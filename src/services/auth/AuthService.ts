// Authentication Service - Single Responsibility + Repository Pattern
import { User, LoginAttempt, AuthState } from '../../models';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

const STORAGE_KEYS = {
  AUTH_STATE: 'telconova_auth_state',
  LOGIN_ATTEMPTS: 'telconova_login_attempts',
  TOKEN: 'telconova_token',
} as const;

const MAX_FAILED_ATTEMPTS = 3;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Mock data for development
const MOCK_USERS = [
  {
    id: 'supervisor-1',
    email: 'supervisor@example.com',
    password: 'Admin123.',
    name: 'Supervisor Principal',
    role: 'supervisor' as const,
    createdAt: new Date().toISOString(),
  }
];

export class AuthService {
  // Repository pattern methods
  static getAuthState(): AuthState {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse auth state:', error);
    }
    
    return {
      user: null,
      isAuthenticated: false,
      failedAttempts: 0,
      blockedUntil: null,
    };
  }

  static setAuthState(state: AuthState): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_STATE, JSON.stringify(state));
  }

  static getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  static setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  static removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  static getLoginAttempts(): LoginAttempt[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static addLoginAttempt(attempt: LoginAttempt): void {
    const attempts = this.getLoginAttempts();
    attempts.push(attempt);
    localStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, JSON.stringify(attempts));
  }

  // Business logic methods
  static isAccountBlocked(email: string): { blocked: boolean; blockedUntil?: number } {
    const authState = this.getAuthState();
    
    if (authState.blockedUntil && Date.now() < authState.blockedUntil) {
      return { blocked: true, blockedUntil: authState.blockedUntil };
    }

    const attempts = this.getLoginAttempts()
      .filter(attempt => attempt.email === email && !attempt.success)
      .slice(-MAX_FAILED_ATTEMPTS);

    if (attempts.length >= MAX_FAILED_ATTEMPTS) {
      const lastAttempt = attempts[attempts.length - 1];
      const blockedUntil = lastAttempt.timestamp + BLOCK_DURATION_MS;
      
      if (Date.now() < blockedUntil) {
        // Update auth state with block info
        const newState = { ...authState, blockedUntil };
        this.setAuthState(newState);
        return { blocked: true, blockedUntil };
      }
    }

    return { blocked: false };
  }

  static formatBlockedUntilTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  // Main authentication methods
  static async login(email: string, password: string): Promise<{
    success: boolean;
    user?: User;
    message: string;
    blockedUntil?: number;
  }> {
    const blockStatus = this.isAccountBlocked(email);
    
    if (blockStatus.blocked) {
      return {
        success: false,
        message: `Cuenta temporalmente bloqueada. Intente de nuevo a las ${this.formatBlockedUntilTime(blockStatus.blockedUntil!)}`,
        blockedUntil: blockStatus.blockedUntil,
      };
    }

    try {
      // For development: use mock authentication
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (mockUser) {
        const user: User = {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          createdAt: mockUser.createdAt,
        };

        // Generate mock JWT token
        const token = `mock-jwt-${user.id}-${Date.now()}`;
        
        this.setToken(token);
        this.setAuthState({
          user,
          isAuthenticated: true,
          failedAttempts: 0,
          blockedUntil: null,
        });

        this.addLoginAttempt({ email, timestamp: Date.now(), success: true });

        return {
          success: true,
          user,
          message: 'Autenticación exitosa',
        };
      } else {
        // Failed authentication
        const authState = this.getAuthState();
        const newFailedAttempts = authState.failedAttempts + 1;
        
        this.addLoginAttempt({ email, timestamp: Date.now(), success: false });
        
        let blockedUntil: number | undefined;
        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
          blockedUntil = Date.now() + BLOCK_DURATION_MS;
        }

        this.setAuthState({
          ...authState,
          failedAttempts: newFailedAttempts,
          blockedUntil: blockedUntil || null,
        });

        if (blockedUntil) {
          return {
            success: false,
            message: `Cuenta temporalmente bloqueada. Intente de nuevo a las ${this.formatBlockedUntilTime(blockedUntil)}`,
            blockedUntil,
          };
        }

        return {
          success: false,
          message: 'Autenticación fallida: revise el correo electrónico o la contraseña',
        };
      }
      
      // TODO: Replace with real API call when backend is ready
      /*
      const response = await apiClient.post<{ user: User; token: string }>(
        API_ENDPOINTS.AUTH.LOGIN,
        { email, password },
        { withAuth: false }
      );

      this.setToken(response.token);
      this.setAuthState({
        user: response.user,
        isAuthenticated: true,
        failedAttempts: 0,
        blockedUntil: null,
      });

      return { success: true, user: response.user, message: 'Autenticación exitosa' };
      */
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Error de conexión. Intente nuevamente.',
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      // TODO: Call backend logout endpoint
      // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.removeToken();
      this.setAuthState({
        user: null,
        isAuthenticated: false,
        failedAttempts: 0,
        blockedUntil: null,
      });
    }
  }

  static async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      // For development: mock token verification
      if (token.startsWith('mock-jwt-')) {
        const authState = this.getAuthState();
        return authState.isAuthenticated && !!authState.user;
      }

      // TODO: Replace with real API verification
      /*
      await apiClient.get(API_ENDPOINTS.AUTH.VERIFY);
      return true;
      */
      return false;
    } catch {
      this.logout();
      return false;
    }
  }

  static clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    localStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
}