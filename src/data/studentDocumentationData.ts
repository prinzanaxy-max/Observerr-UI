export const SUPPORT_EMAIL = 'prinzanaxy@gmail.com';

export const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=${encodeURIComponent('Observerr Support Request')}`;

export type DocSection = {
  id: string;
  title: string;
  icon: string;
  paragraphs: string[];
  bullets?: string[];
};

export const OBSERVERR_DOCUMENTATION: DocSection[] = [
  {
    id: 'overview',
    title: 'About Observerr',
    icon: 'info',
    paragraphs: [
      'Observerr is an academic integrity platform that helps institutions deliver secure, proctored assessments. The student portal lets you view upcoming exams, complete monitored sessions, and review integrity-scored results.',
      'Monitoring is active only during an exam session. Outside of exams, Observerr does not record your camera, microphone, or screen.',
    ],
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'rocket_launch',
    paragraphs: [
      'Sign in with your institutional ID and password provided by your university. After login you land on the dashboard with your integrity overview, upcoming exams, and recent results.',
    ],
    bullets: [
      'Complete identity verification before your first proctored exam.',
      'Use a supported browser (Chrome, Edge, or Firefox recommended).',
      'Ensure a stable internet connection and a quiet, well-lit workspace.',
      'Keep a valid photo ID ready for verification checks.',
    ],
  },
  {
    id: 'taking-exams',
    title: 'Taking an Exam',
    icon: 'assignment',
    paragraphs: [
      'From the Exams page, select an available assessment and review the pre-exam checklist. When you start, Observerr enters fullscreen mode and begins integrity monitoring.',
    ],
    bullets: [
      'Read all instructions on the pre-exam screen before clicking Start.',
      'Do not switch tabs, minimize the window, or leave fullscreen during the session.',
      'Submit your answers before the timer expires — unsaved work may be lost.',
      'If you encounter a technical issue, note the time and contact support after the session.',
    ],
  },
  {
    id: 'integrity',
    title: 'Integrity Monitoring',
    icon: 'shield',
    paragraphs: [
      'During active sessions, Observerr may collect video, audio, screen activity, and eye-tracking signals to detect anomalies. This data is encrypted, used solely for proctoring review, and retained only for the institution\'s review period.',
    ],
    bullets: [
      'Stay centered in frame and keep your face visible to the camera.',
      'Avoid using secondary devices, notes, or unauthorized materials.',
      'Brief gaze shifts are normal; extended off-screen focus may lower your integrity score.',
      'Your session timeline on the result detail page explains detected events.',
    ],
  },
  {
    id: 'results',
    title: 'Results & Reports',
    icon: 'leaderboard',
    paragraphs: [
      'Completed assessments appear on the Results page with an integrity score and verification status. Click any result to view the full session timeline, score breakdown, and feedback.',
    ],
    bullets: [
      'Verified — your session passed integrity review.',
      'Under Review — an instructor or proctor is reviewing flagged events.',
      'Download your report from the result detail page when available.',
    ],
  },
  {
    id: 'account',
    title: 'Account & Settings',
    icon: 'manage_accounts',
    paragraphs: [
      'Update your display name, profile photo, and notification preferences from Settings. Your institutional email and ID are managed by your university and cannot be changed in the portal.',
    ],
    bullets: [
      'Upload a profile photo from the Profile page (JPG, PNG, or WebP, max 5 MB).',
      'Configure alert preferences under Settings → Notifications.',
      'Review privacy and monitoring policies under Settings → Privacy.',
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: 'build',
    paragraphs: [
      'If you experience issues before or during an exam, try the steps below. Contact support if problems persist.',
    ],
    bullets: [
      'Camera or mic blocked — allow browser permissions and refresh the page.',
      'Fullscreen won\'t activate — disable browser extensions and retry in a private window.',
      'Connection dropped — reconnect quickly; your session may resume if within the grace window.',
      'Wrong account — log out and sign in with your correct institutional ID.',
    ],
  },
];

export const DOCUMENTATION_INTRO = {
  title: 'Observerr Student Documentation',
  subtitle: 'Guidelines for using the student portal, taking proctored exams, and understanding integrity monitoring.',
};
