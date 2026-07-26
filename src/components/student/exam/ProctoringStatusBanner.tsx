import { memo } from 'react';
import Icon from '../Icon';

type ProctoringStatusBannerProps = {
  status: 'loading' | 'monitoring' | 'unavailable' | 'permission_denied';
  integrityScore: number;
  message?: string | null;
};

const ProctoringStatusBanner = memo(({ status, integrityScore, message }: ProctoringStatusBannerProps) => {
  if (status === 'monitoring') {
    return (
      <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-2 bg-student-surface-container-low border-b border-student-surface-container-highest text-student-label-md font-student">
        <span className="inline-flex items-center gap-2 text-student-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-student-primary animate-pulse" />
          Proctoring active
        </span>
        <span className="text-student-on-surface">
          Integrity: <strong className="text-student-primary">{integrityScore}%</strong>
        </span>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="shrink-0 px-4 sm:px-6 py-2 bg-student-surface-container-low border-b border-student-surface-container-highest text-student-label-md font-student text-student-on-surface-variant">
        Initialising proctoring…
      </div>
    );
  }

  return (
    <div className="shrink-0 flex items-start gap-2 px-4 sm:px-6 py-2 bg-amber-50 border-b border-amber-200 text-student-label-md font-student text-amber-900">
      <Icon name="warning" className="shrink-0 mt-0.5" />
      <span>{message ?? 'Proctoring unavailable — exam will continue without webcam monitoring.'}</span>
    </div>
  );
});

ProctoringStatusBanner.displayName = 'ProctoringStatusBanner';

export default ProctoringStatusBanner;
