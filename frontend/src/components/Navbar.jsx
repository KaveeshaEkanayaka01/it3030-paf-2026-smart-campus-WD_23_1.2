import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { CalendarDays, LayoutDashboard, PlusCircle, BookOpen, User, Shield, ArrowLeftRight, Wrench, ClipboardList } from 'lucide-react';

export default function Navbar() {
  const { currentUser, toggleRole } = useUser();
  const location = useLocation();
  const isAdmin = currentUser.role === 'ADMIN';

  const userLinks = [
    { to: '/create', icon: <PlusCircle size={18} />, label: 'New Booking' },
    { to: '/my-bookings', icon: <BookOpen size={18} />, label: 'My Bookings' },
    { to: '/create-ticket', icon: <Wrench size={18} />, label: 'New Ticket' },
    { to: '/my-tickets', icon: <ClipboardList size={18} />, label: 'My Tickets' },
    { to: '/calendar', icon: <CalendarDays size={18} />, label: 'Calendar' },
  ];

  const adminLinks = [
    { to: '/admin-dashboard', icon: <LayoutDashboard size={18} />, label: 'Booking Admin' },
    { to: '/admin', icon: <Shield size={18} />, label: 'Ticket Admin' },
    { to: '/technician', icon: <Wrench size={18} />, label: 'Technician' },
    { to: '/calendar', icon: <CalendarDays size={18} />, label: 'Calendar' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <nav className="sticky top-0 z-50" style={{ background: 'rgba(2,6,23,0.72)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAdmin ? '/admin-dashboard' : '/create'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))' }}>
              <CalendarDays size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Book<span style={{ color: 'var(--accent-mid)' }}>Ease</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: active ? 'rgba(99,102,241,0.06)' : 'transparent',
                    color: active ? 'var(--accent-mid)' : 'var(--text-secondary)',
                    border: active ? '1px solid rgba(56,189,248,0.3)' : '1px solid transparent',
                  }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Info + Role Toggle */}
          <div className="flex items-center gap-3">
            {/* User Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(148,163,184,0.2)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: isAdmin ? 'linear-gradient(135deg, var(--status-pending), var(--accent-mid))' : 'linear-gradient(135deg, var(--accent-start), var(--accent-end))' }}>
                {isAdmin ? <Shield size={14} className="text-white" /> : <User size={14} className="text-white" />}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{currentUser.userName}</p>
                <p className="text-xs" style={{ color: isAdmin ? 'var(--status-pending)' : 'var(--accent-mid)' }}>{currentUser.role}</p>
              </div>
            </div>

            {/* Role Toggle Button */}
            <button
              onClick={toggleRole}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: isAdmin ? 'rgba(99,102,241,0.06)' : 'var(--status-pending-bg)',
                color: isAdmin ? 'var(--accent-mid)' : 'var(--status-pending)',
                border: isAdmin ? '1px solid rgba(56,189,248,0.3)' : '1px solid var(--status-pending-border)',
              }}
              title="Switch Role"
            >
              <ArrowLeftRight size={14} />
              <span className="hidden sm:inline">
                Switch to {isAdmin ? 'USER' : 'ADMIN'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
