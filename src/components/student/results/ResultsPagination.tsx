import { memo } from 'react';

type ResultsPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const getVisiblePages = (page: number, totalPages: number): (number | 'ellipsis')[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (page <= 2) return [1, 2, 3, 'ellipsis'];
  if (page >= totalPages - 1) return ['ellipsis', totalPages - 2, totalPages - 1, totalPages];
  return ['ellipsis', page - 1, page, page + 1, 'ellipsis'];
};

const ResultsPagination = memo(({ page, totalPages, onPageChange }: ResultsPaginationProps) => {
  const pages = getVisiblePages(page, totalPages);

  return (
    <div className="p-4 border-t border-student-outline-variant/30 flex items-center justify-between bg-student-surface-container-lowest/50 rounded-b-[24px]">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 text-student-on-surface-variant border border-student-outline-variant rounded-lg text-student-label-md font-student font-bold uppercase hover:bg-student-surface-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <div className="flex items-center gap-2 text-student-body-md font-student">
        {pages.map((p, idx) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="text-student-on-surface-variant px-1">...</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                p === page
                  ? 'bg-student-primary text-student-on-primary shadow-[0_0_10px_rgba(43,108,0,0.3)]'
                  : 'hover:bg-student-surface-variant text-student-on-surface'
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 text-student-primary border border-student-primary rounded-lg text-student-label-md font-student font-bold uppercase hover:bg-student-primary-container/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
});

ResultsPagination.displayName = 'ResultsPagination';

export default ResultsPagination;
