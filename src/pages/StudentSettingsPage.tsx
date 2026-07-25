import { useCallback, useEffect, useMemo, useState } from 'react';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import SettingsNav from '../components/student/settings/SettingsNav';
import SettingsAlert from '../components/student/settings/SettingsAlert';
import AccountSettingsForm from '../components/student/settings/AccountSettingsForm';
import NotificationSettingsPanel from '../components/student/settings/NotificationSettingsPanel';
import PrivacyMonitoringPanel from '../components/student/settings/PrivacyMonitoringPanel';
import SupportPanel from '../components/student/settings/SupportPanel';
import Icon from '../components/student/Icon';
import { filterSettingsTabs, type SettingsTab } from '../data/studentSettingsData';
import { useAccountSettings } from '../hooks/useAccountSettings';
import { useStudentSettings } from '../hooks/useStudentSettings';

const StudentSettingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [savingNotifications, setSavingNotifications] = useState(false);

  const accountSettings = useAccountSettings();

  const {
    settings,
    saveStatus: notificationSaveStatus,
    saveMessage: notificationSaveMessage,
    clearStatus: clearNotificationStatus,
    updateNotificationPref,
    saveAllNotifications,
  } = useStudentSettings();

  const alertStatus = activeTab === 'account' ? accountSettings.saveStatus : notificationSaveStatus;
  const alertMessage = activeTab === 'account' ? accountSettings.saveMessage : notificationSaveMessage;
  const clearAlert = activeTab === 'account' ? accountSettings.clearStatus : clearNotificationStatus;

  useEffect(() => {
    document.title = 'Settings — Observerr';
  }, []);

  const visibleTabs = useMemo(() => filterSettingsTabs(searchQuery), [searchQuery]);

  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [activeTab, visibleTabs]);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);

  const handleSaveNotifications = useCallback(async (...args: Parameters<typeof saveAllNotifications>) => {
    setSavingNotifications(true);
    try {
      return await saveAllNotifications(...args);
    } finally {
      setSavingNotifications(false);
    }
  }, [saveAllNotifications]);

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
            />
            <PrivacyMonitoringPanel />
          </>
        );
      case 'notifications':
        return (
          <NotificationSettingsPanel
            preferences={settings.notifications}
            saving={savingNotifications}
            onToggle={updateNotificationPref}
            onSaveAll={handleSaveNotifications}
          />
        );
      case 'privacy':
        return <PrivacyMonitoringPanel />;
      case 'support':
        return <SupportPanel />;
      default:
        return null;
    }
  };

  return (
    <StudentPortalLayout
      title="Settings"
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search settings..."
      contentClassName="student-settings-bg relative"
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-[1200px] mx-auto w-full pb-24 md:pb-12">
        <div className="md:hidden mb-4 pt-2">
          <h1 className="text-student-headline-md font-student text-student-on-background font-bold">Settings</h1>
        </div>

        <div className="mb-6">
          <SettingsAlert status={alertStatus} message={alertMessage} onDismiss={clearAlert} />
        </div>

        {visibleTabs.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-2xl student-exam-glass-card">
            <Icon name="search_off" className="text-[48px] text-student-outline mb-4 mx-auto" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">No settings found</h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant">
              Try searching for account, notifications, privacy, or support.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
              <div className="lg:hidden mb-4">
                <SettingsNav
                  activeTab={activeTab}
                  visibleTabs={visibleTabs}
                  onTabChange={setActiveTab}
                  variant="mobile"
                />
              </div>
              <div className="hidden lg:block">
                <SettingsNav
                  activeTab={activeTab}
                  visibleTabs={visibleTabs}
                  onTabChange={setActiveTab}
                />
              </div>
            </aside>

            <div className="flex-1 w-full flex flex-col gap-6 min-w-0">
              {renderTabContent()}
            </div>
          </div>
        )}
      </div>
    </StudentPortalLayout>
  );
};

export default StudentSettingsPage;
