import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStudentStatsCached } from '../lib/studentStatsCache';
import useAuthStore from '../store/authStore';
import { EMPTY_STUDENT_STATS, type StudentStats } from '../types/studentStats';

export function useStudentStats() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);
  const userId = useAuthStore((s) => s.user?.institutionalId ?? s.institutionalId ?? '');

  const [stats, setStats] = useState<StudentStats>(EMPTY_STUDENT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const loadStats = useCallback(async () => {
    if (!userId || userId === '—') {
      setStats(EMPTY_STUDENT_STATS);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setForbidden(false);

    try {
      const data = await fetchStudentStatsCached(userId);
      setStats(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        if (status === 401) {
          clearAuth();
          navigate('/login', { replace: true });
          return;
        }
        if (status === 403) {
          setForbidden(true);
          setError('You do not have permission to view these stats.');
          setStats(EMPTY_STUDENT_STATS);
          return;
        }
      }
      setError('Could not load stats. Please try again.');
      setStats(EMPTY_STUDENT_STATS);
    } finally {
      setLoading(false);
    }
  }, [clearAuth, navigate, userId]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    forbidden,
    reload: loadStats,
  };
}
