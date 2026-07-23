import { memo } from 'react';
import Icon from './Icon';
import type { AlertItem } from '../../data/studentDashboardData';

type RecentAlertsPanelProps = {
  alerts: AlertItem[];
};

const iconWrapTone = {
  primary: 'bg-student-primary/10 text-student-primary',
  secondary: 'bg-student-secondary-container/30 text-student-on-secondary-container',
};

const RecentAlertsPanel = memo(({ alerts }: RecentAlertsPanelProps) => (
  <div className="student-glass-card p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-student-headline-sm font-student text-student-on-surface">Recent Alerts</h3>
      <button type="button" className="text-student-primary hover:text-student-primary-container text-student-label-md font-student transition-colors">
        See all
      </button>
    </div>

    <div className="space-y-4">
      {alerts.map((alert) => (
        <button
          key={alert.id}
          type="button"
          className="flex items-start p-3 hover:bg-student-surface-container-low rounded-xl transition-colors cursor-pointer -mx-3 w-[calc(100%+1.5rem)] text-left"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-3 mt-0.5 ${iconWrapTone[alert.tone]}`}>
            <Icon name={alert.icon} className="text-[16px]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-student-on-surface">{alert.title}</p>
            <p className="text-xs text-student-on-surface-variant mt-0.5">{alert.message}</p>
            <p className="text-[10px] text-student-outline mt-1">{alert.time}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
));

RecentAlertsPanel.displayName = 'RecentAlertsPanel';

export default RecentAlertsPanel;
