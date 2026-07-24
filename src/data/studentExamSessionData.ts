import type { StudentExam } from './studentExamsData';

export type ExamAvailability = 'locked' | 'ready' | 'completed';

export type ExamQuestionType = 'multiple-choice' | 'short-answer';

export type ExamQuestion = {
  id: number;
  number: number;
  text: string;
  type: ExamQuestionType;
  options?: string[];
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

const DEFAULT_INSTRUCTIONS = [
  'Ensure you are in a quiet, well-lit room.',
  'Close all unauthorized applications and tabs.',
  'Have a valid photo ID ready for verification.',
];

const DATA_STRUCTURES_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    number: 1,
    text: 'What is the average time complexity of accessing an element in an array by index?',
    type: 'multiple-choice',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    points: 5,
  },
  {
    id: 2,
    number: 2,
    text: 'Which data structure uses FIFO (First-In-First-Out) ordering?',
    type: 'multiple-choice',
    options: ['Stack', 'Queue', 'Binary Tree', 'Hash Map'],
    points: 5,
  },
  {
    id: 3,
    number: 3,
    text: 'Explain the difference between a binary search tree and a heap in one or two sentences.',
    type: 'short-answer',
    points: 10,
  },
  {
    id: 4,
    number: 4,
    text: 'What traversal order visits the root node between its left and right subtrees?',
    type: 'multiple-choice',
    options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
    points: 5,
  },
];

const CALCULUS_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    number: 1,
    text: 'Evaluate the limit: lim(x→0) (sin x) / x',
    type: 'multiple-choice',
    options: ['0', '1', '∞', 'Does not exist'],
    points: 10,
  },
  {
    id: 2,
    number: 2,
    text: 'Find the derivative of f(x) = x³ · e^x',
    type: 'short-answer',
    points: 15,
  },
  {
    id: 3,
    number: 3,
    text: 'Which rule is used to integrate ∫ x · cos(x) dx?',
    type: 'multiple-choice',
    options: ['Substitution', 'Integration by parts', 'Partial fractions', 'Chain rule'],
    points: 10,
  },
];

const QUANTUM_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    number: 1,
    text: 'State the Heisenberg uncertainty principle in your own words.',
    type: 'short-answer',
    points: 10,
  },
  {
    id: 2,
    number: 2,
    text: 'Which experiment demonstrated the wave-particle duality of electrons?',
    type: 'multiple-choice',
    options: ['Double-slit experiment', 'Photoelectric effect', 'Millikan oil drop', 'Rutherford scattering'],
    points: 5,
  },
];

export const STUDENT_EXAM_DETAILS: Record<number, StudentExamDetail> = {
  1: {
    id: 1,
    title: 'Data Structures & Algorithms',
    professor: 'Prof. Alan Turing',
    date: 'Oct 24, 2023',
    timeRange: '10:00 AM - 12:00 PM',
    icon: 'code',
    iconTone: 'secondary',
    statusLabel: 'Starts in 45m',
    statusTone: 'urgent',
    action: { type: 'waiting-room', label: 'Enter Waiting Room' },
    tab: 'upcoming',
    highlight: true,
    courseCode: 'CS 201',
    examType: 'Midterm Examination',
    durationMinutes: 90,
    timezone: 'PST',
    availability: 'ready',
    beginLabel: 'Begin Exam',
    instructions: DEFAULT_INSTRUCTIONS,
    questions: DATA_STRUCTURES_QUESTIONS,
  },
  2: {
    id: 2,
    title: 'Quantum Mechanics I',
    professor: 'Prof. Marie Curie',
    date: 'Oct 25, 2023',
    timeRange: '2:00 PM - 5:00 PM',
    icon: 'science',
    iconTone: 'tertiary',
    statusLabel: 'Tomorrow',
    statusTone: 'neutral',
    action: { type: 'guidelines', label: 'Review Guidelines' },
    tab: 'upcoming',
    courseCode: 'PHYS 301',
    examType: 'Final Examination',
    durationMinutes: 180,
    timezone: 'PST',
    availability: 'locked',
    availableAtLabel: 'Available at 2:00 PM',
    instructions: DEFAULT_INSTRUCTIONS,
    questions: QUANTUM_QUESTIONS,
  },
  3: {
    id: 3,
    title: 'Advanced Calculus III',
    professor: 'Dr. Alan Turing',
    date: 'October 24, 2023',
    timeRange: '10:00 AM - 12:00 PM PST',
    icon: 'functions',
    iconTone: 'error',
    statusLabel: 'Next Week',
    statusTone: 'neutral',
    action: { type: 'disabled', label: 'Not Available Yet' },
    tab: 'upcoming',
    courseCode: 'MATH 302',
    examType: 'Final Examination',
    durationMinutes: 120,
    timezone: 'PST',
    availability: 'locked',
    availableAtLabel: 'Available at 10:00 AM',
    instructions: DEFAULT_INSTRUCTIONS,
    questions: CALCULUS_QUESTIONS,
  },
  4: {
    id: 4,
    title: 'Data Structures',
    professor: 'Prof. Alan Turing',
    date: 'Oct 05, 2023',
    timeRange: '10:00 AM - 12:00 PM',
    icon: 'code',
    iconTone: 'secondary',
    statusLabel: 'Completed',
    statusTone: 'neutral',
    action: { type: 'view-results', label: 'View Results' },
    tab: 'completed',
    courseCode: 'CS 201',
    examType: 'Midterm Examination',
    durationMinutes: 90,
    timezone: 'PST',
    availability: 'completed',
    availableAtLabel: 'View Results',
    instructions: DEFAULT_INSTRUCTIONS,
    questions: DATA_STRUCTURES_QUESTIONS,
  },
  5: {
    id: 5,
    title: 'Modern History',
    professor: 'Dr. Carter',
    date: 'Sep 28, 2023',
    timeRange: '1:00 PM - 3:00 PM',
    icon: 'history_edu',
    iconTone: 'tertiary',
    statusLabel: 'Completed',
    statusTone: 'neutral',
    action: { type: 'view-results', label: 'View Results' },
    tab: 'completed',
    courseCode: 'HIST 110',
    examType: 'Final Examination',
    durationMinutes: 120,
    timezone: 'PST',
    availability: 'completed',
    availableAtLabel: 'View Results',
    instructions: DEFAULT_INSTRUCTIONS,
    questions: [],
  },
  6: {
    id: 6,
    title: 'Linear Algebra',
    professor: 'Prof. Davis',
    date: 'Sep 15, 2023',
    timeRange: '9:00 AM - 11:00 AM',
    icon: 'calculate',
    iconTone: 'error',
    statusLabel: 'Completed',
    statusTone: 'neutral',
    action: { type: 'view-results', label: 'View Results' },
    tab: 'completed',
    courseCode: 'MATH 210',
    examType: 'Midterm Examination',
    durationMinutes: 90,
    timezone: 'PST',
    availability: 'completed',
    availableAtLabel: 'View Results',
    instructions: DEFAULT_INSTRUCTIONS,
    questions: [],
  },
};

export const getStudentExamDetail = (examId: number): StudentExamDetail | undefined =>
  STUDENT_EXAM_DETAILS[examId];
