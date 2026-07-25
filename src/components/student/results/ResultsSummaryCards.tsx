import { memo } from 'react';
import Icon from '../Icon';

import type { StatsCard } from '../../../lib/studentStatsUtils';

type ResultsSummaryCardsProps = {
  cards: StatsCard[];
  loading?: boolean;
};

const toneClass = (tone: StatsCard['tone']) => {
  switch (tone) {
    case 'primary':
      return 'text-student-primary';
    case 'secondary':
      return 'text-student-secondary';
    default:
      return 'text-student-on-surface';
  }
};

const SummarySkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="student-exam-glass-card rounded-2xl p-5 h-[120px] bg-student-surface-container-high/60" />
    ))}
  </div>
);

const ResultsSummaryCards = memo(({ cards, loading = false }: ResultsSummaryCardsProps) => {
  if (loading) {
    return <SummarySkeleton />;
  }

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.id}
          className="student-exam-glass-card rounded-2xl p-5 flex flex-col gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-student-primary-container/20 flex items-center justify-center text-student-primary">
            <Icon name={card.icon} />
          </div>
          <div>
            <p className="text-student-label-md font-student text-student-on-surface-variant">{card.label}</p>
            <p className={`text-student-headline-sm font-student font-bold ${toneClass(card.tone)}`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
});

ResultsSummaryCards.displayName = 'ResultsSummaryCards';

export default ResultsSummaryCards;
