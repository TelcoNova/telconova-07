// API Client - Factory Pattern for creating HTTP client instances
import { ApiClient, RequestConfig, ApiError, API_CONFIG } from './config';
import { AuthService } from '../auth/AuthService';

class HttpClient implements ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config?.headers,
    };

    // Add auth token if required
    if (config?.withAuth !== false) {
      const token = AuthService.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const requestConfig: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(config?.timeout || this.timeout),
    };

    if (data && method !== 'GET') {
      requestConfig.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(fullUrl, requestConfig);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT');
      }
      
      throw new ApiError('Network error', 0, 'NETWORK_ERROR');
    }
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', url, data, config);
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', url, undefined, config);
  }
}

// Factory for creating API clients
export class ApiClientFactory {
  private static instance: ApiClient;

  static getInstance(): ApiClient {
    if (!this.instance) {
      this.instance = new HttpClient();
    }
    return this.instance;
  }

  static createClient(baseURL?: string, timeout?: number): ApiClient {
    return new HttpClient(baseURL, timeout);
  }
}

export const apiClient = ApiClientFactory.getInstance();