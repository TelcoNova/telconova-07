// Domain Models - Single Responsibility: Pure data structures
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'supervisor' | 'admin';
  createdAt: string;
}

export interface Technician {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  zona: Zone;
  especialidad: Specialty;
  carga: number; // 0-5
  disponibilidad: TimeSlot[];
  fotoUrl?: string;
}

export interface Order {
  id: string;
  zona: Zone;
  creadoEn: string;
  servicio: string;
  descripcion: string;
  assignedTo: string | null;
  status: OrderStatus;
}

export interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  failedAttempts: number;
  blockedUntil: number | null;
}

// Enums and Types
export type Zone = 'zona centro' | 'zona sur' | 'zona norte' | 'zona oeste' | 'zona este';
export type Specialty = 'Eléctrico' | 'Plomería' | 'HVAC' | 'Redes';
export type TimeSlot = '00:00-06:00' | '06:00-12:00' | '12:00-18:00' | '18:00-00:00';
export type OrderStatus = 'pending' | 'assigned' | 'completed' | 'cancelled';

// Filter interfaces for Strategy pattern
export interface TechnicianFilters {
  zonas?: Zone[];
  especialidades?: Specialty[];
  maxCarga?: number;
  disponibilidad?: TimeSlot[];
  searchTerm?: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  zona?: Zone[];
  searchTerm?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Command pattern for actions
export interface AssignOrderCommand {
  orderId: string;
  technicianId: string;
  previousTechnicianId?: string;
}

export interface CreateOrderCommand {
  zona: Zone;
  servicio: string;
  descripcion: string;
}

export interface CreateTechnicianCommand {
  nombre: string;
  email: string;
  telefono: string;
  zona: Zone;
  especialidad: Specialty;
  disponibilidad: TimeSlot[];
}