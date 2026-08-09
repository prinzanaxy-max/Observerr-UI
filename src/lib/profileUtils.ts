import { API_URL } from './apiConfig';

/** Turn API-relative profile picture paths into absolute URLs for <img src>. */
export const resolveProfilePictureUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (/^(https?:|data:|blob:)/i.test(url)) return url;

  const base = API_URL.replace(/\/$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
};

export const getInitialsFromId = (institutionalId: string) => {
  const compact = institutionalId.replace(/[^A-Za-z0-9]/g, '');
  return (compact.slice(0, 2) || institutionalId.slice(0, 2)).toUpperCase();
};

export const getInitialsFromName = (
  firstName?: string | null,
  lastName?: string | null,
  fallbackId?: string,
) => {
  const first = firstName?.trim().charAt(0) ?? '';
  const last = lastName?.trim().charAt(0) ?? '';
  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }
  return getInitialsFromId(fallbackId ?? '');
};
