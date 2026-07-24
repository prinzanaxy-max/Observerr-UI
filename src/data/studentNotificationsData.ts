export type NotificationAccent = 'success' | 'warning' | 'neutral';

export type StudentNotification = {
  id: number;
  title: string;
  message: string;
  timeLabel: string;
  icon: string;
  accent: NotificationAccent;
  read: boolean;
  filled?: boolean;
  linkTo?: string;
  createdAt: string;
};

export const STUDENT_NOTIFICATIONS: StudentNotification[] = [
  {
    id: 1,
    title: 'Exam Graded: Advanced Mathematics',
    message: 'Your final score is available for review in the Results section.',
    timeLabel: 'Just now',
    icon: 'assignment_turned_in',
    accent: 'success',
    read: false,
    filled: true,
    linkTo: '/student/results/1',
    createdAt: '2023-10-24T14:00:00',
  },
  {
    id: 2,
    title: 'System Maintenance Scheduled',
    message: 'The portal will be offline for maintenance on Saturday from 2:00 AM to 4:00 AM EST.',
    timeLabel: '2 hours ago',
    icon: 'warning',
    accent: 'warning',
    read: false,
    filled: true,
    createdAt: '2023-10-24T12:00:00',
  },
  {
    id: 3,
    title: 'Upcoming Exam Reminder',
    message: 'Physics 101 Midterm starts tomorrow at 9:00 AM. Please ensure your environment is ready.',
    timeLabel: 'Yesterday',
    icon: 'event',
    accent: 'neutral',
    read: true,
    linkTo: '/student/exams/1',
    createdAt: '2023-10-23T09:00:00',
  },
  {
    id: 4,
    title: 'Identity Verification Successful',
    message: 'Your ID has been successfully verified for the upcoming semester exams.',
    timeLabel: 'Oct 12',
    icon: 'check_circle',
    accent: 'neutral',
    read: true,
    createdAt: '2023-10-12T10:00:00',
  },
  {
    id: 5,
    title: 'Integrity Report Ready',
    message: 'Your Data Structures session report is ready to download.',
    timeLabel: 'Oct 05',
    icon: 'verified_user',
    accent: 'success',
    read: true,
    filled: true,
    linkTo: '/student/results/2',
    createdAt: '2023-10-05T16:30:00',
  },
  {
    id: 6,
    title: 'New Exam Published',
    message: 'Advanced Calculus III has been added to your upcoming exams.',
    timeLabel: 'Oct 03',
    icon: 'assignment',
    accent: 'neutral',
    read: true,
    linkTo: '/student/exams/3',
    createdAt: '2023-10-03T08:00:00',
  },
];

export const cloneNotifications = (): StudentNotification[] =>
  STUDENT_NOTIFICATIONS.map((n) => ({ ...n }));

export const countUnreadNotifications = (notifications: StudentNotification[]): number =>
  notifications.filter((n) => !n.read).length;

export const filterNotifications = (
  notifications: StudentNotification[],
  query: string,
): StudentNotification[] => {
  const q = query.trim().toLowerCase();
  if (!q) return notifications;
  return notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.message.toLowerCase().includes(q),
  );
};
