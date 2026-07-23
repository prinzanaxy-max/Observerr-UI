import { memo } from 'react';
import Icon from '../student/Icon';
import type { FlaggedBehaviorItem } from '../../data/integrityReportsData';

type IntegrityFlaggedBehaviorsCardProps = {
  behaviors: FlaggedBehaviorItem[];
  onViewFullReport?: () => void;
};

const IntegrityFlaggedBehaviorsCard = memo(({ behaviors, onViewFullReport }: IntegrityFlaggedBehaviorsCardProps) => (
  <section className="bg-student-surface rounded-[24px] p-6 lecturer-card-elevation flex flex-col min-h-[400px]">
    <h3 className="text-student-headline-sm font-student text-student-on-surface mb-6">Top Flagged Behaviors</h3>

    <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 lecturer-custom-scrollbar">
      {behaviors.map((behavior) => (
        <div key={behavior.id}>
          <div className="flex justify-between items-end mb-2 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Icon name={behavior.icon} className={`text-[18px] shrink-0 ${behavior.iconClass}`} />
              <span className="text-student-body-md font-student font-medium text-student-on-surface truncate">
                {behavior.label}
              </span>
            </div>
            <span className="text-student-label-md font-student text-student-on-surface-variant shrink-0">
              {behavior.events} events
            </span>
          </div>
          <div className="w-full bg-student-surface-container h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${behavior.barClass}`}
              style={{ width: `${behavior.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>

    <button
      type="button"
      onClick={onViewFullReport}
      className="w-full mt-4 py-2 border-2 border-student-primary text-student-primary font-student text-student-label-md rounded-full hover:bg-student-primary/5 transition-colors flex items-center justify-center gap-2"
    >
      View Full Report
    </button>
  </section>
));

IntegrityFlaggedBehaviorsCard.displayName = 'IntegrityFlaggedBehaviorsCard';

export default IntegrityFlaggedBehaviorsCard;
