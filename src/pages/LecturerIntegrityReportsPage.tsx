import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useLecturerAnalyticsOverview } from '../hooks/useLecturerAnalyticsOverview';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import AnalyticsDateRangeFilter from '../components/lecturer/AnalyticsDateRangeFilter';
import IntegritySummaryCards from '../components/lecturer/IntegritySummaryCards';
import IntegrityEventTrendsChart from '../components/lecturer/IntegrityEventTrendsChart';
import IntegrityFlaggedBehaviorsCard from '../components/lecturer/IntegrityFlaggedBehaviorsCard';
import IntegrityFullReportPanel from '../components/lecturer/IntegrityFullReportPanel';
import type { DateRangeKey } from '../data/integrityReportsData';
import { CREATE_EXAM_PATH } from '../data/createExamData';
import { UI_PERIOD_TO_API } from '../lib/lecturerAnalyticsUtils';
import { fetchIntegrityReport } from '../services/lecturerAnalyticsService';
import type { IntegrityReportEvent, IntegrityReportPage } from '../types/lecturerAnalytics';

const defaultCustomEnd = () => new Date().toISOString().slice(0, 10);
const defaultCustomStart = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().slice(0, 10);
};

const LecturerIntegrityReportsPage = () => {
  const navigate = useNavigate();
  const { institutionalId, email, initials } = useAuthProfile();

  const [dateRange, setDateRange] = useState<DateRangeKey>('7d');
  const [customStart, setCustomStart] = useState(defaultCustomStart);
  const [customEnd, setCustomEnd] = useState(defaultCustomEnd);
  const [showFullReport, setShowFullReport] = useState(false);
  const [reportPage, setReportPage] = useState(0);
  const [reportSearch, setReportSearch] = useState('');
  const [reportEventType, setReportEventType] = useState('');
  const [reportSeverity, setReportSeverity] = useState<'' | IntegrityReportEvent['severity']>('');
  const [fullReport, setFullReport] = useState<IntegrityReportPage | null>(null);
  const [fullReportLoading, setFullReportLoading] = useState(false);
  const [fullReportError, setFullReportError] = useState('');

  const customRange = useMemo(
    () => ({ startDate: customStart, endDate: customEnd }),
    [customEnd, customStart],
  );
  const { report, loading, error, errorHint, forbidden, reload } = useLecturerAnalyticsOverview(
    dateRange,
    customRange,
  );

  useEffect(() => {
    document.title = 'Integrity Reports — Observerr Lecturer';
  }, []);

  const handleDateRangeChange = useCallback((value: DateRangeKey) => setDateRange(value), []);
  const handleNewExam = useCallback(() => navigate(CREATE_EXAM_PATH), [navigate]);
  const handleViewFullReport = useCallback(() => setShowFullReport(true), []);

  const loadFullReport = useCallback(async () => {
    if (!showFullReport) return;
    if (dateRange === 'custom' && (!customStart || !customEnd)) {
      setFullReportError('Select both a start and end date for the custom range.');
      return;
    }
    setFullReportLoading(true);
    setFullReportError('');
    try {
      setFullReport(await fetchIntegrityReport({
        ...(dateRange === 'custom'
          ? { startDate: customStart, endDate: customEnd }
          : { period: UI_PERIOD_TO_API[dateRange] }),
        page: reportPage,
        size: 20,
        search: reportSearch.trim() || undefined,
        eventType: reportEventType || undefined,
        severity: reportSeverity,
      }));
    } catch {
      setFullReportError('Could not load the full integrity report.');
    } finally {
      setFullReportLoading(false);
    }
  }, [
    customEnd,
    customStart,
    dateRange,
    reportEventType,
    reportPage,
    reportSearch,
    reportSeverity,
    showFullReport,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadFullReport(), 250);
    return () => window.clearTimeout(timer);
  }, [loadFullReport]);

  useEffect(
    () => setReportPage(0),
    [dateRange, customStart, customEnd, reportEventType, reportSearch, reportSeverity],
  );

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={handleNewExam}
      contentClassName="lecturer-exams-bg"
    >
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto w-full pb-12 space-y-8 md:space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-student-display-lg font-student text-student-on-surface">Analytics Overview</h1>
            <p className="text-student-body-lg font-student text-student-on-surface-variant mt-1">
              Reviewing integrity metrics and proctoring events.
            </p>
          </div>
          <AnalyticsDateRangeFilter
            value={dateRange}
            onChange={handleDateRangeChange}
            customStart={customStart}
            customEnd={customEnd}
            onCustomStartChange={setCustomStart}
            onCustomEndChange={setCustomEnd}
          />
        </div>

        {(error || forbidden) && !loading && (
          <div className="rounded-xl border border-student-error-container bg-student-error-container/30 px-4 py-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <p className="font-student text-student-body-md text-student-on-error-container">{error}</p>
              {errorHint && (
                <p className="font-student text-student-label-md text-student-on-error-container/80 mt-1">
                  {errorHint}
                </p>
              )}
            </div>
            {!forbidden && (
              <button
                type="button"
                onClick={reload}
                className="shrink-0 px-4 py-2 rounded-full border border-student-error text-student-error font-student text-student-label-md hover:bg-student-error/5 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <IntegritySummaryCards metrics={report.summary} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <IntegrityEventTrendsChart
            days={report.trend}
            title={report.trendTitle}
            subtitle={report.trendSubtitle}
            loading={loading}
          />
          <IntegrityFlaggedBehaviorsCard
            behaviors={report.behaviors}
            onViewFullReport={handleViewFullReport}
            loading={loading}
          />
        </div>

        {showFullReport && (
          <IntegrityFullReportPanel
            report={fullReport}
            loading={fullReportLoading}
            error={fullReportError}
            search={reportSearch}
            eventType={reportEventType}
            severity={reportSeverity}
            onSearchChange={setReportSearch}
            onEventTypeChange={setReportEventType}
            onSeverityChange={setReportSeverity}
            onPageChange={setReportPage}
            onOpenTimeline={(sessionId) => navigate(`/lecturer/students/sessions/${sessionId}`)}
            onRetry={() => void loadFullReport()}
            onClose={() => setShowFullReport(false)}
          />
        )}
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerIntegrityReportsPage;
