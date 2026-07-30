import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseAnalyticsApiError } from '../lib/apiErrorMessage';
import { mapDashboardToView, type DashboardViewModel } from '../lib/lecturerDashboardUtils';
import * as lecturerDashboardService from '../services/lecturerDashboardService';
import useAuthStore from '../store/authStore';

const emptyDashboard = (): DashboardViewModel => ({
  liveExam: null,
  needsReview: [],
  examsByTab: { live: [], upcoming: [], completed: [] },
  integrityTrend: { changeLabel: '', points: [] },
  flaggedBehaviors: [],
});

export function useLecturerDashboard() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [dashboard, setDashboard] = useState<DashboardViewModel>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorHint, setErrorHint] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    setErrorHint('');
    setForbidden(false);

    try {
      const data = await lecturerDashboardService.fetchLecturerDashboard();
      setDashboard(mapDashboardToView(data));
    } catch (err) {
      console.error('[Dashboard] load failed', err);
      const parsed = parseAnalyticsApiError(err);
      if (parsed.unauthorized) {
        clearAuth();
        navigate('/auth', { replace: true });
        return;
      }
      setForbidden(parsed.forbidden);
      setError(parsed.message);
      setErrorHint(parsed.hint ?? '');
      setDashboard(emptyDashboard());
    } finally {
      setLoading(false);
    }
  }, [clearAuth, navigate]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    loading,
    error,
    errorHint,
    forbidden,
    reload: loadDashboard,
  };
}
