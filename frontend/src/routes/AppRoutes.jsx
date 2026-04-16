import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Shared UI
import Navbar from '../components/Navbar';

// Booking Pages
import CreateBookingPage from '../pages/CreateBookingPage';
import MyBookingsPage from '../pages/MyBookingsPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import ResourceCalendarPage from '../pages/ResourceCalendarPage';

// Ticket Pages
import { AdminPanelPage } from '../pages/adminpanel';
import { CreateTicketPage } from '../pages/createticket';
import { MyTicketsPage } from '../pages/myticket';
import { TechnicianPanelPage } from '../pages/technicianpanel';
import { TicketDetailsPage } from '../pages/ticketDetails';

export default function AppRoutes() {
  const { currentUser } = useUser();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Default Redirect */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAdmin ? '/admin-dashboard' : '/create-booking'}
                replace
              />
            }
          />

          {/* ================= BOOKING ROUTES ================= */}
          {/* alias for legacy/short links */}
          <Route path="/create" element={<CreateBookingPage />} />
          <Route path="/create-booking" element={<CreateBookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/calendar" element={<ResourceCalendarPage />} />

          {/* ================= TICKET ROUTES ================= */}
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/create-ticket" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailsPage />} />
          <Route path="/technician" element={<TechnicianPanelPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}