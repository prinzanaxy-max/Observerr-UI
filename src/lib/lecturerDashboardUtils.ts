import type { FlaggedBehavior, LecturerExam, ReviewStudent } from '../data/lecturerDashboardData';
import { mapLecturerExamToOverview } from './lecturerExamsUtils';
import type {
  DashboardFlaggedBehavior,
  DashboardLiveExam,
  DashboardNeedsReviewItem,
  LecturerDashboardResponse,
} from '../types/lecturerDashboard';
import type { LiveSessionStudentDto, LiveSessionStatsDto } from '../types/lecturerLiveSessions';
import type { LiveSessionStats, LiveStatus, MonitoredStudent } from '../data/liveMonitoringData';
import type { ProctoringFeedDto } from '../types/lecturerProctoring';
import type { ProctoringFeed } from '../data/proctoringData';

export type DashboardViewModel = {
  liveExam: DashboardLiveExam | null;
  needsReview: ReviewStudent[];
  examsByTab: {
    live: LecturerExam[];
    upcoming: LecturerExam[];
    completed: LecturerExam[];
  };
  integrityTrend: {
    changeLabel: string;
    points: number[];
  };
  flaggedBehaviors: FlaggedBehavior[];
};

const mapRiskToReviewBadge = (risk: DashboardNeedsReviewItem['riskLevel']): ReviewStudent['risk'] =>
  risk === 'HIGH' ? 'CRITICAL' : 'MODERATE';

export const mapNeedsReviewItem = (item: DashboardNeedsReviewItem): ReviewStudent => ({
  id: item.studentId,
  name: item.studentName,
  initials: item.initials,
  exam: item.examTitle,
  risk: mapRiskToReviewBadge(item.riskLevel),
  integrity: Math.round(item.integrityScore),
  latestSessionId: item.latestSessionId,
});

const mapExamDtoToCard = (exam: LecturerDashboardResponse['examTabs']['live'][number]): LecturerExam => {
  const overview = mapLecturerExamToOverview(exam);
  return {
    id: overview.id,
    title: overview.title,
    date: overview.schedule,
    students: exam.enrolledCount,
    status: overview.status,
  };
};

const mapBehaviorTone = (tone: DashboardFlaggedBehavior['tone']): FlaggedBehavior['tone'] => {
  if (tone === 'error') return 'error';
  if (tone === 'warning') return 'secondary';
  return 'tertiary';
};

export function mapDashboardToView(data: LecturerDashboardResponse): DashboardViewModel {
  return {
    liveExam: data.liveExam,
    needsReview: (data.needsReview ?? []).map(mapNeedsReviewItem),
    examsByTab: {
      live: (data.examTabs?.live ?? []).map(mapExamDtoToCard),
      upcoming: (data.examTabs?.upcoming ?? []).map(mapExamDtoToCard),
      completed: (data.examTabs?.completed ?? []).map(mapExamDtoToCard),
    },
    integrityTrend: {
      changeLabel: data.integrityTrend?.changeLabel ?? '',
      points: data.integrityTrend?.points ?? [],
    },
    flaggedBehaviors: (data.topFlaggedBehaviors ?? []).map((b, index) => ({
      id: index + 1,
      label: b.label,
      count: b.eventCount,
      pct: b.sharePercent,
      tone: mapBehaviorTone(b.tone),
    })),
  };
}

const normalizeLiveStatus = (status: string): LiveStatus => {
  const key = status.toLowerCase().replace(/_/g, '-');
  if (key.includes('tab')) return 'tab-out';
  if (key.includes('gaze') || key.includes('look')) return 'looking-away';
  return 'focused';
};

const normalizeRisk = (risk: string): MonitoredStudent['risk'] => {
  const r = risk.toLowerCase();
  if (r === 'high') return 'high';
  if (r === 'medium') return 'medium';
  return 'low';
};

export const mapLiveStats = (stats: LiveSessionStatsDto): LiveSessionStats => ({
  active: stats.active,
  total: stats.total,
  highRisk: stats.highRisk,
  warnings: stats.warnings,
  networkStability: stats.networkStability,
});

export const mapLiveSessionStudent = (student: LiveSessionStudentDto): MonitoredStudent => ({
  id: String(student.studentNumber || student.studentId),
  name: student.name,
  initials: student.initials,
  liveStatus: normalizeLiveStatus(student.liveStatus),
  liveStatusLabel: student.liveStatusLabel,
  risk: normalizeRisk(student.riskLevel),
  lastEvent: student.lastEvent,
  highlighted: student.highlighted ?? student.riskLevel?.toUpperCase() === 'HIGH',
  latestSessionId: student.latestSessionId,
  blocked: student.blocked ?? false,
  blockReason: student.blockReason,
});

export const mapProctoringFeedToView = (feed: ProctoringFeedDto): ProctoringFeed => ({
  id: String(feed.studentNumber || feed.studentId),
  name: feed.studentName || feed.name || `Student ${feed.studentId}`,
  initials: feed.initials,
  risk: normalizeRisk(feed.riskLevel),
  liveStatus: normalizeLiveStatus(feed.liveStatus ?? feed.liveStatusLabel),
  liveStatusLabel: feed.liveStatusLabel,
  feedPreview: feed.snapshotUrl ?? '',
  audioLevel: feed.audioLevel ?? 0,
  cameraOn: feed.cameraOn ?? Boolean(feed.snapshotUrl),
  micOn: feed.micOn ?? false,
  integrityScore: Math.round(feed.integrityScore),
  lastFlag: feed.lastFlag ?? feed.lastEvent ?? undefined,
  streamingSince: feed.streamingSince ?? '—',
  seatLabel: feed.seatLabel ?? undefined,
  sessionId: feed.sessionId,
  participantIdentity: feed.participantIdentity ?? String(feed.sessionId),
  roomName: feed.roomName,
});
