import { create } from 'zustand';
import * as authService from '../services/authService';
import { clearAuthSession, getStoredAccessToken, persistAuthSession, setStoredAccessToken } from '../lib/authSessionStorage';
import { refreshAuthSession } from '../lib/authRefresh';
import type {
  AuthResponse,
  CurrentUser,
  LoginRequest,
  RegisterRequest,
  UserRole,
  ApiError,
} from '../types/auth';

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
  updateProfilePicture: (profilePictureUrl: string | null) => void;
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
      clearAuthSession();
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
      clearAuthSession();
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
    window.location.href = '/auth';
  },

  clear: () => {
    clearAuthSession();
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
    persistAuthSession(auth);
    set({
      accessToken: auth.accessToken,
      role: auth.role,
      institutionalId: auth.institutionalId,
      isAuthenticated: true,
    });
  },

  setAccessToken: (accessToken) => {
    setStoredAccessToken(accessToken);
    set({ accessToken, isAuthenticated: true });
  },

  updateProfilePicture: (profilePictureUrl) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, profilePictureUrl } });
  },

  getAccessToken: () => get().accessToken,

  bootstrapSession: async () => {
    set({ isInitializing: true });

    const storedAccess = getStoredAccessToken();
    if (storedAccess) {
      set({ accessToken: storedAccess, isAuthenticated: true });
    }

    try {
      await refreshAuthSession();
      await get().fetchCurrentUser();
    } catch {
      get().clear();
    } finally {
      set({ isInitializing: false });
    }
  },

  fetchCurrentUser: async () => {
    try {
      const user = await authService.getMe();
      set({ user, role: user.role, institutionalId: user.institutionalId });
    } catch {
      // Interceptor handles 401 / refresh; avoid clearing session here
    }
  },
}));

export default useAuthStore;
