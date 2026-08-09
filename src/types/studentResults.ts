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
  score: number | null;
  maxScore: number;
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

export type StudentResultDetailResponse = {
  id: number;
  courseName: string;
  courseCode: string;
  assessmentType: string;
  dateTaken: string;
  completedLabel: string;
  integrityScore: number;
  status: ApiResultStatus;
  baseScore: number;
  deductions: number;
  finalScore: number;
  deductionNote?: string;
  feedbackTitle: string;
  feedbackMessage: string;
  score: number | null;
  maxScore: number;
  timeline: TimelineEvent[];
};

export type TimelineEvent = {
  id: number;
  title: string;
  timeLabel: string;
  description: string;
  type: 'success' | 'neutral' | 'shield' | 'skipped';
  imageUrl?: string;
  imageCaption?: string;
  aiConfidence?: { label: string; value: string };
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
  score: number | null;
  maxScore: number;
  status: 'Verified' | 'Under Review';
};

export const RESULTS_PAGE_SIZE = 10;
