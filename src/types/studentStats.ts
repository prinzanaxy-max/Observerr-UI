export type StudentStats = {
  examsCompleted: number;
  avgIntegrity: number;
  verifiedSessions: number;
  underReview: number;
};

export const EMPTY_STUDENT_STATS: StudentStats = {
  examsCompleted: 0,
  avgIntegrity: 100,
  verifiedSessions: 0,
  underReview: 0,
};
