import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './apiConfig';
import { refreshAuthSession } from './authRefresh';
import useAuthStore from '../store/authStore';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

const clearAuthAndRedirect = () => {
  useAuthStore.getState().clear();
  const path = window.location.pathname;
  if (path !== '/auth' && path !== '/login' && path !== '/register' && path !== '/') {
    window.location.href = '/auth';
  }
};

const AUTH_SKIP_REFRESH = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/logout',
];

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? '';
    if (AUTH_SKIP_REFRESH.some((path) => url.includes(path))) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const data = await refreshAuthSession();
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

      processQueue(null, data.accessToken);
      isRefreshing = false;

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);

export default apiClient;
