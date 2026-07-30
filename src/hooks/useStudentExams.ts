import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UpcomingExam } from '../data/studentDashboardData';
import type { StudentExam } from '../data/studentExamsData';
import { mapStudentExamDtoToCard, mapStudentExamDtoToUpcoming } from '../lib/studentExamsUtils';
import * as studentExamsService from '../services/studentExamsService';
import useAuthStore from '../store/authStore';
import type { StudentExamDto } from '../types/studentExams';

export function useStudentExams() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [rawExams, setRawExams] = useState<StudentExamDto[]>([]);
  const [exams, setExams] = useState<StudentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const loadExams = useCallback(async () => {
    setLoading(true);
    setError('');
    setForbidden(false);
    try {
      const data = await studentExamsService.fetchStudentExams();
      const list = data.exams ?? [];
      setRawExams(list);
      setExams(list.map(mapStudentExamDtoToCard));
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
          setError('You do not have permission to view exams.');
          return;
        }
      }
      setError('Could not load exams. Please try again.');
      setExams([]);
      setRawExams([]);
    } finally {
      setLoading(false);
    }
  }, [clearAuth, navigate]);

  useEffect(() => {
    void loadExams();
  }, [loadExams]);

  const upcomingExams = useMemo(
    () => exams.filter((e) => e.tab === 'upcoming'),
    [exams],
  );

  const completedExams = useMemo(
    () => exams.filter((e) => e.tab === 'completed'),
    [exams],
  );

  const upcomingForDashboard = useMemo(
    () =>
      rawExams
        .map(mapStudentExamDtoToUpcoming)
        .filter((item): item is UpcomingExam => item !== null),
    [rawExams],
  );

  return {
    exams,
    upcomingExams,
    completedExams,
    upcomingForDashboard,
    loading,
    error,
    forbidden,
    reload: loadExams,
  };
}
