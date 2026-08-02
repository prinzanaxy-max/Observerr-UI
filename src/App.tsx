import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import useAuthStore from './store/authStore';

import ProtectedRoute    from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import PushNotificationProvider from './components/PushNotificationProvider';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const StudentExamsPage = lazy(() => import('./pages/StudentExamsPage'));
const StudentExamPrePage = lazy(() => import('./pages/StudentExamPrePage'));
const StudentExamSessionPage = lazy(() => import('./pages/StudentExamSessionPage'));
const StudentResultsPage = lazy(() => import('./pages/StudentResultsPage'));
const StudentResultDetailPage = lazy(() => import('./pages/StudentResultDetailPage'));
const StudentNotificationsPage = lazy(() => import('./pages/StudentNotificationsPage'));
const StudentSettingsPage = lazy(() => import('./pages/StudentSettingsPage'));
const StudentProfilePage = lazy(() => import('./pages/StudentProfilePage'));
const StudentDocumentationPage = lazy(() => import('./pages/StudentDocumentationPage'));
const LecturerDashboard = lazy(() => import('./pages/LecturerDashboard'));
const LecturerExamsPage = lazy(() => import('./pages/LecturerExamsPage'));
const LecturerLiveMonitoringPage = lazy(() => import('./pages/LecturerLiveMonitoringPage'));
const LecturerStudentsPage = lazy(() => import('./pages/LecturerStudentsPage'));
const LecturerIntegrityReportsPage = lazy(() => import('./pages/LecturerIntegrityReportsPage'));
const LecturerProctoringPage = lazy(() => import('./pages/LecturerProctoringPage'));
const LecturerCreateExamPage = lazy(() => import('./pages/LecturerCreateExamPage'));
const LecturerSessionDetailPage = lazy(() => import('./pages/LecturerSessionDetailPage'));
const LecturerSettingsPage = lazy(() => import('./pages/LecturerSettingsPage'));
const LecturerSupportPage = lazy(() => import('./pages/LecturerSupportPage'));
const LecturerExamResultsPage = lazy(() => import('./pages/LecturerExamResultsPage'));
const AccessDeniedPage = lazy(() => import('./pages/AccessDeniedPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const bootstrapSession = useAuthStore((s) => s.bootstrapSession);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  return (
    <PushNotificationProvider>
      <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading…</div>}>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/auth"     element={<AuthPage />} />

        {/* /login and /register are aliases for /auth */}
        <Route path="/login"    element={<Navigate to="/auth"              replace />} />
        <Route path="/register" element={<Navigate to="/auth?mode=signup"  replace />} />

        {/* Protected — any authenticated user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Role-protected — STUDENT only */}
        <Route element={<RoleProtectedRoute roles={['STUDENT']} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/exams" element={<StudentExamsPage />} />
          <Route path="/student/exams/:examId" element={<StudentExamPrePage />} />
          <Route path="/student/exams/:examId/take" element={<StudentExamSessionPage />} />
          <Route path="/student/results" element={<StudentResultsPage />} />
          <Route path="/student/results/:resultId" element={<StudentResultDetailPage />} />
          <Route path="/student/notifications" element={<StudentNotificationsPage />} />
          <Route path="/student/settings" element={<StudentSettingsPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/documentation" element={<StudentDocumentationPage />} />
        </Route>

        {/* Role-protected — LECTURER only */}
        <Route element={<RoleProtectedRoute roles={['LECTURER']} />}>
          <Route path="/lecturer" element={<LecturerDashboard />} />
          <Route path="/lecturer/exams" element={<LecturerExamsPage />} />
          <Route path="/lecturer/exams/new" element={<LecturerCreateExamPage />} />
          <Route path="/lecturer/exams/:examId/live" element={<LecturerLiveMonitoringPage />} />
          <Route path="/lecturer/exams/:examId/results" element={<LecturerExamResultsPage />} />
          <Route path="/lecturer/students" element={<LecturerStudentsPage />} />
          <Route path="/lecturer/students/sessions/:sessionId" element={<LecturerSessionDetailPage />} />
          <Route path="/lecturer/reports" element={<LecturerIntegrityReportsPage />} />
          <Route path="/lecturer/proctoring" element={<LecturerProctoringPage />} />
          <Route path="/lecturer/settings" element={<LecturerSettingsPage />} />
          <Route path="/lecturer/support" element={<LecturerSupportPage />} />
        </Route>

        {/* Error pages */}
        <Route path="/403" element={<AccessDeniedPage />} />
        <Route path="*"    element={<NotFoundPage />} />
      </Routes>
      </Suspense>
      </BrowserRouter>
    </PushNotificationProvider>
  );
}

export default App;
