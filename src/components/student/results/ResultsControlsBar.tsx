import { memo } from 'react';
import CustomSelect from '../../shared/CustomSelect';
import type { ResultSortKey } from '../../../types/studentResults';

type ResultsControlsBarProps = {
  showingFrom: number;
  showingTo: number;
  total: number;
  sortKey: ResultSortKey;
  onSortChange: (key: ResultSortKey) => void;
};

const SORT_OPTIONS: { value: ResultSortKey; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'score_high', label: 'Highest Integrity' },
  { value: 'score_low', label: 'Lowest Integrity' },
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
      Showing {showingFrom}-{showingTo} of {total} completed assessments
    </p>

    <div className="flex items-center gap-3">
      <span className="text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider">
        Sort By
      </span>
      <CustomSelect
        value={sortKey}
        onChange={(v) => onSortChange(v as ResultSortKey)}
        options={SORT_OPTIONS}
        aria-label="Sort results by"
        className="w-44"
      />
    </div>
  </div>
));

ResultsControlsBar.displayName = 'ResultsControlsBar';

export default ResultsControlsBar;
