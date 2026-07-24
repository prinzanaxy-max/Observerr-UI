import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import ResultsControlsBar from '../components/student/results/ResultsControlsBar';
import ResultsTable from '../components/student/results/ResultsTable';
import Icon from '../components/student/Icon';
import {
  STUDENT_RESULTS,
  RESULTS_PAGE_SIZE,
  filterStudentResults,
  sortStudentResults,
  type ResultSortKey,
  type StudentResult,
} from '../data/studentResultsData';

const StudentResultsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<ResultSortKey>('recent');
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = 'Results — Observerr';
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortKey]);

  const filteredSorted = useMemo(() => {
    const filtered = filterStudentResults(STUDENT_RESULTS, searchQuery);
    return sortStudentResults(filtered, sortKey);
  }, [searchQuery, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / RESULTS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageResults = useMemo(() => {
    const start = (safePage - 1) * RESULTS_PAGE_SIZE;
    return filteredSorted.slice(start, start + RESULTS_PAGE_SIZE);
  }, [filteredSorted, safePage]);

  const showingFrom = filteredSorted.length === 0 ? 0 : (safePage - 1) * RESULTS_PAGE_SIZE + 1;
  const showingTo = Math.min(safePage * RESULTS_PAGE_SIZE, filteredSorted.length);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleSortChange = useCallback((key: ResultSortKey) => setSortKey(key), []);
  const handlePageChange = useCallback((next: number) => {
    setPage(Math.max(1, Math.min(totalPages, next)));
  }, [totalPages]);

  const handleSelect = useCallback((result: StudentResult) => {
    navigate(`/student/results/${result.id}`);
  }, [navigate]);

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

        <ResultsControlsBar
          showingFrom={showingFrom}
          showingTo={showingTo}
          total={filteredSorted.length}
          sortKey={sortKey}
          onSortChange={handleSortChange}
        />

        {pageResults.length > 0 ? (
          <ResultsTable
            results={pageResults}
            onSelect={handleSelect}
            page={safePage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : (
          <div className="text-center py-16 px-6 rounded-[24px] student-exam-glass-card">
            <Icon name="leaderboard" className="text-[48px] text-student-outline mb-4 mx-auto" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">No results found</h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant">
              {searchQuery.trim() ? 'Try a different search term.' : 'Completed assessments will appear here.'}
            </p>
          </div>
        )}
      </div>
    </StudentPortalLayout>
  );
};

export default StudentResultsPage;
