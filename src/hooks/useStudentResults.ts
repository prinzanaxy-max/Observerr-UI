import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mapResultItemToRow } from '../lib/studentResultsUtils';
import * as studentResultsService from '../services/studentResultsService';
import useAuthStore from '../store/authStore';
import type { ResultSortKey, StudentResultsSummary } from '../types/studentResults';

const SUMMARY_CACHE_MS = 5 * 60 * 1000;

let summaryCache: { data: StudentResultsSummary; fetchedAt: number } | null = null;

export function useStudentResults() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [page, setPageIndex] = useState(0);
  const [sortKey, setSortKey] = useState<ResultSortKey>('recent');

  const [summary, setSummary] = useState<StudentResultsSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rows, setRows] = useState<ReturnType<typeof mapResultItemToRow>[]>([]);
  const [listLoading, setListLoading] = useState(true);

  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const handleApiError = useCallback(
    (err: unknown) => {
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        if (status === 401) {
          clearAuth();
          navigate('/login', { replace: true });
          return true;
        }
        if (status === 403) {
          setForbidden(true);
          setError('You do not have permission to view these results.');
          return true;
        }
      }
      setError('Could not load results. Please try again.');
      return false;
    },
    [clearAuth, navigate],
  );

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      if (summaryCache && Date.now() - summaryCache.fetchedAt < SUMMARY_CACHE_MS) {
        setSummary(summaryCache.data);
        return;
      }

      const data = await studentResultsService.fetchResultsSummary();
      summaryCache = { data, fetchedAt: Date.now() };
      setSummary(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setSummaryLoading(false);
    }
  }, [handleApiError]);

  const loadList = useCallback(async () => {
    setListLoading(true);
    setError('');
    setForbidden(false);
    try {
      const data = await studentResultsService.fetchResultsList({
        page,
        sort: sortKey,
      });

      setRows(data.content.map(mapResultItemToRow));
      setFrom(data.from);
      setTo(data.to);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err) {
      handleApiError(err);
      setRows([]);
      setFrom(0);
      setTo(0);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setListLoading(false);
    }
  }, [handleApiError, page, sortKey]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const setSort = useCallback((key: ResultSortKey) => {
    setSortKey(key);
    setPageIndex(0);
  }, []);

  const setPage = useCallback(
    (uiPage: number) => {
      const next = Math.max(0, Math.min(totalPages - 1, uiPage - 1));
      setPageIndex(next);
    },
    [totalPages],
  );

  const uiPage = page + 1;

  const summaryCards = useMemo(() => {
    if (!summary) return [];
    return [
      {
        id: 'exams',
        label: 'Exams Completed',
        value: String(summary.examsCompleted),
        icon: 'history_edu',
        tone: 'neutral' as const,
      },
      {
        id: 'integrity',
        label: 'Avg Integrity',
        value: `${summary.avgIntegrity}%`,
        icon: 'verified_user',
        tone: 'primary' as const,
      },
      {
        id: 'verified',
        label: 'Verified Sessions',
        value: String(summary.verifiedSessions),
        icon: 'check_circle',
        tone: 'primary' as const,
      },
      {
        id: 'review',
        label: 'Under Review',
        value: String(summary.underReview),
        icon: 'pending',
        tone: 'secondary' as const,
      },
    ];
  }, [summary]);

  return {
    summaryCards,
    rows,
    from,
    to,
    totalElements,
    totalPages,
    page: uiPage,
    sortKey,
    summaryLoading,
    listLoading,
    error,
    forbidden,
    setSort,
    setPage,
    reload: loadList,
  };
}
