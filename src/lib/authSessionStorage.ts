import type { AuthResponse } from '../types/auth';

const ACCESS_TOKEN_KEY = 'observerr:accessToken';
const REFRESH_TOKEN_KEY = 'observerr:refreshToken';

const LEGACY_STORAGE_KEYS = ['accessToken', 'refreshToken', 'authRole', 'authFullName'] as const;

export const persistAuthSession = (auth: AuthResponse) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  if (auth.refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
    // Keep refresh token in localStorage so it survives tab close / cross-origin cookie limits.
    localStorage.setItem('refreshToken', auth.refreshToken);
  }
};

export const clearAuthSession = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const getStoredAccessToken = (): string | null =>
  sessionStorage.getItem(ACCESS_TOKEN_KEY);

export const getStoredRefreshToken = (): string | null =>
  sessionStorage.getItem(REFRESH_TOKEN_KEY) ?? localStorage.getItem('refreshToken');

export const setStoredAccessToken = (token: string) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
};
