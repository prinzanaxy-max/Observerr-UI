import { memo } from 'react';
import Icon from '../student/Icon';
import type { TrendDay } from '../../data/integrityReportsData';

type IntegrityEventTrendsChartProps = {
  days: TrendDay[];
};

const IntegrityEventTrendsChart = memo(({ days }: IntegrityEventTrendsChartProps) => (
  <section className="lg:col-span-2 bg-student-surface rounded-[24px] p-6 lecturer-card-elevation flex flex-col min-h-[400px]">
    <div className="flex justify-between items-start mb-6 gap-3">
      <div>
        <h3 className="text-student-headline-sm font-student text-student-on-surface">Integrity Event Trends</h3>
        <p className="text-student-body-md font-student text-student-on-surface-variant mt-1">
          Daily flagged events vs monitored sessions
        </p>
      </div>
      <button
        type="button"
        className="p-2 text-student-on-surface-variant hover:bg-student-surface-container rounded-full transition-colors shrink-0"
        aria-label="Chart options"
      >
        <Icon name="more_vert" />
      </button>
    </div>

    <div className="flex-1 relative flex items-end gap-2 sm:gap-4 justify-between mt-4 border-b border-student-surface-variant/50 pb-8 min-h-[220px]">
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 z-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-t border-student-surface-variant/20 w-full" />
        ))}
      </div>

      {days.map((day) => (
        <div key={day.label} className="flex flex-col items-center flex-1 z-10 group relative h-full justify-end">
          <div
            className="w-full max-w-[40px] bg-student-primary/20 rounded-t-md group-hover:bg-student-primary/30 transition-colors relative flex items-end justify-center"
            style={{ height: `${day.sessionsPct}%` }}
          >
            <div
              className={`w-full rounded-t-md transition-all duration-1000 ease-out ${
                day.critical
                  ? 'bg-student-error shadow-[0_0_10px_rgba(186,26,26,0.4)]'
                  : 'bg-student-primary shadow-[0_0_10px_rgba(43,108,0,0.4)]'
              }`}
              style={{ height: `${(day.flagsPct / day.sessionsPct) * 100}%` }}
            />
          </div>
          <span className="font-student text-student-label-md text-student-on-surface-variant mt-2 absolute -bottom-6">
            {day.label}
          </span>
        </div>
      ))}
    </div>
  </section>
));

IntegrityEventTrendsChart.displayName = 'IntegrityEventTrendsChart';

export default IntegrityEventTrendsChart;
