import { memo } from 'react';
import Icon from '../student/Icon';
import { INTEGRITY_TREND } from '../../data/lecturerDashboardData';

const IntegrityTrendPanel = memo(() => (
  <section className="bg-student-surface-container-lowest p-4 sm:p-6 rounded-brand shadow-sm border border-student-outline-variant/30">
    <div className="flex justify-between items-center mb-6 gap-3">
      <h3 className="text-student-body-lg font-student font-bold text-student-on-surface">Integrity Trend</h3>
      <span className="text-student-label-md font-student font-bold text-student-primary shrink-0">+12% vs last sem</span>
    </div>

    <div className="h-32 flex items-end gap-2 mb-4 px-2">
      {INTEGRITY_TREND.map((height, index) => (
        <div
          key={`${height}-${index}`}
          className={`flex-1 rounded-t-lg transition-all ${
            index === 3 ? 'bg-student-primary' : 'bg-student-surface-container-high hover:bg-student-primary'
          }`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>

    <div className="flex justify-between text-[10px] text-student-on-surface-variant uppercase font-bold tracking-widest border-t border-student-outline-variant/20 pt-4">
      <button type="button" className="flex items-center gap-1 text-student-primary hover:gap-2 transition-all font-student">
        View full analytics
        <Icon name="arrow_forward" className="text-[14px]" />
      </button>
    </div>
  </section>
));

IntegrityTrendPanel.displayName = 'IntegrityTrendPanel';

export default IntegrityTrendPanel;
