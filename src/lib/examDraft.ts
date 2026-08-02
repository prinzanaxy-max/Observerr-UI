import type { AnswerChoice, CreateExamFormState } from '../data/createExamData';

const DRAFT_VERSION = 1;
const ANSWERS: AnswerChoice[] = ['A', 'B', 'C', 'D'];

type StoredExamDraft = {
  version: number;
  savedAt: string;
  form: CreateExamFormState;
};

export type ExamDraft = {
  savedAt: Date;
  form: CreateExamFormState;
};

export const examDraftStorageKey = (institutionalId: string) =>
  `observerr:lecturer-exam-draft:${institutionalId || 'anonymous'}:v${DRAFT_VERSION}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isForm = (value: unknown): value is CreateExamFormState => {
  if (!isRecord(value) || !isRecord(value.security) || !Array.isArray(value.questions)) return false;
  const security = value.security;
  if (
    typeof value.title !== 'string' ||
    typeof value.courseId !== 'string' ||
    typeof value.startDateTime !== 'string' ||
    typeof value.durationMinutes !== 'string' ||
    (value.studentInstitutionalIdsText !== undefined
      && typeof value.studentInstitutionalIdsText !== 'string')
  ) return false;
  if (!['webcamMonitoring', 'tabSwitchTracking', 'blockCopyPaste'].every(
    (key) => typeof security[key] === 'boolean',
  )) return false;
  return value.questions.length > 0 && value.questions.every((question) => {
    if (!isRecord(question) || !isRecord(question.options)) return false;
    const options = question.options;
    return (
      typeof question.id === 'string' &&
      typeof question.text === 'string' &&
      ANSWERS.every((answer) => typeof options[answer] === 'string') &&
      ANSWERS.includes(question.correctAnswer as AnswerChoice) &&
      typeof question.points === 'number' &&
      Number.isFinite(question.points)
    );
  });
};

export function readExamDraft(storage: Pick<Storage, 'getItem'>, institutionalId: string): ExamDraft | null {
  try {
    const raw = storage.getItem(examDraftStorageKey(institutionalId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed) || parsed.version !== DRAFT_VERSION || typeof parsed.savedAt !== 'string' || !isForm(parsed.form)) {
      return null;
    }
    const savedAt = new Date(parsed.savedAt);
    return Number.isNaN(savedAt.getTime())
      ? null
      : {
          savedAt,
          form: {
            ...parsed.form,
            studentInstitutionalIdsText: parsed.form.studentInstitutionalIdsText ?? '',
          },
        };
  } catch {
    return null;
  }
}

export function writeExamDraft(
  storage: Pick<Storage, 'setItem'>,
  institutionalId: string,
  form: CreateExamFormState,
  savedAt = new Date(),
): Date {
  const value: StoredExamDraft = {
    version: DRAFT_VERSION,
    savedAt: savedAt.toISOString(),
    form,
  };
  storage.setItem(examDraftStorageKey(institutionalId), JSON.stringify(value));
  return savedAt;
}

export function clearExamDraft(storage: Pick<Storage, 'removeItem'>, institutionalId: string) {
  storage.removeItem(examDraftStorageKey(institutionalId));
}
