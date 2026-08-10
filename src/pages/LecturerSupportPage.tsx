import { useEffect } from 'react';
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
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-[1200px] mx-auto w-full pb-24 md:pb-12">
        <div className="mb-4 pt-2">
          <h1 className="text-student-headline-md font-student text-student-on-background font-bold">Support</h1>
          <p className="text-student-body-md font-student text-student-on-surface-variant mt-1">Get help with the Observerr lecturer portal.</p>
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
