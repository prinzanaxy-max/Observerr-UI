export const studentExamActionPath = (
  examId: number,
  action: 'view-results' | 'exam',
  resultId?: number | null,
) => action === 'view-results'
  ? (resultId ? `/student/results/${resultId}` : '/student/results')
  : `/student/exams/${examId}`;

export const lecturerExamPath = (
  examId: number,
  status: 'live' | 'upcoming' | 'completed',
) => status === 'live'
  ? `/lecturer/exams/${examId}/live`
  : status === 'completed'
    ? `/lecturer/exams/${examId}/results`
    : null;
