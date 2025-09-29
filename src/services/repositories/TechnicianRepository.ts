// Technician Repository - Repository Pattern + Interface Segregation
import { Technician, TechnicianFilters, CreateTechnicianCommand, PaginatedResponse } from '../../models';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

const STORAGE_KEY = 'telconova_technicians';

// Mock data
const MOCK_TECHNICIANS: Technician[] = [
  {
    id: "t1",
    nombre: "Carlos Pérez",
    email: "carlos.perez@example.com",
    telefono: "+57-300-1111111",
    zona: "zona norte",
    especialidad: "Eléctrico",
    carga: 2,
    disponibilidad: ["06:00-12:00", "12:00-18:00"]
  },
  {
    id: "t2",
    nombre: "Ana Gómez",
    email: "ana.gomez@example.com",
    telefono: "+57-300-2222222",
    zona: "zona sur",
    especialidad: "Plomería",
    carga: 4,
    disponibilidad: ["00:00-06:00", "18:00-00:00"]
  },
  {
    id: "t3",
    nombre: "Luis Martínez",
    email: "luis.martinez@example.com",
    telefono: "+57-300-3333333",
    zona: "zona centro",
    especialidad: "HVAC",
    carga: 5,
    disponibilidad: ["06:00-12:00"]
  },
  {
    id: "t4",
    nombre: "María Ruiz",
    email: "maria.ruiz@example.com",
    telefono: "+57-300-4444444",
    zona: "zona oeste",
    especialidad: "Redes",
    carga: 1,
    disponibilidad: ["12:00-18:00", "18:00-00:00"]
  },
  {
    id: "t5",
    nombre: "Jorge López",
    email: "jorge.lopez@example.com",
    telefono: "+57-300-5555555",
    zona: "zona este",
    especialidad: "Eléctrico",
    carga: 0,
    disponibilidad: ["00:00-06:00", "06:00-12:00"]
  },
  {
    id: "t6",
    nombre: "Sofia Herrera",
    email: "sofia.herrera@example.com",
    telefono: "+57-300-6666666",
    zona: "zona norte",
    especialidad: "Plomería",
    carga: 3,
    disponibilidad: ["12:00-18:00"]
  }
];

export interface ITechnicianRepository {
  getAll(filters?: TechnicianFilters): Promise<Technician[]>;
  getById(id: string): Promise<Technician | null>;
  create(command: CreateTechnicianCommand): Promise<Technician>;
  update(id: string, updates: Partial<Technician>): Promise<Technician>;
  delete(id: string): Promise<void>;
  updateWorkload(id: string, delta: number): Promise<Technician>;
}

export class TechnicianRepository implements ITechnicianRepository {
  // Local storage operations
  private loadFromStorage(): Technician[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load technicians from storage:', error);
    }
    
    // Initialize with mock data if not found
    this.saveToStorage(MOCK_TECHNICIANS);
    return MOCK_TECHNICIANS;
  }

  private saveToStorage(technicians: Technician[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(technicians));
  }

  // Filter strategies (Strategy Pattern)
  private applyFilters(technicians: Technician[], filters?: TechnicianFilters): Technician[] {
    if (!filters) return technicians;

    return technicians.filter(tech => {
      // Zone filter
      if (filters.zonas?.length && !filters.zonas.includes(tech.zona)) {
        return false;
      }

      // Specialty filter
      if (filters.especialidades?.length && !filters.especialidades.includes(tech.especialidad)) {
        return false;
      }

      // Workload filter
      if (filters.maxCarga !== undefined && tech.carga > filters.maxCarga) {
        return false;
      }

      // Availability filter
      if (filters.disponibilidad?.length) {
        const hasAvailability = filters.disponibilidad.some(slot => 
          tech.disponibilidad.includes(slot)
        );
        if (!hasAvailability) return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchableText = `${tech.nombre} ${tech.email} ${tech.telefono}`.toLowerCase();
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }

  // Repository methods
  async getAll(filters?: TechnicianFilters): Promise<Technician[]> {
    try {
      // TODO: Replace with real API call
      /*
      const response = await apiClient.get<PaginatedResponse<Technician>>(
        API_ENDPOINTS.TECHNICIANS.LIST,
        { headers: { ...filters } }
      );
      return response.data;
      */

      // Mock implementation
      const technicians = this.loadFromStorage();
      const filtered = this.applyFilters(technicians, filters);
      
      // Sort by workload (ascending) for better UX
      return filtered.sort((a, b) => a.carga - b.carga);
    } catch (error) {
      console.error('Failed to fetch technicians:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Technician | null> {
    try {
      // TODO: Replace with real API call
      /*
      const response = await apiClient.get<Technician>(
        `${API_ENDPOINTS.TECHNICIANS.LIST}/${id}`
      );
      return response;
      */

      // Mock implementation
      const technicians = this.loadFromStorage();
      return technicians.find(tech => tech.id === id) || null;
    } catch (error) {
      console.error('Failed to fetch technician:', error);
      return null;
    }
  }

  async create(command: CreateTechnicianCommand): Promise<Technician> {
    try {
      // TODO: Replace with real API call
      /*
      const response = await apiClient.post<Technician>(
        API_ENDPOINTS.TECHNICIANS.CREATE,
        command
      );
      return response;
      */

      // Mock implementation
      const technicians = this.loadFromStorage();
      const newTechnician: Technician = {
        id: `t${Date.now()}`,
        ...command,
        carga: 0, // New technicians start with no workload
      };

      technicians.push(newTechnician);
      this.saveToStorage(technicians);
      return newTechnician;
    } catch (error) {
      console.error('Failed to create technician:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Technician>): Promise<Technician> {
    try {
      // TODO: Replace with real API call
      /*
      const response = await apiClient.put<Technician>(
        `${API_ENDPOINTS.TECHNICIANS.UPDATE}/${id}`,
        updates
      );
      return response;
      */

      // Mock implementation
      const technicians = this.loadFromStorage();
      const index = technicians.findIndex(tech => tech.id === id);
      
      if (index === -1) {
        throw new Error(`Technician with id ${id} not found`);
      }

      technicians[index] = { ...technicians[index], ...updates };
      this.saveToStorage(technicians);
      return technicians[index];
    } catch (error) {
      console.error('Failed to update technician:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // TODO: Replace with real API call
      /*
      await apiClient.delete(`${API_ENDPOINTS.TECHNICIANS.DELETE}/${id}`);
      */

      // Mock implementation
      const technicians = this.loadFromStorage();
      const filtered = technicians.filter(tech => tech.id !== id);
      this.saveToStorage(filtered);
    } catch (error) {
      console.error('Failed to delete technician:', error);
      throw error;
    }
  }

  async updateWorkload(id: string, delta: number): Promise<Technician> {
    const technician = await this.getById(id);
    if (!technician) {
      throw new Error(`Technician with id ${id} not found`);
    }

    const newWorkload = Math.max(0, Math.min(5, technician.carga + delta));
    return this.update(id, { carga: newWorkload });
  }
}

// Singleton instance
export const technicianRepository = new TechnicianRepository();