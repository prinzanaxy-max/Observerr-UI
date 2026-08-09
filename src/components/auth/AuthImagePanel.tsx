import { memo } from 'react';
import Icon from '../student/Icon';
import { AUTH_IMAGES } from '../../data/authPageData';

type AuthImagePanelProps = {
  mode: 'signin' | 'signup';
};

const AuthImagePanel = memo(({ mode }: AuthImagePanelProps) => (
  <div className="hidden lg:block lg:w-1/2 relative bg-student-surface-container overflow-hidden min-h-[320px] lg:min-h-0">
    <div className="absolute inset-0 bg-student-primary/20 z-10 mix-blend-multiply pointer-events-none" />
    <img
      src={mode === 'signin' ? AUTH_IMAGES.signIn : AUTH_IMAGES.signUp}
      alt=""
      className="absolute inset-0 w-full h-full object-cover z-0"
    />

    {mode === 'signup' && (
      <div className="absolute bottom-12 left-12 z-20 auth-glass-panel p-6 rounded-xl max-w-sm">
        <p className="text-student-headline-sm font-student text-student-on-surface mb-2">Secure Assessment.</p>
        <p className="text-student-body-md font-student text-student-on-surface-variant">
          Experience a new standard in academic integrity with our advanced monitoring tools.
        </p>
      </div>
    )}
  </div>
));

AuthImagePanel.displayName = 'AuthImagePanel';

type PasswordToggleProps = {
  show: boolean;
  onToggle: () => void;
};

export const PasswordToggle = memo(({ show, onToggle }: PasswordToggleProps) => (
  <button
    type="button"
    onClick={onToggle}
    tabIndex={-1}
    className="text-student-outline hover:text-student-primary transition-colors"
    aria-label={show ? 'Hide password' : 'Show password'}
  >
    <Icon name={show ? 'visibility_off' : 'visibility'} />
  </button>
));

PasswordToggle.displayName = 'PasswordToggle';

export default AuthImagePanel;
