import { memo } from 'react';
import Icon from '../Icon';
import type { ResultSortKey } from '../../../data/studentResultsData';

type ResultsControlsBarProps = {
  showingFrom: number;
  showingTo: number;
  total: number;
  sortKey: ResultSortKey;
  onSortChange: (key: ResultSortKey) => void;
};

const SORT_OPTIONS: { value: ResultSortKey; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'score_high', label: 'Score: High to Low' },
  { value: 'score_low', label: 'Score: Low to High' },
  { value: 'course', label: 'Course Name' },
];

const ResultsControlsBar = memo(({
  showingFrom,
  showingTo,
  total,
  sortKey,
  onSortChange,
}: ResultsControlsBarProps) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
    <p className="text-student-body-md font-student text-student-on-surface-variant">
      Showing {showingFrom}-{showingTo} of {total} completed assessments.
    </p>

    <div className="flex items-center gap-3">
      <span className="text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider">
        Sort By
      </span>
      <div className="relative">
        <select
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as ResultSortKey)}
          className="appearance-none bg-student-surface-container-lowest border border-student-outline-variant rounded-lg py-2 pl-4 pr-10 text-student-body-md font-student text-student-on-surface focus:outline-none focus:border-student-primary focus:ring-1 focus:ring-student-primary shadow-sm cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <Icon
          name="expand_more"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-student-outline pointer-events-none text-[20px]"
        />
      </div>
    </div>
  </div>
));

ResultsControlsBar.displayName = 'ResultsControlsBar';

export default ResultsControlsBar;
