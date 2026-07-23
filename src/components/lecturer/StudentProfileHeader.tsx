import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../student/Icon';
import type { StudentTimelineProfile } from '../../data/studentTimelineData';

type StudentProfileHeaderProps = {
  profile: StudentTimelineProfile;
  backTo: string;
};

const integrityTone = (score: number) =>
  score >= 80 ? 'text-student-primary' : score >= 60 ? 'text-amber-600' : 'text-student-error';

const integrityBg = (score: number) =>
  score >= 80
    ? 'bg-student-primary-container/30 text-student-on-primary-container border-student-primary/20'
    : score >= 60
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-student-error-container text-student-on-error-container border-student-error/20';

const StudentProfileHeader = memo(({ profile, backTo }: StudentProfileHeaderProps) => (
  <div className="bg-student-surface rounded-[24px] p-4 sm:p-6 lecturer-card-elevation mb-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
      <Link
        to={backTo}
        className="shrink-0 text-student-on-surface-variant hover:text-student-primary transition-colors lg:hidden"
        aria-label="Back to monitoring"
      >
        <Icon name="arrow_back" />
      </Link>
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container font-bold text-lg border-2 border-student-primary-container">
        {profile.initials ?? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
      </div>
      <div className="min-w-0">
        <h2 className="text-student-headline-md font-student text-student-on-surface truncate">{profile.name}</h2>
        <p className="text-student-body-md font-student text-student-on-surface-variant flex items-center gap-2 mt-1">
          <Icon name="quiz" className="text-sm shrink-0" />
          <span className="truncate">{profile.examLabel}</span>
        </p>
      </div>
    </div>

    <div className="flex flex-col items-start lg:items-end shrink-0">
      <span className="text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider mb-1">
        Integrity Score
      </span>
      <div
        className={`px-5 sm:px-6 py-2 rounded-full text-student-headline-md font-student font-bold flex items-center gap-2 border ${integrityBg(profile.integrityScore)}`}
      >
        {profile.integrityScore < 60 && <Icon name="warning" className="text-2xl sm:text-3xl" />}
        <span className={integrityTone(profile.integrityScore)}>{profile.integrityScore}%</span>
      </div>
    </div>
  </div>
));

StudentProfileHeader.displayName = 'StudentProfileHeader';

export default StudentProfileHeader;
