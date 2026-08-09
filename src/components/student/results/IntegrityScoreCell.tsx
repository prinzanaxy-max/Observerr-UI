import { memo } from 'react';
import { getIntegrityScoreTone } from '../../../lib/studentResultsUtils';

type IntegrityScoreCellProps = {
  score: number;
};

const toneStyles = {
  high: {
    bar: 'bg-student-primary',
    text: 'text-student-primary',
  },
  medium: {
    bar: 'bg-student-tertiary',
    text: 'text-student-tertiary',
  },
  low: {
    bar: 'bg-student-secondary',
    text: 'text-student-secondary',
  },
} as const;

const IntegrityScoreCell = memo(({ score }: IntegrityScoreCellProps) => {
  const tone = getIntegrityScoreTone(score);
  const styles = toneStyles[tone];

  return (
    <div className="flex items-center gap-2">
      <span className={`text-student-headline-sm font-student font-bold ${styles.text}`}>{score}%</span>
      <div className="w-16 h-1.5 bg-student-surface-variant rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${styles.bar}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
});

IntegrityScoreCell.displayName = 'IntegrityScoreCell';

export default IntegrityScoreCell;
