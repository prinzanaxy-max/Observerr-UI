export interface AccountResponse {
  firstName: string | null;
  lastName: string | null;
  institutionalId: string;
  email: string;
}

export interface UpdateAccountRequest {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

export interface FieldErrorResponse {
  error: 'VALIDATION_FAILED' | 'UNAUTHORIZED';
  field: string;
  message: string;
  timestamp: string;
}

export interface ValidationErrorsResponse {
  error: 'VALIDATION_FAILED';
  message: string;
  errors: Record<string, string>;
  timestamp: string;
}

export interface RateLimitErrorResponse {
  error: 'TOO_MANY_REQUESTS';
  message: string;
  timestamp: string;
}
