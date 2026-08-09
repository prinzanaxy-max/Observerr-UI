import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import type { ProfileQuickLink } from '../../../data/studentProfileData';

type ProfileQuickLinksProps = {
  links: ProfileQuickLink[];
};

const ProfileQuickLinks = memo(({ links }: ProfileQuickLinksProps) => (
  <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
    <h3 className="text-student-headline-sm font-student text-student-on-surface mb-4">Quick Access</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {links.map((link) => (
        <Link
          key={link.id}
          to={link.path}
          className="flex items-center gap-3 p-4 rounded-xl border border-student-outline-variant/30 bg-student-surface-container-lowest hover:border-student-primary/30 hover:bg-student-primary-container/5 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-student-primary-container/20 flex items-center justify-center text-student-primary shrink-0 group-hover:bg-student-primary-container/30 transition-colors">
            <Icon name={link.icon} />
          </div>
          <div className="min-w-0">
            <p className="text-student-body-lg font-student font-medium text-student-on-surface group-hover:text-student-primary transition-colors">
              {link.label}
            </p>
            <p className="text-student-body-md font-student text-student-on-surface-variant truncate">
              {link.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </section>
));

ProfileQuickLinks.displayName = 'ProfileQuickLinks';

export default ProfileQuickLinks;
