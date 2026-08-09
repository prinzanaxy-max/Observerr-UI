import { useMemo } from 'react';
import { buildResultsSummaryCards } from '../lib/studentStatsUtils';
import { useStudentStats } from './useStudentStats';

/** Shared results summary stats — used by Results and Profile pages. */
export function useResultsSummary() {
  const { stats, loading, error, forbidden, reload } = useStudentStats();

  const summaryCards = useMemo(
    () => (loading ? [] : buildResultsSummaryCards(stats)),
    [stats, loading],
  );

  return {
    stats,
    summaryCards,
    loading,
    error,
    forbidden,
    reload,
  };
}
