import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { mapAccountApiError } from '../lib/accountErrors';
import { validateAccountForm, validatePasswordForm } from '../lib/accountValidation';
import { syncProfileNamesToLocalSettings } from '../lib/studentSettingsSync';
import { getInitialsFromName } from '../lib/profileUtils';
import * as accountService from '../services/accountService';
import type { AccountResponse, ChangePasswordRequest } from '../types/account';
import { useProfilePicture } from './useProfilePicture';

export type SaveStatus = 'idle' | 'success' | 'error';

const emptyPasswordForm = (): ChangePasswordRequest => ({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

export function useAccountSettings() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);
  const updateProfilePicture = useAuthStore((s) => s.updateProfilePicture);

  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [accountForm, setAccountForm] = useState({ firstName: '', lastName: '' });
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>(emptyPasswordForm);

  const [accountErrors, setAccountErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordRateLimited, setPasswordRateLimited] = useState(false);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const profilePicture = useProfilePicture(account?.profilePictureUrl);

  const initials = getInitialsFromName(
    account?.firstName,
    account?.lastName,
    account?.institutionalId,
  );

  const clearStatus = useCallback(() => {
    setSaveStatus('idle');
    setSaveMessage('');
  }, []);

  const loadAccount = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await accountService.fetchAccount();
      setAccount(data);
      setAccountForm({
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
      });
      profilePicture.syncPictureUrl(data.profilePictureUrl ?? null);
      updateProfilePicture(data.profilePictureUrl ?? null);
    } catch (err) {
      const mapped = mapAccountApiError(err);
      if (mapped.unauthorized) {
        clearAuth();
        navigate('/login', { replace: true });
        return;
      }
      setLoadError(mapped.message);
    } finally {
      setLoading(false);
    }
  }, [clearAuth, navigate, profilePicture.syncPictureUrl, updateProfilePicture]);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  const handleSaveAccount = useCallback(async () => {
    clearStatus();
    setAccountErrors({});

    const payload = {
      firstName: accountForm.firstName.trim(),
      lastName: accountForm.lastName.trim(),
    };

    const clientErrors = validateAccountForm(payload);
    if (Object.keys(clientErrors).length > 0) {
      setAccountErrors(clientErrors);
      return false;
    }

    setSavingAccount(true);
    try {
      const updated = await accountService.updateAccount(payload);
      setAccount(updated);
      setAccountForm({
        firstName: updated.firstName ?? '',
        lastName: updated.lastName ?? '',
      });
      syncProfileNamesToLocalSettings(
        updated.institutionalId,
        updated.email,
        updated.firstName ?? '',
        updated.lastName ?? '',
      );
      setSaveStatus('success');
      setSaveMessage('Profile updated successfully.');
      return true;
    } catch (err) {
      const mapped = mapAccountApiError(err);
      if (mapped.unauthorized) {
        clearAuth();
        navigate('/login', { replace: true });
        return false;
      }
      setAccountErrors(mapped.fieldErrors);
      setSaveStatus('error');
      setSaveMessage(mapped.message);
      return false;
    } finally {
      setSavingAccount(false);
    }
  }, [accountForm.firstName, accountForm.lastName, clearAuth, clearStatus, navigate]);

  const handleChangePassword = useCallback(async () => {
    clearStatus();
    setPasswordErrors({});

    const clientErrors = validatePasswordForm(passwordForm);
    if (Object.keys(clientErrors).length > 0) {
      setPasswordErrors(clientErrors);
      return false;
    }

    setSavingPassword(true);
    try {
      await accountService.changePassword(passwordForm);
      setPasswordForm(emptyPasswordForm());
      clearAuth();
      navigate('/login', { replace: true });
      return true;
    } catch (err) {
      const mapped = mapAccountApiError(err);
      if (mapped.rateLimited) {
        setPasswordRateLimited(true);
      }
      if (mapped.unauthorized && Object.keys(mapped.fieldErrors).length === 0) {
        clearAuth();
        navigate('/login', { replace: true });
        return false;
      }
      setPasswordErrors(mapped.fieldErrors);
      setSaveStatus('error');
      setSaveMessage(mapped.message);
      return false;
    } finally {
      setSavingPassword(false);
    }
  }, [clearAuth, clearStatus, navigate, passwordForm]);

  const updateAccountField = useCallback((field: 'firstName' | 'lastName', value: string) => {
    setAccountForm((prev) => ({ ...prev, [field]: value }));
    setAccountErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const updatePasswordField = useCallback((field: keyof ChangePasswordRequest, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleUploadProfilePicture = useCallback(
    async (file: File) => {
      clearStatus();
      profilePicture.clearPhotoError();
      const result = await profilePicture.uploadProfilePicture(file);
      if (result === false) return false;
      setAccount((prev) => (prev ? { ...prev, profilePictureUrl: result } : prev));
      setSaveStatus('success');
      setSaveMessage('Profile picture updated.');
      return true;
    },
    [
      clearStatus,
      profilePicture.clearPhotoError,
      profilePicture.uploadProfilePicture,
    ],
  );

  const handleRemoveProfilePicture = useCallback(async () => {
    clearStatus();
    profilePicture.clearPhotoError();
    const ok = await profilePicture.removeProfilePicture();
    if (!ok) return false;
    setAccount((prev) => (prev ? { ...prev, profilePictureUrl: null } : prev));
    setSaveStatus('success');
    setSaveMessage('Profile picture removed.');
    return true;
  }, [clearStatus, profilePicture.clearPhotoError, profilePicture.removeProfilePicture]);

  return {
    account,
    loading,
    loadError,
    accountForm,
    passwordForm,
    accountErrors,
    passwordErrors,
    savingAccount,
    savingPassword,
    passwordRateLimited,
    saveStatus,
    saveMessage,
    clearStatus,
    reloadAccount: loadAccount,
    updateAccountField,
    updatePasswordField,
    handleSaveAccount,
    handleChangePassword,
    initials,
    profilePictureUrl: profilePicture.profilePictureUrl,
    uploadingPhoto: profilePicture.uploading,
    removingPhoto: profilePicture.removing,
    photoError: profilePicture.photoError,
    handleUploadProfilePicture,
    handleRemoveProfilePicture,
  };
}
