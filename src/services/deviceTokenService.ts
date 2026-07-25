import apiClient from '../lib/axios';
import type { DeviceTokenRequest } from '../types/pushNotifications';

export async function registerDeviceToken(token: string): Promise<void> {
  const body: DeviceTokenRequest = { token, platform: 'web' };
  await apiClient.post('/api/device-tokens', body);
}
