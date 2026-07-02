import { create } from 'zustand';
import * as authService from '../services/authService';
import type { CurrentUser, Role, ApiError } from '../types/auth';

/* ─── State shape ────────────────────────────────────────────────────────── */
interface AuthState {
  user: CurrentUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean; // true while rehydrating from localStorage on first load
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
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  loadFromStorage: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  role: 'authRole',
  fullName: 'authFullName',
} as const;

const persistTokens = (
  accessToken: string,
  refreshToken: string,
  role: Role,
  fullName: string,
) => {
  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
  localStorage.setItem(STORAGE_KEYS.role, role);
  localStorage.setItem(STORAGE_KEYS.fullName, fullName);
};

const clearStorage = () => {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
};

/* ─── Store ──────────────────────────────────────────────────────────────── */
const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem(STORAGE_KEYS.accessToken),
  refreshToken: localStorage.getItem(STORAGE_KEYS.refreshToken),
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.accessToken),
  isLoading: false,
  isInitializing: true,
  role: (localStorage.getItem(STORAGE_KEYS.role) as Role) ?? null,

  /* ── login ────────────────────────────────────────────────────────────── */
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(credentials);
      persistTokens(data.accessToken, data.refreshToken, data.role, data.fullName);
      set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        role: data.role,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err as ApiError;
    }
  },

  /* ── register ─────────────────────────────────────────────────────────── */
  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await authService.register(data);
      persistTokens(res.accessToken, res.refreshToken, res.role, res.fullName);
      set({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        isAuthenticated: true,
        role: res.role,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err as ApiError;
    }
  },

  /* ── logout ───────────────────────────────────────────────────────────── */
  logout: () => {
    clearStorage();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      role: null,
    });
    window.location.href = '/auth';
  },

  /* ── setTokens (called by refresh interceptor externally if needed) ────── */
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  /* ── loadFromStorage: rehydrate on page reload ────────────────────────── */
  loadFromStorage: async () => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    const role = localStorage.getItem(STORAGE_KEYS.role) as Role | null;

    if (!accessToken) {
      set({ isAuthenticated: false, user: null, role: null, isInitializing: false });
      return;
    }

    set({ accessToken, refreshToken, role, isAuthenticated: true });

    // Silently fetch current user — if token is expired the axios interceptor
    // will handle the refresh transparently.
    try {
      await get().fetchCurrentUser();
    } catch {
      // Interceptor already cleared tokens and redirected if refresh failed
    } finally {
      set({ isInitializing: false });
    }
  },

  /* ── fetchCurrentUser ─────────────────────────────────────────────────── */
  fetchCurrentUser: async () => {
    try {
      const user = await authService.getMe();
      set({ user, role: user.role });
    } catch {
      // Silent — interceptor handles 401 / redirect
    }
  },
}));

export default useAuthStore;
