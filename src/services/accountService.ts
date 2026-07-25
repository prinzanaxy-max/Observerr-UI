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
  const { data } = await apiClient.patch<AccountResponse>('/api/account/me', body);
  return data;
}

export async function changePassword(body: ChangePasswordRequest): Promise<PasswordChangeResponse> {
  const { data } = await apiClient.patch<PasswordChangeResponse>(
    '/api/account/me/password',
    body,
  );
  return data;
}
