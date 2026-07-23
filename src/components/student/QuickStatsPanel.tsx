import { memo } from 'react';
import Icon from './Icon';
import { QUICK_STATS } from '../../data/studentDashboardData';

const QuickStatsPanel = memo(() => (
  <div className="student-glass-card p-6">
    <h3 className="text-student-headline-sm font-student text-student-on-surface mb-6">Quick Stats</h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-4 bg-student-surface-container-lowest rounded-xl border border-student-surface-variant/50">
        <div className="flex items-center text-student-on-surface-variant">
          <Icon name="history_edu" className="mr-3 text-student-primary" />
          <span className="text-sm font-medium">Exams Taken</span>
        </div>
        <span className="text-student-headline-sm font-student text-student-on-surface">{QUICK_STATS.examsTaken}</span>
      </div>

      <div className="flex justify-between items-center p-4 bg-student-surface-container-lowest rounded-xl border border-student-surface-variant/50">
        <div className="flex items-center text-student-on-surface-variant">
          <Icon name="security" className="mr-3 text-student-primary" />
          <span className="text-sm font-medium">Avg. Integrity</span>
        </div>
        <span className="text-student-headline-sm font-student text-student-primary">{QUICK_STATS.avgIntegrity}%</span>
      </div>

      <div className="flex justify-between items-center p-4 bg-student-surface-container-lowest rounded-xl border border-student-surface-variant/50">
        <div className="flex items-center text-student-on-surface-variant">
          <Icon name="flag" className="mr-3 text-student-secondary" />
          <span className="text-sm font-medium">Flags</span>
        </div>
        <span className="text-student-headline-sm font-student text-student-on-surface">{QUICK_STATS.flags}</span>
      </div>
    </div>
  </div>
));

QuickStatsPanel.displayName = 'QuickStatsPanel';

export default QuickStatsPanel;
