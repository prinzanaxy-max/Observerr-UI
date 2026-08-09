import { memo } from 'react';

type SettingsTabConfig = {
  id: string;
  label: string;
};

type PortalSettingsNavProps = {
  tabs: SettingsTabConfig[];
  activeTab: string;
  visibleTabs: string[];
  onTabChange: (tab: string) => void;
  variant?: 'sidebar' | 'mobile';
};

const PortalSettingsNav = memo(({
  tabs,
  activeTab,
  visibleTabs,
  onTabChange,
  variant = 'sidebar',
}: PortalSettingsNavProps) => {
  const visible = tabs.filter((tab) => visibleTabs.includes(tab.id));

  if (variant === 'mobile') {
    return (
      <nav className="flex gap-2 overflow-x-auto pb-2 student-hide-scrollbar" aria-label="Settings sections">
        {visible.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-student-body-md font-student transition-colors ${
                isActive
                  ? 'bg-student-primary-container text-student-on-primary-container font-semibold'
                  : 'bg-student-surface text-student-on-surface-variant border border-student-outline-variant/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="student-exam-glass-card rounded-xl p-4" aria-label="Settings sections">
      <ul className="flex flex-col gap-1">
        {visible.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-student-body-md font-student transition-colors ${
                  isActive
                    ? 'bg-student-primary-container text-student-on-primary-container font-medium'
                    : 'text-student-on-surface-variant hover:bg-student-surface-container'
                }`}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

PortalSettingsNav.displayName = 'PortalSettingsNav';

export default PortalSettingsNav;
