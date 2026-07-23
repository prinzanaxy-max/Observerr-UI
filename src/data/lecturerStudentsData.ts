export type StudentRisk = 'low' | 'medium' | 'high';

export type StudentRosterEntry = {
  id: string;
  name: string;
  initials?: string;
  course: string;
  examsTaken: number;
  avgIntegrity: number;
  risk: StudentRisk;
  lastActive: string;
};

export const COURSE_FILTERS = [
  { value: 'all', label: 'All Courses' },
  { value: 'CS101', label: 'CS101: Intro to CS' },
  { value: 'MATH401', label: 'MATH401: Advanced Calculus' },
  { value: 'MATH202', label: 'MATH202: Calculus' },
  { value: 'PHYS105', label: 'PHYS105: Mechanics' },
];

export const STUDENT_ROSTER: StudentRosterEntry[] = [
  {
    id: '902144',
    name: 'Alex Mercer',
    course: 'MATH401: Advanced Calculus',
    examsTaken: 4,
    avgIntegrity: 42,
    risk: 'high',
    lastActive: '2 hours ago',
  },
  {
    id: '902155',
    name: 'Sarah Chen',
    course: 'MATH202: Calculus',
    examsTaken: 3,
    avgIntegrity: 76,
    risk: 'medium',
    lastActive: '1 day ago',
  },
  {
    id: '902215',
    name: 'Marcus Johnson',
    initials: 'MJ',
    course: 'CS101: Intro to CS',
    examsTaken: 5,
    avgIntegrity: 42,
    risk: 'high',
    lastActive: '3 days ago',
  },
  {
    id: '902188',
    name: 'Maria Garcia',
    course: 'MATH401: Advanced Calculus',
    examsTaken: 2,
    avgIntegrity: 71,
    risk: 'medium',
    lastActive: '5 hours ago',
  },
  {
    id: '902201',
    name: 'James Wilson',
    initials: 'JW',
    course: 'CS101: Intro to CS',
    examsTaken: 6,
    avgIntegrity: 94,
    risk: 'low',
    lastActive: 'Today',
  },
];

export const riskBadgeClass: Record<StudentRisk, string> = {
  low: 'bg-student-tertiary-container text-student-on-tertiary-container',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-student-error-container text-student-on-error-container',
};

export const integrityScoreClass = (score: number) =>
  score >= 90 ? 'text-student-primary' : score >= 70 ? 'text-amber-600' : 'text-student-error';

export const getStudentRosterEntry = (id: string) =>
  STUDENT_ROSTER.find((student) => student.id === id);
