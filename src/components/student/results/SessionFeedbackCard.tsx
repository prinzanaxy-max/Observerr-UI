import { memo } from 'react';
import Icon from '../Icon';

type SessionFeedbackCardProps = {
  title: string;
  message: string;
};

const SessionFeedbackCard = memo(({ title, message }: SessionFeedbackCardProps) => (
  <div className="p-6 bg-student-surface-container-lowest rounded-2xl border border-student-outline-variant/30 flex flex-col items-center text-center gap-3">
    <Icon name="workspace_premium" className="text-4xl text-student-tertiary" />
    <h4 className="text-student-body-lg font-student font-semibold text-student-on-surface">{title}</h4>
    <p className="text-student-body-md font-student text-student-on-surface-variant">{message}</p>
  </div>
));

SessionFeedbackCard.displayName = 'SessionFeedbackCard';

export default SessionFeedbackCard;
