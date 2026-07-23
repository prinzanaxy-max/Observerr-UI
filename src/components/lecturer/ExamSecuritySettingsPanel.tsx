import { memo } from 'react';
import Icon from '../student/Icon';
import type { SecuritySettingKey } from '../../data/createExamData';
import { SECURITY_SETTINGS } from '../../data/createExamData';

type ExamSecuritySettingsPanelProps = {
  security: Record<SecuritySettingKey, boolean>;
  draftSavedLabel: string;
  onToggle: (key: SecuritySettingKey) => void;
};

const ExamSecuritySettingsPanel = memo(({
  security,
  draftSavedLabel,
  onToggle,
}: ExamSecuritySettingsPanelProps) => (
  <aside className="bg-student-surface rounded-2xl p-6 lecturer-card-elevation border border-student-surface-container/50 sticky top-6">
    <h2 className="text-student-headline-sm font-student font-semibold mb-6 flex items-center gap-2">
      <Icon name="security" className="text-student-primary" />
      Security Settings
    </h2>

    <div className="space-y-2">
      {SECURITY_SETTINGS.map((setting) => (
        <div
          key={setting.key}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-student-surface-container-lowest transition-colors group border border-transparent hover:border-student-surface-container gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform ${setting.iconBgClass} ${setting.iconTextClass}`}>
              <Icon name={setting.icon} />
            </div>
            <div className="min-w-0">
              <p className="font-student text-student-body-lg font-medium text-student-on-surface">{setting.label}</p>
              <p className="font-student text-student-label-md text-student-on-surface-variant">{setting.description}</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={security[setting.key]}
              onChange={() => onToggle(setting.key)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-student-surface-container-highest rounded-full peer peer-checked:bg-student-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
          </label>
        </div>
      ))}
    </div>

    <div className="mt-8 pt-6 border-t border-student-surface-container">
      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-student-primary to-student-primary-fixed text-student-on-primary rounded-xl font-student text-student-headline-sm font-bold shadow-[0_4px_16px_rgba(43,108,0,0.25)] hover:shadow-[0_8px_24px_rgba(43,108,0,0.35)] hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
      >
        Publish Exam
        <Icon name="send" />
      </button>
      <p className="text-center font-student text-student-label-md text-student-on-surface-variant mt-4">
        {draftSavedLabel}
      </p>
    </div>
  </aside>
));

ExamSecuritySettingsPanel.displayName = 'ExamSecuritySettingsPanel';

export default ExamSecuritySettingsPanel;
