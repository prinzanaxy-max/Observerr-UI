import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import ResultsControlsBar from '../components/student/results/ResultsControlsBar';
import ResultsSummaryCards from '../components/student/results/ResultsSummaryCards';
import ResultsTable from '../components/student/results/ResultsTable';
import Icon from '../components/student/Icon';
import { useStudentResults } from '../hooks/useStudentResults';
import type { StudentResultRow } from '../types/studentResults';

const StudentResultsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const {
    summaryCards,
    rows,
    from,
    to,
    totalElements,
    totalPages,
    page,
    sortKey,
    summaryLoading,
    listLoading,
    error,
    forbidden,
    setSort,
    setPage,
    reload,
  } = useStudentResults();

  useEffect(() => {
    document.title = 'Results — Observerr';
  }, []);

  const handleSelect = useCallback(
    (result: StudentResultRow) => {
      navigate(`/student/results/${result.id}`);
    },
    [navigate],
  );

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      `${row.courseName} ${row.courseCode} ${row.examLabel} ${row.status}`
        .toLowerCase()
        .includes(query),
    );
  }, [rows, searchQuery]);

  const showEmpty = !listLoading && !error && totalElements === 0;
  const showNoMatches = !listLoading && !error && totalElements > 0 && filteredRows.length === 0;

  return (
    <StudentPortalLayout
      title="Results"
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search results..."
      contentClassName="student-results-bg relative"
    >
      <div className="pointer-events-none fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-student-primary-container opacity-20 blur-[100px] z-0" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-student-secondary-container opacity-20 blur-[100px] z-0" />

      <div className="relative z-10 px-4 sm:px-6 md:px-8 pb-12 max-w-[1200px] mx-auto w-full">
        <div className="md:hidden mb-4 pt-2">
          <h1 className="text-student-headline-md font-student text-student-on-surface font-bold">Results</h1>
        </div>

        <ResultsSummaryCards cards={summaryCards} loading={summaryLoading} />

        {error ? (
          <div className="text-center py-16 px-6 rounded-[24px] student-exam-glass-card">
            <Icon
              name={forbidden ? 'block' : 'error'}
              className="text-[48px] text-student-outline mb-4 mx-auto"
            />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">
              {forbidden ? 'Access denied' : 'Could not load results'}
            </h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant mb-4">{error}</p>
            {!forbidden && (
              <button
                type="button"
                onClick={() => void reload()}
                className="px-5 py-2 rounded-full border border-student-primary text-student-primary text-student-body-md font-student hover:bg-student-primary/5"
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <>
            <ResultsControlsBar
              showingFrom={filteredRows.length === 0 ? 0 : from}
              showingTo={filteredRows.length === 0 ? 0 : Math.min(to, from + filteredRows.length - 1)}
              total={searchQuery.trim() ? filteredRows.length : totalElements}
              sortKey={sortKey}
              onSortChange={setSort}
            />

            {showEmpty ? (
              <div className="text-center py-16 px-6 rounded-[24px] student-exam-glass-card">
                <Icon name="leaderboard" className="text-[48px] text-student-outline mb-4 mx-auto" />
                <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">No results yet</h2>
                <p className="text-student-body-md font-student text-student-on-surface-variant">
                  Completed assessments will appear here.
                </p>
              </div>
            ) : showNoMatches ? (
              <div className="text-center py-16 px-6 rounded-[24px] student-exam-glass-card">
                <Icon name="search_off" className="text-[48px] text-student-outline mb-4 mx-auto" />
                <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">No matching results</h2>
                <p className="text-student-body-md font-student text-student-on-surface-variant">
                  Try a different search term.
                </p>
              </div>
            ) : (
              <ResultsTable
                results={filteredRows}
                onSelect={handleSelect}
                page={page}
                totalPages={searchQuery.trim() ? 1 : totalPages}
                onPageChange={setPage}
                loading={listLoading}
              />
            )}
          </>
        )}
      </div>
    </StudentPortalLayout>
  );
};

export default StudentResultsPage;
