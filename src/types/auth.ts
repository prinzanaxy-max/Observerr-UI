export type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  role: Role;
  fullName: string;
  expiresIn: number;
}

export interface CurrentUser {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
}

export interface ApiError {
  error: string;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}
