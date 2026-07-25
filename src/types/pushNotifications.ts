export type DeviceTokenRequest = {
  token: string;
  platform: 'web';
};

export type PushPermissionStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'error'
  | 'unsupported';

export type ForegroundPushPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
};
