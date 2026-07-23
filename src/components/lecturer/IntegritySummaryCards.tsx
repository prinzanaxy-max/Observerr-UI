import { memo } from 'react';
import Icon from '../student/Icon';
import type { SummaryMetric } from '../../data/integrityReportsData';
import { trendIcon } from '../../data/integrityReportsData';

type IntegritySummaryCardsProps = {
  metrics: SummaryMetric[];
};

const IntegritySummaryCards = memo(({ metrics }: IntegritySummaryCardsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
    {metrics.map((metric) => (
      <article
        key={metric.id}
        className="bg-student-surface rounded-[24px] p-6 lecturer-card-elevation flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:shadow-[0px_15px_40px_rgba(0,0,0,0.08)] transition-all"
      >
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 transition-colors ${metric.glowClass}`} />

        <div className="flex justify-between items-start relative z-10 gap-3">
          <h3 className="text-student-body-md font-student text-student-on-surface-variant">{metric.label}</h3>
          <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${metric.iconBgClass} ${metric.iconTextClass}`}>
            <Icon name={metric.icon} />
          </div>
        </div>

        <div className="relative z-10 mt-4">
          <div
            className={`font-student font-bold text-student-on-surface ${
              metric.id === 'common-flag' ? 'text-student-headline-md truncate' : 'text-student-display-lg'
            }`}
          >
            {metric.value}
          </div>
          <div className={`font-student text-student-label-md flex items-center mt-1 ${metric.trendClass}`}>
            <Icon name={trendIcon(metric.trendDirection)} className="text-[16px] mr-1" />
            {metric.trendLabel}
          </div>
        </div>
      </article>
    ))}
  </div>
));

IntegritySummaryCards.displayName = 'IntegritySummaryCards';

export default IntegritySummaryCards;
