import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserProvider, useUser } from './context/UserContext';
import Navbar from './components/Navbar';
import CreateBookingPage from './pages/CreateBookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ResourceCalendarPage from './pages/ResourceCalendarPage';

function AppRoutes() {
  const { currentUser } = useUser();
  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Default redirect based on role */}
          <Route
            path="/"
            element={<Navigate to={isAdmin ? '/admin' : '/create'} replace />}
          />

          {/* User Routes */}
          <Route path="/create" element={<CreateBookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />

          {/* Admin Route */}
          <Route path="/admin" element={<AdminDashboardPage />} />

          {/* Shared Route */}
          <Route path="/calendar" element={<ResourceCalendarPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(26, 26, 46, 0.95)',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#4ade80', secondary: 'transparent' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: 'transparent' },
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}
