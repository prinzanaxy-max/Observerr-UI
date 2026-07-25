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

export function mapAccountApiError(error: unknown): AccountApiErrorResult {
  const fallback: AccountApiErrorResult = {
    message: 'Something went wrong. Please try again.',
    fieldErrors: {},
    unauthorized: false,
    rateLimited: false,
  };

  if (!(error instanceof AxiosError)) {
    return fallback;
  }

  const status = error.response?.status;
  const data = error.response?.data;

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
      message: data.message,
      fieldErrors: data.errors,
      unauthorized: false,
      rateLimited: false,
    };
  }

  if (isFieldError(data)) {
    return {
      message: data.message,
      fieldErrors: { [data.field]: data.message },
      unauthorized: status === 401 && data.error === 'UNAUTHORIZED' && data.field === 'currentPassword'
        ? false
        : status === 401,
      rateLimited: false,
    };
  }

  if (status === 401) {
    return {
      message: 'Your session has expired. Please sign in again.',
      fieldErrors: {},
      unauthorized: true,
      rateLimited: false,
    };
  }

  if (typeof data === 'object' && data !== null && 'message' in data) {
    return {
      message: String((data as { message: string }).message),
      fieldErrors: {},
      unauthorized: false,
      rateLimited: false,
    };
  }

  return fallback;
}
