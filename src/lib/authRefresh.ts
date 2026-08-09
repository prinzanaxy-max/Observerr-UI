import axios from 'axios';
import { API_URL } from './apiConfig';
import { getStoredRefreshToken, persistAuthSession } from './authSessionStorage';
import useAuthStore from '../store/authStore';
import type { AuthResponse } from '../types/auth';

let refreshPromise: Promise<AuthResponse> | null = null;

/**
 * Exchange refresh token (httpOnly cookie and/or stored token) for a new access token.
 * Uses a standalone axios call — never apiClient — to avoid interceptor loops.
 */
export async function refreshAuthSession(): Promise<AuthResponse> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const storedRefresh = getStoredRefreshToken();

  refreshPromise = axios
    .post<AuthResponse>(
      `${API_URL}/api/auth/refresh`,
      storedRefresh ? { refreshToken: storedRefresh } : {},
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      },
    )
    .then(({ data }) => {
      persistAuthSession(data);
      useAuthStore.getState().setSession(data);
      return data;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}
