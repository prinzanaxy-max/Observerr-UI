import { AxiosError } from 'axios';
import apiClient from '../lib/axios';
import type {
  AccountResponse,
  ChangePasswordRequest,
  PasswordChangeResponse,
  ProfilePictureResponse,
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

export async function uploadProfilePicture(file: File): Promise<ProfilePictureResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post<ProfilePictureResponse>(
    '/api/account/me/profile-picture',
    formData,
    {
      transformRequest: [
        (body, headers) => {
          if (headers && typeof headers === 'object') {
            delete (headers as Record<string, unknown>)['Content-Type'];
          }
          return body;
        },
      ],
    },
  );
  return data;
}

export async function removeProfilePicture(): Promise<ProfilePictureResponse> {
  const { data } = await apiClient.delete<ProfilePictureResponse>(
    '/api/account/me/profile-picture',
  );
  return data;
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
