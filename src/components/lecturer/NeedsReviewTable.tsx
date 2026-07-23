import { memo } from 'react';
import type { ReviewStudent } from '../../data/lecturerDashboardData';

const riskStyles = {
  CRITICAL: 'bg-student-error-container text-student-on-error-container',
  MODERATE: 'bg-student-secondary-container text-student-on-secondary-container',
};

const integrityTone = (risk: ReviewStudent['risk']) =>
  risk === 'CRITICAL' ? 'text-student-error' : 'text-student-secondary';

type NeedsReviewTableProps = {
  students: ReviewStudent[];
  onViewTimeline: (student: ReviewStudent) => void;
};

const NeedsReviewTable = memo(({ students, onViewTimeline }: NeedsReviewTableProps) => (
  <section className="bg-student-surface-container-lowest p-4 sm:p-6 rounded-brand shadow-[0px_10px_30px_rgba(0,0,0,0.05)] border border-student-outline-variant/30">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-student-headline-sm font-student font-bold text-student-on-surface">Needs Review</h3>
      <button type="button" className="text-student-primary font-student font-bold text-student-body-md hover:underline">
        See all
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left">
        <thead>
          <tr className="border-b border-student-outline-variant/30 text-student-label-md font-student text-student-on-surface-variant uppercase font-bold tracking-widest">
            <th className="pb-4 pr-4">Student</th>
            <th className="pb-4 pr-4">Exam</th>
            <th className="pb-4 text-center">Risk Badge</th>
            <th className="pb-4 text-center">Integrity</th>
            <th className="pb-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-student-outline-variant/20">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-student-surface-container-low transition-colors group">
              <td className="py-4 pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container text-xs font-bold">
                    {student.initials}
                  </div>
                  <span className="text-student-body-md font-student font-bold text-student-on-surface">{student.name}</span>
                </div>
              </td>
              <td className="py-4 pr-4 text-student-body-md font-student text-student-on-surface-variant">{student.exam}</td>
              <td className="py-4 text-center">
                <span className={`px-3 py-1 rounded-full text-student-label-md font-student font-bold ${riskStyles[student.risk]}`}>
                  {student.risk}
                </span>
              </td>
              <td className={`py-4 text-center font-black text-student-body-lg font-student ${integrityTone(student.risk)}`}>
                {student.integrity}%
              </td>
              <td className="py-4 text-right">
                <button
                  type="button"
                  onClick={() => onViewTimeline(student)}
                  className="bg-student-surface-container-high hover:bg-student-primary-container text-student-on-surface-variant hover:text-student-on-primary-container px-4 py-2 rounded-xl text-student-body-md font-student font-bold transition-all"
                >
                  View Timeline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
));

NeedsReviewTable.displayName = 'NeedsReviewTable';

export default NeedsReviewTable;
