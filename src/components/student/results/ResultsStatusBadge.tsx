import { memo } from 'react';
import Icon from '../Icon';
import type { ResultStatus } from '../../../data/studentResultsData';

type ResultsStatusBadgeProps = {
  status: ResultStatus;
};

const ResultsStatusBadge = memo(({ status }: ResultsStatusBadgeProps) => {
  const isVerified = status === 'Verified';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full font-student text-student-label-md font-bold gap-1 ${
        isVerified
          ? 'bg-student-primary-container text-student-on-primary-container'
          : 'bg-student-secondary-container text-student-on-secondary-container'
      }`}
    >
      <Icon name={isVerified ? 'check_circle' : 'info'} className="text-[14px]" />
      {status}
    </span>
  );
});

ResultsStatusBadge.displayName = 'ResultsStatusBadge';

export default ResultsStatusBadge;
