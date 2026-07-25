import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { filterExamsByTab, mapLecturerExamToOverview } from '../lib/lecturerExamsUtils';
import * as lecturerExamsService from '../services/lecturerExamsService';
import useAuthStore from '../store/authStore';
import type { ExamFilterTab, ExamOverview } from '../types/lecturerExams';

export function useLecturerExams(search: string, activeTab: ExamFilterTab) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [exams, setExams] = useState<ExamOverview[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleApiError = useCallback(
    (err: unknown) => {
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        if (status === 401) {
          clearAuth();
          navigate('/auth', { replace: true });
          return true;
        }
        if (status === 403) {
          setForbidden(true);
          setError('You do not have permission to view exams.');
          return true;
        }
      }
      setError('Could not load exams. Please try again.');
      return false;
    },
    [clearAuth, navigate],
  );

  const loadExams = useCallback(async () => {
    setLoading(true);
    setError('');
    setForbidden(false);
    try {
      const data = await lecturerExamsService.fetchLecturerExams({
        status: 'ALL',
        search: debouncedSearch,
      });
      setExams(data.exams.map(mapLecturerExamToOverview));
      setTotalElements(data.totalElements);
    } catch (err) {
      handleApiError(err);
      setExams([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, handleApiError]);

  useEffect(() => {
    void loadExams();
  }, [loadExams]);

  const filteredExams = useMemo(
    () => filterExamsByTab(exams, activeTab),
    [activeTab, exams],
  );

  return {
    exams: filteredExams,
    totalElements,
    loading,
    error,
    forbidden,
    reload: loadExams,
  };
}
