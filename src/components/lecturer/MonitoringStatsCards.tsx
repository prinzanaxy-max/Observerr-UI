import { memo } from 'react';
import Icon from '../student/Icon';
import type { LiveSessionStats } from '../../data/liveMonitoringData';

type MonitoringStatsCardsProps = {
  stats: LiveSessionStats;
};

const MonitoringStatsCards = memo(({ stats }: MonitoringStatsCardsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    <div className="bg-student-surface-container-lowest rounded-brand p-5 lecturer-card-elevation border border-student-outline-variant/20">
      <p className="text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider mb-2">Active Students</p>
      <p className="text-student-display-lg font-student font-black text-student-primary">
        {stats.active} <span className="text-student-headline-sm font-student text-student-on-surface-variant">/ {stats.total}</span>
      </p>
    </div>

    <div className="bg-student-surface-container-lowest rounded-brand p-5 lecturer-card-elevation border border-student-outline-variant/20">
      <p className="text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider mb-2">High Risk</p>
      <div className="flex items-center gap-2">
        <p className="text-student-display-lg font-student font-black text-student-error">{stats.highRisk}</p>
        <span className="w-3 h-3 rounded-full bg-student-error animate-pulse" />
      </div>
    </div>

    <div className="bg-student-surface-container-lowest rounded-brand p-5 lecturer-card-elevation border border-student-outline-variant/20">
      <p className="text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider mb-2">Warnings Issued</p>
      <p className="text-student-display-lg font-student font-black text-student-secondary">{stats.warnings}</p>
    </div>

    <div className="bg-student-surface-container-lowest rounded-brand p-5 lecturer-card-elevation border border-student-outline-variant/20">
      <div className="flex justify-between items-start mb-2">
        <p className="text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider">Network Stability</p>
        <Icon name="wifi" className="text-student-primary text-[20px]" />
      </div>
      <p className="text-student-display-lg font-student font-black text-student-primary mb-2">{stats.networkStability}%</p>
      <div className="w-full bg-student-surface-container rounded-full h-2 overflow-hidden">
        <div className="bg-student-primary h-full rounded-full transition-all" style={{ width: `${stats.networkStability}%` }} />
      </div>
    </div>
  </div>
));

MonitoringStatsCards.displayName = 'MonitoringStatsCards';

export default MonitoringStatsCards;
