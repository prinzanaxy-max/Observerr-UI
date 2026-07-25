import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as lecturerExamsService from '../services/lecturerExamsService';
import useAuthStore from '../store/authStore';
import type { LecturerExamDto } from '../types/lecturerExams';

export function useLecturerExam(examId: number | null) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [exam, setExam] = useState<LecturerExamDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const loadExam = useCallback(async () => {
    if (!examId || Number.isNaN(examId)) {
      setExam(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setForbidden(false);
    setNotFound(false);

    try {
      const data = await lecturerExamsService.fetchLecturerExam(examId);
      setExam(data);
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
          setError('You do not have permission to view this exam.');
        } else if (status === 404) {
          setNotFound(true);
          setError('Exam not found.');
        } else {
          setError('Could not load exam details. Please try again.');
        }
      } else {
        setError('Could not load exam details. Please try again.');
      }
      setExam(null);
    } finally {
      setLoading(false);
    }
  }, [clearAuth, examId, navigate]);

  useEffect(() => {
    void loadExam();
  }, [loadExam]);

  return {
    exam,
    loading,
    error,
    forbidden,
    notFound,
    reload: loadExam,
  };
}
