export type ResultSortKey = 'recent' | 'oldest' | 'score_high' | 'score_low';

export type ApiResultSort =
  | 'MOST_RECENT'
  | 'OLDEST'
  | 'HIGHEST_INTEGRITY'
  | 'LOWEST_INTEGRITY';

export type ApiResultStatus = 'VERIFIED' | 'UNDER_REVIEW';

export type ResultTimingType = 'TIMED' | 'SUBMITTED';

export type ResultTiming = {
  type: ResultTimingType;
  startTime?: string | null;
  endTime?: string | null;
  submittedTime?: string | null;
};

export type StudentResultItem = {
  id: number;
  courseName: string;
  courseCode: string;
  assessmentType: string;
  category: string;
  dateTaken: string;
  timing: ResultTiming;
  integrityScore: number;
  status: ApiResultStatus;
};

export type StudentResultsPageResponse = {
  content: StudentResultItem[];
  totalElements: number;
  totalPages: number;
  from: number;
  to: number;
  page: number;
  size: number;
};

export type StudentResultsSummary = {
  examsCompleted: number;
  avgIntegrity: number;
  verifiedSessions: number;
  underReview: number;
};

/** Row shape used by ResultsTable and related UI. */
export type StudentResultRow = {
  id: number;
  courseName: string;
  courseCode: string;
  examLabel: string;
  icon: string;
  dateTaken: string;
  timeLabel: string;
  integrityScore: number;
  status: 'Verified' | 'Under Review';
};

export const RESULTS_PAGE_SIZE = 10;
