import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import IntegrityScoreCard from '../components/student/IntegrityScoreCard';
import UpcomingExamsSection from '../components/student/UpcomingExamsSection';
import RecentResultsSection from '../components/student/RecentResultsSection';
import QuickStatsPanel from '../components/student/QuickStatsPanel';
import ScoreTrendChart from '../components/student/ScoreTrendChart';
import RecentAlertsPanel from '../components/student/RecentAlertsPanel';
import type { AlertItem, UpcomingExam } from '../data/studentDashboardData';
import { buildQuickStatRows } from '../lib/studentStatsUtils';
import { useStudentStats } from '../hooks/useStudentStats';
import { useStudentExams } from '../hooks/useStudentExams';
import { useStudentResults } from '../hooks/useStudentResults';
import { useNotifications } from '../hooks/useNotifications';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { stats, loading: statsLoading } = useStudentStats();
  const { upcomingForDashboard, loading: examsLoading } = useStudentExams();
  const { rows: resultRows } = useStudentResults();
  const { notifications } = useNotifications();

  const quickStatRows = useMemo(
    () => buildQuickStatRows(stats),
    [stats],
  );

  useEffect(() => {
    document.title = 'Overview — Observerr';
  }, []);

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return upcomingForDashboard;
    return upcomingForDashboard.filter(
      (exam) =>
        exam.title.toLowerCase().includes(q) ||
        exam.courseCode.toLowerCase().includes(q) ||
        exam.professor.toLowerCase().includes(q),
    );
  }, [searchQuery, upcomingForDashboard]);

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return resultRows.slice(0, 5);
    return resultRows.filter(
      (result) =>
        result.courseName.toLowerCase().includes(q) ||
        result.dateTaken.toLowerCase().includes(q),
    ).slice(0, 5);
  }, [resultRows, searchQuery]);

  const scoreTrend = useMemo(
    () =>
      resultRows
        .slice()
        .reverse()
        .slice(-8)
        .map((result) =>
          result.score === null || result.maxScore <= 0
            ? result.integrityScore
            : Math.round((result.score / result.maxScore) * 100),
        ),
    [resultRows],
  );

  const recentAlerts = useMemo<AlertItem[]>(
    () =>
      notifications.slice(0, 5).map((notification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        time: new Date(notification.createdAt).toLocaleString(),
        icon: notification.category === 'INTEGRITY' ? 'shield' : 'notifications',
        tone: notification.read ? 'secondary' : 'primary',
        linkTo: notification.deepLink ?? '/student/notifications',
      })),
    [notifications],
  );

  const handleExamSelect = useCallback((exam: UpcomingExam) => {
    navigate(`/student/exams/${exam.id}`);
  }, [navigate]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <StudentPortalLayout
      title="Overview"
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
    >
      <div className="p-4 sm:p-8 max-w-[1200px] mx-auto w-full pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[65%] space-y-8">
            <IntegrityScoreCard score={stats.avgIntegrity} loading={statsLoading} />
            <UpcomingExamsSection
              exams={examsLoading ? [] : filteredExams}
              onExamSelect={handleExamSelect}
            />
            <RecentResultsSection results={filteredResults} />
          </div>

          <div className="lg:w-[35%] space-y-8">
            <QuickStatsPanel rows={quickStatRows} loading={statsLoading} />
            <ScoreTrendChart scores={scoreTrend} />
            <RecentAlertsPanel
              alerts={recentAlerts}
              onSelect={(alert) => navigate(alert.linkTo ?? '/student/notifications')}
            />
          </div>
        </div>
      </div>
    </StudentPortalLayout>
  );
};

export default StudentDashboard;
