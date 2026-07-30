import type { LecturerExamDto } from './lecturerExams';

export type DashboardLiveExam = {
  examId: number;
  title: string;
  courseCode: string;
  status: 'LIVE';
  remainingSeconds: number;
  activeStudents: number;
  highRiskCount: number;
  avgIntegrityScore: number;
  liveMonitoringPath?: string | null;
};

export type DashboardNeedsReviewItem = {
  studentId: number;
  studentName: string;
  initials: string;
  examTitle: string;
  examId: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  integrityScore: number;
  latestSessionId: string | number | null;
  requiresReview: boolean;
};

export type DashboardIntegrityTrend = {
  changeLabel: string;
  changeDirection: 'UP' | 'DOWN' | 'STABLE';
  points: number[];
};

export type DashboardFlaggedBehavior = {
  behaviorCode: string;
  label: string;
  eventCount: number;
  sharePercent: number;
  tone: 'error' | 'warning' | 'neutral';
  icon: string;
};

export type LecturerDashboardResponse = {
  liveExam: DashboardLiveExam | null;
  needsReview: DashboardNeedsReviewItem[];
  examTabs: {
    live: LecturerExamDto[];
    upcoming: LecturerExamDto[];
    completed: LecturerExamDto[];
  };
  integrityTrend: DashboardIntegrityTrend;
  topFlaggedBehaviors: DashboardFlaggedBehavior[];
};
