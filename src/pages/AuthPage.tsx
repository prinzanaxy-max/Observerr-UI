import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import type { ApiError, UserRole } from '../types/auth';
import AuthBrandMark, { AuthField } from '../components/auth/AuthBrandMark';
import AuthImagePanel, { PasswordToggle } from '../components/auth/AuthImagePanel';
import AuthRoleSelector from '../components/auth/AuthRoleSelector';
import Icon from '../components/student/Icon';

const AuthSubmitButton = ({
  loading,
  label,
  loadingLabel,
  variant = 'vivid',
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
  variant?: 'vivid' | 'brand';
}) => (
  <button
    type="submit"
    disabled={loading}
    className={`w-full flex justify-center items-center gap-2 rounded-full py-3 px-4 font-student text-student-headline-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${
      variant === 'vivid'
        ? 'auth-vivid-gradient text-student-on-primary shadow-[0_4px_14px_0_rgba(43,108,0,0.39)] hover:shadow-[0_6px_20px_rgba(43,108,0,0.23)] hover:scale-[1.02]'
        : 'auth-gradient-brand text-student-on-surface auth-btn-glow hover:opacity-90'
    }`}
  >
    {loading ? (
      <>
        <span className="auth-spinner auth-spinner-dark" />
        {loadingLabel}
      </>
    ) : (
      label
    )}
  </button>
);

const mapConflictError = (message: string): Record<string, string> => {
  const lower = message.toLowerCase();
  if (lower.includes('institutional id')) {
    return { institutionalId: 'Institutional ID already registered' };
  }
  if (lower.includes('email')) {
    return { email: 'Email already registered' };
  }
  return { institutionalId: message };
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, isAuthenticated, role: currentRole } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [formKey, setFormKey] = useState(0);

  const [siInstitutionalId, setSiInstitutionalId] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siShowPw, setSiShowPw] = useState(false);
  const [siErrors, setSiErrors] = useState<Record<string, string>>({});
  const [siLoading, setSiLoading] = useState(false);

  const [suInstitutionalId, setSuInstitutionalId] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suRole, setSuRole] = useState<'student' | 'lecturer' | null>(null);
  const [suShowPw, setSuShowPw] = useState(false);
  const [suErrors, setSuErrors] = useState<Record<string, string>>({});
  const [suLoading, setSuLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && currentRole) {
      const dest =
        currentRole === 'STUDENT' ? '/student'
        : currentRole === 'LECTURER' ? '/lecturer'
        : '/dashboard';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, currentRole, navigate]);

  useEffect(() => {
    document.title = isSignUp ? 'OBSERVERR — Create Account' : 'OBSERVERR — Sign In';
  }, [isSignUp]);

  const swap = useCallback((toSignUp: boolean) => {
    setIsSignUp(toSignUp);
    setFormKey((k) => k + 1);
    setSiErrors({});
    setSuErrors({});
    navigate(toSignUp ? '/auth?mode=signup' : '/auth', { replace: true });
  }, [navigate]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!siInstitutionalId.trim()) errs.institutionalId = 'Institutional ID is required';
    if (!siPassword) errs.password = 'Password is required';
    else if (siPassword.length < 8) errs.password = 'Password must be at least 8 characters';
    setSiErrors(errs);
    if (Object.keys(errs).length) return;

    setSiLoading(true);
    try {
      await login({
        institutionalId: siInstitutionalId.trim(),
        password: siPassword,
      });
      const role = useAuthStore.getState().role;
      navigate(
        role === 'STUDENT' ? '/student' : role === 'LECTURER' ? '/lecturer' : '/dashboard',
        { replace: true },
      );
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.error === 'UNAUTHORIZED') {
        setSiErrors({ password: 'Invalid credentials' });
      } else if (apiErr.error === 'NETWORK_ERROR') {
        setSiErrors({ institutionalId: apiErr.message });
      } else if (apiErr.error === 'VALIDATION_FAILED' && apiErr.errors) {
        setSiErrors({
          ...(apiErr.errors.institutionalId ? { institutionalId: apiErr.errors.institutionalId } : {}),
          ...(apiErr.errors.password ? { password: apiErr.errors.password } : {}),
        });
      } else {
        setSiErrors({ institutionalId: apiErr.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setSiLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!suInstitutionalId.trim()) errs.institutionalId = 'Institutional ID is required';
    if (!suEmail.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(suEmail)) errs.email = 'Enter a valid email address';
    if (!suRole) errs.role = 'Please select your role';
    if (!suPassword) errs.password = 'Password is required';
    else if (suPassword.length < 8) errs.password = 'Password must be at least 8 characters';
    setSuErrors(errs);
    if (Object.keys(errs).length) return;

    setSuLoading(true);
    try {
      await register({
        institutionalId: suInstitutionalId.trim(),
        email: suEmail.trim(),
        password: suPassword,
        role: suRole!.toUpperCase() as UserRole,
      });
      const role = useAuthStore.getState().role;
      navigate(
        role === 'STUDENT' ? '/student' : role === 'LECTURER' ? '/lecturer' : '/dashboard',
        { replace: true },
      );
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.error === 'CONFLICT') {
        setSuErrors(mapConflictError(apiErr.message));
      } else if (apiErr.error === 'VALIDATION_FAILED' && apiErr.errors) {
        setSuErrors({
          ...(apiErr.errors.institutionalId ? { institutionalId: apiErr.errors.institutionalId } : {}),
          ...(apiErr.errors.email ? { email: apiErr.errors.email } : {}),
          ...(apiErr.errors.password ? { password: apiErr.errors.password } : {}),
          ...(apiErr.errors.role ? { role: apiErr.errors.role } : {}),
        });
      } else if (apiErr.error === 'NETWORK_ERROR') {
        setSuErrors({ institutionalId: apiErr.message });
      } else {
        setSuErrors({ institutionalId: apiErr.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setSuLoading(false);
    }
  };

  const signInForm = (
    <div key={`signin-${formKey}`} className="auth-form-enter w-full max-w-md">
      <AuthBrandMark />

      <h1 className="text-student-display-lg font-student text-student-on-surface mb-2">Sign In</h1>
      <p className="text-student-body-md font-student text-student-on-surface-variant mb-10">
        Sign in with your university-assigned institutional ID.
      </p>

      <form onSubmit={handleSignIn} noValidate className="space-y-5">
        <div>
          <AuthField
            id="signin-institutional-id"
            label="Institutional ID"
            icon="badge"
            type="text"
            placeholder="e.g. STU-2024-001"
            value={siInstitutionalId}
            autoComplete="username"
            onChange={(v) => { setSiInstitutionalId(v); setSiErrors((e) => ({ ...e, institutionalId: '' })); }}
            error={siErrors.institutionalId}
          />
          <p className="mt-1.5 text-student-label-md font-student text-student-on-surface-variant">
            Your university-assigned ID used to sign in
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="signin-password" className="block text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider">
              Password
            </label>
            <a href="#" className="text-student-label-md font-student text-student-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <AuthField
            id="signin-password"
            label=""
            icon="lock"
            type={siShowPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={siPassword}
            autoComplete="current-password"
            onChange={(v) => { setSiPassword(v); setSiErrors((e) => ({ ...e, password: '' })); }}
            error={siErrors.password}
            rightSlot={<PasswordToggle show={siShowPw} onToggle={() => setSiShowPw((p) => !p)} />}
          />
        </div>

        <div className="pt-2">
          <AuthSubmitButton loading={siLoading} label="Sign In" loadingLabel="Signing in…" variant="vivid" />
        </div>
      </form>

      <p className="mt-10 text-center font-student text-student-body-md text-student-on-surface-variant">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => swap(true)}
          className="text-student-primary font-semibold hover:underline transition-colors"
        >
          Sign Up
        </button>
      </p>
    </div>
  );

  const signUpForm = (
    <div key={`signup-${formKey}`} className="auth-form-enter w-full max-w-md mx-auto">
      <AuthBrandMark variant="display" />
      <p className="text-student-headline-sm font-student text-student-on-surface -mt-6 mb-1">Create Account</p>
      <p className="text-student-body-md font-student text-student-on-surface-variant mb-10">
        Join the community of integrity-focused learners.
      </p>

      <form onSubmit={handleSignUp} noValidate className="space-y-6">
        <div>
          <AuthField
            id="signup-institutional-id"
            label="Institutional ID"
            icon="badge"
            type="text"
            placeholder="e.g. STU-2024-001"
            value={suInstitutionalId}
            autoComplete="username"
            onChange={(v) => { setSuInstitutionalId(v); setSuErrors((e) => ({ ...e, institutionalId: '' })); }}
            error={suErrors.institutionalId}
          />
          <p className="mt-1.5 text-student-label-md font-student text-student-on-surface-variant">
            Your university-assigned ID used to sign in
          </p>
        </div>

        <AuthField
          id="signup-email"
          label="Institutional Email"
          icon="mail"
          type="email"
          placeholder="jane.doe@university.edu"
          value={suEmail}
          autoComplete="email"
          onChange={(v) => { setSuEmail(v); setSuErrors((e) => ({ ...e, email: '' })); }}
          error={suErrors.email}
        />

        <AuthRoleSelector
          selected={suRole}
          onSelect={(r) => { setSuRole(r); setSuErrors((e) => ({ ...e, role: '' })); }}
          error={suErrors.role}
        />

        <AuthField
          id="signup-password"
          label="Password"
          icon="lock"
          type={suShowPw ? 'text' : 'password'}
          placeholder="••••••••"
          value={suPassword}
          autoComplete="new-password"
          onChange={(v) => { setSuPassword(v); setSuErrors((e) => ({ ...e, password: '' })); }}
          error={suErrors.password}
          rightSlot={<PasswordToggle show={suShowPw} onToggle={() => setSuShowPw((p) => !p)} />}
        />

        <div className="pt-2">
          <AuthSubmitButton
            loading={suLoading}
            label="Create Account"
            loadingLabel="Creating account…"
            variant="brand"
          />
        </div>
      </form>

      <p className="text-center font-student text-student-body-md text-student-on-surface-variant mt-8">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => swap(false)}
          className="text-student-primary font-bold hover:underline"
        >
          Sign In
        </button>
      </p>
    </div>
  );

  if (isSignUp) {
    return (
      <div className="auth-page auth-page-signup min-h-screen flex items-center justify-center p-4 sm:p-6 font-student">
        <div className="auth-signup-shell max-w-[1440px] w-full bg-student-surface-container-lowest rounded-[24px] shadow-[0px_10px_30px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row min-h-[min(800px,calc(100svh-2rem))]">
          <AuthImagePanel mode="signup" />

          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col justify-center relative overflow-y-auto">
            <div className="absolute top-0 right-0 w-96 h-96 bg-student-primary-container rounded-full blur-[100px] opacity-20 -z-10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-student-on-surface-variant hover:text-student-primary text-student-body-md font-medium transition-colors mb-6 w-fit md:absolute md:top-8 md:left-8 lg:left-12"
            >
              <Icon name="arrow_back" className="text-[18px]" />
              Back to home
            </Link>

            {signUpForm}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page auth-page-signin min-h-screen flex font-student bg-student-surface-container-lowest">
      <AuthImagePanel mode="signin" />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-6 md:p-10 relative z-20 min-h-screen">
        <Link
          to="/"
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-student-on-surface-variant hover:text-student-primary text-student-body-md font-medium transition-colors"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          Back to home
        </Link>

        {signInForm}
      </div>
    </div>
  );
};

export default AuthPage;
