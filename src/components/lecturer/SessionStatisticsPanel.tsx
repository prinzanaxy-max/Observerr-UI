import { memo } from 'react';
import Icon from '../student/Icon';
import type { SessionStatistics } from '../../data/studentTimelineData';

type SessionStatisticsPanelProps = {
  stats: SessionStatistics;
};

const rows = [
  { key: 'duration', label: 'Duration', icon: 'schedule', tone: 'text-student-on-surface' },
  { key: 'totalFlags', label: 'Total Flags', icon: 'warning', tone: 'text-student-error' },
  { key: 'deviceFlags', label: 'Device Flags', icon: 'devices_off', tone: 'text-student-on-surface' },
  { key: 'absenceFlags', label: 'Absence Flags', icon: 'person_off', tone: 'text-student-on-surface' },
] as const;

const SessionStatisticsPanel = memo(({ stats }: SessionStatisticsPanelProps) => (
  <div className="bg-student-surface rounded-[24px] p-4 sm:p-6 lecturer-card-elevation">
    <h3 className="text-student-headline-sm font-student text-student-on-surface mb-6 border-b border-student-surface-container-high pb-4">
      Session Statistics
    </h3>
    <div className="space-y-4">
      {rows.map((row) => {
        const value =
          row.key === 'duration'
            ? stats.duration
            : stats[row.key as 'totalFlags' | 'deviceFlags' | 'absenceFlags'];
        return (
          <div key={row.key} className="flex justify-between items-center gap-4">
            <span className="text-student-body-md font-student text-student-on-surface-variant flex items-center gap-2">
              <Icon name={row.icon} className="text-sm" />
              {row.label}
            </span>
            <span className={`text-student-body-md font-student font-bold ${row.tone}`}>{value}</span>
          </div>
        );
      })}
    </div>
  </div>
));

SessionStatisticsPanel.displayName = 'SessionStatisticsPanel';

export default SessionStatisticsPanel;
