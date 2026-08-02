import apiClient from '../lib/axios';
import { mapSortKeyToApi } from '../lib/studentResultsUtils';
import type {
  ResultSortKey,
  StudentResultsPageResponse,
  StudentResultDetailResponse,
} from '../types/studentResults';
import { RESULTS_PAGE_SIZE } from '../types/studentResults';
import {
  requireArray,
  requireBoolean,
  requireNumber,
  requireRecord,
  requireString,
} from '../lib/apiResponse';

type ApiExamResult = {
  id: number;
  examId: number;
  sessionId: string;
  examTitle: string;
  courseCode: string;
  academicScore: number;
  maxScore: number;
  percentage: number;
  integrityScore: number;
  requiresReview: boolean;
  submittedAt: string;
  status: 'RELEASED';
};

type ApiExamResultsPage = {
  content: ApiExamResult[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type ApiQuestionAnalysis = {
  questionId: number;
  question: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  correct: boolean;
  pointsEarned: number;
  pointsPossible: number;
};

type ApiExamResultDetail = {
  result: ApiExamResult;
  analysis: ApiQuestionAnalysis[];
};

const normalizeResult = (value: unknown): ApiExamResult => {
  const item = requireRecord(value, 'student result');
  const status = requireString(item.status, 'student result');
  if (status !== 'RELEASED') throw new Error('Invalid student result response.');
  return {
    id: requireNumber(item.id, 'student result'),
    examId: requireNumber(item.examId, 'student result'),
    sessionId: requireString(item.sessionId, 'student result'),
    examTitle: requireString(item.examTitle, 'student result'),
    courseCode: requireString(item.courseCode, 'student result'),
    academicScore: requireNumber(item.academicScore, 'student result'),
    maxScore: requireNumber(item.maxScore, 'student result'),
    percentage: requireNumber(item.percentage, 'student result'),
    integrityScore: requireNumber(item.integrityScore, 'student result'),
    requiresReview: requireBoolean(item.requiresReview, 'student result'),
    submittedAt: requireString(item.submittedAt, 'student result'),
    status,
  };
};

export const normalizeResultsPage = (value: unknown): ApiExamResultsPage => {
  const page = requireRecord(value, 'student results page');
  return {
    content: requireArray(page.content, 'student results page').map(normalizeResult),
    page: requireNumber(page.page, 'student results page'),
    size: requireNumber(page.size, 'student results page'),
    totalElements: requireNumber(page.totalElements, 'student results page'),
    totalPages: requireNumber(page.totalPages, 'student results page'),
  };
};

export const normalizeResultDetail = (value: unknown): ApiExamResultDetail => {
  const detail = requireRecord(value, 'student result detail');
  return {
    result: normalizeResult(detail.result),
    analysis: requireArray(detail.analysis, 'student result detail').map((value) => {
      const answer = requireRecord(value, 'question analysis');
      return {
        questionId: requireNumber(answer.questionId, 'question analysis'),
        question: requireString(answer.question, 'question analysis'),
        selectedAnswer: answer.selectedAnswer === null
          ? null
          : requireString(answer.selectedAnswer, 'question analysis'),
        correctAnswer: requireString(answer.correctAnswer, 'question analysis'),
        correct: requireBoolean(answer.correct, 'question analysis'),
        pointsEarned: requireNumber(answer.pointsEarned, 'question analysis'),
        pointsPossible: requireNumber(answer.pointsPossible, 'question analysis'),
      };
    }),
  };
};

const toResultItem = (item: ApiExamResult) => ({
  id: item.id,
  courseName: item.courseCode,
  courseCode: item.courseCode,
  assessmentType: item.examTitle,
  category: item.courseCode,
  dateTaken: item.submittedAt,
  timing: { type: 'SUBMITTED' as const, submittedTime: new Date(item.submittedAt).toLocaleTimeString() },
  integrityScore: item.integrityScore,
  status: item.requiresReview ? ('UNDER_REVIEW' as const) : ('VERIFIED' as const),
  score: item.academicScore,
  maxScore: item.maxScore,
});

export type FetchResultsParams = {
  page: number;
  size?: number;
  sort: ResultSortKey;
};

export async function fetchResultsList({
  page,
  size = RESULTS_PAGE_SIZE,
  sort,
}: FetchResultsParams): Promise<StudentResultsPageResponse> {
  const { data } = await apiClient.get<unknown>('/api/student/results', {
    params: { page, size, sort: mapSortKeyToApi(sort) },
  });
  const normalized = normalizeResultsPage(data);
  return {
    content: normalized.content.map(toResultItem),
    totalElements: normalized.totalElements,
    totalPages: normalized.totalPages,
    from: normalized.totalElements === 0 ? 0 : normalized.page * normalized.size + 1,
    to: Math.min((normalized.page + 1) * normalized.size, normalized.totalElements),
    page: normalized.page,
    size: normalized.size,
  };
}

export async function fetchResultDetail(resultId: number): Promise<StudentResultDetailResponse> {
  const { data } = await apiClient.get<unknown>(`/api/student/results/${resultId}`);
  const normalized = normalizeResultDetail(data);
  const item = normalized.result;
  return {
    id: item.id,
    courseName: item.courseCode,
    courseCode: item.courseCode,
    assessmentType: item.examTitle,
    dateTaken: item.submittedAt,
    completedLabel: `Submitted ${new Date(item.submittedAt).toLocaleString()}`,
    integrityScore: item.integrityScore,
    status: item.requiresReview ? 'UNDER_REVIEW' : 'VERIFIED',
    baseScore: 100,
    deductions: Math.max(0, 100 - item.integrityScore),
    finalScore: item.integrityScore,
    feedbackTitle: 'Question analysis',
    feedbackMessage: `You scored ${item.academicScore} of ${item.maxScore} points (${Math.round(item.percentage)}%).`,
    score: item.academicScore,
    maxScore: item.maxScore,
    timeline: normalized.analysis.map((answer, index) => ({
      id: answer.questionId,
      title: `Question ${index + 1}: ${answer.correct ? 'Correct' : 'Incorrect'}`,
      timeLabel: `${answer.pointsEarned}/${answer.pointsPossible} points`,
      description: `${answer.question} · Selected: ${answer.selectedAnswer ?? 'No answer'} · Correct: ${answer.correctAnswer}`,
      type: answer.correct ? 'success' : 'neutral',
    })),
  };
}
