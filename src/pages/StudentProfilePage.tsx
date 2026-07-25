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
} from '../data/studentProfileData';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useProfilePicture } from '../hooks/useProfilePicture';
import { useStudentSettings } from '../hooks/useStudentSettings';
import { useStudentStats } from '../hooks/useStudentStats';
import { buildProfileStats } from '../lib/studentStatsUtils';
import { getInitialsFromName } from '../lib/profileUtils';
import type { SaveStatus } from '../hooks/useAccountSettings';

const StudentProfilePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const { institutionalId, email, user } = useAuthProfile();
  const { displayName, settings } = useStudentSettings();
  const profilePicture = useProfilePicture();
  const { stats: studentStats, loading: statsLoading } = useStudentStats();

  const initials = useMemo(
    () =>
      getInitialsFromName(
        settings.profile.firstName,
        settings.profile.lastName,
        institutionalId,
      ),
    [institutionalId, settings.profile.firstName, settings.profile.lastName],
  );

  useEffect(() => {
    document.title = 'Profile — Observerr';
  }, []);

  const stats = useMemo(() => buildProfileStats(studentStats), [studentStats]);
  const integrityScore = studentStats.avgIntegrity;
  const memberSince = useMemo(() => formatMemberSince(user?.createdAt), [user?.createdAt]);

  const verificationItems = useMemo(
    () =>
      VERIFICATION_ITEMS.map((item) =>
        item.id === 'integrity'
          ? {
              ...item,
              description: `Overall score ${integrityScore}% — consistent adherence to testing protocols.`,
            }
          : item,
      ),
    [integrityScore],
  );

  const recentResults = useMemo(
    () => filterProfileResults(searchQuery),
    [searchQuery],
  );

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);

  const clearStatus = useCallback(() => {
    setSaveStatus('idle');
    setSaveMessage('');
  }, []);

  const handleUploadPhoto = useCallback(
    async (file: File) => {
      clearStatus();
      profilePicture.clearPhotoError();
      const result = await profilePicture.uploadProfilePicture(file);
      if (result === false) return false;
      setSaveStatus('success');
      setSaveMessage('Profile picture updated.');
      return true;
    },
    [clearStatus, profilePicture.clearPhotoError, profilePicture.uploadProfilePicture],
  );

  const handleRemovePhoto = useCallback(async () => {
    clearStatus();
    profilePicture.clearPhotoError();
    const ok = await profilePicture.removeProfilePicture();
    if (!ok) return false;
    setSaveStatus('success');
    setSaveMessage('Profile picture removed.');
    return true;
  }, [clearStatus, profilePicture.clearPhotoError, profilePicture.removeProfilePicture]);

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
            avatarUrl={profilePicture.profilePictureUrl}
            memberSince={memberSince}
            integrityScore={integrityScore}
            onUploadPhoto={handleUploadPhoto}
            onRemovePhoto={handleRemovePhoto}
            uploadingPhoto={profilePicture.uploading}
            removingPhoto={profilePicture.removing}
            photoError={profilePicture.photoError}
          />

          <ProfileStatsGrid stats={stats} loading={statsLoading} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <ProfileRecentResults results={recentResults} />
              <ProfileVerificationCard items={verificationItems} />
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
