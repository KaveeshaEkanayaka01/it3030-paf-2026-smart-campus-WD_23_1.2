import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import {
  CalendarDays,
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  User,
  Users,
  Shield,
  Wrench,
  ClipboardList,
  LogOut,
  Package,
} from 'lucide-react';
import NotificationBell from './notifications/NotificationBell';

export default function Navbar() {
  const { currentUser } = useUser();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const role = currentUser?.role || '';
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';
  const isTechnician = role === 'TECHNICIAN' || role === 'ROLE_TECHNICIAN';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToDashboard = () => {
    navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
  };

  // 🔥 Shortened labels so everything fits perfectly
  const userLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { to: '/create', icon: <PlusCircle size={16} />, label: 'Booking' },
    { to: '/my-bookings', icon: <BookOpen size={16} />, label: 'Bookings' },
    { to: '/resources', icon: <Package size={16} />, label: 'Resources' },
    { to: '/create-ticket', icon: <Wrench size={16} />, label: 'Ticket' },
    { to: '/my-tickets', icon: <ClipboardList size={16} />, label: 'Tickets' },
    { to: '/calendar', icon: <CalendarDays size={16} />, label: 'Calendar' },
  ];

  const adminLinks = [
    { to: '/admin-dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { to: '/resources', icon: <Package size={16} />, label: 'Resources' },
    { to: '/admin', icon: <Shield size={16} />, label: 'Tickets' },
    { to: '/users', icon: <Users size={16} />, label: 'Users' },
    { to: '/calendar', icon: <CalendarDays size={16} />, label: 'Calendar' },
  ];

  const technicianLinks = [
    { to: '/technician', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { to: '/technician', icon: <Wrench size={16} />, label: 'Tech Workspace' },
  ];

  const links = useMemo(() => {
    if (isAdmin) return adminLinks;

    if (isTechnician) {
      return technicianLinks;
    }

    return userLinks;
  }, [isAdmin, isTechnician]);

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Logo */}
          <Link
            to={isAdmin ? '/admin-dashboard' : '/dashboard'}
            className="flex items-center gap-2 shrink-0"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
              }}
            >
              <CalendarDays size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
              SmartCampus
            </span>
          </Link>

          {/* 🔥 Center Links (fits in one row) */}
          <div className="flex items-center justify-center gap-1 flex-1">
            {links.map((link) => {
              const active = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: active ? 'rgba(249,115,22,0.1)' : 'transparent',
                    color: active ? 'var(--primary)' : 'var(--text-secondary)',
                    border: active
                      ? '1px solid rgba(249,115,22,0.2)'
                      : '1px solid transparent',
                  }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <NotificationBell />

            <button
              onClick={goToDashboard}
              className="flex items-center gap-2 px-2 py-1 rounded-lg transition-all"
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-hover)';
                e.currentTarget.style.borderColor = 'rgba(249,115,22,0.22)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <User size={14} />
              <span className="text-xs hidden sm:inline">
                {currentUser?.userName}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all"
              style={{
                background: 'rgba(249,115,22,0.1)',
                color: 'var(--primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(249,115,22,0.16)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(249,115,22,0.1)';
              }}
            >
              <LogOut size={14} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}