import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface Props {
  roles?: string[];
}

/* ─── Inline loading spinner ──────────────────────────────────────────────── */
const Spinner = () => (
  <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
      <p className="text-[#475569] text-[14px] font-medium">Loading…</p>
    </div>
  </div>
);

/* ─── Inline 403 view (not a redirect — matches spec requirement) ──────────── */
export const AccessDeniedView = () => (
  <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
        <span className="material-symbols-outlined text-[36px] text-red-500"
              style={{ fontVariationSettings: "'FILL' 1" }}>
          lock
        </span>
      </div>
      <h1 className="text-[#0F172A] font-bold text-[28px] mb-3">Access Denied</h1>
      <p className="text-[#475569] text-[15px] mb-8 leading-relaxed">
        You don't have permission to view this page. This area is restricted to a different role.
      </p>
      <a href="/dashboard"
         className="inline-flex items-center gap-2 bg-[#2563EB] text-white text-[14px] font-semibold
                    px-6 py-3 rounded-full hover:bg-[#1D4ED8] transition-colors">
        Back to Dashboard
      </a>
    </div>
  </div>
);

/* ─── ProtectedRoute ──────────────────────────────────────────────────────── */
const ProtectedRoute = ({ roles }: Props) => {
  const { isAuthenticated, isInitializing, role } = useAuthStore();

  // Wait for storage rehydration before making auth decisions
  if (isInitializing) return <Spinner />;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Role check — render AccessDeniedView in-page (spec: do NOT redirect)
  if (roles && role && !roles.includes(role)) {
    return <AccessDeniedView />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
