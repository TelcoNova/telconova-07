// Custom Hook for Technician Management - Single Responsibility
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Technician, TechnicianFilters, CreateTechnicianCommand } from '../models';
import { technicianRepository } from '../services/repositories/TechnicianRepository';
import { toast } from '@/hooks/use-toast';

export const useTechnicians = (filters?: TechnicianFilters) => {
  const queryClient = useQueryClient();
  
  // Query for technicians list
  const {
    data: technicians = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['technicians', filters],
    queryFn: () => technicianRepository.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for creating technician
  const createTechnicianMutation = useMutation({
    mutationFn: (command: CreateTechnicianCommand) => technicianRepository.create(command),
    onSuccess: (newTechnician) => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      toast({
        title: "Técnico creado",
        description: `${newTechnician.nombre} ha sido agregado exitosamente.`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear el técnico. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  // Mutation for updating technician workload
  const updateWorkloadMutation = useMutation({
    mutationFn: ({ id, delta }: { id: string; delta: number }) => 
      technicianRepository.updateWorkload(id, delta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la carga de trabajo.",
        variant: "destructive",
      });
    },
  });

  // Helper methods
  const createTechnician = useCallback((command: CreateTechnicianCommand) => {
    return createTechnicianMutation.mutate(command);
  }, [createTechnicianMutation]);

  const updateWorkload = useCallback((id: string, delta: number) => {
    return updateWorkloadMutation.mutate({ id, delta });
  }, [updateWorkloadMutation]);

  const getAvailableTechnicians = useCallback(() => {
    return technicians.filter(tech => tech.carga < 5);
  }, [technicians]);

  const getTechniciansByZone = useCallback((zone: string) => {
    return technicians.filter(tech => tech.zona === zone);
  }, [technicians]);

  return {
    technicians,
    isLoading,
    error,
    refetch,
    createTechnician,
    updateWorkload,
    getAvailableTechnicians,
    getTechniciansByZone,
    isCreating: createTechnicianMutation.isPending,
    isUpdating: updateWorkloadMutation.isPending,
  };
};

// Hook for individual technician
export const useTechnician = (id: string) => {
  const {
    data: technician,
    isLoading,
    error
  } = useQuery({
    queryKey: ['technician', id],
    queryFn: () => technicianRepository.getById(id),
    enabled: !!id,
  });

  return { technician, isLoading, error };
};