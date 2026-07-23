import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import IntegrityReportsPageHeader from '../components/lecturer/IntegrityReportsPageHeader';
import AnalyticsDateRangeFilter from '../components/lecturer/AnalyticsDateRangeFilter';
import IntegritySummaryCards from '../components/lecturer/IntegritySummaryCards';
import IntegrityEventTrendsChart from '../components/lecturer/IntegrityEventTrendsChart';
import IntegrityFlaggedBehaviorsCard from '../components/lecturer/IntegrityFlaggedBehaviorsCard';
import { INTEGRITY_REPORTS, type DateRangeKey } from '../data/integrityReportsData';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const LecturerIntegrityReportsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [dateRange, setDateRange] = useState<DateRangeKey>('30d');

  const fullName = user?.fullName ?? localStorage.getItem('authFullName') ?? 'Dr. Ama Boateng';
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  const report = useMemo(() => INTEGRITY_REPORTS[dateRange], [dateRange]);

  useEffect(() => {
    document.title = 'Integrity Reports — Observerr Lecturer';
  }, []);

  const handleDateRangeChange = useCallback((value: DateRangeKey) => setDateRange(value), []);
  const handleGoLive = useCallback(() => navigate('/lecturer/exams'), []);
  const handleNewExam = useCallback(() => navigate(CREATE_EXAM_PATH), [navigate]);
  const handleViewFullReport = useCallback(() => {
    // Placeholder for future full report download
  }, []);

  return (
    <LecturerPortalLayout
      fullName={fullName}
      initials={initials}
      onNewExam={handleNewExam}
      contentClassName="lecturer-exams-bg"
      header={<IntegrityReportsPageHeader initials={initials} onGoLive={handleGoLive} />}
    >
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto w-full pb-12 space-y-8 md:space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-student-display-lg font-student text-student-on-surface">Analytics Overview</h1>
            <p className="text-student-body-lg font-student text-student-on-surface-variant mt-1">
              Reviewing integrity metrics and proctoring events.
            </p>
          </div>
          <AnalyticsDateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
        </div>

        <IntegritySummaryCards metrics={report.summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <IntegrityEventTrendsChart days={report.trend} />
          <IntegrityFlaggedBehaviorsCard
            behaviors={report.behaviors}
            onViewFullReport={handleViewFullReport}
          />
        </div>
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerIntegrityReportsPage;
