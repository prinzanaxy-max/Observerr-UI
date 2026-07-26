import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mapSessionEventToView } from '../lib/lecturerStudentsUtils';
import * as lecturerStudentsService from '../services/lecturerStudentsService';
import useAuthStore from '../store/authStore';
import type { LecturerSessionDetailResponse } from '../types/lecturerStudents';

export function useLecturerSessionDetail(sessionId: string | null) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [session, setSession] = useState<LecturerSessionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const loadSession = useCallback(async () => {
    if (!sessionId || sessionId.trim() === '') {
      setSession(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setForbidden(false);
    try {
      const data = await lecturerStudentsService.fetchLecturerSessionDetail(sessionId);
      setSession(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        if (status === 401) {
          clearAuth();
          navigate('/auth', { replace: true });
          return;
        }
        if (status === 403) {
          setForbidden(true);
          setError('You do not have permission to view this session.');
        } else if (status === 404) {
          setError('Session not found.');
        } else {
          setError('Could not load session details. Please try again.');
        }
      } else {
        setError('Could not load session details. Please try again.');
      }
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [clearAuth, navigate, sessionId]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const events = useMemo(
    () => session?.events.map(mapSessionEventToView) ?? [],
    [session?.events],
  );

  return {
    session,
    events,
    loading,
    error,
    forbidden,
    reload: loadSession,
  };
}
