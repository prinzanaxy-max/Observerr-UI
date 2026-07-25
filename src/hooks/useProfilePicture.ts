import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mapAccountApiError } from '../lib/accountErrors';
import { validateProfileImage } from '../lib/imageUtils';
import * as accountService from '../services/accountService';
import useAuthStore from '../store/authStore';

export function useProfilePicture(initialUrl?: string | null) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);
  const updateProfilePicture = useAuthStore((s) => s.updateProfilePicture);
  const authPictureUrl = useAuthStore((s) => s.user?.profilePictureUrl ?? null);

  const [localPictureUrl, setLocalPictureUrl] = useState<string | null | undefined>(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [photoError, setPhotoError] = useState('');

  const profilePictureUrl =
    localPictureUrl !== undefined ? localPictureUrl : authPictureUrl;

  const syncPictureUrl = useCallback(
    (url: string | null) => {
      setLocalPictureUrl(url);
      updateProfilePicture(url);
    },
    [updateProfilePicture],
  );

  const uploadProfilePicture = useCallback(
    async (file: File): Promise<string | null | false> => {
      setPhotoError('');

      const validation = validateProfileImage(file);
      if (!validation.ok) {
        setPhotoError(validation.message);
        return false;
      }

      setUploading(true);
      try {
        const result = await accountService.uploadProfilePicture(file);
        syncPictureUrl(result.profilePictureUrl);
        return result.profilePictureUrl;
      } catch (err) {
        const mapped = mapAccountApiError(err);
        if (mapped.unauthorized) {
          clearAuth();
          navigate('/login', { replace: true });
          return false;
        }
        setPhotoError(mapped.fieldErrors.file ?? mapped.message);
        return false;
      } finally {
        setUploading(false);
      }
    },
    [clearAuth, navigate, syncPictureUrl],
  );

  const removeProfilePicture = useCallback(async (): Promise<boolean> => {
    setPhotoError('');
    setRemoving(true);
    try {
      const result = await accountService.removeProfilePicture();
      syncPictureUrl(result.profilePictureUrl);
      return true;
    } catch (err) {
      const mapped = mapAccountApiError(err);
      if (mapped.unauthorized) {
        clearAuth();
        navigate('/login', { replace: true });
        return false;
      }
      setPhotoError(mapped.message);
      return false;
    } finally {
      setRemoving(false);
    }
  }, [clearAuth, navigate, syncPictureUrl]);

  const clearPhotoError = useCallback(() => setPhotoError(''), []);

  return {
    profilePictureUrl,
    uploading,
    removing,
    photoError,
    clearPhotoError,
    uploadProfilePicture,
    removeProfilePicture,
    syncPictureUrl,
  };
}
