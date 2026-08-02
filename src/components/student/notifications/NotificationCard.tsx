import { memo } from 'react';
import Icon from '../Icon';
import type { NotificationItem } from '../../../types/pushNotifications';

type NotificationCardProps = {
  notification: NotificationItem;
  onSelect: (notification: NotificationItem) => void;
  onDismiss: (id: NotificationItem['id']) => void;
  dismissing?: boolean;
};

type AccentStyles = {
  cardBg: string;
  bar: string;
  iconWrap: string;
  time: string;
  titleClass: string;
  cardOpacity: string;
};

const unreadStyles: Record<'success' | 'warning', AccentStyles> = {
  success: {
    cardBg: 'bg-student-primary-container/10',
    bar: 'bg-student-primary',
    iconWrap: 'bg-student-primary-container/20 text-student-primary',
    time: 'text-student-primary font-bold',
    titleClass: 'text-student-headline-sm font-student text-student-on-background',
    cardOpacity: '',
  },
  warning: {
    cardBg: 'bg-student-secondary-container/10',
    bar: 'bg-student-secondary',
    iconWrap: 'bg-student-secondary-container/20 text-student-secondary',
    time: 'text-student-secondary font-bold',
    titleClass: 'text-student-headline-sm font-student text-student-on-background',
    cardOpacity: '',
  },
};

const readStyles: AccentStyles = {
  cardBg: 'bg-student-surface',
  bar: 'bg-student-outline-variant',
  iconWrap: 'bg-student-surface-container-high text-student-on-surface-variant',
  time: 'text-student-on-surface-variant',
  titleClass: 'text-student-body-lg font-student font-bold text-student-on-background',
  cardOpacity: 'opacity-75 hover:opacity-100',
};

const getStyles = (notification: NotificationItem): AccentStyles => {
  if (notification.read || notification.category === 'SYSTEM') {
    return readStyles;
  }
  return notification.category === 'INTEGRITY'
    ? unreadStyles.warning
    : unreadStyles.success;
};

const categoryIcon = (notification: NotificationItem) => {
  switch (notification.category) {
    case 'EXAM': return 'event';
    case 'INTEGRITY': return 'shield';
    case 'RESULT': return 'grading';
    default: return 'notifications';
  }
};

const NotificationCard = memo(({
  notification,
  onSelect,
  onDismiss,
  dismissing = false,
}: NotificationCardProps) => {
  const styles = getStyles(notification);

  return (
    <div
      className={`w-full rounded-xl flex gap-2 relative overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.05)] border border-student-outline-variant/30 hover:shadow-[0px_15px_40px_rgba(0,0,0,0.08)] transition-shadow ${styles.cardBg} ${styles.cardOpacity} ${dismissing ? 'notification-slide-out' : ''}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.bar}`} aria-hidden="true" />

      <button
        type="button"
        onClick={() => onSelect(notification)}
        className="flex-1 min-w-0 text-left p-6 flex gap-4 cursor-pointer"
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${styles.iconWrap}`}>
          <Icon name={categoryIcon(notification)} filled={!notification.read} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
            <h3 className={`${styles.titleClass} pr-2`}>{notification.title}</h3>
            <span className={`text-student-label-md font-student shrink-0 ${styles.time}`}>
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(notification.createdAt))}
            </span>
          </div>
          <p className="text-student-body-md font-student text-student-on-surface-variant">{notification.message}</p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onDismiss(notification.id)}
        disabled={dismissing}
        className="shrink-0 self-start m-4 p-2 rounded-full text-student-on-surface-variant hover:text-student-error hover:bg-student-error/10 transition-colors disabled:opacity-40"
        aria-label={`Clear notification: ${notification.title}`}
      >
        <Icon name="delete" className="text-[20px]" />
      </button>
    </div>
  );
});

NotificationCard.displayName = 'NotificationCard';

export default NotificationCard;
