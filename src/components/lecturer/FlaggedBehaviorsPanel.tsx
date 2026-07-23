import { memo } from 'react';
import type { FlaggedBehavior } from '../../data/lecturerDashboardData';

const barTone = {
  error: 'bg-student-error',
  secondary: 'bg-student-secondary',
  tertiary: 'bg-student-tertiary',
};

type FlaggedBehaviorsPanelProps = {
  behaviors: FlaggedBehavior[];
};

const FlaggedBehaviorsPanel = memo(({ behaviors }: FlaggedBehaviorsPanelProps) => (
  <section className="bg-white p-4 sm:p-6 rounded-brand shadow-sm border border-student-outline-variant/30">
    <h3 className="text-student-body-lg font-student font-bold text-student-on-surface mb-6">Top Flagged Behaviors</h3>
    <div className="space-y-6">
      {behaviors.map((behavior) => (
        <div key={behavior.id}>
          <div className="flex justify-between mb-2">
            <span className="text-student-body-md font-student font-medium text-student-on-surface">{behavior.label}</span>
            <span className="text-student-body-md font-student font-black text-student-on-surface">{behavior.count}</span>
          </div>
          <div className="w-full bg-student-surface-container rounded-full h-2 overflow-hidden">
            <div className={`${barTone[behavior.tone]} h-full rounded-full transition-all`} style={{ width: `${behavior.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  </section>
));

FlaggedBehaviorsPanel.displayName = 'FlaggedBehaviorsPanel';

export default FlaggedBehaviorsPanel;
