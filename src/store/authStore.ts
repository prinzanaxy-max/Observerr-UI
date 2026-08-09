import { create } from 'zustand';
import * as authService from '../services/authService';
import * as accountService from '../services/accountService';
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
  fetchCurrentUser: () => Promise<boolean>;
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
      // Prefer validating the stored access token before forcing a refresh.
      // Refresh often fails cross-origin (no cookie) even when the access token is still valid.
      if (storedAccess) {
        const restored = await get().fetchCurrentUser();
        if (restored) return;
      }

      await refreshAuthSession();
      const restored = await get().fetchCurrentUser();
      if (!restored) {
        get().clear();
      }
    } catch {
      get().clear();
    } finally {
      set({ isInitializing: false });
    }
  },

  fetchCurrentUser: async () => {
    try {
      const user = await authService.getMe();
      let profilePictureUrl = user.profilePictureUrl ?? null;

      if (!profilePictureUrl) {
        try {
          const account = await accountService.fetchAccount();
          profilePictureUrl = account.profilePictureUrl ?? null;
        } catch {
          // Account endpoint optional for profile picture hydration
        }
      }

      set({
        user: { ...user, profilePictureUrl },
        role: user.role,
        institutionalId: user.institutionalId,
        isAuthenticated: true,
      });
      return true;
    } catch {
      return false;
    }
  },
}));

export default useAuthStore;
