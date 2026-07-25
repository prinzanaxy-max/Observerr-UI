import type {
  ApiResultSort,
  ApiResultStatus,
  ResultSortKey,
  ResultTiming,
  StudentResultItem,
  StudentResultRow,
} from '../types/studentResults';

const CATEGORY_ICONS: Record<string, string> = {
  science: 'science',
  cs: 'computer',
  math: 'calculate',
  history: 'menu_book',
  psychology: 'psychology',
  economics: 'trending_up',
  writing: 'edit_note',
  philosophy: 'gavel',
  communication: 'record_voice_over',
  literature: 'auto_stories',
  business: 'account_balance',
  politics: 'public',
};

export const mapSortKeyToApi = (sort: ResultSortKey): ApiResultSort => {
  switch (sort) {
    case 'oldest':
      return 'OLDEST';
    case 'score_high':
      return 'HIGHEST_INTEGRITY';
    case 'score_low':
      return 'LOWEST_INTEGRITY';
    case 'recent':
    default:
      return 'MOST_RECENT';
  }
};

export const mapCategoryToIcon = (category: string): string =>
  CATEGORY_ICONS[category.toLowerCase()] ?? 'school';

export const mapApiStatusToDisplay = (status: ApiResultStatus): StudentResultRow['status'] =>
  status === 'VERIFIED' ? 'Verified' : 'Under Review';

export const formatTimingLabel = (timing: ResultTiming): string => {
  if (timing.type === 'SUBMITTED') {
    return timing.submittedTime ? `Submitted ${timing.submittedTime}` : 'Submitted';
  }

  if (timing.startTime && timing.endTime) {
    return `${timing.startTime} - ${timing.endTime}`;
  }

  return timing.startTime ?? timing.endTime ?? '';
};

export const mapResultItemToRow = (item: StudentResultItem): StudentResultRow => ({
  id: item.id,
  courseName: item.courseName,
  courseCode: item.courseCode,
  examLabel: item.assessmentType,
  icon: mapCategoryToIcon(item.category),
  dateTaken: item.dateTaken,
  timeLabel: formatTimingLabel(item.timing),
  integrityScore: item.integrityScore,
  status: mapApiStatusToDisplay(item.status),
});

export type IntegrityScoreTone = 'high' | 'medium' | 'low';

export const getIntegrityScoreTone = (score: number): IntegrityScoreTone => {
  if (score >= 90) return 'high';
  if (score >= 80) return 'medium';
  return 'low';
};
