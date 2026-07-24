import { AxiosError } from 'axios';
import apiClient from '../lib/axios';
import { API_URL } from '../lib/apiConfig';
import type {
  AuthResponse,
  CurrentUser,
  ApiError,
  LogoutResponse,
} from '../types/auth';

const toApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      return error.response.data as ApiError;
    }
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

export const refreshSession = async (): Promise<AuthResponse> => {
  try {
    const { data: body } = await apiClient.post<AuthResponse>('/api/auth/refresh');
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

export async function logout(
  accessToken: string | null,
  allDevices = false,
): Promise<LogoutResponse> {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ allDevices }),
  });

  return response.json().catch(() => ({
    success: true,
    message: 'Logged out successfully',
  }));
}
