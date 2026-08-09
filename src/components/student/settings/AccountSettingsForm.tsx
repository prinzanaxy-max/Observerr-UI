import { memo, useState, type FormEvent } from 'react';
import { PasswordToggle } from '../../auth/AuthImagePanel';
import Icon from '../Icon';
import SettingsField from './SettingsField';
import ProfilePhotoUpload from '../profile/ProfilePhotoUpload';
import { PASSWORD_POLICY_HINT } from '../../../lib/accountValidation';
import type { AccountResponse } from '../../../types/account';

type AccountSettingsFormProps = {
  account: AccountResponse | null;
  loading: boolean;
  loadError: string;
  accountForm: { firstName: string; lastName: string };
  passwordForm: { currentPassword: string; newPassword: string; confirmPassword: string };
  accountErrors: Record<string, string>;
  passwordErrors: Record<string, string>;
  savingAccount: boolean;
  savingPassword: boolean;
  passwordRateLimited: boolean;
  onAccountFieldChange: (field: 'firstName' | 'lastName', value: string) => void;
  onPasswordFieldChange: (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => void;
  onSaveAccount: () => Promise<boolean>;
  onChangePassword: () => Promise<boolean>;
  onRetryLoad: () => void;
  initials: string;
  profilePictureUrl?: string | null;
  uploadingPhoto?: boolean;
  removingPhoto?: boolean;
  photoError?: string;
  onUploadProfilePicture: (file: File) => Promise<boolean>;
  onRemoveProfilePicture: () => Promise<boolean>;
};

const AccountSettingsSkeleton = memo(() => (
  <div className="space-y-6 max-w-2xl animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-20 rounded-lg bg-student-surface-container-high" />
      <div className="h-20 rounded-lg bg-student-surface-container-high" />
    </div>
    <div className="h-20 rounded-lg bg-student-surface-container-high" />
    <div className="h-20 rounded-lg bg-student-surface-container-high" />
  </div>
));

AccountSettingsSkeleton.displayName = 'AccountSettingsSkeleton';

const AccountSettingsForm = memo(({
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
  onAccountFieldChange,
  onPasswordFieldChange,
  onSaveAccount,
  onChangePassword,
  onRetryLoad,
  initials,
  profilePictureUrl,
  uploadingPhoto = false,
  removingPhoto = false,
  photoError = '',
  onUploadProfilePicture,
  onRemoveProfilePicture,
}: AccountSettingsFormProps) => {
  const handleAccountSubmit = (e: FormEvent) => {
    e.preventDefault();
    void onSaveAccount();
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    void onChangePassword();
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="text-student-headline-sm font-student text-student-on-surface mb-1">Account Information</h3>
          <p className="text-student-body-md font-student text-student-on-surface-variant">
            Update your personal details and how we can reach you.
          </p>
        </div>

        {loading ? (
          <AccountSettingsSkeleton />
        ) : loadError ? (
          <div className="text-center py-8">
            <p className="text-student-body-md font-student text-student-error mb-4">{loadError}</p>
            <button
              type="button"
              onClick={onRetryLoad}
              className="px-5 py-2 rounded-full border border-student-primary text-student-primary text-student-body-md font-student hover:bg-student-primary/5"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-8 max-w-2xl">
            <ProfilePhotoUpload
              avatarUrl={profilePictureUrl}
              initials={initials}
              onUpload={onUploadProfilePicture}
              onRemove={onRemoveProfilePicture}
              disabled={savingAccount}
              uploading={uploadingPhoto}
              removing={removingPhoto}
              error={photoError}
            />

            <form onSubmit={handleAccountSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingsField
                label="First Name"
                value={accountForm.firstName}
                onChange={(e) => onAccountFieldChange('firstName', e.target.value)}
                autoComplete="given-name"
                maxLength={50}
                required
                error={accountErrors.firstName}
              />
              <SettingsField
                label="Last Name"
                value={accountForm.lastName}
                onChange={(e) => onAccountFieldChange('lastName', e.target.value)}
                autoComplete="family-name"
                maxLength={50}
                required
                error={accountErrors.lastName}
              />
            </div>

            <SettingsField
              label="Institutional ID"
              value={account?.institutionalId ?? ''}
              disabled
              readOnly
              hint="Your institutional ID is managed by your university and cannot be changed."
            />

            <SettingsField
              label="Email Address"
              type="email"
              icon="mail"
              value={account?.email ?? ''}
              disabled
              readOnly
              hint="Institutional email cannot be changed."
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingAccount}
                className="px-6 py-2.5 rounded-full bg-student-primary text-student-on-primary text-student-body-md font-student font-bold shadow-[0_0_15px_rgba(43,108,0,0.3)] hover:shadow-[0_0_20px_rgba(43,108,0,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingAccount && <span className="auth-spinner" />}
                Save Changes
              </button>
            </div>
            </form>
          </div>
        )}
      </section>

      <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="text-student-headline-sm font-student text-student-on-surface mb-1">Security</h3>
          <p className="text-student-body-md font-student text-student-on-surface-variant">
            Change your password. You will be signed out after a successful update.
          </p>
        </div>

        {passwordRateLimited && (
          <div className="mb-4 rounded-xl px-4 py-3 bg-student-secondary-container/30 border border-student-secondary/30 text-student-on-secondary-container text-student-body-md font-student">
            Too many password attempts. Please wait before trying again.
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <label htmlFor="current-password" className="text-student-label-md font-student text-student-on-surface">
              Current Password
            </label>
            <div className="relative">
              <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none" />
              <input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => onPasswordFieldChange('currentPassword', e.target.value)}
                autoComplete="current-password"
                disabled={savingPassword || passwordRateLimited || loading}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-student-surface focus:border-student-primary focus:ring-1 focus:ring-student-primary outline-none transition-all text-student-body-md font-student disabled:opacity-60 ${
                  passwordErrors.currentPassword ? 'border-student-error' : 'border-student-outline-variant'
                }`}
              />
            </div>
            {passwordErrors.currentPassword && (
              <p className="text-student-label-md font-student text-student-error">{passwordErrors.currentPassword}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PasswordField
              id="new-password"
              label="New Password"
              icon="key"
              value={passwordForm.newPassword}
              onChange={(v) => onPasswordFieldChange('newPassword', v)}
              error={passwordErrors.newPassword}
              disabled={savingPassword || passwordRateLimited || loading}
            />
            <PasswordField
              id="confirm-password"
              label="Confirm Password"
              icon="key"
              value={passwordForm.confirmPassword}
              onChange={(v) => onPasswordFieldChange('confirmPassword', v)}
              error={passwordErrors.confirmPassword}
              disabled={savingPassword || passwordRateLimited || loading}
            />
          </div>

          <p className="text-student-label-md font-student text-student-on-surface-variant">
            {PASSWORD_POLICY_HINT}
          </p>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPassword || passwordRateLimited || loading}
              className="px-6 py-2.5 rounded-full border border-student-primary text-student-primary text-student-body-md font-student font-bold hover:bg-student-primary/5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {savingPassword && <span className="auth-spinner auth-spinner-dark" />}
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
});

type PasswordFieldProps = {
  id: string;
  label: string;
  icon: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

const PasswordField = memo(({ id, label, icon, value, onChange, error, disabled }: PasswordFieldProps) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-student-label-md font-student text-student-on-surface">
        {label}
      </label>
      <div className="relative">
        <Icon name={icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="new-password"
          disabled={disabled}
          className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-student-surface focus:border-student-primary focus:ring-1 focus:ring-student-primary outline-none transition-all text-student-body-md font-student disabled:opacity-60 ${
            error ? 'border-student-error' : 'border-student-outline-variant'
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <PasswordToggle show={show} onToggle={() => setShow((v) => !v)} />
        </div>
      </div>
      {error && <p className="text-student-label-md font-student text-student-error">{error}</p>}
    </div>
  );
});

PasswordField.displayName = 'PasswordField';

AccountSettingsForm.displayName = 'AccountSettingsForm';

export default AccountSettingsForm;
