export type SecuritySettingKey =
  | 'webcamMonitoring'
  | 'tabSwitchTracking'
  | 'blockCopyPaste'
  | 'allowRetake';

export type SecuritySetting = {
  key: SecuritySettingKey;
  label: string;
  description: string;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
  defaultEnabled: boolean;
};

export type CreateExamFormState = {
  title: string;
  courseId: string;
  startDateTime: string;
  durationMinutes: string;
  studentInstitutionalIdsText: string;
  security: Record<SecuritySettingKey, boolean>;
  questions: AuthoringQuestion[];
};

export type AnswerChoice = 'A' | 'B' | 'C' | 'D';

export type AuthoringQuestion = {
  id: string;
  text: string;
  options: Record<AnswerChoice, string>;
  correctAnswer: AnswerChoice;
  points: number;
};

export const createEmptyQuestion = (index = 0): AuthoringQuestion => ({
  id: globalThis.crypto?.randomUUID?.() ?? `question-${Date.now()}-${index}`,
  text: '',
  options: { A: '', B: '', C: '', D: '' },
  correctAnswer: 'A',
  points: 1,
});

export const CREATE_EXAM_PATH = '/lecturer/exams/new';

export const SECURITY_SETTINGS: SecuritySetting[] = [
  {
    key: 'webcamMonitoring',
    label: 'Webcam Monitoring',
    description: 'Record student video & audio',
    icon: 'videocam',
    iconBgClass: 'bg-student-primary-container/20',
    iconTextClass: 'text-student-primary',
    defaultEnabled: true,
  },
  {
    key: 'tabSwitchTracking',
    label: 'Tab-Switch Tracking',
    description: 'Flag if focus is lost',
    icon: 'tab',
    iconBgClass: 'bg-student-primary-container/20',
    iconTextClass: 'text-student-primary',
    defaultEnabled: true,
  },
  {
    key: 'blockCopyPaste',
    label: 'Block Copy/Paste',
    description: 'Disable clipboard access',
    icon: 'content_copy',
    iconBgClass: 'bg-student-error-container/50',
    iconTextClass: 'text-student-on-error-container',
    defaultEnabled: true,
  },
  {
    key: 'allowRetake',
    label: 'Allow Retakes',
    description: 'Let students start again after submitting (off by default)',
    icon: 'replay',
    iconBgClass: 'bg-student-secondary-container/40',
    iconTextClass: 'text-student-on-secondary-container',
    defaultEnabled: false,
  },
];

export const DEFAULT_FORM_STATE: CreateExamFormState = {
  title: '',
  courseId: '',
  startDateTime: '',
  durationMinutes: '120',
  studentInstitutionalIdsText: '',
  security: {
    webcamMonitoring: true,
    tabSwitchTracking: true,
    blockCopyPaste: true,
    allowRetake: false,
  },
  questions: [createEmptyQuestion()],
};
