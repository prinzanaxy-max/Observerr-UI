import { memo } from 'react';
import Icon from '../student/Icon';
import type { MonitoredStudent } from '../../data/liveMonitoringData';
import { liveStatusDot, riskBadge } from '../../data/liveMonitoringData';

type MonitoringStudentTableProps = {
  students: MonitoredStudent[];
  onViewTimeline: (student: MonitoredStudent) => void;
  onWatchFeed?: (student: MonitoredStudent) => void;
};

const MonitoringStudentTable = memo(({ students, onViewTimeline, onWatchFeed }: MonitoringStudentTableProps) => (
  <div className="bg-student-surface-container-lowest rounded-brand lecturer-card-elevation border border-student-outline-variant/20 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead>
          <tr className="border-b border-student-surface-variant bg-student-surface-container-low/50">
            {['Student', 'Live Status', 'Risk Level', 'Last Flagged Event', 'Action'].map((col, i) => (
              <th
                key={col}
                className={`py-4 px-4 text-student-label-md font-student text-student-outline uppercase tracking-wider font-bold ${
                  i > 0 && i < 4 ? 'text-center' : i === 4 ? 'text-right' : ''
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-student-surface-variant/60">
          {students.map((student) => (
            <tr
              key={student.id}
              className={`hover:bg-student-surface-container-low/80 transition-colors ${
                student.highlighted ? 'bg-student-error/5' : ''
              }`}
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  {student.initials ? (
                    <div className="w-10 h-10 rounded-full shrink-0 bg-student-surface-container-high flex items-center justify-center text-student-on-surface-variant font-bold text-sm">
                      {student.initials}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container font-bold text-sm">
                      {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p className="text-student-body-lg font-student font-semibold text-student-on-surface">{student.name}</p>
                    <p className="text-student-body-md font-student text-student-on-surface-variant">ID: {student.id}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${liveStatusDot[student.liveStatus]}`} />
                  <span className="text-student-body-md font-student text-student-on-surface">{student.liveStatusLabel}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${riskBadge[student.risk]}`}>
                  {student.risk}
                </span>
              </td>
              <td className="py-4 px-4 text-center text-student-body-md font-student text-student-on-surface-variant max-w-[240px]">
                {student.lastEvent ?? '—'}
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  {onWatchFeed && (
                    <button
                      type="button"
                      onClick={() => onWatchFeed(student)}
                      className="inline-flex items-center gap-1 text-student-on-surface-variant font-student font-semibold text-student-body-md hover:text-student-primary transition-colors"
                    >
                      <Icon name="videocam" className="text-[16px]" />
                      Watch Feed
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onViewTimeline(student)}
                    className="inline-flex items-center gap-1 text-student-primary font-student font-bold text-student-body-md hover:gap-2 transition-all"
                  >
                    View Timeline
                    <Icon name="arrow_forward" className="text-[16px]" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {students.length === 0 && (
      <p className="py-12 text-center text-student-on-surface-variant font-student">No students match your filters.</p>
    )}
  </div>
));

MonitoringStudentTable.displayName = 'MonitoringStudentTable';

export default MonitoringStudentTable;
