import type {
  ApiExamStatus,
  CreateExamRequest,
  ExamFilterTab,
  ExamOverview,
  ExamStatus,
  LecturerExamDto,
} from '../types/lecturerExams';
import type { CreateExamFormState } from '../data/createExamData';

export const mapApiStatus = (status: ApiExamStatus): ExamStatus =>
  status.toLowerCase() as ExamStatus;

export const mapLecturerExamToOverview = (exam: LecturerExamDto): ExamOverview => ({
  id: exam.id,
  title: exam.title,
  courseCode: exam.courseCode,
  term: exam.term,
  schedule: exam.schedule,
  status: mapApiStatus(exam.status),
  enrollment: exam.enrollment,
  startAt: exam.startAt,
  durationMinutes: exam.durationMinutes,
  published: exam.published,
  detail: exam.detail ?? undefined,
});

export const filterExamsByTab = (exams: ExamOverview[], tab: ExamFilterTab): ExamOverview[] =>
  exams
    .filter((exam) => {
      if (tab === 'live') return exam.status === 'live' || exam.status === 'upcoming';
      return exam.status === tab;
    })
    .sort((a, b) => {
      if (tab !== 'live') return a.id - b.id;
      if (a.status === b.status) return a.id - b.id;
      if (a.status === 'live') return -1;
      if (b.status === 'live') return 1;
      return 0;
    });

export const formatExamTitle = (exam: Pick<LecturerExamDto, 'courseCode' | 'title'>): string =>
  `${exam.courseCode} — ${exam.title}`;

export const formatStartAt = (datetimeLocal: string): string => {
  if (!datetimeLocal) return '';
  return datetimeLocal.length === 16 ? `${datetimeLocal}:00` : datetimeLocal;
};

export const buildCreateExamRequest = (
  form: CreateExamFormState,
  publish: boolean,
): CreateExamRequest => ({
  title: form.title.trim(),
  course: form.courseId.trim(),
  startAt: formatStartAt(form.startDateTime),
  durationMinutes: Number.parseInt(form.durationMinutes, 10),
  studentInstitutionalIds: Array.from(
    new Set(
      form.studentInstitutionalIdsText
        .split(/[\s,;]+/)
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ),
  security: { ...form.security },
  questions: form.questions.map((question) => ({
    text: question.text.trim(),
    options: {
      A: question.options.A.trim(),
      B: question.options.B.trim(),
      C: question.options.C.trim(),
      D: question.options.D.trim(),
    },
    correctAnswer: question.correctAnswer,
    points: question.points,
  })),
  publish,
});

export const validateCreateExamForm = (form: CreateExamFormState): string | null => {
  if (!form.title.trim()) return 'Exam title is required.';
  if (!form.courseId.trim()) return 'Associated course is required.';
  if (!form.startDateTime) return 'Start date and time is required.';
  if (!form.studentInstitutionalIdsText.trim()) {
    return 'Add at least one student institutional ID before publishing.';
  }
  const duration = Number.parseInt(form.durationMinutes, 10);
  if (Number.isNaN(duration) || duration < 15) return 'Duration must be at least 15 minutes.';
  if (!form.questions.length) return 'Add at least one question.';
  for (const [index, question] of form.questions.entries()) {
    if (!question.text.trim()) return `Question ${index + 1} needs question text.`;
    if (Object.values(question.options).some((option) => !option.trim())) {
      return `Question ${index + 1} needs all four answer options.`;
    }
    if (!Number.isInteger(question.points) || question.points < 1) {
      return `Question ${index + 1} points must be a positive whole number.`;
    }
  }
  return null;
};

export const computeRemainingSeconds = (startAt: string, durationMinutes: number): number => {
  const start = new Date(startAt).getTime();
  if (Number.isNaN(start)) return 0;
  const end = start + durationMinutes * 60 * 1000;
  return Math.max(0, Math.floor((end - Date.now()) / 1000));
};
