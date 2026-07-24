import { memo } from 'react';

type IntegrityScoreCellProps = {
  score: number;
};

const IntegrityScoreCell = memo(({ score }: IntegrityScoreCellProps) => {
  const isHigh = score >= 90;
  const barColor = isHigh ? 'bg-student-primary' : 'bg-student-secondary';
  const textColor = isHigh ? 'text-student-primary' : 'text-student-secondary';

  return (
    <div className="flex items-center gap-2">
      <span className={`text-student-headline-sm font-student font-bold ${textColor}`}>{score}%</span>
      <div className="w-16 h-1.5 bg-student-surface-variant rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
});

IntegrityScoreCell.displayName = 'IntegrityScoreCell';

export default IntegrityScoreCell;
