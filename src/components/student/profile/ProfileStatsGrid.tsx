import { memo } from 'react';
import Icon from '../Icon';
import type { ProfileStat } from '../../../data/studentProfileData';

type ProfileStatsGridProps = {
  stats: ProfileStat[];
};

const toneClass = (tone: ProfileStat['tone']) => {
  switch (tone) {
    case 'primary':
      return 'text-student-primary';
    case 'secondary':
      return 'text-student-secondary';
    default:
      return 'text-student-on-surface';
  }
};

const ProfileStatsGrid = memo(({ stats }: ProfileStatsGridProps) => (
  <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((stat) => (
      <div
        key={stat.id}
        className="student-exam-glass-card rounded-2xl p-5 flex flex-col gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-student-primary-container/20 flex items-center justify-center text-student-primary">
          <Icon name={stat.icon} />
        </div>
        <div>
          <p className="text-student-label-md font-student text-student-on-surface-variant">{stat.label}</p>
          <p className={`text-student-headline-sm font-student font-bold ${toneClass(stat.tone)}`}>
            {stat.value}
          </p>
        </div>
      </div>
    ))}
  </section>
));

ProfileStatsGrid.displayName = 'ProfileStatsGrid';

export default ProfileStatsGrid;
