import { AxiosError } from 'axios';

type ApiErrorBody = {
  message?: string;
  error?: string;
};

export type ParsedApiError = {
  message: string;
  forbidden: boolean;
  unauthorized: boolean;
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
      return { message: '', unauthorized: true, forbidden: false };
    }
    if (status === 403) {
      return { message: forbiddenMessage, unauthorized: false, forbidden: true };
    }
    if (status === 404) {
      return {
        message: detail ?? 'Endpoint not found. Deploy the latest backend (analytics commit ad5149f).',
        unauthorized: false,
        forbidden: false,
      };
    }
    if (status === 400) {
      return {
        message: detail ?? 'Invalid request parameters.',
        unauthorized: false,
        forbidden: false,
      };
    }
    if (status === 500) {
      return {
        message:
          detail ??
          'Server error loading analytics. Run scripts/run-lecturer-analytics-seed.mjs against Neon, then redeploy.',
        unauthorized: false,
        forbidden: false,
      };
    }
    if (!err.response) {
      return {
        message: 'Cannot reach the API. Check VITE_API_URL and that the backend is running.',
        unauthorized: false,
        forbidden: false,
      };
    }
    return {
      message: detail ?? `${fallback} (HTTP ${status}).`,
      unauthorized: false,
      forbidden: false,
    };
  }

  return { message: fallback, unauthorized: false, forbidden: false };
}
