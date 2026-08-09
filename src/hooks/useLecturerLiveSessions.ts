import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LiveSessionStats, MonitoredStudent } from '../data/liveMonitoringData';
import { parseAnalyticsApiError } from '../lib/apiErrorMessage';
import { mapLiveSessionStudent, mapLiveStats } from '../lib/lecturerDashboardUtils';
import * as lecturerLiveSessionsService from '../services/lecturerLiveSessionsService';
import useAuthStore from '../store/authStore';

export function useLecturerLiveSessions(examId: number | null) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [students, setStudents] = useState<MonitoredStudent[]>([]);
  const [stats, setStats] = useState<LiveSessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [actionError, setActionError] = useState('');
  const [pendingStudentId, setPendingStudentId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (examId === null) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setForbidden(false);
    setNotFound(false);

    try {
      const data = await lecturerLiveSessionsService.fetchLecturerLiveSessions(examId);
      setStats(mapLiveStats(data.stats));
      setStudents((data.students ?? []).map(mapLiveSessionStudent));
    } catch (err) {
      console.error('[LiveSessions] load failed', err);
      const parsed = parseAnalyticsApiError(err);
      if (parsed.unauthorized) {
        clearAuth();
        navigate('/auth', { replace: true });
        return;
      }
      if (err instanceof AxiosError && err.response?.status === 404) {
        setNotFound(true);
      }
      setForbidden(parsed.forbidden);
      setError(parsed.message);
      setStudents([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [clearAuth, examId, navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  const setStudentBlocked = useCallback(async (
    studentId: string,
    blocked: boolean,
    reason = '',
  ) => {
    if (examId === null || pendingStudentId) return false;
    setPendingStudentId(studentId);
    setActionError('');
    try {
      if (blocked) {
        await lecturerLiveSessionsService.blockExamStudent(examId, studentId, reason);
      } else {
        await lecturerLiveSessionsService.unblockExamStudent(examId, studentId);
      }
      setStudents((current) => current.map((student) =>
        student.id === studentId
          ? { ...student, blocked, blockReason: blocked ? reason : null }
          : student,
      ));
      return true;
    } catch {
      setActionError(`Could not ${blocked ? 'block' : 'unblock'} this student.`);
      return false;
    } finally {
      setPendingStudentId(null);
    }
  }, [examId, pendingStudentId]);

  return {
    students,
    stats,
    loading,
    error,
    forbidden,
    notFound,
    actionError,
    pendingStudentId,
    reload: load,
    setStudentBlocked,
  };
}
