import { AxiosError } from 'axios';
import type {
  FieldErrorResponse,
  RateLimitErrorResponse,
  ValidationErrorsResponse,
} from '../types/account';

export type AccountApiErrorResult = {
  message: string;
  fieldErrors: Record<string, string>;
  unauthorized: boolean;
  rateLimited: boolean;
};

const isFieldError = (data: unknown): data is FieldErrorResponse =>
  typeof data === 'object' &&
  data !== null &&
  'field' in data &&
  'message' in data;

const isValidationErrors = (data: unknown): data is ValidationErrorsResponse =>
  typeof data === 'object' &&
  data !== null &&
  'errors' in data &&
  typeof (data as ValidationErrorsResponse).errors === 'object';

const isRateLimitError = (data: unknown): data is RateLimitErrorResponse =>
  typeof data === 'object' &&
  data !== null &&
  (data as RateLimitErrorResponse).error === 'TOO_MANY_REQUESTS';

const humanizeSpringError = (value: string): string => {
  switch (value) {
    case 'Method Not Allowed':
      return 'Profile updates are not supported by the server (method not allowed).';
    case 'Forbidden':
      return 'You do not have permission to update this account.';
    case 'Not Found':
      return 'Account update endpoint was not found on the server.';
    case 'Internal Server Error':
      return 'The server encountered an error while saving your profile.';
    default:
      return value;
  }
};

const extractMessage = (data: unknown, status?: number): string => {
  if (typeof data === 'string') {
    return data.length > 200 ? 'The server returned an unexpected response.' : data;
  }

  if (typeof data !== 'object' || data === null) {
    if (status === 404) return 'Account update endpoint was not found.';
    if (status === 405) return 'Profile updates are not supported by the server yet.';
    if (status === 403) return 'You do not have permission to update this account.';
    if (status === 500) return 'The server encountered an error while saving your profile.';
    return status ? `Request failed (${status}). Please try again.` : 'Something went wrong. Please try again.';
  }

  const body = data as Record<string, unknown>;

  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message;
  }
  if (typeof body.detail === 'string' && body.detail.trim()) {
    return body.detail;
  }
  if (typeof body.title === 'string' && body.title.trim()) {
    return body.title;
  }
  if (typeof body.error === 'string' && body.error.trim()) {
    return humanizeSpringError(body.error);
  }

  if (status === 404) return 'Account update endpoint was not found.';
  if (status === 405) return 'Profile updates are not supported by the server yet.';
  if (status === 403) return 'You do not have permission to update this account.';
  if (status === 500) return 'The server encountered an error while saving your profile.';

  return 'Something went wrong. Please try again.';
};

export function mapAccountApiError(error: unknown): AccountApiErrorResult {
  const fallback: AccountApiErrorResult = {
    message: 'Something went wrong. Please try again.',
    fieldErrors: {},
    unauthorized: false,
    rateLimited: false,
  };

  if (!(error instanceof AxiosError)) {
    if (error instanceof Error && error.message) {
      return { ...fallback, message: error.message };
    }
    return fallback;
  }

  if (!error.response) {
    return {
      message:
        error.code === 'ERR_NETWORK'
          ? 'Could not reach the server. Check your connection, or the API may be blocking profile updates from this browser (CORS).'
          : 'Could not connect to the server. Please try again.',
      fieldErrors: {},
      unauthorized: false,
      rateLimited: false,
    };
  }

  const status = error.response.status;
  const data = error.response.data;

  if (status === 429 || isRateLimitError(data)) {
    return {
      message:
        (data as RateLimitErrorResponse | undefined)?.message ??
        'Too many attempts. Please try again later.',
      fieldErrors: {},
      unauthorized: false,
      rateLimited: true,
    };
  }

  if (isValidationErrors(data)) {
    return {
      message: data.message ?? extractMessage(data, status),
      fieldErrors: data.errors,
      unauthorized: false,
      rateLimited: false,
    };
  }

  if (isFieldError(data)) {
    const isWrongPassword =
      status === 401 &&
      data.error === 'UNAUTHORIZED' &&
      data.field === 'currentPassword';

    return {
      message: data.message,
      fieldErrors: { [data.field]: data.message },
      unauthorized: status === 401 && !isWrongPassword,
      rateLimited: false,
    };
  }

  const fieldErrors =
    typeof data === 'object' &&
    data !== null &&
    'errors' in data &&
    typeof (data as { errors: unknown }).errors === 'object'
      ? ((data as { errors: Record<string, string> }).errors ?? {})
      : {};

  if (status === 401) {
    return {
      message: Object.keys(fieldErrors).length
        ? extractMessage(data, status)
        : 'Your session has expired. Please sign in again.',
      fieldErrors,
      unauthorized: Object.keys(fieldErrors).length === 0,
      rateLimited: false,
    };
  }

  return {
    message: extractMessage(data, status),
    fieldErrors,
    unauthorized: false,
    rateLimited: false,
  };
}
