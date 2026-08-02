import { memo } from 'react';
import Icon from '../Icon';
import type { StudentResultRow } from '../../../types/studentResults';
import IntegrityScoreCell from './IntegrityScoreCell';
import ResultsStatusBadge from './ResultsStatusBadge';
import ResultsPagination from './ResultsPagination';

type ResultsTableProps = {
  results: StudentResultRow[];
  onSelect?: (result: StudentResultRow) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
};

const TableSkeleton = () => (
  <tbody className="animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="border-b border-student-outline-variant/20">
        <td className="py-5 px-6" colSpan={6}>
          <div className="h-12 rounded-lg bg-student-surface-container-high/70" />
        </td>
      </tr>
    ))}
  </tbody>
);

const ResultsTable = memo(({
  results,
  onSelect,
  page,
  totalPages,
  onPageChange,
  loading = false,
}: ResultsTableProps) => (
  <div className="student-exam-glass-card rounded-[24px] overflow-hidden w-full flex flex-col">
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[760px]">
        <thead>
          <tr className="border-b border-student-outline-variant/40 bg-student-surface-container-low/50">
            {['Course', 'Date Taken', 'Grade', 'Integrity Score', 'Status', 'Action'].map((col, idx) => (
              <th
                key={col}
                className={`py-4 px-6 text-student-label-md font-student font-bold text-student-on-surface-variant uppercase tracking-wider ${
                  idx === 5 ? 'text-right' : ''
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        {loading ? (
          <TableSkeleton />
        ) : (
          <tbody className="text-student-body-md font-student text-student-on-surface">
            {results.map((result, index) => (
              <tr
                key={result.id}
                onClick={() => onSelect?.(result)}
                className={`student-results-row transition-colors group cursor-pointer ${
                  index < results.length - 1 ? 'border-b border-student-outline-variant/20' : ''
                }`}
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-student-surface-container flex items-center justify-center text-student-primary group-hover:bg-student-primary-container/30 transition-colors shrink-0">
                      <Icon name={result.icon} className="text-[22px]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-student-body-lg font-student font-medium truncate">{result.courseName}</p>
                      <p className="text-student-label-md font-student text-student-on-surface-variant truncate">
                        {result.courseCode} • {result.examLabel}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <p className="font-medium">{result.dateTaken}</p>
                  <p className="text-student-label-md font-student text-student-on-surface-variant">{result.timeLabel}</p>
                </td>
                <td className="py-5 px-6">
                  <span className="font-semibold">
                    {result.score === null ? 'Pending' : `${result.score}/${result.maxScore}`}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <IntegrityScoreCell score={result.integrityScore} />
                </td>
                <td className="py-5 px-6">
                  <ResultsStatusBadge status={result.status} />
                </td>
                <td className="py-5 px-6 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect?.(result);
                    }}
                    className="text-student-on-surface-variant group-hover:text-student-primary transition-colors p-2 rounded-full hover:bg-student-surface-variant"
                    aria-label={`View ${result.courseName} result`}
                  >
                    <Icon name="chevron_right" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>

    {totalPages !== undefined && totalPages > 1 && page && onPageChange && (
      <ResultsPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    )}
  </div>
));

ResultsTable.displayName = 'ResultsTable';

export default ResultsTable;
