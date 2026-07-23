import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import ObserverrLogo from '../components/ObserverrLogo';
import StudentSidebar from '../components/student/StudentSidebar';
import StudentTopBar from '../components/student/StudentTopBar';
import MobileBottomNav from '../components/student/MobileBottomNav';
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

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const StudentDashboard = () => {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const [activeNav, setActiveNav] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const fullName = user?.fullName ?? localStorage.getItem('authFullName') ?? 'Johan Mandela';
  const initials = useMemo(() => getInitials(fullName), [fullName]);

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

  const handleExamSelect = useCallback((_exam: UpcomingExam) => {
    // Exam room entry will be wired to the API in a follow-up
  }, []);

  const handleNavChange = useCallback((id: string) => {
    setActiveNav(id);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <div className="student-dashboard h-dvh flex overflow-hidden antialiased">
      <StudentSidebar
        activeNav={activeNav}
        onNavChange={handleNavChange}
        fullName={fullName}
        initials={initials}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Mobile brand bar */}
        <div className="md:hidden shrink-0 h-16 flex items-center px-4 border-b border-student-surface-variant/50 bg-student-surface-container-lowest">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <ObserverrLogo className="h-7 w-7 shrink-0" />
            <span className="text-student-headline-sm font-student text-student-primary tracking-tight truncate">
              OBSERVERR
            </span>
          </Link>
        </div>

        <StudentTopBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <div className="p-4 sm:p-8 max-w-[1200px] mx-auto w-full pb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-[65%] space-y-8">
                <IntegrityScoreCard />
                <UpcomingExamsSection exams={filteredExams} onExamSelect={handleExamSelect} />
                <RecentResultsSection results={filteredResults} />
              </div>

              <div className="lg:w-[35%] space-y-8">
                <QuickStatsPanel />
                <ScoreTrendChart />
                <RecentAlertsPanel alerts={RECENT_ALERTS} />
              </div>
            </div>
          </div>
        </main>

        <MobileBottomNav activeNav={activeNav} onNavChange={handleNavChange} />
      </div>
    </div>
  );
};

export default StudentDashboard;
