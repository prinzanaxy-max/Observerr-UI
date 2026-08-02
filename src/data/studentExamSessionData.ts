import type { StudentExam } from './studentExamsData';

export type ExamAvailability = 'locked' | 'ready' | 'completed';

export type ExamQuestionType = 'multiple-choice' | 'short-answer';

export type ExamQuestion = {
  id: number;
  number: number;
  text: string;
  type: ExamQuestionType;
  options?: string[];
  optionKeys?: ('A' | 'B' | 'C' | 'D')[];
  points: number;
};

export type StudentExamDetail = StudentExam & {
  courseCode: string;
  examType: string;
  durationMinutes: number;
  timezone: string;
  availability: ExamAvailability;
  availableAtLabel?: string;
  beginLabel?: string;
  instructions: string[];
  questions: ExamQuestion[];
};
