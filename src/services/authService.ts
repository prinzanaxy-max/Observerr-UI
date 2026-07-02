import { AxiosError } from 'axios';
import apiClient from '../lib/axios';
import type { AuthResponse, CurrentUser, ApiError } from '../types/auth';

/* ─── Error normaliser ───────────────────────────────────────────────────── */
/* Converts any thrown value into a consistent ApiError so components        */
/* never have to deal with raw AxiosError or unknown shapes.                 */
const toApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    // Backend returned a structured error body
    if (error.response?.data) {
      return error.response.data as ApiError;
    }
    // No response at all → network / CORS / backend down
    if (!error.response) {
      return {
        error: 'NETWORK_ERROR',
        message: 'Cannot connect to server. Is the backend running?',
        timestamp: new Date().toISOString(),
      };
    }
  }
  return {
    error: 'UNKNOWN',
    message: 'Something went wrong. Please try again.',
    timestamp: new Date().toISOString(),
  };
};

/* ─── Auth API calls ─────────────────────────────────────────────────────── */
export const register = async (data: {
  fullName: string;
  email: string;
  password: string;
  role: string;
}): Promise<AuthResponse> => {
  try {
    const { data: body } = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return body;
  } catch (err) {
    throw toApiError(err);
  }
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const { data: body } = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return body;
  } catch (err) {
    throw toApiError(err);
  }
};

export const refreshToken = async (token: string): Promise<AuthResponse> => {
  try {
    const { data: body } = await apiClient.post<AuthResponse>(
      '/api/auth/refresh',
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return body;
  } catch (err) {
    throw toApiError(err);
  }
};

export const getMe = async (): Promise<CurrentUser> => {
  try {
    const { data: body } = await apiClient.get<CurrentUser>('/api/auth/me');
    return body;
  } catch (err) {
    throw toApiError(err);
  }
};

export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('authRole');
  localStorage.removeItem('authFullName');
  window.location.href = '/auth';
};
