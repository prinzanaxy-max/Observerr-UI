import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProctoringExam, ProctoringFeed } from '../data/proctoringData';
import { parseAnalyticsApiError } from '../lib/apiErrorMessage';
import { mapProctoringFeedToView } from '../lib/lecturerDashboardUtils';
import * as lecturerProctoringService from '../services/lecturerProctoringService';
import useAuthStore from '../store/authStore';

export function useLecturerProctoring(selectedExamId: number | null) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [exams, setExams] = useState<ProctoringExam[]>([]);
  const [feeds, setFeeds] = useState<ProctoringFeed[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [error, setError] = useState('');

  const loadExams = useCallback(async () => {
    setLoadingExams(true);
    setError('');
    try {
      const data = await lecturerProctoringService.fetchProctoringExams();
      setExams(
        (data.exams ?? []).map((exam) => ({
          id: exam.examId,
          title: exam.title,
          courseCode: exam.courseLabel,
          activeFeeds: exam.activeFeeds,
          totalStudents: exam.totalStudents,
        })),
      );
    } catch (err) {
      console.error('[Proctoring] exams load failed', err);
      const parsed = parseAnalyticsApiError(err);
      if (parsed.unauthorized) {
        clearAuth();
        navigate('/auth', { replace: true });
        return;
      }
      setError(parsed.message);
      setExams([]);
    } finally {
      setLoadingExams(false);
    }
  }, [clearAuth, navigate]);

  const loadFeeds = useCallback(async (examId: number) => {
    setLoadingFeeds(true);
    try {
      const data = await lecturerProctoringService.fetchProctoringFeeds(examId);
      setFeeds((data.feeds ?? []).map(mapProctoringFeedToView));
    } catch (err) {
      console.error('[Proctoring] feeds load failed', err);
      const parsed = parseAnalyticsApiError(err);
      if (parsed.unauthorized) {
        clearAuth();
        navigate('/auth', { replace: true });
        return;
      }
      setFeeds([]);
    } finally {
      setLoadingFeeds(false);
    }
  }, [clearAuth, navigate]);

  useEffect(() => {
    void loadExams();
  }, [loadExams]);

  useEffect(() => {
    if (selectedExamId !== null) {
      void loadFeeds(selectedExamId);
      const poll = window.setInterval(() => {
        if (document.visibilityState === 'visible') void loadFeeds(selectedExamId);
      }, 10_000);
      const onVisibility = () => {
        if (document.visibilityState === 'visible') void loadFeeds(selectedExamId);
      };
      document.addEventListener('visibilitychange', onVisibility);
      return () => {
        window.clearInterval(poll);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    } else {
      setFeeds([]);
    }
    return undefined;
  }, [loadFeeds, selectedExamId]);

  return {
    exams,
    feeds,
    loading: loadingExams || loadingFeeds,
    error,
    reloadExams: loadExams,
  };
}
