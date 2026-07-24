import type { StudentResult } from './studentResultsData';
import { STUDENT_RESULTS } from './studentResultsData';

export type TimelineEventType = 'success' | 'neutral' | 'shield';

export type TimelineEvent = {
  id: number;
  title: string;
  timeLabel: string;
  description: string;
  type: TimelineEventType;
  imageUrl?: string;
  imageCaption?: string;
  aiConfidence?: { label: string; value: string };
};

export type ResultDetail = StudentResult & {
  completedLabel: string;
  baseScore: number;
  deductions: number;
  finalScore: number;
  deductionNote?: string;
  feedbackTitle: string;
  feedbackMessage: string;
  timeline: TimelineEvent[];
};

const DATA_STRUCTURES_TIMELINE: TimelineEvent[] = [
  {
    id: 1,
    title: 'Identity verified successfully',
    timeLabel: '09:00 AM',
    description:
      'Biometric match confirmed against student profile. Environment scan passed with optimal lighting conditions.',
    type: 'success',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop',
    imageCaption: 'ID Match',
  },
  {
    id: 2,
    title: 'Stayed in fullscreen',
    timeLabel: '09:05 AM - 10:30 AM',
    description:
      'Browser remained locked in fullscreen mode throughout the entire assessment duration. No focus lost.',
    type: 'neutral',
  },
  {
    id: 3,
    title: 'No suspicious activity detected',
    timeLabel: 'Continuous',
    description:
      'Audio levels remained normal. Eye-tracking patterns consistent with focused test-taking. No secondary devices detected.',
    type: 'shield',
    aiConfidence: { label: 'AI Confidence Score', value: 'High Reliability' },
  },
  {
    id: 4,
    title: 'Session Completed',
    timeLabel: '10:30 AM',
    description: 'Exam submitted successfully. Secure environment closed.',
    type: 'neutral',
  },
];

const RESULT_DETAIL_OVERRIDES: Partial<
  Record<number, Omit<ResultDetail, keyof StudentResult> & { integrityScore?: number }>
> = {
  2: {
    completedLabel: 'Completed Oct 24, 2023',
    integrityScore: 98,
    baseScore: 100,
    deductions: 0,
    finalScore: 98,
    deductionNote: 'Minor gaze deviations detected briefly.',
    feedbackTitle: 'Excellent Session',
    feedbackMessage:
      'Your testing environment and behavior met all academic integrity standards perfectly. Great job maintaining focus.',
    timeline: DATA_STRUCTURES_TIMELINE,
  },
  1: {
    completedLabel: 'Completed Oct 12, 2023',
    baseScore: 100,
    deductions: 2,
    finalScore: 98,
    deductionNote: 'Brief tab focus event at 10:15 AM.',
    feedbackTitle: 'Excellent Session',
    feedbackMessage:
      'Your session met integrity standards with only minor deviations. Overall performance was strong.',
    timeline: DATA_STRUCTURES_TIMELINE.slice(0, 3).concat(DATA_STRUCTURES_TIMELINE.slice(3)),
  },
  3: {
    completedLabel: 'Completed Sep 28, 2023',
    baseScore: 100,
    deductions: 0,
    finalScore: 100,
    feedbackTitle: 'Perfect Session',
    feedbackMessage:
      'Flawless integrity record. No violations or anomalies detected during the entire examination.',
    timeline: DATA_STRUCTURES_TIMELINE,
  },
  4: {
    completedLabel: 'Completed Sep 15, 2023',
    baseScore: 100,
    deductions: 5,
    finalScore: 95,
    deductionNote: 'Extended idle period during essay composition.',
    feedbackTitle: 'Strong Session',
    feedbackMessage:
      'Your submission met academic integrity requirements. Minor timing anomalies were noted but within acceptable limits.',
    timeline: [
      {
        id: 1,
        title: 'Identity verified successfully',
        timeLabel: '23:30 PM',
        description: 'Student identity confirmed before essay submission window opened.',
        type: 'success',
      },
      {
        id: 2,
        title: 'Session Completed',
        timeLabel: '23:45 PM',
        description: 'Essay submitted successfully.',
        type: 'neutral',
      },
    ],
  },
};

const buildDefaultDetail = (result: StudentResult): ResultDetail => ({
  ...result,
  completedLabel: `Completed ${result.dateTaken}`,
  baseScore: 100,
  deductions: Math.max(0, 100 - result.integrityScore),
  finalScore: result.integrityScore,
  feedbackTitle: result.integrityScore >= 90 ? 'Excellent Session' : 'Session Reviewed',
  feedbackMessage:
    result.status === 'Verified'
      ? 'Your testing environment met academic integrity standards for this assessment.'
      : 'This session is under review. You will be notified when verification is complete.',
  timeline: [
    {
      id: 1,
      title: 'Session recorded',
      timeLabel: result.timeLabel,
      description: `Assessment completed on ${result.dateTaken}. Integrity score: ${result.integrityScore}%.`,
      type: result.status === 'Verified' ? 'success' : 'neutral',
    },
  ],
});

export const getStudentResultById = (id: number): StudentResult | undefined =>
  STUDENT_RESULTS.find((r) => r.id === id);

export const getStudentResultDetail = (id: number): ResultDetail | undefined => {
  const summary = getStudentResultById(id);
  if (!summary) return undefined;

  const override = RESULT_DETAIL_OVERRIDES[id];
  if (override) {
    return {
      ...summary,
      ...override,
      integrityScore: override.finalScore ?? summary.integrityScore,
    } as ResultDetail;
  }

  return buildDefaultDetail(summary);
};
