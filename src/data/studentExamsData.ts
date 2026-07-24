export type ExamListTab = 'upcoming' | 'completed';

export type ExamIconTone = 'secondary' | 'tertiary' | 'error';

export type ExamActionType = 'waiting-room' | 'guidelines' | 'disabled' | 'view-results';

export type StudentExam = {
  id: number;
  title: string;
  professor: string;
  date: string;
  timeRange: string;
  icon: string;
  iconTone: ExamIconTone;
  statusLabel: string;
  statusTone: 'urgent' | 'neutral';
  action: {
    type: ExamActionType;
    label: string;
  };
  tab: ExamListTab;
  highlight?: boolean;
};

export const UPCOMING_STUDENT_EXAMS: StudentExam[] = [
  {
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
  },
  {
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
  },
  {
    id: 3,
    title: 'Advanced Calculus III',
    professor: 'Prof. Isaac Newton',
    date: 'Nov 02, 2023',
    timeRange: '9:00 AM - 11:30 AM',
    icon: 'calculate',
    iconTone: 'error',
    statusLabel: 'Next Week',
    statusTone: 'neutral',
    action: { type: 'disabled', label: 'Not Available Yet' },
    tab: 'upcoming',
  },
];

export const COMPLETED_STUDENT_EXAMS: StudentExam[] = [
  {
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
  },
  {
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
  },
  {
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
  },
];

export const ALL_STUDENT_EXAMS: StudentExam[] = [
  ...UPCOMING_STUDENT_EXAMS,
  ...COMPLETED_STUDENT_EXAMS,
];
