import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import LecturerSupportPanel from '../components/lecturer/settings/LecturerSupportPanel';
import { LECTURER_SUPPORT_FAQ } from '../data/lecturerSettingsData';
import { useAuthProfile } from '../hooks/useAuthProfile';

const LecturerSupportPage = () => {
  const { institutionalId, email, initials } = useAuthProfile();

  useEffect(() => {
    document.title = 'Support — Observerr Lecturer';
  }, []);

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      contentClassName="student-settings-bg relative"
      header={
        <header className="hidden md:flex shrink-0 h-20 bg-transparent items-center justify-between px-6 lg:px-8 sticky top-0 z-20 backdrop-blur-md bg-student-surface-bright/80 border-b border-student-outline-variant/10">
          <h1 className="text-student-headline-md font-student text-student-on-background">Support</h1>
          <Link
            to="/lecturer/settings"
            className="text-student-label-md font-student text-student-primary hover:text-student-primary-container transition-colors py-2 px-4 rounded-full border border-student-primary hover:bg-student-primary/5"
          >
            Settings
          </Link>
        </header>
      }
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-[1200px] mx-auto w-full pb-24 md:pb-12">
        <div className="md:hidden mb-4 pt-2 flex items-center justify-between gap-3">
          <h1 className="text-student-headline-md font-student text-student-on-background font-bold">Support</h1>
          <Link
            to="/lecturer/settings"
            className="text-student-label-md font-student text-student-primary py-1.5 px-3 rounded-full border border-student-primary shrink-0"
          >
            Settings
          </Link>
        </div>

        <LecturerSupportPanel
          faq={LECTURER_SUPPORT_FAQ}
          documentationHref="mailto:prinzanaxy@gmail.com?subject=Observerr%20Lecturer%20Documentation%20Request"
          documentationLabel="Request Documentation"
          documentationDescription="Email us for lecturer setup guides"
        />
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerSupportPage;
