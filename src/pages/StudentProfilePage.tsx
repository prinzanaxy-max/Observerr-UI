import { useCallback, useEffect, useMemo, useState } from 'react';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import ProfileHeroCard from '../components/student/profile/ProfileHeroCard';
import ResultsSummaryCards from '../components/student/results/ResultsSummaryCards';
import ProfileVerificationCard from '../components/student/profile/ProfileVerificationCard';
import ProfileRecentResults from '../components/student/profile/ProfileRecentResults';
import ProfileQuickLinks from '../components/student/profile/ProfileQuickLinks';
import SettingsAlert from '../components/student/settings/SettingsAlert';
import {
  PROFILE_QUICK_LINKS,
  buildVerificationItems,
  formatMemberSince,
} from '../data/studentProfileData';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useProfilePicture } from '../hooks/useProfilePicture';
import { useStudentSettings } from '../hooks/useStudentSettings';
import { useResultsSummary } from '../hooks/useResultsSummary';
import { getInitialsFromName } from '../lib/profileUtils';
import type { SaveStatus } from '../hooks/useAccountSettings';
import { useStudentResults } from '../hooks/useStudentResults';

const StudentProfilePage = () => {
  const searchQuery = '';
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const { institutionalId, email, user } = useAuthProfile();
  const { displayName, settings } = useStudentSettings();
  const {
    profilePictureUrl,
    uploading,
    removing,
    photoError,
    clearPhotoError,
    uploadProfilePicture,
    removeProfilePicture,
  } = useProfilePicture();
  const { stats, summaryCards, loading: statsLoading } = useResultsSummary();
  const { rows: resultRows } = useStudentResults();

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

  const integrityScore = stats.avgIntegrity;
  const memberSince = useMemo(() => formatMemberSince(user?.createdAt), [user?.createdAt]);

  const verificationItems = useMemo(
    () => buildVerificationItems(integrityScore),
    [integrityScore],
  );

  const recentResults = useMemo(
    () => {
      const query = searchQuery.trim().toLowerCase();
      return resultRows
        .filter((result) => !query || `${result.courseName} ${result.courseCode} ${result.examLabel}`.toLowerCase().includes(query))
        .slice(0, 4);
    },
    [resultRows, searchQuery],
  );


  const clearStatus = useCallback(() => {
    setSaveStatus('idle');
    setSaveMessage('');
  }, []);

  const handleUploadPhoto = useCallback(
    async (file: File) => {
      clearStatus();
      clearPhotoError();
      const result = await uploadProfilePicture(file);
      if (result === false) return false;
      setSaveStatus('success');
      setSaveMessage('Profile picture updated.');
      return true;
    },
    [clearPhotoError, clearStatus, uploadProfilePicture],
  );

  const handleRemovePhoto = useCallback(async () => {
    clearStatus();
    clearPhotoError();
    const ok = await removeProfilePicture();
    if (!ok) return false;
    setSaveStatus('success');
    setSaveMessage('Profile picture removed.');
    return true;
  }, [clearPhotoError, clearStatus, removeProfilePicture]);

  return (
    <StudentPortalLayout
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
            avatarUrl={profilePictureUrl}
            memberSince={memberSince}
            integrityScore={integrityScore}
            onUploadPhoto={handleUploadPhoto}
            onRemovePhoto={handleRemovePhoto}
            uploadingPhoto={uploading}
            removingPhoto={removing}
            photoError={photoError}
          />

          <ResultsSummaryCards cards={summaryCards} loading={statsLoading} />

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
