import { memo } from 'react';
import Icon from './Icon';
import { SCORE_TREND } from '../../data/studentDashboardData';

const barTone = (score: number, index: number) => {
  if (index === SCORE_TREND.length - 1) return 'bg-student-primary';
  if (score >= 90) return 'bg-student-primary/80';
  if (score >= 85) return 'bg-student-primary/60';
  return 'bg-student-tertiary-container/60';
};

const ScoreTrendChart = memo(() => (
  <div className="student-glass-card p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-student-headline-sm font-student text-student-on-surface">Score Trend</h3>
      <button type="button" className="text-student-on-surface-variant hover:text-student-primary transition-colors" aria-label="More options">
        <Icon name="more_vert" />
      </button>
    </div>

    <div className="h-40 flex items-end justify-between px-2 pb-2 border-b border-student-surface-variant/50 mb-4 relative">
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
        {[0, 1, 2].map((line) => (
          <div key={line} className="w-full border-t border-dashed border-student-outline-variant/30" />
        ))}
      </div>

      {SCORE_TREND.map((score, index) => (
        <div
          key={`${score}-${index}`}
          className={`w-8 ${barTone(score, index)} rounded-t-sm relative group`}
          style={{ height: `${score}%` }}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-student-inverse-surface text-student-inverse-on-surface text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {score}%
          </div>
        </div>
      ))}
    </div>

    <button type="button" className="block text-center text-student-primary hover:text-student-primary-container text-student-label-md font-student transition-colors w-full">
      View full analytics
    </button>
  </div>
));

ScoreTrendChart.displayName = 'ScoreTrendChart';

export default ScoreTrendChart;
