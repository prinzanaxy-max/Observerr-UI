import { memo } from 'react';
import Icon from '../student/Icon';
import type {
  IntegrityReportEvent,
  IntegrityReportPage,
} from '../../types/lecturerAnalytics';

type Props = {
  report: IntegrityReportPage | null;
  loading: boolean;
  error: string;
  search: string;
  eventType: string;
  severity: '' | IntegrityReportEvent['severity'];
  onSearchChange: (value: string) => void;
  onEventTypeChange: (value: string) => void;
  onSeverityChange: (value: '' | IntegrityReportEvent['severity']) => void;
  onPageChange: (page: number) => void;
  onOpenTimeline: (sessionId: IntegrityReportEvent['sessionId']) => void;
  onRetry: () => void;
  onClose: () => void;
};

const IntegrityFullReportPanel = memo(({
  report,
  loading,
  error,
  search,
  eventType,
  severity,
  onSearchChange,
  onEventTypeChange,
  onSeverityChange,
  onPageChange,
  onOpenTimeline,
  onRetry,
  onClose,
}: Props) => (
  <section className="bg-student-surface rounded-[24px] p-4 sm:p-6 lecturer-card-elevation" aria-labelledby="full-report-heading">
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h2 id="full-report-heading" className="text-student-headline-md font-student text-student-on-surface">Full Integrity Report</h2>
        <p className="text-student-body-md font-student text-student-on-surface-variant">
          {report ? `${report.totalElements} matching events` : 'Filter event-level integrity records.'}
        </p>
      </div>
      <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-student-surface-container" aria-label="Close full report">
        <Icon name="close" />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
      <input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Student or exam" aria-label="Search report" className="rounded-xl border border-student-outline-variant px-4 py-2.5" />
      <select value={eventType} onChange={(event) => onEventTypeChange(event.target.value)} aria-label="Filter event type" className="rounded-xl border border-student-outline-variant px-4 py-2.5">
        <option value="">All event types</option>
        {(report?.eventTypes ?? []).map((type) => <option key={type} value={type}>{type}</option>)}
      </select>
      <select value={severity} onChange={(event) => onSeverityChange(event.target.value as typeof severity)} aria-label="Filter severity" className="rounded-xl border border-student-outline-variant px-4 py-2.5">
        <option value="">All severities</option>
        <option value="DANGER">Danger</option>
        <option value="WARNING">Warning</option>
        <option value="NEUTRAL">Neutral</option>
        <option value="SUCCESS">Success</option>
      </select>
    </div>

    {error ? (
      <div role="alert" className="py-10 text-center">
        <p className="text-student-error mb-4">{error}</p>
        <button type="button" onClick={onRetry} className="px-5 py-2 rounded-full border border-student-primary text-student-primary">Retry</button>
      </div>
    ) : loading ? (
      <div className="h-64 animate-pulse rounded-xl bg-student-surface-container-high" aria-label="Loading report" />
    ) : (
      <>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead><tr className="border-b border-student-outline-variant">
              {['Student', 'Exam', 'Event', 'Severity', 'Time', 'Deduction', ''].map((heading) => <th key={heading || 'action'} scope="col" className="px-3 py-3 text-student-label-md uppercase text-student-outline">{heading}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-student-surface-variant">
              {(report?.content ?? []).map((event) => (
                <tr key={event.id}>
                  <td className="px-3 py-3 font-medium">{event.studentName}</td>
                  <td className="px-3 py-3">{event.examTitle}</td>
                  <td className="px-3 py-3">{event.eventType}</td>
                  <td className="px-3 py-3">{event.severity}</td>
                  <td className="px-3 py-3">{new Date(event.occurredAt).toLocaleString()}</td>
                  <td className="px-3 py-3">{event.pointsDeducted == null ? '—' : `-${event.pointsDeducted}`}</td>
                  <td className="px-3 py-3 text-right"><button type="button" onClick={() => onOpenTimeline(event.sessionId)} className="text-student-primary font-semibold">Timeline</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(report?.content.length ?? 0) === 0 && <p className="py-10 text-center text-student-on-surface-variant">No integrity events match these filters.</p>}
        {report && report.totalPages > 1 && (
          <div className="flex justify-end gap-3 mt-5">
            <button type="button" disabled={report.page <= 0} onClick={() => onPageChange(report.page - 1)} className="px-4 py-2 rounded-full border disabled:opacity-40">Previous</button>
            <span className="py-2">Page {report.page + 1} of {report.totalPages}</span>
            <button type="button" disabled={report.page + 1 >= report.totalPages} onClick={() => onPageChange(report.page + 1)} className="px-4 py-2 rounded-full border disabled:opacity-40">Next</button>
          </div>
        )}
      </>
    )}
  </section>
));

IntegrityFullReportPanel.displayName = 'IntegrityFullReportPanel';
export default IntegrityFullReportPanel;
