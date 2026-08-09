import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseAnalyticsApiError } from '../lib/apiErrorMessage';
import type { DateRangeKey } from '../data/integrityReportsData';
import {
  mapAnalyticsOverviewToView,
  UI_PERIOD_TO_API,
  type AnalyticsOverviewView,
} from '../lib/lecturerAnalyticsUtils';
import * as lecturerAnalyticsService from '../services/lecturerAnalyticsService';
import useAuthStore from '../store/authStore';

type CustomRange = {
  startDate: string;
  endDate: string;
};

export function useLecturerAnalyticsOverview(period: DateRangeKey, customRange: CustomRange) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [overview, setOverview] = useState<AnalyticsOverviewView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorHint, setErrorHint] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const loadOverview = useCallback(
    async () => {
      if (period === 'custom' && (!customRange.startDate || !customRange.endDate)) {
        setLoading(false);
        setOverview(null);
        setError('Select both a start and end date for the custom range.');
        return;
      }

      setLoading(true);
      setError('');
      setErrorHint('');
      setForbidden(false);

      try {
        const data = period === 'custom'
          ? await lecturerAnalyticsService.fetchLecturerAnalyticsOverview('CUSTOM', customRange)
          : await lecturerAnalyticsService.fetchLecturerAnalyticsOverview(
              UI_PERIOD_TO_API[period],
            );
        setOverview(mapAnalyticsOverviewToView(data));
      } catch (err) {
        console.error('[Analytics] load failed', err);

        if (err instanceof Error && err.message.startsWith('Analytics response')) {
          setError(`${err.message} — backend JSON may not match the contract.`);
          setOverview(null);
          return;
        }

        const parsed = parseAnalyticsApiError(err);

        if (parsed.unauthorized) {
          clearAuth();
          navigate('/auth', { replace: true });
          return;
        }

        setForbidden(parsed.forbidden);
        setError(parsed.message);
        setErrorHint(parsed.hint ?? '');
        setOverview(null);
      } finally {
        setLoading(false);
      }
    },
    [clearAuth, customRange, navigate, period],
  );

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

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
    loading,
    error,
    errorHint,
    forbidden,
    reload: () => {
      void loadOverview();
    },
  };
}
