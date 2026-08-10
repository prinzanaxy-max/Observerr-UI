import { memo } from 'react';
import { Link } from 'react-router-dom';
import StudentAvatar from './StudentAvatar';
import NotificationBellDropdown from '../shared/NotificationBellDropdown';
import { useAuthProfile } from '../../hooks/useAuthProfile';

const StudentTopBar = memo(() => {
  const { initials, profilePictureUrl } = useAuthProfile();

  return (
    <header className="hidden md:flex shrink-0 h-16 bg-transparent items-center justify-end px-6 lg:px-8 gap-4 sticky top-0 z-20">
      <NotificationBellDropdown viewAllPath="/student/notifications" />
      <Link to="/student/profile" aria-label="View profile">
        <StudentAvatar src={profilePictureUrl} initials={initials} size="xs" />
      </Link>
    </header>
  );
});

StudentTopBar.displayName = 'StudentTopBar';

export default StudentTopBar;
