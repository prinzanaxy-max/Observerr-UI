import { memo } from 'react';
import Icon from '../Icon';
import type { NotificationAccent, StudentNotification } from '../../../data/studentNotificationsData';

type NotificationCardProps = {
  notification: StudentNotification;
  onSelect: (notification: StudentNotification) => void;
};

type AccentStyles = {
  cardBg: string;
  bar: string;
  iconWrap: string;
  time: string;
  titleClass: string;
  cardOpacity: string;
};

const unreadStyles: Record<Exclude<NotificationAccent, 'neutral'>, AccentStyles> = {
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

const getStyles = (notification: StudentNotification): AccentStyles => {
  if (notification.read || notification.accent === 'neutral') {
    return readStyles;
  }
  return unreadStyles[notification.accent];
};

const NotificationCard = memo(({ notification, onSelect }: NotificationCardProps) => {
  const styles = getStyles(notification);

  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className={`w-full text-left rounded-xl p-6 flex gap-4 relative overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.05)] border border-student-outline-variant/30 hover:shadow-[0px_15px_40px_rgba(0,0,0,0.08)] transition-all cursor-pointer ${styles.cardBg} ${styles.cardOpacity}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.bar}`} aria-hidden="true" />

      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${styles.iconWrap}`}>
        <Icon name={notification.icon} filled={notification.filled} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
          <h3 className={`${styles.titleClass} pr-2`}>{notification.title}</h3>
          <span className={`text-student-label-md font-student shrink-0 ${styles.time}`}>
            {notification.timeLabel}
          </span>
        </div>
        <p className="text-student-body-md font-student text-student-on-surface-variant">{notification.message}</p>
      </div>
    </button>
  );
});

NotificationCard.displayName = 'NotificationCard';

export default NotificationCard;
