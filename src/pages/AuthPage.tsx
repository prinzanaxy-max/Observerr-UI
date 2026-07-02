import { useState, useEffect } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import type { ApiError } from '../types/auth';

/* ─── Logo ───────────────────────────────────────────────────────────────── */
type LogoProps = { shieldColor?: string; irisColor?: string; pupilColor?: string; className?: string };

const ObserrLogo = ({ shieldColor = '#0F172A', irisColor = '#2563EB', pupilColor = '#0F172A', className = '' }: LogoProps) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M16 2.5L5 7L5 18.5C5 25.2 9.5 29.8 16 31.8C22.5 29.8 27 25.2 27 18.5L27 7Z"
          stroke={shieldColor} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
    <path d="M9 18.5C11.5 14.3 20.5 14.3 23 18.5C20.5 22.7 11.5 22.7 9 18.5Z"
          stroke={shieldColor} strokeWidth="1.2" strokeLinejoin="round" fill="none" />
    <circle cx="16" cy="18.5" r="3.2" fill={irisColor} />
    <circle cx="16" cy="18.5" r="1.6" fill={pupilColor} />
    <circle cx="17.2" cy="17.3" r="0.65" fill="white" />
    <circle cx="15.2" cy="18.1" r="0.35" fill="white" />
  </svg>
);

/* ─── Filled Material Symbol helper ─────────────────────────────────────── */
/* Renders a Material Symbols icon with FILL=1 (filled, not outlined) */
const FilledIcon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
    aria-hidden="true"
  >
    {name}
  </span>
);

/* ─── Input with left icon + optional right slot ─────────────────────────── */
type InputProps = {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon: string;
  rightSlot?: ReactNode;
  autoComplete?: string;
};

const LabeledInput = ({ label, type, placeholder, value, onChange, error, icon, rightSlot, autoComplete }: InputProps) => (
  <div className="mb-4">
    <label className="block text-[14px] font-semibold text-[#1E293B] mb-1.5">{label}</label>
    <div
      className={`group relative flex items-center rounded-full border transition-all duration-200
        ${error
          ? 'border-red-400 bg-[#FFF5F5] focus-within:ring-2 focus-within:ring-red-100'
          : 'border-[#E2E8F0] bg-[#F8FAFC] focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15'
        }`}
    >
      {/* Left icon — changes blue on focus via group-focus-within */}
      <FilledIcon
        name={icon}
        className="absolute left-4 text-[20px] pointer-events-none select-none
                   text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors duration-200"
      />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-11 pr-11 py-3.5 bg-transparent text-[14px] text-[#0F172A]
                   placeholder-[#94A3B8] focus:outline-none"
      />
      {rightSlot && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
          {rightSlot}
        </div>
      )}
    </div>
    {error && (
      <p className="mt-1.5 ml-4 text-red-500 text-[12px] flex items-center gap-1">
        <FilledIcon name="error" className="text-[14px]" />
        {error}
      </p>
    )}
  </div>
);

/* ─── Password strength bar ──────────────────────────────────────────────── */
const PasswordStrength = ({ password }: { password: string }) => {
  if (!password) return null;
  const strength: 1 | 2 | 3 = password.length < 6 ? 1 : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3 : 2;
  const labels: Record<1|2|3, string> = { 1: 'Weak', 2: 'Fair', 3: 'Strong' };
  const colors: Record<1|2|3, string> = { 1: '#ef4444', 2: '#f97316', 3: '#22c55e' };
  return (
    <div className="mb-4 -mt-1 px-1">
      <div className="flex gap-1.5 mb-1">
        {([1, 2, 3] as const).map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
               style={{ backgroundColor: i <= strength ? colors[strength] : '#E2E8F0' }} />
        ))}
      </div>
      <span className="text-[11px] font-semibold" style={{ color: colors[strength] }}>{labels[strength]}</span>
    </div>
  );
};

/* ─── Show/hide password toggle (FILL=1, matches field icon style) ───────── */
const PwToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle} tabIndex={-1}
          className="text-[#94A3B8] hover:text-[#2563EB] transition-colors duration-200"
          aria-label={show ? 'Hide password' : 'Show password'}>
    <FilledIcon name={show ? 'visibility_off' : 'visibility'} className="text-[20px]" />
  </button>
);

/* ─── Submit button — black ──────────────────────────────────────────────── */
const SubmitBtn = ({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) => (
  <button type="submit" disabled={loading}
          className="w-full bg-[#0F172A] text-white text-[14px] font-semibold py-[14px] rounded-full
                     hover:bg-[#1E293B] hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)]
                     active:scale-[0.99] transition-all duration-200 mt-1
                     flex items-center justify-center gap-2.5
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none">
    {loading ? <><span className="auth-spinner" />{loadingLabel}</> : label}
  </button>
);

/* ─── Role selector — FIX 2: no emojis, filled Material Symbols icons ───── */
const RoleSelector = ({
  selected, onSelect, error,
}: { selected: 'student' | 'lecturer' | null; onSelect: (r: 'student' | 'lecturer') => void; error?: string }) => (
  <div className="mb-4">
    <label className="block text-[14px] font-semibold text-[#1E293B] mb-1.5">I am a</label>
    <div className="flex gap-2.5">
      {([
        { role: 'student',  icon: 'school',             label: 'Student'  },
        { role: 'lecturer', icon: 'cast_for_education', label: 'Lecturer' },
      ] as const).map(({ role, icon, label }) => (
        <button
          key={role}
          type="button"
          onClick={() => onSelect(role)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full
                      text-[13px] font-semibold transition-all duration-200 border
            ${selected === role
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-[0_4px_14px_rgba(37,99,235,0.25)]'
              : 'bg-white text-[#1E293B] border-[#CBD5E1] hover:border-[#2563EB]/50 hover:bg-[#EFF6FF]'
            }`}
        >
          <FilledIcon
            name={icon}
            className={`text-[20px] ${selected === role ? 'text-white' : 'text-[#475569]'}`}
          />
          {label}
        </button>
      ))}
    </div>
    {error && (
      <p className="mt-1.5 ml-1 text-red-500 text-[12px] flex items-center gap-1">
        <FilledIcon name="error" className="text-[14px]" />{error}
      </p>
    )}
  </div>
);

/* ─── Custom checkbox ────────────────────────────────────────────────────── */
const Checkbox = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <div onClick={() => onChange(!checked)}
         className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150
           ${checked ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-[#CBD5E1] hover:border-[#2563EB]'}`}>
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
    <span className="text-[13px] text-[#334155] font-medium">{label}</span>
  </label>
);

/* ─── Left panel decorative background ──────────────────────────────────── */
const PanelDecor = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
    <svg className="absolute -top-16 -left-16 w-72 h-72 opacity-[0.07]" viewBox="0 0 100 120" fill="none">
      <path d="M50 5L8 22L8 62C8 85 27 103 50 112C73 103 92 85 92 62L92 22Z" stroke="white" strokeWidth="2"/>
      <path d="M22 62C29 47 71 47 78 62C71 77 29 77 22 62Z" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
    <svg className="absolute -bottom-10 -right-14 w-56 h-56 opacity-[0.06]" viewBox="0 0 100 120" fill="none">
      <path d="M50 5L8 22L8 62C8 85 27 103 50 112C73 103 92 85 92 62L92 22Z" stroke="white" strokeWidth="2"/>
    </svg>
    <svg className="absolute top-1/4 -right-20 w-80 h-80 opacity-[0.04]" viewBox="0 0 100 100" fill="none">
      <path d="M10 50 A40 40 0 1 1 90 50" stroke="white" strokeWidth="1"/>
    </svg>
    <svg className="absolute bottom-1/4 -left-24 w-64 h-64 opacity-[0.05]" viewBox="0 0 100 100" fill="none">
      <path d="M10 50 A40 40 0 1 0 90 50" stroke="white" strokeWidth="1"/>
    </svg>
    <div className="absolute inset-0" style={{
      background: 'radial-gradient(ellipse at 50% 45%, rgba(37,99,235,0.18) 0%, transparent 65%)'
    }}/>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  AUTH PAGE                                                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */
const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, role: currentRole } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formKey, setFormKey]   = useState(0);

  /* Sign In */
  const [siEmail, setSiEmail]       = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siShowPw, setSiShowPw]     = useState(false);
  const [siRemember, setSiRemember] = useState(false);
  const [siErrors, setSiErrors]     = useState<Record<string, string>>({});
  const [siLoading, setSiLoading]   = useState(false);

  /* Sign Up */
  const [suName, setSuName]         = useState('');
  const [suEmail, setSuEmail]       = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suRole, setSuRole]         = useState<'student' | 'lecturer' | null>(null);
  const [suShowPw, setSuShowPw]     = useState(false);
  const [suErrors, setSuErrors]     = useState<Record<string, string>>({});
  const [suLoading, setSuLoading]   = useState(false);

  // Redirect already-authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && currentRole) {
      const dest = currentRole === 'STUDENT' ? '/student'
                 : currentRole === 'LECTURER' ? '/lecturer'
                 : '/dashboard';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, currentRole, navigate]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') === 'signup') setIsSignUp(true);
  }, []);

  useEffect(() => {
    document.title = isSignUp ? 'Observerr — Create Account' : 'Observerr — Sign In';
  }, [isSignUp]);

  const swap = (toSignUp: boolean) => {
    setIsSignUp(toSignUp);
    setFormKey(k => k + 1);
    setSiErrors({});
    setSuErrors({});
  };

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  /* ── Sign In — calls backend ────────────────────────────────────────── */
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!siEmail.trim())             errs.email    = 'Email is required';
    else if (!isValidEmail(siEmail)) errs.email    = 'Enter a valid email address';
    if (!siPassword)                 errs.password = 'Password is required';
    else if (siPassword.length < 6)  errs.password = 'Password must be at least 6 characters';
    setSiErrors(errs);
    if (Object.keys(errs).length) return;

    setSiLoading(true);
    try {
      await login({ email: siEmail.trim(), password: siPassword });
      // role is set in store — redirect to role-specific dashboard
      const role = useAuthStore.getState().role;
      navigate(role === 'STUDENT' ? '/student' : role === 'LECTURER' ? '/lecturer' : '/dashboard', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.error === 'UNAUTHORIZED') {
        setSiErrors({ password: 'Invalid email or password.' });
      } else if (apiErr.error === 'NETWORK_ERROR') {
        setSiErrors({ email: apiErr.message });
      } else {
        setSiErrors({ email: apiErr.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setSiLoading(false);
    }
  };

  /* ── Sign Up — calls backend ────────────────────────────────────────── */
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!suName.trim() || suName.trim().length < 2)
      errs.name     = 'Enter your full name (min 2 characters)';
    if (!suEmail.trim())              errs.email    = 'Email is required';
    else if (!isValidEmail(suEmail))  errs.email    = 'Enter a valid email address';
    if (!suRole)                      errs.role     = 'Please select your role';
    if (!suPassword)                  errs.password = 'Password is required';
    else if (suPassword.length < 8)   errs.password = 'Password must be at least 8 characters';
    setSuErrors(errs);
    if (Object.keys(errs).length) return;

    setSuLoading(true);
    try {
      await register({
        fullName: suName.trim(),
        email:    suEmail.trim(),
        password: suPassword,
        role:     suRole!.toUpperCase(), // 'student' → 'STUDENT'
      });
      const role = useAuthStore.getState().role;
      navigate(role === 'STUDENT' ? '/student' : role === 'LECTURER' ? '/lecturer' : '/dashboard', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.error === 'CONFLICT') {
        setSuErrors({ email: 'This email is already registered.' });
      } else if (apiErr.error === 'VALIDATION_FAILED' && apiErr.errors) {
        setSuErrors({
          ...(apiErr.errors.fullName  ? { name:     apiErr.errors.fullName  } : {}),
          ...(apiErr.errors.email     ? { email:    apiErr.errors.email     } : {}),
          ...(apiErr.errors.password  ? { password: apiErr.errors.password  } : {}),
          ...(apiErr.errors.role      ? { role:     apiErr.errors.role      } : {}),
        });
      } else if (apiErr.error === 'NETWORK_ERROR') {
        setSuErrors({ name: apiErr.message });
      } else {
        setSuErrors({ name: apiErr.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setSuLoading(false);
    }
  };

  /* ── render ─────────────────────────────────────────────────────────── */
  return (
    <div className="auth-page">
      <div className={`auth-card${isSignUp ? ' swapped' : ''}`}>

        {/* ── LEFT / BRANDING PANEL ────────────────────────────────────── */}
        <div
          className="auth-panel-blue"
          style={{ background: 'linear-gradient(160deg, #110820 0%, #08041a 45%, #040010 100%)' }}
        >
          <PanelDecor />

          {/* Mobile: compact header */}
          <div className="sm:hidden flex items-center gap-2.5 px-6 h-full">
            <ObserrLogo shieldColor="white" irisColor="rgba(255,255,255,0.45)" pupilColor="rgba(255,255,255,0.9)" className="h-7 w-7" />
            <span className="text-white font-bold text-lg">Observerr</span>
          </div>

          {/* Desktop: centered brand content */}
          <div className="hidden sm:flex flex-col h-full px-10 py-12">
            {/* Logo + wordmark top-left */}
            <div className="flex items-center gap-2.5 mb-auto">
              <ObserrLogo shieldColor="white" irisColor="rgba(255,255,255,0.45)" pupilColor="rgba(255,255,255,0.9)" className="h-8 w-8" />
              <span className="text-white/90 font-bold text-[17px] tracking-tight">Observerr</span>
            </div>

            {/* Center content */}
            <div className="my-auto">
              <div className="mb-10 relative">
                <ObserrLogo
                  shieldColor="rgba(255,255,255,0.12)"
                  irisColor="rgba(37,99,235,0.55)"
                  pupilColor="rgba(37,99,235,0.25)"
                  className="h-20 w-20"
                />
                <div className="absolute top-0 left-0 h-20 w-20 rounded-full"
                     style={{ boxShadow: '0 0 40px 8px rgba(37,99,235,0.2)' }} />
              </div>

              <h2 className="text-white font-bold text-[28px] leading-[1.25] mb-4 tracking-tight">
                {isSignUp
                  ? <>Welcome<br />back.</>
                  : <>Integrity you<br />can verify.</>
                }
              </h2>
              <p className="text-white/40 text-[13px] leading-relaxed max-w-[200px]">
                {isSignUp
                  ? "Sign in to resume monitoring your institution's exams."
                  : 'AI-powered proctoring that works in any browser without plugins or downloads.'
                }
              </p>
            </div>

            {/* Bottom: ghost swap link */}
            <div className="mt-auto">
              <button
                onClick={() => swap(!isSignUp)}
                className="flex items-center gap-2 text-white/50 text-[13px] font-medium
                           hover:text-white/80 transition-colors duration-200 group"
              >
                <span className="w-8 h-px bg-white/20 group-hover:bg-white/40 transition-colors" />
                {isSignUp ? 'Go to Sign In' : 'Create an account'}
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT / FORM PANEL ───────────────────────────────────────── */}
        <div className="auth-panel-form">
          <div key={formKey} className="form-content-animated">

            {/* Back to home */}
            <a href="/"
               className="flex items-center gap-1.5 text-[#334155] hover:text-[#0F172A] text-[13px] font-medium transition-colors mb-7 w-fit">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to home
            </a>

            {isSignUp ? (
              /* ══ SIGN UP ══════════════════════════════════════════════ */
              <>
                <div className="mb-6">
                  {/* FIX 1 — heading */}
                  <h1 className="text-[#0F172A] font-bold text-[30px] leading-tight tracking-tight mb-1.5">
                    Create Account
                  </h1>
                  <p className="text-[#334155] text-[14px] font-medium">
                    Already have an account?{' '}
                    <button onClick={() => swap(false)}
                            className="text-[#2563EB] font-semibold hover:text-[#1D4ED8] transition-colors">
                      Sign in
                    </button>
                  </p>
                </div>

                <form onSubmit={handleSignUp} noValidate>
                  {/* FIX 3 — icon prop added */}
                  <LabeledInput
                    label="Full Name"
                    icon="person"
                    type="text"
                    placeholder="Dr. Kwame Mensah"
                    value={suName}
                    autoComplete="name"
                    onChange={v => { setSuName(v); setSuErrors(e => ({ ...e, name: '' })); }}
                    error={suErrors.name}
                  />
                  <LabeledInput
                    label="School Email"
                    icon="mail"
                    type="email"
                    placeholder="name@institution.edu"
                    value={suEmail}
                    autoComplete="email"
                    onChange={v => { setSuEmail(v); setSuErrors(e => ({ ...e, email: '' })); }}
                    error={suErrors.email}
                  />
                  <RoleSelector
                    selected={suRole}
                    onSelect={r => { setSuRole(r); setSuErrors(e => ({ ...e, role: '' })); }}
                    error={suErrors.role}
                  />
                  <LabeledInput
                    label="Password"
                    icon="lock"
                    type={suShowPw ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={suPassword}
                    autoComplete="new-password"
                    onChange={v => { setSuPassword(v); setSuErrors(e => ({ ...e, password: '' })); }}
                    error={suErrors.password}
                    rightSlot={<PwToggle show={suShowPw} onToggle={() => setSuShowPw(p => !p)} />}
                  />
                  <PasswordStrength password={suPassword} />
                  <SubmitBtn loading={suLoading} label="Create Account" loadingLabel="Creating account…" />
                </form>

                <p className="text-center text-[#475569] text-[12px] mt-5 leading-relaxed font-medium">
                  By creating an account you agree to our{' '}
                  <a href="#" className="text-[#334155] font-semibold underline underline-offset-2 hover:text-[#0F172A] transition-colors">Terms</a>
                  {' & '}
                  <a href="#" className="text-[#334155] font-semibold underline underline-offset-2 hover:text-[#0F172A] transition-colors">Privacy Policy</a>.
                </p>
              </>
            ) : (
              /* ══ SIGN IN ══════════════════════════════════════════════ */
              <>
                <div className="mb-6">
                  {/* FIX 1 — heading */}
                  <h1 className="text-[#0F172A] font-bold text-[30px] leading-tight tracking-tight mb-1.5">
                    Log in
                  </h1>
                  <p className="text-[#334155] text-[14px] font-medium">
                    Don't have an account?{' '}
                    <button onClick={() => swap(true)}
                            className="text-[#2563EB] font-semibold hover:text-[#1D4ED8] transition-colors">
                      Create an Account
                    </button>
                  </p>
                </div>

                <form onSubmit={handleSignIn} noValidate>
                  {/* FIX 3 — icon prop */}
                  <LabeledInput
                    label="Email Address"
                    icon="mail"
                    type="email"
                    placeholder="name@institution.edu"
                    value={siEmail}
                    autoComplete="email"
                    onChange={v => { setSiEmail(v); setSiErrors(e => ({ ...e, email: '' })); }}
                    error={siErrors.email}
                  />
                  <LabeledInput
                    label="Password"
                    icon="lock"
                    type={siShowPw ? 'text' : 'password'}
                    placeholder="Password"
                    value={siPassword}
                    autoComplete="current-password"
                    onChange={v => { setSiPassword(v); setSiErrors(e => ({ ...e, password: '' })); }}
                    error={siErrors.password}
                    rightSlot={<PwToggle show={siShowPw} onToggle={() => setSiShowPw(p => !p)} />}
                  />

                  {/* Forgot password — FIX 1: blue */}
                  <div className="flex justify-end -mt-2 mb-5">
                    <a href="#" className="text-[13px] text-[#2563EB] font-medium hover:text-[#1D4ED8] transition-colors">
                      Forgot Password?
                    </a>
                  </div>

                  <SubmitBtn loading={siLoading} label="Log in" loadingLabel="Signing in…" />

                  {/* Remember me */}
                  <div className="flex items-center mt-4">
                    <Checkbox checked={siRemember} onChange={setSiRemember} label={<span className="text-[#334155] font-medium">Remember me</span>} />
                  </div>
                </form>

                <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
                  <p className="text-center text-[12px] text-[#475569] leading-relaxed font-medium">
                    By logging in you agree to our{' '}
                    <a href="#" className="text-[#334155] font-semibold underline underline-offset-2 hover:text-[#0F172A] transition-colors">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#334155] font-semibold underline underline-offset-2 hover:text-[#0F172A] transition-colors">Privacy Policy</a>.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
