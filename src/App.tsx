import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import useAuthStore from './store/authStore';

import LandingPage       from './pages/LandingPage';
import AuthPage          from './pages/AuthPage';
import DashboardPage     from './pages/DashboardPage';
import StudentDashboard  from './pages/StudentDashboard';
import StudentExamsPage  from './pages/StudentExamsPage';
import StudentExamPrePage from './pages/StudentExamPrePage';
import StudentExamSessionPage from './pages/StudentExamSessionPage';
import StudentResultsPage from './pages/StudentResultsPage';
import StudentResultDetailPage from './pages/StudentResultDetailPage';
import StudentNotificationsPage from './pages/StudentNotificationsPage';
import StudentSettingsPage from './pages/StudentSettingsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import StudentDocumentationPage from './pages/StudentDocumentationPage';
import LecturerDashboard from './pages/LecturerDashboard';
import LecturerExamsPage from './pages/LecturerExamsPage';
import LecturerLiveMonitoringPage from './pages/LecturerLiveMonitoringPage';
import LecturerStudentTimelinePage from './pages/LecturerStudentTimelinePage';
import LecturerStudentsPage from './pages/LecturerStudentsPage';
import LecturerIntegrityReportsPage from './pages/LecturerIntegrityReportsPage';
import LecturerProctoringPage from './pages/LecturerProctoringPage';
import LecturerCreateExamPage from './pages/LecturerCreateExamPage';
import LecturerSessionDetailPage from './pages/LecturerSessionDetailPage';
import LecturerSettingsPage from './pages/LecturerSettingsPage';
import LecturerSupportPage from './pages/LecturerSupportPage';
import AccessDeniedPage  from './pages/AccessDeniedPage';
import NotFoundPage      from './pages/NotFoundPage';
import ProtectedRoute    from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import PushNotificationProvider from './components/PushNotificationProvider';

function App() {
  const bootstrapSession = useAuthStore((s) => s.bootstrapSession);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  return (
    <PushNotificationProvider>
      <BrowserRouter>
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
          <Route path="/lecturer/exams/:examId/students/:studentId/timeline" element={<LecturerStudentTimelinePage />} />
          <Route path="/lecturer/students" element={<LecturerStudentsPage />} />
          <Route path="/lecturer/students/sessions/:sessionId" element={<LecturerSessionDetailPage />} />
          <Route path="/lecturer/students/:studentId/timeline" element={<LecturerStudentTimelinePage />} />
          <Route path="/lecturer/reports" element={<LecturerIntegrityReportsPage />} />
          <Route path="/lecturer/proctoring" element={<LecturerProctoringPage />} />
          <Route path="/lecturer/settings" element={<LecturerSettingsPage />} />
          <Route path="/lecturer/support" element={<LecturerSupportPage />} />
        </Route>

        {/* Error pages */}
        <Route path="/403" element={<AccessDeniedPage />} />
        <Route path="*"    element={<NotFoundPage />} />
      </Routes>
      </BrowserRouter>
    </PushNotificationProvider>
  );
}

export default App;
