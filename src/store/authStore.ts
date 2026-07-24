import { create } from 'zustand';
import * as authService from '../services/authService';
import type {
  AuthResponse,
  CurrentUser,
  LoginRequest,
  RegisterRequest,
  UserRole,
  ApiError,
} from '../types/auth';

const LEGACY_STORAGE_KEYS = ['accessToken', 'refreshToken', 'authRole', 'authFullName'] as const;

const clearLegacyStorage = () => {
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

interface AuthState {
  user: CurrentUser | null;
  accessToken: string | null;
  institutionalId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  role: UserRole | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: (allDevices?: boolean) => Promise<void>;
  clear: () => void;
  setSession: (auth: AuthResponse) => void;
  setAccessToken: (accessToken: string) => void;
  getAccessToken: () => string | null;
  bootstrapSession: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  accessToken: null,
  institutionalId: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  role: null,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(credentials);
      clearLegacyStorage();
      get().setSession(data);
      set({ isLoading: false });
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
      get().setSession(res);
      set({ isLoading: false });
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
      institutionalId: null,
      isAuthenticated: false,
      role: null,
      isLoading: false,
    });
  },

  setSession: (auth) => {
    set({
      accessToken: auth.accessToken,
      role: auth.role,
      institutionalId: auth.institutionalId,
      isAuthenticated: true,
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
      get().setSession(data);
      await get().fetchCurrentUser();
    } catch {
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        institutionalId: null,
        role: null,
      });
    } finally {
      set({ isInitializing: false });
    }
  },

  fetchCurrentUser: async () => {
    try {
      const user = await authService.getMe();
      set({ user, role: user.role, institutionalId: user.institutionalId });
    } catch {
      // Interceptor handles 401 / redirect
    }
  },
}));

export default useAuthStore;
