export type ProctoringMediaToken = {
  token: string;
  url?: string;
  livekitUrl?: string;
  roomName: string;
  participantIdentity: string;
  expiresAt?: string;
};

export type ProctoringMediaState =
  | 'disabled'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'unavailable'
  | 'error';
