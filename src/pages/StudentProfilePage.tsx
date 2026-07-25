import { useCallback, useEffect, useMemo, useState } from 'react';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import ProfileHeroCard from '../components/student/profile/ProfileHeroCard';
import ProfileStatsGrid from '../components/student/profile/ProfileStatsGrid';
import ProfileVerificationCard from '../components/student/profile/ProfileVerificationCard';
import ProfileRecentResults from '../components/student/profile/ProfileRecentResults';
import ProfileQuickLinks from '../components/student/profile/ProfileQuickLinks';
import SettingsAlert from '../components/student/settings/SettingsAlert';
import {
  PROFILE_QUICK_LINKS,
  VERIFICATION_ITEMS,
  filterProfileResults,
  formatMemberSince,
  getOverallIntegrityScore,
  getStudentProfileStats,
} from '../data/studentProfileData';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useStudentSettings } from '../hooks/useStudentSettings';

const StudentProfilePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { institutionalId, email, initials, user } = useAuthProfile();
  const {
    displayName,
    avatarUrl,
    uploadAvatar,
    removeAvatar,
    saveStatus,
    saveMessage,
    clearStatus,
  } = useStudentSettings();

  useEffect(() => {
    document.title = 'Profile — Observerr';
  }, []);

  const stats = useMemo(() => getStudentProfileStats(), []);
  const integrityScore = useMemo(() => getOverallIntegrityScore(), []);
  const memberSince = useMemo(() => formatMemberSince(user?.createdAt), [user?.createdAt]);

  const recentResults = useMemo(
    () => filterProfileResults(searchQuery),
    [searchQuery],
  );

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);

  return (
    <StudentPortalLayout
      title="Profile"
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search assessments..."
      contentClassName="student-profile-bg relative"
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-[1200px] mx-auto w-full pb-24 md:pb-12">
        <div className="md:hidden mb-4 pt-2">
          <h1 className="text-student-headline-md font-student text-student-on-background font-bold">Profile</h1>
        </div>

        <div className="mb-6">
          <SettingsAlert status={saveStatus} message={saveMessage} onDismiss={clearStatus} />
        </div>

        <div className="flex flex-col gap-6 lg:gap-8">
          <ProfileHeroCard
            displayName={displayName}
            institutionalId={institutionalId}
            email={email}
            initials={initials}
            avatarUrl={avatarUrl}
            memberSince={memberSince}
            integrityScore={integrityScore}
            onUploadPhoto={uploadAvatar}
            onRemovePhoto={removeAvatar}
          />

          <ProfileStatsGrid stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <ProfileRecentResults results={recentResults} />
              <ProfileVerificationCard items={VERIFICATION_ITEMS} />
            </div>

            <div className="lg:col-span-1">
              <ProfileQuickLinks links={PROFILE_QUICK_LINKS} />
            </div>
          </div>
        </div>
      </div>
    </StudentPortalLayout>
  );
};

export default StudentProfilePage;
