export type UserRole = 'STUDENT' | 'LECTURER' | 'ADMIN';

/** @deprecated Use UserRole */
export type Role = UserRole;

export interface RegisterRequest {
  institutionalId: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  institutionalId: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  role: UserRole;
  institutionalId: string;
  expiresIn: number;
}

export interface CurrentUser {
  id: number;
  institutionalId: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ApiError {
  error: string;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}

export interface LogoutRequest {
  allDevices?: boolean;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
