// Custom Hook for Order Management - Single Responsibility + Command Pattern
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, OrderFilters, CreateOrderCommand, AssignOrderCommand } from '../models';
import { orderRepository } from '../services/repositories/OrderRepository';
import { technicianRepository } from '../services/repositories/TechnicianRepository';
import { toast } from '@/hooks/use-toast';

export const useOrders = (filters?: OrderFilters) => {
  const queryClient = useQueryClient();
  
  // Query for orders list
  const {
    data: orders = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderRepository.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Separate queries for pending and assigned orders
  const {
    data: pendingOrders = [],
    isLoading: isPendingLoading
  } = useQuery({
    queryKey: ['orders', 'pending'],
    queryFn: () => orderRepository.getPendingOrders(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const {
    data: assignedOrders = [],
    isLoading: isAssignedLoading
  } = useQuery({
    queryKey: ['orders', 'assigned'],
    queryFn: () => orderRepository.getAssignedOrders(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Mutation for creating order
  const createOrderMutation = useMutation({
    mutationFn: (command: CreateOrderCommand) => orderRepository.create(command),
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Orden creada",
        description: `Orden ${newOrder.id} ha sido creada exitosamente.`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear la orden. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  // Command Pattern for assignment with undo capability
  const [lastAssignment, setLastAssignment] = useState<{
    orderId: string;
    oldTechnicianId: string | null;
    newTechnicianId: string;
    timestamp: number;
  } | null>(null);

  const assignOrderMutation = useMutation({
    mutationFn: async (command: AssignOrderCommand) => {
      // Store assignment info for undo
      const order = await orderRepository.getById(command.orderId);
      if (order) {
        setLastAssignment({
          orderId: command.orderId,
          oldTechnicianId: command.previousTechnicianId || order.assignedTo,
          newTechnicianId: command.technicianId,
          timestamp: Date.now(),
        });
      }

      // Execute assignment
      const result = await orderRepository.assign(command);
      
      // Update technician workloads
      if (command.previousTechnicianId) {
        await technicianRepository.updateWorkload(command.previousTechnicianId, -1);
      }
      await technicianRepository.updateWorkload(command.technicianId, 1);
      
      return result;
    },
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      
      const isReassignment = lastAssignment?.oldTechnicianId;
      toast({
        title: isReassignment ? "Orden reasignada" : "Orden asignada",
        description: `Orden ${updatedOrder.id} ${isReassignment ? 'reasignada' : 'asignada'} exitosamente.`,
        variant: "default",
      });

      // Clear undo after 5 seconds
      setTimeout(() => {
        setLastAssignment(null);
      }, 5000);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo asignar la orden. Intente nuevamente.",
        variant: "destructive",
      });
      setLastAssignment(null);
    },
  });

  // Undo assignment functionality
  const undoAssignment = useCallback(async () => {
    if (!lastAssignment) return;

    try {
      const { orderId, oldTechnicianId, newTechnicianId } = lastAssignment;

      // Revert order assignment
      await orderRepository.update(orderId, {
        assignedTo: oldTechnicianId,
        status: oldTechnicianId ? 'assigned' : 'pending',
      });

      // Revert technician workloads
      await technicianRepository.updateWorkload(newTechnicianId, -1);
      if (oldTechnicianId) {
        await technicianRepository.updateWorkload(oldTechnicianId, 1);
      }

      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['technicians'] });

      toast({
        title: "Asignación deshecha",
        description: "La asignación ha sido revertida exitosamente.",
        variant: "default",
      });

      setLastAssignment(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo deshacer la asignación.",
        variant: "destructive",
      });
    }
  }, [lastAssignment, queryClient]);

  // Helper methods
  const createOrder = useCallback((command: CreateOrderCommand) => {
    return createOrderMutation.mutate(command);
  }, [createOrderMutation]);

  const assignOrder = useCallback((command: AssignOrderCommand) => {
    return assignOrderMutation.mutate(command);
  }, [assignOrderMutation]);

  const canUndoAssignment = useCallback(() => {
    return lastAssignment && (Date.now() - lastAssignment.timestamp) < 5000;
  }, [lastAssignment]);

  return {
    orders,
    pendingOrders,
    assignedOrders,
    isLoading: isLoading || isPendingLoading || isAssignedLoading,
    error,
    refetch,
    createOrder,
    assignOrder,
    undoAssignment,
    canUndoAssignment,
    isCreating: createOrderMutation.isPending,
    isAssigning: assignOrderMutation.isPending,
  };
};

// Hook for individual order
export const useOrder = (id: string) => {
  const {
    data: order,
    isLoading,
    error
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderRepository.getById(id),
    enabled: !!id,
  });

  return { order, isLoading, error };
};