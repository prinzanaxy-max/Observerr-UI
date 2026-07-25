import { memo } from 'react';
import Icon from './Icon';
import type { QuickStatRow } from '../../lib/studentStatsUtils';

type QuickStatsPanelProps = {
  rows: QuickStatRow[];
  loading?: boolean;
};

const QuickStatsSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-14 rounded-xl bg-student-surface-container-high/70" />
    ))}
  </div>
);

const QuickStatsPanel = memo(({ rows, loading = false }: QuickStatsPanelProps) => (
  <div className="student-glass-card p-6">
    <h3 className="text-student-headline-sm font-student text-student-on-surface mb-6">Quick Stats</h3>
    {loading ? (
      <QuickStatsSkeleton />
    ) : (
      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex justify-between items-center p-4 bg-student-surface-container-lowest rounded-xl border border-student-surface-variant/50"
          >
            <div className="flex items-center text-student-on-surface-variant">
              <Icon name={row.icon} className="mr-3 text-student-primary" />
              <span className="text-sm font-medium">{row.label}</span>
            </div>
            <span
              className={`text-student-headline-sm font-student text-student-on-surface ${row.valueClassName ?? ''}`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
));

QuickStatsPanel.displayName = 'QuickStatsPanel';

export default QuickStatsPanel;
