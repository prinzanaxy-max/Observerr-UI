import { useCallback, useEffect, useMemo, useState } from 'react';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import PortalSettingsNav from '../components/shared/PortalSettingsNav';
import SettingsAlert from '../components/student/settings/SettingsAlert';
import AccountSettingsForm from '../components/student/settings/AccountSettingsForm';
import NotificationSettingsPanel from '../components/student/settings/NotificationSettingsPanel';
import LecturerPrivacyPanel from '../components/lecturer/settings/LecturerPrivacyPanel';
import Icon from '../components/student/Icon';
import {
  LECTURER_NOTIFICATION_TOGGLES,
  LECTURER_PRIVACY_BULLETS,
  LECTURER_SETTINGS_TABS,
  filterLecturerSettingsTabs,
  type LecturerSettingsTab,
} from '../data/lecturerSettingsData';
import { useAccountSettings } from '../hooks/useAccountSettings';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useLecturerSettings } from '../hooks/useLecturerSettings';
import { usePushNotifications } from '../hooks/usePushNotifications';

const LecturerSettingsPage = () => {
  const { institutionalId, email, initials } = useAuthProfile();
  const [activeTab, setActiveTab] = useState<LecturerSettingsTab>('account');
  const [savingNotifications, setSavingNotifications] = useState(false);

  const accountSettings = useAccountSettings();
  const pushNotifications = usePushNotifications();
  const {
    settings,
    saveStatus: notificationSaveStatus,
    saveMessage: notificationSaveMessage,
    clearStatus: clearNotificationStatus,
    updateNotificationPref,
    saveAllNotifications,
  } = useLecturerSettings();

  const alertStatus = activeTab === 'account' ? accountSettings.saveStatus : notificationSaveStatus;
  const alertMessage = activeTab === 'account' ? accountSettings.saveMessage : notificationSaveMessage;
  const clearAlert = activeTab === 'account' ? accountSettings.clearStatus : clearNotificationStatus;

  useEffect(() => {
    document.title = 'Settings — Observerr Lecturer';
  }, []);

  const visibleTabs = useMemo(() => filterLecturerSettingsTabs(''), []);

  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [activeTab, visibleTabs]);

  const handleSaveNotifications = useCallback(
    async (...args: Parameters<typeof saveAllNotifications>) => {
      setSavingNotifications(true);
      try {
        return await saveAllNotifications(...args);
      } finally {
        setSavingNotifications(false);
      }
    },
    [saveAllNotifications],
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <>
            <AccountSettingsForm
              account={accountSettings.account}
              loading={accountSettings.loading}
              loadError={accountSettings.loadError}
              accountForm={accountSettings.accountForm}
              passwordForm={accountSettings.passwordForm}
              accountErrors={accountSettings.accountErrors}
              passwordErrors={accountSettings.passwordErrors}
              savingAccount={accountSettings.savingAccount}
              savingPassword={accountSettings.savingPassword}
              passwordRateLimited={accountSettings.passwordRateLimited}
              onAccountFieldChange={accountSettings.updateAccountField}
              onPasswordFieldChange={accountSettings.updatePasswordField}
              onSaveAccount={accountSettings.handleSaveAccount}
              onChangePassword={accountSettings.handleChangePassword}
              onRetryLoad={() => void accountSettings.reloadAccount()}
              initials={accountSettings.initials}
              profilePictureUrl={accountSettings.profilePictureUrl}
              uploadingPhoto={accountSettings.uploadingPhoto}
              removingPhoto={accountSettings.removingPhoto}
              photoError={accountSettings.photoError}
              onUploadProfilePicture={accountSettings.handleUploadProfilePicture}
              onRemoveProfilePicture={accountSettings.handleRemoveProfilePicture}
            />
            <LecturerPrivacyPanel bullets={LECTURER_PRIVACY_BULLETS} />
          </>
        );
      case 'notifications':
        return (
          <NotificationSettingsPanel
            preferences={settings.notifications}
            saving={savingNotifications}
            onToggle={updateNotificationPref}
            onSaveAll={handleSaveNotifications}
            pushStatus={pushNotifications.status}
            pushEnabled={pushNotifications.pushEnabled}
            pushErrorMessage={pushNotifications.errorMessage}
            onEnablePush={pushNotifications.requestNotificationPermission}
            onDisablePush={pushNotifications.disablePushNotifications}
            toggles={LECTURER_NOTIFICATION_TOGGLES}
          />
        );
      case 'privacy':
        return <LecturerPrivacyPanel bullets={LECTURER_PRIVACY_BULLETS} />;
      default:
        return null;
    }
  };

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      contentClassName="student-settings-bg relative"
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-[1200px] mx-auto w-full pb-24 md:pb-12">
        <div className="mb-4 pt-2">
          <h1 className="text-student-headline-md font-student text-student-on-background font-bold">Settings</h1>
          <p className="text-student-body-md font-student text-student-on-surface-variant mt-1">Manage your account, notification preferences, and privacy settings.</p>
        </div>

        <div className="mb-6">
          <SettingsAlert status={alertStatus} message={alertMessage} onDismiss={clearAlert} />
        </div>

        {visibleTabs.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-2xl student-exam-glass-card">
            <Icon name="search_off" className="text-[48px] text-student-outline mb-4 mx-auto" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">No settings found</h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant">
              Try searching for account, notifications, or privacy.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
              <div className="lg:hidden mb-4">
                <PortalSettingsNav
                  tabs={LECTURER_SETTINGS_TABS}
                  activeTab={activeTab}
                  visibleTabs={visibleTabs}
                  onTabChange={(tab) => setActiveTab(tab as LecturerSettingsTab)}
                  variant="mobile"
                />
              </div>
              <div className="hidden lg:block">
                <PortalSettingsNav
                  tabs={LECTURER_SETTINGS_TABS}
                  activeTab={activeTab}
                  visibleTabs={visibleTabs}
                  onTabChange={(tab) => setActiveTab(tab as LecturerSettingsTab)}
                />
              </div>
            </aside>

            <div className="flex-1 w-full flex flex-col gap-6 min-w-0">
              {renderTabContent()}
            </div>
          </div>
        )}
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerSettingsPage;
