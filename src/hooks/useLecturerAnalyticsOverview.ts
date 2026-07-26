import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DateRangeKey } from '../data/integrityReportsData';
import {
  mapAnalyticsOverviewToView,
  UI_PERIOD_TO_API,
  type AnalyticsOverviewView,
} from '../lib/lecturerAnalyticsUtils';
import * as lecturerAnalyticsService from '../services/lecturerAnalyticsService';
import useAuthStore from '../store/authStore';

export function useLecturerAnalyticsOverview(period: DateRangeKey) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [overview, setOverview] = useState<AnalyticsOverviewView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const loadOverview = useCallback(
    async (range: Exclude<DateRangeKey, 'custom'>) => {
      setLoading(true);
      setError('');
      setForbidden(false);

      try {
        const data = await lecturerAnalyticsService.fetchLecturerAnalyticsOverview(
          UI_PERIOD_TO_API[range],
        );
        setOverview(mapAnalyticsOverviewToView(data));
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
            setError('You do not have permission to view analytics.');
          } else {
            setError('Could not load analytics. Please try again.');
          }
        } else {
          setError('Could not load analytics. Please try again.');
        }
        setOverview(null);
      } finally {
        setLoading(false);
      }
    },
    [clearAuth, navigate],
  );

  useEffect(() => {
    if (period === 'custom') {
      setLoading(false);
      return;
    }
    void loadOverview(period);
  }, [loadOverview, period]);

  const report = useMemo(
    () =>
      overview ?? {
        summary: [],
        trend: [],
        behaviors: [],
        trendTitle: 'Integrity Event Trends',
        trendSubtitle: 'Daily flagged events vs monitored sessions',
      },
    [overview],
  );

  return {
    report,
    loading: period !== 'custom' && loading,
    error,
    forbidden,
    reload: () => {
      if (period !== 'custom') void loadOverview(period);
    },
  };
}
