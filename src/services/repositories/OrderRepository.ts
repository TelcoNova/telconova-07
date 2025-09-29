// Order Repository - Repository Pattern + Command Pattern for assignments
import { Order, OrderFilters, CreateOrderCommand, AssignOrderCommand, OrderStatus } from '../../models';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

const STORAGE_KEY = 'telconova_orders';

// Mock data
const MOCK_ORDERS: Order[] = [
  {
    id: "O-1001",
    zona: "zona norte",
    creadoEn: "2025-09-22T10:12:00Z",
    servicio: "Instalación eléctrica",
    descripcion: "Cambio de tablero principal en edificio residencial",
    assignedTo: null,
    status: "pending"
  },
  {
    id: "O-1002",
    zona: "zona sur",
    creadoEn: "2025-09-22T11:00:00Z",
    servicio: "Reparación de cañería",
    descripcion: "Fuga en planta baja, requiere atención urgente",
    assignedTo: "t2",
    status: "assigned"
  },
  {
    id: "O-1003",
    zona: "zona centro",
    creadoEn: "2025-09-22T09:30:00Z",
    servicio: "Mantenimiento HVAC",
    descripcion: "Revisión trimestral sistema aire acondicionado",
    assignedTo: null,
    status: "pending"
  },
  {
    id: "O-1004",
    zona: "zona oeste",
    creadoEn: "2025-09-22T14:15:00Z",
    servicio: "Instalación de red",
    descripcion: "Cableado estructurado para oficinas",
    assignedTo: "t4",
    status: "assigned"
  },
  {
    id: "O-1005",
    zona: "zona este",
    creadoEn: "2025-09-22T08:45:00Z",
    servicio: "Reparación eléctrica",
    descripcion: "Cortocircuito en panel de distribución",
    assignedTo: null,
    status: "pending"
  },
  {
    id: "O-1006",
    zona: "zona norte",
    creadoEn: "2025-09-22T16:20:00Z",
    servicio: "Instalación de plomería",
    descripcion: "Nueva línea de agua para expansión",
    assignedTo: "t6",
    status: "assigned"
  },
  {
    id: "O-1007",
    zona: "zona sur",
    creadoEn: "2025-09-22T13:10:00Z",
    servicio: "Mantenimiento preventivo",
    descripcion: "Revisión general de instalaciones",
    assignedTo: null,
    status: "pending"
  },
  {
    id: "O-1008",
    zona: "zona centro",
    creadoEn: "2025-09-22T12:30:00Z",
    servicio: "Reparación de red",
    descripcion: "Problemas de conectividad en switches",
    assignedTo: null,
    status: "pending"
  }
];

export interface IOrderRepository {
  getAll(filters?: OrderFilters): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  create(command: CreateOrderCommand): Promise<Order>;
  update(id: string, updates: Partial<Order>): Promise<Order>;
  delete(id: string): Promise<void>;
  assign(command: AssignOrderCommand): Promise<Order>;
  getPendingOrders(): Promise<Order[]>;
  getAssignedOrders(): Promise<Order[]>;
}

export class OrderRepository implements IOrderRepository {
  // Local storage operations
  private loadFromStorage(): Order[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load orders from storage:', error);
    }
    
    // Initialize with mock data if not found
    this.saveToStorage(MOCK_ORDERS);
    return MOCK_ORDERS;
  }

  private saveToStorage(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }

  // Filter strategies (Strategy Pattern)
  private applyFilters(orders: Order[], filters?: OrderFilters): Order[] {
    if (!filters) return orders;

    return orders.filter(order => {
      // Status filter
      if (filters.status?.length && !filters.status.includes(order.status)) {
        return false;
      }

      // Zone filter
      if (filters.zona?.length && !filters.zona.includes(order.zona)) {
        return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchableText = `${order.id} ${order.servicio} ${order.descripcion}`.toLowerCase();
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }

  // Repository methods
  async getAll(filters?: OrderFilters): Promise<Order[]> {
    try {
      // TODO: Replace with real API call
      /*
      const response = await apiClient.get<PaginatedResponse<Order>>(
        API_ENDPOINTS.ORDERS.LIST,
        { headers: { ...filters } }
      );
      return response.data;
      */

      // Mock implementation
      const orders = this.loadFromStorage();
      const filtered = this.applyFilters(orders, filters);
      
      // Sort by creation date (newest first)
      return filtered.sort((a, b) => 
        new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Order | null> {
    try {
      // TODO: Replace with real API call
      /*
      const response = await apiClient.get<Order>(
        `${API_ENDPOINTS.ORDERS.LIST}/${id}`
      );
      return response;
      */

      // Mock implementation
      const orders = this.loadFromStorage();
      return orders.find(order => order.id === id) || null;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      return null;
    }
  }

  async create(command: CreateOrderCommand): Promise<Order> {
    try {
      // TODO: Replace with real API call
      /*
      const response = await apiClient.post<Order>(
        API_ENDPOINTS.ORDERS.CREATE,
        command
      );
      return response;
      */

      // Mock implementation
      const orders = this.loadFromStorage();
      const newOrder: Order = {
        id: `O-${Date.now()}`,
        ...command,
        creadoEn: new Date().toISOString(),
        assignedTo: null,
        status: 'pending',
      };

      orders.push(newOrder);
      this.saveToStorage(orders);
      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Order>): Promise<Order> {
    try {
      // TODO: Replace with real API call
      /*
      const response = await apiClient.put<Order>(
        `${API_ENDPOINTS.ORDERS.UPDATE}/${id}`,
        updates
      );
      return response;
      */

      // Mock implementation
      const orders = this.loadFromStorage();
      const index = orders.findIndex(order => order.id === id);
      
      if (index === -1) {
        throw new Error(`Order with id ${id} not found`);
      }

      orders[index] = { ...orders[index], ...updates };
      this.saveToStorage(orders);
      return orders[index];
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // TODO: Replace with real API call
      /*
      await apiClient.delete(`${API_ENDPOINTS.ORDERS.DELETE}/${id}`);
      */

      // Mock implementation
      const orders = this.loadFromStorage();
      const filtered = orders.filter(order => order.id !== id);
      this.saveToStorage(filtered);
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    }
  }

  // Command Pattern for assignment
  async assign(command: AssignOrderCommand): Promise<Order> {
    try {
      // TODO: Replace with real API call
      /*
      const response = await apiClient.post<Order>(
        API_ENDPOINTS.ORDERS.ASSIGN,
        command
      );
      return response;
      */

      // Mock implementation
      const order = await this.getById(command.orderId);
      if (!order) {
        throw new Error(`Order with id ${command.orderId} not found`);
      }

      const updatedOrder = await this.update(command.orderId, {
        assignedTo: command.technicianId,
        status: 'assigned',
      });

      return updatedOrder;
    } catch (error) {
      console.error('Failed to assign order:', error);
      throw error;
    }
  }

  async getPendingOrders(): Promise<Order[]> {
    return this.getAll({ status: ['pending'] });
  }

  async getAssignedOrders(): Promise<Order[]> {
    return this.getAll({ status: ['assigned'] });
  }
}

// Singleton instance
export const orderRepository = new OrderRepository();