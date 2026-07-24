import { memo } from 'react';
import Icon from '../Icon';
import type { VerificationItem } from '../../../data/studentProfileData';

type ProfileVerificationCardProps = {
  items: VerificationItem[];
};

const statusStyles = {
  verified: {
    badge: 'bg-student-primary-container/30 text-student-on-primary-container',
    icon: 'check_circle',
    label: 'Verified',
  },
  clear: {
    badge: 'bg-student-tertiary-container/40 text-student-on-tertiary-container',
    icon: 'verified_user',
    label: 'Clear',
  },
  pending: {
    badge: 'bg-student-secondary-container/40 text-student-on-secondary-container',
    icon: 'schedule',
    label: 'Pending',
  },
};

const ProfileVerificationCard = memo(({ items }: ProfileVerificationCardProps) => (
  <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
    <div className="flex items-center gap-3 mb-6">
      <Icon name="shield" className="text-student-primary text-[24px]" />
      <div>
        <h3 className="text-student-headline-sm font-student text-student-on-surface">Verification &amp; Standing</h3>
        <p className="text-student-body-md font-student text-student-on-surface-variant">
          Your account readiness for proctored assessments
        </p>
      </div>
    </div>

    <ul className="space-y-4">
      {items.map((item) => {
        const style = statusStyles[item.status];
        return (
          <li
            key={item.id}
            className="flex items-start gap-4 p-4 rounded-xl border border-student-outline-variant/30 bg-student-surface-container-lowest"
          >
            <div className="w-10 h-10 rounded-full bg-student-surface-container-high flex items-center justify-center text-student-on-surface-variant shrink-0">
              <Icon name={item.icon} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-student-body-lg font-student font-medium text-student-on-surface">{item.label}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-student font-medium ${style.badge}`}>
                  <Icon name={style.icon} filled className="text-[12px]" />
                  {style.label}
                </span>
              </div>
              <p className="text-student-body-md font-student text-student-on-surface-variant">{item.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  </section>
));

ProfileVerificationCard.displayName = 'ProfileVerificationCard';

export default ProfileVerificationCard;
