import { memo } from 'react';
import Icon from '../Icon';
import type { ProfileStat } from '../../../data/studentProfileData';

type ProfileStatsGridProps = {
  stats: ProfileStat[];
  loading?: boolean;
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

const ProfileStatsSkeleton = () => (
  <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="student-exam-glass-card rounded-2xl p-5 h-[120px] bg-student-surface-container-high/60" />
    ))}
  </section>
);

const ProfileStatsGrid = memo(({ stats, loading = false }: ProfileStatsGridProps) => {
  if (loading) {
    return <ProfileStatsSkeleton />;
  }

  return (
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
  );
});

ProfileStatsGrid.displayName = 'ProfileStatsGrid';

export default ProfileStatsGrid;
