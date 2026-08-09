import { useEffect } from 'react';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import SupportPanel from '../components/student/settings/SupportPanel';

const StudentSupportPage = () => {
  useEffect(() => {
    document.title = 'Support — Observerr';
  }, []);

  return (
    <StudentPortalLayout contentClassName="student-settings-bg relative">
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-[1200px] mx-auto w-full pb-24 md:pb-12">
        <div className="mb-6">
          <h1 className="text-student-headline-md font-student text-student-on-background font-bold">Support</h1>
          <p className="text-student-body-md font-student text-student-on-surface-variant mt-1">
            Get help with exams, proctoring, and the Observerr platform.
          </p>
        </div>
        <SupportPanel />
      </div>
    </StudentPortalLayout>
  );
};

export default StudentSupportPage;
