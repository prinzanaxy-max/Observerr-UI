import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StudentExamDetail } from '../data/studentExamSessionData';
import { mapStudentExamDtoToDetail } from '../lib/studentExamsUtils';
import * as studentExamsService from '../services/studentExamsService';
import useAuthStore from '../store/authStore';

export function useStudentExam(examId: number | null) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [exam, setExam] = useState<StudentExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const loadExam = useCallback(async () => {
    if (examId === null || examId <= 0) {
      setExam(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setNotFound(false);

    try {
      const data = await studentExamsService.fetchStudentExam(examId);
      setExam(mapStudentExamDtoToDetail(data));
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        if (status === 401) {
          clearAuth();
          navigate('/auth', { replace: true });
          return;
        }
        if (status === 404) {
          setNotFound(true);
          setError('Exam not found or not published yet.');
        } else if (status === 403) {
          setError('You do not have access to this exam.');
        } else {
          setError('Could not load exam details.');
        }
      } else {
        setError('Could not load exam details.');
      }
      setExam(null);
    } finally {
      setLoading(false);
    }
  }, [clearAuth, examId, navigate]);

  useEffect(() => {
    void loadExam();
  }, [loadExam]);

  return { exam, loading, error, notFound, reload: loadExam };
}
