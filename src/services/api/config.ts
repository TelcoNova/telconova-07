// API Configuration - Dependency Inversion: Abstract from implementation details

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
  },
  TECHNICIANS: {
    LIST: '/technicians',
    CREATE: '/technicians',
    UPDATE: '/technicians',
    DELETE: '/technicians',
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    UPDATE: '/orders',
    ASSIGN: '/orders/assign',
    DELETE: '/orders',
  },
} as const;

// Request/Response interceptors interface
export interface ApiClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  withAuth?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}