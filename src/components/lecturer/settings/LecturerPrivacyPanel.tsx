import { memo } from 'react';
import Icon from '../../student/Icon';

type LecturerPrivacyPanelProps = {
  bullets: string[];
};

const LecturerPrivacyPanel = memo(({ bullets }: LecturerPrivacyPanelProps) => (
  <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
    <div className="mb-4 flex items-center gap-3 text-student-primary">
      <Icon name="policy" />
      <h3 className="text-student-headline-sm font-student text-student-on-surface">Privacy &amp; Proctoring</h3>
    </div>

    <div className="bg-student-surface-container-low rounded-xl p-6 border border-student-surface-container-highest">
      <p className="text-student-body-md font-student text-student-on-surface-variant leading-relaxed mb-4">
        As a lecturer using Observerr, you access proctoring and integrity data solely for academic oversight.{' '}
        <strong className="text-student-on-surface">
          Session data is handled according to your institution&apos;s policies and is never sold to third parties.
        </strong>
      </p>

      <ul className="space-y-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3">
            <Icon name="check_circle" className="text-student-tertiary text-[20px] shrink-0 mt-0.5" />
            <span className="text-student-body-md font-student text-student-on-surface-variant">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
));

LecturerPrivacyPanel.displayName = 'LecturerPrivacyPanel';

export default LecturerPrivacyPanel;
