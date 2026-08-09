export type ExamListTab = 'upcoming' | 'completed';

export type ExamIconTone = 'secondary' | 'tertiary' | 'error';

export type ExamActionType = 'waiting-room' | 'guidelines' | 'disabled' | 'view-results';

export type StudentExam = {
  id: number;
  title: string;
  professor: string;
  date: string;
  timeRange: string;
  icon: string;
  iconTone: ExamIconTone;
  statusLabel: string;
  statusTone: 'urgent' | 'neutral';
  action: {
    type: ExamActionType;
    label: string;
  };
  tab: ExamListTab;
  highlight?: boolean;
  resultId?: number | null;
};
