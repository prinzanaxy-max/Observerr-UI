import { useMemo } from 'react';
import useAuthStore from '../store/authStore';
import { getInitialsFromId, resolveProfilePictureUrl } from '../lib/profileUtils';

export function useAuthProfile() {
  const user = useAuthStore((s) => s.user);
  const sessionId = useAuthStore((s) => s.institutionalId);

  const institutionalId = user?.institutionalId ?? sessionId ?? '—';
  const email = user?.email ?? '';
  const profilePictureUrl = resolveProfilePictureUrl(user?.profilePictureUrl);
  const initials = useMemo(() => getInitialsFromId(institutionalId), [institutionalId]);

  return { user, institutionalId, email, initials, profilePictureUrl };
}
