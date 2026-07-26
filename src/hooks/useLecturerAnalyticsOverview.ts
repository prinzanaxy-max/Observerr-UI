import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseApiError } from '../lib/apiErrorMessage';
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
        console.error('[Analytics] load failed', err);

        if (err instanceof Error && err.message.startsWith('Analytics response')) {
          setError(`${err.message} — backend JSON may not match the contract.`);
          setOverview(null);
          return;
        }

        const parsed = parseApiError(
          err,
          'Could not load analytics. Please try again.',
          'You do not have permission to view analytics.',
        );

        if (parsed.unauthorized) {
          clearAuth();
          navigate('/auth', { replace: true });
          return;
        }

        setForbidden(parsed.forbidden);
        setError(parsed.message);
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
