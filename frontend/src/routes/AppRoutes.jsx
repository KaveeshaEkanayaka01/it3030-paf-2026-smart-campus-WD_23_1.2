import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
import DashboardPage from '../pages/DashboardPage';
import NotificationsPage from '../pages/NotificationsPage';
import ProtectedRoute from '../components/common/ProtectedRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />

        {/* Admin Only */}
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold">Admin - User Management</h2>
            </div>
          </ProtectedRoute>
        } />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-600">404 - Page Not Found</h2>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}