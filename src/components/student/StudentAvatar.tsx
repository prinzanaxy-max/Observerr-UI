import { memo, useEffect, useState } from 'react';
import { resolveProfilePictureUrl } from '../../lib/profileUtils';

const sizeClasses = {
  xs: 'w-8 h-8 text-xs',
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-24 h-24 sm:w-28 sm:h-28 text-3xl',
} as const;

type StudentAvatarProps = {
  src?: string | null;
  initials: string;
  size?: keyof typeof sizeClasses;
  className?: string;
  alt?: string;
};

const StudentAvatar = memo(({
  src,
  initials,
  size = 'md',
  className = '',
  alt = 'Profile photo',
}: StudentAvatarProps) => {
  const sizeClass = sizeClasses[size];
  const resolvedSrc = resolveProfilePictureUrl(src);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [resolvedSrc]);

  if (resolvedSrc && !imageFailed) {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        onError={() => setImageFailed(true)}
        className={`${sizeClass} rounded-full object-cover border border-student-outline-variant shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full shrink-0 bg-gradient-to-br from-student-primary to-student-primary-container flex items-center justify-center text-student-on-primary font-bold border border-student-outline-variant ${className}`}
      aria-hidden={alt === 'Profile photo' ? true : undefined}
    >
      {initials}
    </div>
  );
});

StudentAvatar.displayName = 'StudentAvatar';

export default StudentAvatar;
