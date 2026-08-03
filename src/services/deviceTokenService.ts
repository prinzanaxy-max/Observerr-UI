import apiClient from '../lib/axios';
import type { WebPushSubscriptionPayload } from '../lib/webPush';

export async function registerDeviceToken(
  subscription: WebPushSubscriptionPayload,
): Promise<void> {
  await apiClient.post('/api/devices/token', subscription);
}

export async function unregisterDeviceToken(
  subscription: WebPushSubscriptionPayload,
): Promise<void> {
  await apiClient.delete('/api/devices/token', { data: subscription });
}
