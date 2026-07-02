import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import apiClient from '../lib/axios';
import { logout } from '../services/authService';

const Icon = ({ name }: { name: string }) => (
  <span className="material-symbols-outlined"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden="true">{name}</span>
);

/* ─── Role greeting card that calls the hello endpoint ───────────────────── */
const HelloCard = ({ role }: { role: string }) => {
  const [message, setMessage]     = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const endpoint =
      role === 'STUDENT'  ? '/api/student/hello'
    : role === 'LECTURER' ? '/api/lecturer/hello'
    : null;

    if (!endpoint) { setLoading(false); return; }

    apiClient
      .get<string>(endpoint)
      .then((res) => setMessage(typeof res.data === 'string' ? res.data : JSON.stringify(res.data)))
      .catch((err) => {
        if (err?.response?.status === 403) {
          setError('Access denied — your role does not match this endpoint.');
        } else {
          setError('Could not load greeting from server.');
        }
      })
      .finally(() => setLoading(false));
  }, [role]);

  if (loading) return (
    <div className="h-12 flex items-center gap-2 text-[#475569] text-[14px]">
      <div className="w-4 h-4 border-2 border-[#2563EB]/30 border-t-[#2563EB] rounded-full animate-spin" />
      Loading server greeting…
    </div>
  );

  if (error) return (
    <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">
      <Icon name="error" />
      <span>{error}</span>
    </div>
  );

  return (
    <div className="flex items-start gap-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[14px] font-medium">
      <Icon name="check_circle" />
      <span className="font-mono">{message}</span>
    </div>
  );
};

/* ─── Dashboard page ─────────────────────────────────────────────────────── */
const DashboardPage = () => {
  const { user, role, isAuthenticated } = useAuthStore();
  const fullName = user?.fullName ?? localStorage.getItem('authFullName') ?? 'User';
  const storedRole = role ?? (localStorage.getItem('authRole') as typeof role);

  // Redirect to role-specific dashboard
  if (storedRole === 'STUDENT')  return <Navigate to="/student"  replace />;
  if (storedRole === 'LECTURER') return <Navigate to="/lecturer" replace />;

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  /* ADMIN fallback — rendered if role is ADMIN or unknown */
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-2xl mx-auto pt-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-headline-section text-headline-section text-primary mb-2">
            Welcome, {fullName} 👋
          </h1>
          <span className="inline-flex items-center gap-1.5 bg-[#EFF6FF] text-[#2563EB] text-[12px]
                           font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Icon name="admin_panel_settings" />
            {storedRole ?? 'ADMIN'}
          </span>
        </div>

        {/* Server greeting */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6
                        shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)]">
          <h2 className="font-bold text-[16px] text-[#0F172A] mb-4">Server Response</h2>
          {storedRole && <HelloCard role={storedRole} />}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          <a href="/student"
             className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md
                        hover:border-[#2563EB]/30 transition-all group">
            <Icon name="school" />
            <p className="font-semibold text-[14px] text-[#0F172A] mt-2 group-hover:text-[#2563EB] transition-colors">Student Dashboard</p>
          </a>
          <a href="/lecturer"
             className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md
                        hover:border-[#2563EB]/30 transition-all group">
            <Icon name="cast_for_education" />
            <p className="font-semibold text-[14px] text-[#0F172A] mt-2 group-hover:text-[#2563EB] transition-colors">Lecturer Dashboard</p>
          </a>
        </div>

        <button
          onClick={logout}
          className="mt-8 flex items-center gap-2 text-[#64748B] text-[13px] hover:text-[#0F172A] transition-colors"
        >
          <Icon name="logout" /> Sign out
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
