import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import useAuthStore from './store/authStore';

import LandingPage       from './pages/LandingPage';
import AuthPage          from './pages/AuthPage';
import DashboardPage     from './pages/DashboardPage';
import StudentDashboard  from './pages/StudentDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import LecturerExamsPage from './pages/LecturerExamsPage';
import LecturerLiveMonitoringPage from './pages/LecturerLiveMonitoringPage';
import LecturerStudentTimelinePage from './pages/LecturerStudentTimelinePage';
import LecturerStudentsPage from './pages/LecturerStudentsPage';
import LecturerIntegrityReportsPage from './pages/LecturerIntegrityReportsPage';
import LecturerProctoringPage from './pages/LecturerProctoringPage';
import LecturerCreateExamPage from './pages/LecturerCreateExamPage';
import AccessDeniedPage  from './pages/AccessDeniedPage';
import NotFoundPage      from './pages/NotFoundPage';
import ProtectedRoute    from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

function App() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  // Rehydrate auth state from localStorage on every hard reload
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
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
        </Route>

        {/* Role-protected — LECTURER only */}
        <Route element={<RoleProtectedRoute roles={['LECTURER']} />}>
          <Route path="/lecturer" element={<LecturerDashboard />} />
          <Route path="/lecturer/exams" element={<LecturerExamsPage />} />
          <Route path="/lecturer/exams/new" element={<LecturerCreateExamPage />} />
          <Route path="/lecturer/exams/:examId/live" element={<LecturerLiveMonitoringPage />} />
          <Route path="/lecturer/exams/:examId/students/:studentId/timeline" element={<LecturerStudentTimelinePage />} />
          <Route path="/lecturer/students" element={<LecturerStudentsPage />} />
          <Route path="/lecturer/students/:studentId/timeline" element={<LecturerStudentTimelinePage />} />
          <Route path="/lecturer/reports" element={<LecturerIntegrityReportsPage />} />
          <Route path="/lecturer/proctoring" element={<LecturerProctoringPage />} />
        </Route>

        {/* Error pages */}
        <Route path="/403" element={<AccessDeniedPage />} />
        <Route path="*"    element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
