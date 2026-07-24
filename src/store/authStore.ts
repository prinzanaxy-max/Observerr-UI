import { create } from 'zustand';
import * as authService from '../services/authService';
import type { CurrentUser, Role, ApiError } from '../types/auth';

const LEGACY_STORAGE_KEYS = ['accessToken', 'refreshToken', 'authRole', 'authFullName'] as const;

const clearLegacyStorage = () => {
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

interface AuthState {
  user: CurrentUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  role: Role | null;
}

interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  logout: (allDevices?: boolean) => Promise<void>;
  clear: () => void;
  setAccessToken: (accessToken: string) => void;
  getAccessToken: () => string | null;
  bootstrapSession: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  role: null,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(credentials);
      clearLegacyStorage();
      set({
        accessToken: data.accessToken,
        isAuthenticated: true,
        role: data.role,
        isLoading: false,
      });
      await get().fetchCurrentUser();
    } catch (err) {
      set({ isLoading: false });
      throw err as ApiError;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await authService.register(data);
      clearLegacyStorage();
      set({
        accessToken: res.accessToken,
        isAuthenticated: true,
        role: res.role,
        isLoading: false,
      });
      await get().fetchCurrentUser();
    } catch (err) {
      set({ isLoading: false });
      throw err as ApiError;
    }
  },

  logout: async (allDevices = false) => {
    const accessToken = get().accessToken;
    try {
      await authService.logout(accessToken, allDevices);
    } catch {
      // Logout is idempotent — always proceed to login
    }
    get().clear();
    window.location.href = '/login';
  },

  clear: () => {
    clearLegacyStorage();
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      role: null,
      isLoading: false,
    });
  },

  setAccessToken: (accessToken) => {
    set({ accessToken, isAuthenticated: true });
  },

  getAccessToken: () => get().accessToken,

  bootstrapSession: async () => {
    set({ isInitializing: true });
    clearLegacyStorage();

    try {
      const data = await authService.refreshSession();
      set({
        accessToken: data.accessToken,
        isAuthenticated: true,
        role: data.role,
      });
      await get().fetchCurrentUser();
    } catch {
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        role: null,
      });
    } finally {
      set({ isInitializing: false });
    }
  },

  fetchCurrentUser: async () => {
    try {
      const user = await authService.getMe();
      set({ user, role: user.role });
    } catch {
      // Interceptor handles 401 / redirect
    }
  },
}));

export default useAuthStore;
