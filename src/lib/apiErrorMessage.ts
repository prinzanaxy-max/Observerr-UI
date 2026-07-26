import { AxiosError } from 'axios';

export type ApiErrorBody = {
  message?: string;
  error?: string;
  timestamp?: string;
};

export type ParsedApiError = {
  message: string;
  hint?: string;
  forbidden: boolean;
  unauthorized: boolean;
  retryable: boolean;
};

export function parseApiError(
  err: unknown,
  fallback: string,
  forbiddenMessage = 'You do not have permission to view this resource.',
): ParsedApiError {
  if (err instanceof AxiosError) {
    const status = err.response?.status;
    const body = err.response?.data as ApiErrorBody | undefined;
    const detail = body?.message ?? body?.error;

    if (status === 401) {
      return { message: '', unauthorized: true, forbidden: false, retryable: false };
    }
    if (status === 403) {
      return {
        message: forbiddenMessage,
        unauthorized: false,
        forbidden: true,
        retryable: false,
      };
    }
    if (status === 404) {
      return {
        message: detail ?? 'Analytics overview not found for this period.',
        hint: 'No seeded overview row exists for the selected period. Run the V13 analytics seed on Neon.',
        unauthorized: false,
        forbidden: false,
        retryable: true,
      };
    }
    if (status === 400) {
      return {
        message: detail ?? 'Invalid period parameter.',
        unauthorized: false,
        forbidden: false,
        retryable: false,
      };
    }
    if (status === 500) {
      return {
        message: detail ?? 'An unexpected error occurred.',
        hint:
          'Usually caused by a missing V13 migration or analytics seed. Run scripts/run-lecturer-analytics-seed.mjs on Neon, then redeploy.',
        unauthorized: false,
        forbidden: false,
        retryable: true,
      };
    }
    if (!err.response) {
      return {
        message: 'Cannot reach the API. Check VITE_API_URL and that the backend is running.',
        unauthorized: false,
        forbidden: false,
        retryable: true,
      };
    }
    return {
      message: detail ?? `${fallback} (HTTP ${status}).`,
      unauthorized: false,
      forbidden: false,
      retryable: true,
    };
  }

  return { message: fallback, unauthorized: false, forbidden: false, retryable: true };
}

/** Analytics-specific wrapper — preserves backend `{ error, message }` body. */
export function parseAnalyticsApiError(err: unknown): ParsedApiError {
  return parseApiError(
    err,
    'Could not load analytics. Please try again.',
    'You do not have permission to view analytics.',
  );
}
