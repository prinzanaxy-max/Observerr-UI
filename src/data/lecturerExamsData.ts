export type ExamStatus = 'live' | 'upcoming' | 'completed';

export type ExamDetail = {
  type: 'flags' | 'draft' | 'config';
  label: string;
  icon: string;
  tone: 'error' | 'muted' | 'secondary';
};

export type ExamOverview = {
  id: number;
  title: string;
  courseCode: string;
  term: string;
  schedule: string;
  status: ExamStatus;
  enrollment: string;
  detail?: ExamDetail;
};

export type ExamFilterTab = ExamStatus;

export const EXAM_OVERVIEWS: ExamOverview[] = [
  {
    id: 1,
    title: 'Advanced Algorithms Final',
    courseCode: 'CS401',
    term: 'Spring 2024',
    schedule: 'Today, 10:00 AM - 12:00 PM',
    status: 'live',
    enrollment: '145 / 150 Students Joined',
    detail: { type: 'flags', label: '3 Active Flags', icon: 'warning', tone: 'error' },
  },
  {
    id: 2,
    title: 'Data Structures Midterm',
    courseCode: 'CS302',
    term: 'Spring 2024',
    schedule: 'Tomorrow, 2:00 PM - 4:00 PM',
    status: 'upcoming',
    enrollment: '120 Enrolled',
    detail: { type: 'draft', label: 'Draft Ready', icon: 'verified', tone: 'muted' },
  },
  {
    id: 3,
    title: 'Intro to Machine Learning',
    courseCode: 'CS450',
    term: 'Spring 2024',
    schedule: 'Oct 24, 9:00 AM - 11:30 AM',
    status: 'upcoming',
    enrollment: '85 Enrolled',
    detail: { type: 'config', label: 'Needs Configuration', icon: 'pending', tone: 'secondary' },
  },
  {
    id: 4,
    title: 'Operating Systems Final',
    courseCode: 'CS310',
    term: 'Fall 2023',
    schedule: 'Nov 28, 2023 • 9:00 AM - 11:00 AM',
    status: 'completed',
    enrollment: '96 Completed',
    detail: { type: 'draft', label: 'Archived', icon: 'inventory_2', tone: 'muted' },
  },
  {
    id: 5,
    title: 'Database Systems Quiz',
    courseCode: 'CS330',
    term: 'Spring 2024',
    schedule: 'Nov 05, 2024 • 1:00 PM - 2:00 PM',
    status: 'completed',
    enrollment: '110 Completed',
    detail: { type: 'draft', label: 'Graded', icon: 'task_alt', tone: 'muted' },
  },
];

export const getExamById = (id: number): ExamOverview | undefined =>
  EXAM_OVERVIEWS.find((exam) => exam.id === id);
