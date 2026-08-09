import { memo, useCallback, useRef, useState } from 'react';
import Icon from '../Icon';
import StudentAvatar from '../StudentAvatar';
import { PROFILE_IMAGE_ACCEPT } from '../../../lib/imageUtils';

type ProfilePhotoUploadProps = {
  avatarUrl?: string | null;
  initials: string;
  onUpload: (file: File) => Promise<boolean>;
  onRemove: () => Promise<boolean>;
  disabled?: boolean;
  uploading?: boolean;
  removing?: boolean;
  error?: string;
};

const ProfilePhotoUpload = memo(({
  avatarUrl,
  initials,
  onUpload,
  onRemove,
  disabled = false,
  uploading = false,
  removing = false,
  error = '',
}: ProfilePhotoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localUploading, setLocalUploading] = useState(false);

  const isBusy = uploading || removing || localUploading;

  const openPicker = useCallback(() => {
    if (!disabled && !isBusy) {
      inputRef.current?.click();
    }
  }, [disabled, isBusy]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setLocalUploading(true);
    try {
      await onUpload(file);
    } finally {
      setLocalUploading(false);
    }
  }, [onUpload]);

  const handleRemove = useCallback(async () => {
    await onRemove();
  }, [onRemove]);

  const showSpinner = isBusy;

  return (
    <div className="flex flex-col items-center sm:items-start gap-3">
      <div className="relative group">
        <StudentAvatar
          src={avatarUrl}
          initials={initials}
          size="lg"
          className="border-4 border-student-surface shadow-lg"
        />

        {showSpinner && (
          <div className="absolute inset-0 rounded-full bg-student-on-surface/40 flex items-center justify-center">
            <span className="auth-spinner" />
          </div>
        )}

        <button
          type="button"
          onClick={openPicker}
          disabled={disabled || isBusy}
          className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-student-primary text-student-on-primary flex items-center justify-center shadow-md hover:bg-student-primary-container transition-colors disabled:opacity-60"
          aria-label="Upload profile photo"
        >
          <Icon name="photo_camera" className="text-[18px]" />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={PROFILE_IMAGE_ACCEPT}
          onChange={(e) => void handleFileChange(e)}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled || isBusy}
          className="text-student-body-md font-student text-student-primary hover:underline disabled:opacity-60"
        >
          {avatarUrl ? 'Change photo' : 'Upload photo'}
        </button>
        {avatarUrl && (
          <>
            <span className="text-student-on-surface-variant" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => void handleRemove()}
              disabled={disabled || isBusy}
              className="text-student-body-md font-student text-student-error hover:underline disabled:opacity-60"
            >
              Remove photo
            </button>
          </>
        )}
      </div>

      {error && (
        <p className="text-student-label-md font-student text-student-error">{error}</p>
      )}
      <p className="text-student-label-md font-student text-student-on-surface-variant max-w-[220px] text-center sm:text-left">
        JPEG, PNG, WebP, or GIF · Max 5 MB
      </p>
    </div>
  );
});

ProfilePhotoUpload.displayName = 'ProfilePhotoUpload';

export default ProfilePhotoUpload;
