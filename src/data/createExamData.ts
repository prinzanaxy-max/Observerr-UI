export type SecuritySettingKey = 'webcamMonitoring' | 'tabSwitchTracking' | 'blockCopyPaste';

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
  security: Record<SecuritySettingKey, boolean>;
};

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
];

export const DEFAULT_FORM_STATE: CreateExamFormState = {
  title: '',
  courseId: '',
  startDateTime: '',
  durationMinutes: '120',
  security: {
    webcamMonitoring: true,
    tabSwitchTracking: true,
    blockCopyPaste: true,
  },
};
