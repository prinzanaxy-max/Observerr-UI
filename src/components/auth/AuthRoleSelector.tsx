import { memo } from 'react';
import Icon from '../student/Icon';

type AuthRoleSelectorProps = {
  selected: 'student' | 'lecturer' | null;
  onSelect: (role: 'student' | 'lecturer') => void;
  error?: string;
};

const AuthRoleSelector = memo(({ selected, onSelect, error }: AuthRoleSelectorProps) => (
  <div>
    <label className="block text-student-label-md font-student text-student-on-surface-variant mb-2">
      I am a
    </label>
    <div className="flex gap-2.5">
      {([
        { role: 'student' as const, icon: 'school', label: 'Student' },
        { role: 'lecturer' as const, icon: 'cast_for_education', label: 'Lecturer' },
      ]).map(({ role, icon, label }) => (
        <button
          key={role}
          type="button"
          onClick={() => onSelect(role)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-student text-student-body-md font-semibold transition-all ${
            selected === role
              ? 'bg-student-primary text-student-on-primary border-student-primary shadow-[0_4px_14px_rgba(43,108,0,0.25)]'
              : 'bg-student-surface-container-lowest text-student-on-surface border-student-outline-variant hover:border-student-primary/50'
          }`}
        >
          <Icon name={icon} filled={selected === role} />
          {label}
        </button>
      ))}
    </div>
    {error && (
      <p className="mt-1.5 text-student-error text-student-label-md font-student flex items-center gap-1">
        <Icon name="error" className="text-sm" />
        {error}
      </p>
    )}
  </div>
));

AuthRoleSelector.displayName = 'AuthRoleSelector';

export default AuthRoleSelector;
