import { AxiosError } from 'axios';
import apiClient from '../lib/axios';
import type {
  AccountResponse,
  ChangePasswordRequest,
  PasswordChangeResponse,
  UpdateAccountRequest,
} from '../types/account';

export async function fetchAccount(): Promise<AccountResponse> {
  const { data } = await apiClient.get<AccountResponse>('/api/account/me');
  return data;
}

export async function updateAccount(body: UpdateAccountRequest): Promise<AccountResponse> {
  try {
    const { data } = await apiClient.patch<AccountResponse>('/api/account/me', body);
    return data;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 405) {
      const { data } = await apiClient.put<AccountResponse>('/api/account/me', body);
      return data;
    }
    throw err;
  }
}

export async function changePassword(body: ChangePasswordRequest): Promise<PasswordChangeResponse> {
  try {
    const { data } = await apiClient.patch<PasswordChangeResponse>(
      '/api/account/me/password',
      body,
    );
    return data;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 405) {
      const { data } = await apiClient.put<PasswordChangeResponse>(
        '/api/account/me/password',
        body,
      );
      return data;
    }
    throw err;
  }
}
