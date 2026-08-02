import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { StudentResultRow } from '../../types/studentResults';

const integrityColor = (score: number) =>
  score >= 90 ? 'text-student-primary' : 'text-student-secondary';

type RecentResultsSectionProps = {
  results: StudentResultRow[];
};

const RecentResultsSection = memo(({ results }: RecentResultsSectionProps) => (
  <section>
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-student-headline-sm font-student text-student-on-background">Recent Results</h3>
      <Link
        to="/student/results"
        className="text-student-primary hover:text-student-primary-container text-student-label-md font-student transition-colors"
      >
        See all
      </Link>
    </div>

    <div className="student-glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left border-collapse">
          <thead>
            <tr className="bg-student-surface-container-lowest border-b border-student-surface-variant/50">
              {['Course', 'Date', 'Integrity', 'Status'].map((col) => (
                <th key={col} className="py-4 px-6 text-student-label-md font-student text-student-on-surface-variant font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr
                key={row.id}
                className={`hover:bg-student-surface-container-low/50 transition-colors ${
                  index < results.length - 1 ? 'border-b border-student-surface-variant/30' : ''
                }`}
              >
                <td className="py-4 px-6 text-student-body-md font-student text-student-on-surface">
                  <Link to={`/student/results/${row.id}`} className="hover:text-student-primary">{row.courseName}</Link>
                </td>
                <td className="py-4 px-6 text-sm text-student-on-surface-variant">{row.dateTaken}</td>
                <td className="py-4 px-6">
                  <span className={`${integrityColor(row.integrityScore)} font-medium`}>{row.integrityScore}%</span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-student-tertiary-container/50 text-student-on-tertiary-container border border-student-tertiary-container">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
));

RecentResultsSection.displayName = 'RecentResultsSection';

export default RecentResultsSection;
