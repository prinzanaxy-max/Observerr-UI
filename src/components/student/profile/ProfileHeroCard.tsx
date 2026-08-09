import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import ProfilePhotoUpload from './ProfilePhotoUpload';

type ProfileHeroCardProps = {
  displayName: string;
  institutionalId: string;
  email: string;
  initials: string;
  avatarUrl?: string | null;
  memberSince: string;
  integrityScore: number;
  onUploadPhoto: (file: File) => Promise<boolean>;
  onRemovePhoto: () => Promise<boolean>;
  uploadingPhoto?: boolean;
  removingPhoto?: boolean;
  photoError?: string;
};

const ProfileHeroCard = memo(({
  displayName,
  institutionalId,
  email,
  initials,
  avatarUrl,
  memberSince,
  integrityScore,
  onUploadPhoto,
  onRemovePhoto,
  uploadingPhoto = false,
  removingPhoto = false,
  photoError = '',
}: ProfileHeroCardProps) => (
  <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8 overflow-hidden relative">
    <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-student-primary-container/20 blur-3xl" />

    <div className="relative flex flex-col md:flex-row md:items-center gap-6">
      <ProfilePhotoUpload
        avatarUrl={avatarUrl}
        initials={initials}
        onUpload={onUploadPhoto}
        onRemove={onRemovePhoto}
        uploading={uploadingPhoto}
        removing={removingPhoto}
        error={photoError}
      />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h2 className="text-student-headline-md font-student text-student-on-background font-bold truncate">
            {displayName}
          </h2>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-student-primary-container/30 text-student-on-primary-container text-student-label-md font-student font-medium">
            <Icon name="school" filled className="text-[14px]" />
            Student
          </span>
        </div>

        <div className="space-y-1.5 text-student-body-md font-student text-student-on-surface-variant">
          <p className="flex items-center gap-2 min-w-0">
            <Icon name="badge" className="text-student-primary shrink-0" />
            <span className="truncate">{institutionalId}</span>
          </p>
          {email && (
            <p className="flex items-center gap-2 min-w-0">
              <Icon name="mail" className="text-student-primary shrink-0" />
              <span className="truncate">{email}</span>
            </p>
          )}
          <p className="flex items-center gap-2">
            <Icon name="calendar_month" className="text-student-primary shrink-0" />
            Member since {memberSince}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
        <div className="text-center sm:text-right px-4 py-3 rounded-xl bg-student-surface-container-low border border-student-outline-variant/30">
          <p className="text-student-label-md font-student text-student-on-surface-variant">Integrity Score</p>
          <p className="text-student-headline-md font-student font-bold text-student-primary">{integrityScore}%</p>
        </div>
        <Link
          to="/student/settings"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-student-primary text-student-primary text-student-body-md font-student font-medium hover:bg-student-primary/5 transition-colors"
        >
          <Icon name="edit" className="text-[18px]" />
          Edit Profile
        </Link>
      </div>
    </div>
  </section>
));

ProfileHeroCard.displayName = 'ProfileHeroCard';

export default ProfileHeroCard;
