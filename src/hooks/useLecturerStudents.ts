import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseAvailableCourses } from '../lib/lecturerStudentsUtils';
import * as lecturerStudentsService from '../services/lecturerStudentsService';
import useAuthStore from '../store/authStore';
import type { LecturerStudentItem } from '../types/lecturerStudents';

export function useLecturerStudents(search: string, course: string) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [page, setPageIndex] = useState(0);
  const [students, setStudents] = useState<LecturerStudentItem[]>([]);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch, course]);

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
          setError('You do not have permission to view students.');
          return true;
        }
      }
      setError('Could not load students. Please try again.');
      return false;
    },
    [clearAuth, navigate],
  );

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    setForbidden(false);
    try {
      const data = await lecturerStudentsService.fetchLecturerStudents({
        page,
        search: debouncedSearch,
        course,
      });
      setStudents(data.content);
      setFrom(data.from);
      setTo(data.to);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
      setAvailableCourses(data.availableCourses);
    } catch (err) {
      handleApiError(err);
      setStudents([]);
      setFrom(0);
      setTo(0);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [course, debouncedSearch, handleApiError, page]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const setPage = useCallback(
    (uiPage: number) => {
      const next = Math.max(0, Math.min(totalPages - 1, uiPage - 1));
      setPageIndex(next);
    },
    [totalPages],
  );

  const courseOptions = useMemo(
    () => parseAvailableCourses(availableCourses),
    [availableCourses],
  );

  return {
    students,
    from,
    to,
    totalElements,
    totalPages,
    page: page + 1,
    courseOptions,
    loading,
    error,
    forbidden,
    setPage,
    reload: loadStudents,
  };
}
