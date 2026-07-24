import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import type { StudentResult } from '../../../data/studentResultsData';

type ProfileRecentResultsProps = {
  results: StudentResult[];
};

const integrityColor = (score: number) =>
  score >= 90 ? 'text-student-primary' : 'text-student-secondary';

const ProfileRecentResults = memo(({ results }: ProfileRecentResultsProps) => (
  <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-student-headline-sm font-student text-student-on-surface">Recent Assessments</h3>
      <Link
        to="/student/results"
        className="text-student-primary hover:text-student-primary-container text-student-label-md font-student transition-colors"
      >
        View all
      </Link>
    </div>

    {results.length === 0 ? (
      <p className="text-student-body-md font-student text-student-on-surface-variant text-center py-8">
        No matching assessments found.
      </p>
    ) : (
      <div className="space-y-3">
        {results.map((result) => (
          <Link
            key={result.id}
            to={`/student/results/${result.id}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-student-outline-variant/30 bg-student-surface-container-lowest hover:border-student-primary/30 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-student-primary-container/20 flex items-center justify-center text-student-primary shrink-0">
              <Icon name={result.icon} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-student-body-lg font-student font-medium text-student-on-surface truncate group-hover:text-student-primary transition-colors">
                {result.courseName}
              </p>
              <p className="text-student-body-md font-student text-student-on-surface-variant truncate">
                {result.examLabel} · {result.dateTaken}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-student-body-lg font-student font-bold ${integrityColor(result.integrityScore)}`}>
                {result.integrityScore}%
              </p>
              <p className="text-student-label-md font-student text-student-on-surface-variant">{result.status}</p>
            </div>
            <Icon name="chevron_right" className="text-student-outline shrink-0 group-hover:text-student-primary transition-colors" />
          </Link>
        ))}
      </div>
    )}
  </section>
));

ProfileRecentResults.displayName = 'ProfileRecentResults';

export default ProfileRecentResults;
