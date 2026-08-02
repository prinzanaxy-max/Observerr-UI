import apiClient from '../lib/axios';
import type { DeviceTokenRequest } from '../types/pushNotifications';

export async function registerDeviceToken(token: string): Promise<void> {
  const body: DeviceTokenRequest = { token };
  await apiClient.post('/api/devices/token', body);
}

export async function unregisterDeviceToken(token: string): Promise<void> {
  await apiClient.delete('/api/devices/token', { data: { token } });
}
