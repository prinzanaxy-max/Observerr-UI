import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import IntegrityScoreCard from '../components/student/IntegrityScoreCard';
import UpcomingExamsSection from '../components/student/UpcomingExamsSection';
import RecentResultsSection from '../components/student/RecentResultsSection';
import QuickStatsPanel from '../components/student/QuickStatsPanel';
import ScoreTrendChart from '../components/student/ScoreTrendChart';
import RecentAlertsPanel from '../components/student/RecentAlertsPanel';
import {
  RECENT_ALERTS,
  RECENT_RESULTS,
  UPCOMING_EXAMS,
  type UpcomingExam,
} from '../data/studentDashboardData';
import { buildQuickStatRows } from '../lib/studentStatsUtils';
import { useStudentStats } from '../hooks/useStudentStats';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { stats, loading: statsLoading } = useStudentStats();

  const quickStatRows = useMemo(
    () => buildQuickStatRows(stats),
    [stats],
  );

  useEffect(() => {
    document.title = 'Dashboard — Observerr';
  }, []);

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return UPCOMING_EXAMS;
    return UPCOMING_EXAMS.filter(
      (exam) =>
        exam.title.toLowerCase().includes(q) ||
        exam.courseCode.toLowerCase().includes(q) ||
        exam.professor.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return RECENT_RESULTS;
    return RECENT_RESULTS.filter(
      (result) =>
        result.course.toLowerCase().includes(q) ||
        result.date.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const handleExamSelect = useCallback((exam: UpcomingExam) => {
    navigate(`/student/exams/${exam.id}`);
  }, [navigate]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <StudentPortalLayout
      title="Dashboard"
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
    >
      <div className="p-4 sm:p-8 max-w-[1200px] mx-auto w-full pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[65%] space-y-8">
            <IntegrityScoreCard score={stats.avgIntegrity} loading={statsLoading} />
            <UpcomingExamsSection exams={filteredExams} onExamSelect={handleExamSelect} />
            <RecentResultsSection results={filteredResults} />
          </div>

          <div className="lg:w-[35%] space-y-8">
            <QuickStatsPanel rows={quickStatRows} loading={statsLoading} />
            <ScoreTrendChart />
            <RecentAlertsPanel alerts={RECENT_ALERTS} />
          </div>
        </div>
      </div>
    </StudentPortalLayout>
  );
};

export default StudentDashboard;
