import { memo } from 'react';
import Icon from '../student/Icon';
import { QUICK_ACTIONS } from '../../data/lecturerDashboardData';

type QuickActionsPanelProps = {
  onAction: (id: string) => void;
};

const QuickActionsPanel = memo(({ onAction }: QuickActionsPanelProps) => (
  <section className="bg-student-surface-container-low p-4 sm:p-6 rounded-brand border border-student-outline-variant/30">
    <h3 className="text-student-body-lg font-student font-bold text-student-on-surface mb-4">Quick Actions</h3>
    <div className="grid grid-cols-2 gap-3">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => onAction(action.id)}
          className="bg-white p-4 rounded-2xl flex flex-col items-center gap-2 border border-student-outline-variant/20 hover:border-student-primary hover:text-student-primary transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-student-primary-container/20 flex items-center justify-center group-hover:bg-student-primary-container/40">
            <Icon name={action.icon} />
          </div>
          <span className="text-student-label-md font-student font-bold">{action.label}</span>
        </button>
      ))}
    </div>
  </section>
));

QuickActionsPanel.displayName = 'QuickActionsPanel';

export default QuickActionsPanel;
