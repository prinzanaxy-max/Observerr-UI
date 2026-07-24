import { memo } from 'react';
import Icon from '../Icon';
import { PRIVACY_BULLETS } from '../../../data/studentSettingsData';

const PrivacyMonitoringPanel = memo(() => (
  <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
    <div className="mb-4 flex items-center gap-3 text-student-primary">
      <Icon name="policy" />
      <h3 className="text-student-headline-sm font-student text-student-on-surface">Privacy &amp; Monitoring</h3>
    </div>

    <div className="bg-student-surface-container-low rounded-xl p-6 border border-student-surface-container-highest">
      <p className="text-student-body-md font-student text-student-on-surface-variant leading-relaxed mb-4">
        At Observerr, your privacy is a priority. During an active exam session, we temporarily collect video, audio,
        and screen data to ensure academic integrity.{' '}
        <strong className="text-student-on-surface">
          This data is strictly used for proctoring purposes and is never sold or shared with third-party advertisers.
        </strong>
      </p>

      <ul className="space-y-3">
        {PRIVACY_BULLETS.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3">
            <Icon name="check_circle" className="text-student-tertiary text-[20px] shrink-0 mt-0.5" />
            <span className="text-student-body-md font-student text-student-on-surface-variant">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
));

PrivacyMonitoringPanel.displayName = 'PrivacyMonitoringPanel';

export default PrivacyMonitoringPanel;
