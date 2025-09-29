// Auth Store - Observer Pattern + State Management
import { create } from 'zustand';
import { AuthState, User } from '../models';
import { AuthService } from '../services/auth/AuthService';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<{
    success: boolean;
    message: string;
    blockedUntil?: number;
  }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  clearAuthData: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  failedAttempts: 0,
  blockedUntil: null,

  // Actions
  login: async (email: string, password: string) => {
    const result = await AuthService.login(email, password);
    
    if (result.success && result.user) {
      set({
        user: result.user,
        isAuthenticated: true,
        failedAttempts: 0,
        blockedUntil: null,
      });
    } else {
      const authState = AuthService.getAuthState();
      set({
        failedAttempts: authState.failedAttempts,
        blockedUntil: authState.blockedUntil,
      });
    }

    return {
      success: result.success,
      message: result.message,
      blockedUntil: result.blockedUntil,
    };
  },

  logout: async () => {
    await AuthService.logout();
    set({
      user: null,
      isAuthenticated: false,
      failedAttempts: 0,
      blockedUntil: null,
    });
  },

  initialize: async () => {
    const authState = AuthService.getAuthState();
    const isValidToken = await AuthService.verifyToken();
    
    if (isValidToken && authState.user) {
      set({
        user: authState.user,
        isAuthenticated: true,
        failedAttempts: authState.failedAttempts,
        blockedUntil: authState.blockedUntil,
      });
    } else {
      // Clear invalid state
      AuthService.logout();
      set({
        user: null,
        isAuthenticated: false,
        failedAttempts: 0,
        blockedUntil: null,
      });
    }
  },

  clearAuthData: () => {
    AuthService.clearAuthData();
    set({
      user: null,
      isAuthenticated: false,
      failedAttempts: 0,
      blockedUntil: null,
    });
  },
}));