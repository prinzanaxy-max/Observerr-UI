export type ResultStatus = 'Verified' | 'Under Review';

export type ResultSortKey = 'recent' | 'score_high' | 'score_low' | 'course';

export type StudentResult = {
  id: number;
  examId?: number;
  courseName: string;
  courseCode: string;
  examLabel: string;
  icon: string;
  dateTaken: string;
  timeLabel: string;
  integrityScore: number;
  status: ResultStatus;
  takenAt: string;
};

export const RESULTS_PAGE_SIZE = 10;

export const STUDENT_RESULTS: StudentResult[] = [
  {
    id: 1,
    courseName: 'Advanced Organic Chemistry',
    courseCode: 'CHEM-401',
    examLabel: 'Midterm Exam',
    icon: 'science',
    dateTaken: 'Oct 12, 2023',
    timeLabel: '09:00 AM - 11:30 AM',
    integrityScore: 98,
    status: 'Verified',
    takenAt: '2023-10-12T09:00:00',
  },
  {
    id: 2,
    examId: 4,
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CS-305',
    examLabel: 'Quiz 4',
    icon: 'computer',
    dateTaken: 'Oct 05, 2023',
    timeLabel: '14:00 PM - 14:45 PM',
    integrityScore: 82,
    status: 'Under Review',
    takenAt: '2023-10-05T14:00:00',
  },
  {
    id: 3,
    examId: 6,
    courseName: 'Linear Algebra',
    courseCode: 'MATH-201',
    examLabel: 'Final Exam',
    icon: 'calculate',
    dateTaken: 'Sep 28, 2023',
    timeLabel: '10:00 AM - 13:00 PM',
    integrityScore: 100,
    status: 'Verified',
    takenAt: '2023-09-28T10:00:00',
  },
  {
    id: 4,
    examId: 5,
    courseName: 'Modern World History',
    courseCode: 'HIST-102',
    examLabel: 'Essay Submission',
    icon: 'menu_book',
    dateTaken: 'Sep 15, 2023',
    timeLabel: 'Submitted 23:45 PM',
    integrityScore: 95,
    status: 'Verified',
    takenAt: '2023-09-15T23:45:00',
  },
  {
    id: 5,
    courseName: 'Intro to Psychology',
    courseCode: 'PSYC-101',
    examLabel: 'Midterm Exam',
    icon: 'psychology',
    dateTaken: 'Sep 08, 2023',
    timeLabel: '11:00 AM - 12:30 PM',
    integrityScore: 91,
    status: 'Verified',
    takenAt: '2023-09-08T11:00:00',
  },
  {
    id: 6,
    courseName: 'Microeconomics',
    courseCode: 'ECON-210',
    examLabel: 'Quiz 2',
    icon: 'trending_up',
    dateTaken: 'Aug 30, 2023',
    timeLabel: '15:00 PM - 15:45 PM',
    integrityScore: 88,
    status: 'Verified',
    takenAt: '2023-08-30T15:00:00',
  },
  {
    id: 7,
    courseName: 'Operating Systems',
    courseCode: 'CS-401',
    examLabel: 'Final Exam',
    icon: 'memory',
    dateTaken: 'Aug 22, 2023',
    timeLabel: '09:00 AM - 12:00 PM',
    integrityScore: 76,
    status: 'Under Review',
    takenAt: '2023-08-22T09:00:00',
  },
  {
    id: 8,
    courseName: 'Technical Writing',
    courseCode: 'ENG-220',
    examLabel: 'Portfolio Review',
    icon: 'edit_note',
    dateTaken: 'Aug 14, 2023',
    timeLabel: 'Submitted 18:20 PM',
    integrityScore: 97,
    status: 'Verified',
    takenAt: '2023-08-14T18:20:00',
  },
  {
    id: 9,
    courseName: 'Physics II',
    courseCode: 'PHYS-202',
    examLabel: 'Lab Practical',
    icon: 'biotech',
    dateTaken: 'Aug 05, 2023',
    timeLabel: '13:00 PM - 15:00 PM',
    integrityScore: 93,
    status: 'Verified',
    takenAt: '2023-08-05T13:00:00',
  },
  {
    id: 10,
    courseName: 'Ethics in Technology',
    courseCode: 'PHIL-150',
    examLabel: 'Final Essay',
    icon: 'gavel',
    dateTaken: 'Jul 28, 2023',
    timeLabel: 'Submitted 21:10 PM',
    integrityScore: 99,
    status: 'Verified',
    takenAt: '2023-07-28T21:10:00',
  },
  {
    id: 11,
    courseName: 'Database Systems',
    courseCode: 'CS-350',
    examLabel: 'Midterm Exam',
    icon: 'storage',
    dateTaken: 'Jul 20, 2023',
    timeLabel: '10:00 AM - 11:30 AM',
    integrityScore: 85,
    status: 'Verified',
    takenAt: '2023-07-20T10:00:00',
  },
  {
    id: 12,
    courseName: 'Human Anatomy',
    courseCode: 'BIO-301',
    examLabel: 'Practical Exam',
    icon: 'monitor_heart',
    dateTaken: 'Jul 12, 2023',
    timeLabel: '08:30 AM - 10:30 AM',
    integrityScore: 94,
    status: 'Verified',
    takenAt: '2023-07-12T08:30:00',
  },
  {
    id: 13,
    courseName: 'Discrete Mathematics',
    courseCode: 'MATH-250',
    examLabel: 'Quiz 3',
    icon: 'functions',
    dateTaken: 'Jul 03, 2023',
    timeLabel: '14:00 PM - 14:50 PM',
    integrityScore: 79,
    status: 'Under Review',
    takenAt: '2023-07-03T14:00:00',
  },
  {
    id: 14,
    courseName: 'Software Engineering',
    courseCode: 'CS-420',
    examLabel: 'Project Defense',
    icon: 'engineering',
    dateTaken: 'Jun 25, 2023',
    timeLabel: 'Submitted 16:00 PM',
    integrityScore: 96,
    status: 'Verified',
    takenAt: '2023-06-25T16:00:00',
  },
  {
    id: 15,
    courseName: 'Corporate Finance',
    courseCode: 'FIN-310',
    examLabel: 'Final Exam',
    icon: 'account_balance',
    dateTaken: 'Jun 18, 2023',
    timeLabel: '09:00 AM - 11:00 AM',
    integrityScore: 87,
    status: 'Verified',
    takenAt: '2023-06-18T09:00:00',
  },
  {
    id: 16,
    courseName: 'World Literature',
    courseCode: 'LIT-201',
    examLabel: 'Analysis Paper',
    icon: 'auto_stories',
    dateTaken: 'Jun 10, 2023',
    timeLabel: 'Submitted 22:30 PM',
    integrityScore: 92,
    status: 'Verified',
    takenAt: '2023-06-10T22:30:00',
  },
  {
    id: 17,
    courseName: 'Computer Networks',
    courseCode: 'CS-380',
    examLabel: 'Midterm Exam',
    icon: 'hub',
    dateTaken: 'Jun 02, 2023',
    timeLabel: '13:00 PM - 14:30 PM',
    integrityScore: 81,
    status: 'Under Review',
    takenAt: '2023-06-02T13:00:00',
  },
  {
    id: 18,
    courseName: 'Environmental Science',
    courseCode: 'ENV-110',
    examLabel: 'Field Report',
    icon: 'eco',
    dateTaken: 'May 25, 2023',
    timeLabel: 'Submitted 17:45 PM',
    integrityScore: 90,
    status: 'Verified',
    takenAt: '2023-05-25T17:45:00',
  },
  {
    id: 19,
    courseName: 'Artificial Intelligence',
    courseCode: 'CS-450',
    examLabel: 'Final Exam',
    icon: 'smart_toy',
    dateTaken: 'May 18, 2023',
    timeLabel: '10:00 AM - 13:00 PM',
    integrityScore: 97,
    status: 'Verified',
    takenAt: '2023-05-18T10:00:00',
  },
  {
    id: 20,
    courseName: 'Public Speaking',
    courseCode: 'COMM-105',
    examLabel: 'Recorded Presentation',
    icon: 'record_voice_over',
    dateTaken: 'May 10, 2023',
    timeLabel: 'Submitted 19:00 PM',
    integrityScore: 100,
    status: 'Verified',
    takenAt: '2023-05-10T19:00:00',
  },
  {
    id: 21,
    courseName: 'Statistics for Engineers',
    courseCode: 'STAT-220',
    examLabel: 'Quiz 5',
    icon: 'bar_chart',
    dateTaken: 'May 02, 2023',
    timeLabel: '11:00 AM - 11:45 AM',
    integrityScore: 84,
    status: 'Verified',
    takenAt: '2023-05-02T11:00:00',
  },
  {
    id: 22,
    courseName: 'Mobile App Development',
    courseCode: 'CS-430',
    examLabel: 'Capstone Demo',
    icon: 'phone_iphone',
    dateTaken: 'Apr 24, 2023',
    timeLabel: 'Submitted 14:30 PM',
    integrityScore: 95,
    status: 'Verified',
    takenAt: '2023-04-24T14:30:00',
  },
  {
    id: 23,
    courseName: 'International Relations',
    courseCode: 'POL-240',
    examLabel: 'Midterm Exam',
    icon: 'public',
    dateTaken: 'Apr 16, 2023',
    timeLabel: '09:30 AM - 11:00 AM',
    integrityScore: 78,
    status: 'Under Review',
    takenAt: '2023-04-16T09:30:00',
  },
  {
    id: 24,
    courseName: 'Cloud Computing',
    courseCode: 'CS-440',
    examLabel: 'Final Exam',
    icon: 'cloud',
    dateTaken: 'Apr 08, 2023',
    timeLabel: '10:00 AM - 12:00 PM',
    integrityScore: 89,
    status: 'Verified',
    takenAt: '2023-04-08T10:00:00',
  },
];

export const sortStudentResults = (
  results: StudentResult[],
  sortKey: ResultSortKey,
): StudentResult[] => {
  const copy = [...results];
  switch (sortKey) {
    case 'score_high':
      return copy.sort((a, b) => b.integrityScore - a.integrityScore);
    case 'score_low':
      return copy.sort((a, b) => a.integrityScore - b.integrityScore);
    case 'course':
      return copy.sort((a, b) => a.courseName.localeCompare(b.courseName));
    case 'recent':
    default:
      return copy.sort((a, b) => b.takenAt.localeCompare(a.takenAt));
  }
};

export const filterStudentResults = (
  results: StudentResult[],
  query: string,
): StudentResult[] => {
  const q = query.trim().toLowerCase();
  if (!q) return results;
  return results.filter(
    (r) =>
      r.courseName.toLowerCase().includes(q) ||
      r.courseCode.toLowerCase().includes(q) ||
      r.examLabel.toLowerCase().includes(q) ||
      r.dateTaken.toLowerCase().includes(q),
  );
};
