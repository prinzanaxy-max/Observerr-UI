import { memo, useCallback, useEffect, useState, type FormEvent } from 'react';
import { PasswordToggle } from '../../auth/AuthImagePanel';
import Icon from '../Icon';
import SettingsField from './SettingsField';
import type { PasswordChangeInput, StudentSettingsProfile } from '../../../data/studentSettingsData';

type AccountSettingsFormProps = {
  profile: StudentSettingsProfile;
  email: string;
  institutionalId: string;
  saving: boolean;
  onSave: (profile: StudentSettingsProfile, password?: PasswordChangeInput) => Promise<boolean>;
};

const AccountSettingsForm = memo(({
  profile,
  email,
  institutionalId,
  saving,
  onSave,
}: AccountSettingsFormProps) => {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  useEffect(() => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
  }, [profile.firstName, profile.lastName]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const success = await onSave(
      { firstName: firstName.trim(), lastName: lastName.trim() },
      { currentPassword, newPassword, confirmPassword },
    );
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [confirmPassword, currentPassword, firstName, lastName, newPassword, onSave]);

  return (
    <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
      <div className="mb-6">
        <h3 className="text-student-headline-sm font-student text-student-on-surface mb-1">Account Information</h3>
        <p className="text-student-body-md font-student text-student-on-surface-variant">
          Update your personal details and how we can reach you.
        </p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingsField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            required
          />
          <SettingsField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>

        <SettingsField
          label="Institutional ID"
          value={institutionalId}
          disabled
          hint="Your institutional ID is managed by your university and cannot be changed."
        />

        <SettingsField
          label="Email Address"
          type="email"
          icon="mail"
          value={email || '—'}
          disabled
          hint="Institutional email cannot be changed."
        />

        <div className="pt-4 border-t border-student-surface-container-high">
          <h4 className="text-student-headline-sm font-student text-student-on-surface mb-4">Security</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="current-password" className="text-student-label-md font-student text-student-on-surface">
                Current Password
              </label>
              <div className="relative">
                <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none" />
                <input
                  id="current-password"
                  type={showCurrentPw ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-student-outline-variant bg-student-surface focus:border-student-primary focus:ring-1 focus:ring-student-primary outline-none transition-all text-student-body-md font-student"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <PasswordToggle show={showCurrentPw} onToggle={() => setShowCurrentPw((v) => !v)} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-student-label-md font-student text-student-on-surface">
                  New Password
                </label>
                <div className="relative">
                  <Icon name="key" className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none" />
                  <input
                    id="new-password"
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-student-outline-variant bg-student-surface focus:border-student-primary focus:ring-1 focus:ring-student-primary outline-none transition-all text-student-body-md font-student"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <PasswordToggle show={showNewPw} onToggle={() => setShowNewPw((v) => !v)} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-student-label-md font-student text-student-on-surface">
                  Confirm Password
                </label>
                <div className="relative">
                  <Icon name="key" className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none" />
                  <input
                    id="confirm-password"
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-student-outline-variant bg-student-surface focus:border-student-primary focus:ring-1 focus:ring-student-primary outline-none transition-all text-student-body-md font-student"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <PasswordToggle show={showConfirmPw} onToggle={() => setShowConfirmPw((v) => !v)} />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-student-label-md font-student text-student-on-surface-variant">
              Leave password fields blank if you only want to update your name.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-student-primary text-student-on-primary text-student-body-md font-student font-bold shadow-[0_0_15px_rgba(43,108,0,0.3)] hover:shadow-[0_0_20px_rgba(43,108,0,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <span className="auth-spinner" />}
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
});

AccountSettingsForm.displayName = 'AccountSettingsForm';

export default AccountSettingsForm;
