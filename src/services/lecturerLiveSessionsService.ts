import apiClient from '../lib/axios';
import type {
  EndExamResponse,
  ExamStudentBlockRequest,
  LecturerLiveSessionsResponse,
} from '../types/lecturerLiveSessions';
import { requireArray, requireNumber, requireRecord, requireString } from '../lib/apiResponse';

export const normalizeLiveSessions = (value: unknown): LecturerLiveSessionsResponse => {
  const response = requireRecord(value, 'live sessions');
  const stats = requireRecord(response.stats, 'live sessions');
  return {
    examId: requireNumber(response.examId, 'live sessions'),
    stats: {
      active: requireNumber(stats.active, 'live sessions'),
      total: requireNumber(stats.total, 'live sessions'),
      highRisk: requireNumber(stats.highRisk, 'live sessions'),
      warnings: requireNumber(stats.warnings, 'live sessions'),
      networkStability: requireNumber(stats.networkStability, 'live sessions'),
    },
    students: requireArray(response.students, 'live sessions').map((value) => {
      const student = requireRecord(value, 'live session student');
      return {
        studentId: requireNumber(student.studentId, 'live session student'),
        studentNumber: requireString(student.studentNumber, 'live session student'),
        name: requireString(student.name, 'live session student'),
        initials: requireString(student.initials, 'live session student'),
        liveStatus: requireString(student.liveStatus, 'live session student'),
        liveStatusLabel: requireString(student.liveStatusLabel, 'live session student'),
        riskLevel: requireString(student.riskLevel, 'live session student'),
        lastEvent: student.lastEvent === null ? null : requireString(student.lastEvent, 'live session student'),
        latestSessionId: student.latestSessionId === null || typeof student.latestSessionId === 'string' || typeof student.latestSessionId === 'number'
          ? student.latestSessionId
          : null,
        integrityScore: requireNumber(student.integrityScore, 'live session student'),
        highlighted: typeof student.highlighted === 'boolean' ? student.highlighted : undefined,
        blocked: typeof student.blocked === 'boolean' ? student.blocked : undefined,
        blockReason: student.blockReason === null || student.blockReason === undefined
          ? null
          : requireString(student.blockReason, 'live session student'),
      };
    }),
  };
};

export async function fetchLecturerLiveSessions(
  examId: number,
): Promise<LecturerLiveSessionsResponse> {
  const { data } = await apiClient.get<unknown>(
    `/api/lecturer/exams/${examId}/live-sessions`,
  );
  return normalizeLiveSessions(data);
}

export async function startLecturerExam(examId: number): Promise<{ examId: number }> {
  const { data } = await apiClient.post<{ examId: number }>(
    `/api/lecturer/exams/${examId}/start`,
  );
  return data;
}

export async function endLecturerExam(examId: number): Promise<EndExamResponse> {
  const { data } = await apiClient.post<EndExamResponse>(
    `/api/lecturer/exams/${examId}/end`,
  );
  return data;
}

export async function blockExamStudent(
  examId: number,
  studentId: string,
  reason: string,
): Promise<void> {
  const body: ExamStudentBlockRequest = { reason };
  await apiClient.post(
    `/api/lecturer/exams/${examId}/students/${encodeURIComponent(studentId)}/block`,
    body,
  );
}

export async function unblockExamStudent(
  examId: number,
  studentId: string,
): Promise<void> {
  await apiClient.delete(
    `/api/lecturer/exams/${examId}/students/${encodeURIComponent(studentId)}/block`,
  );
}
