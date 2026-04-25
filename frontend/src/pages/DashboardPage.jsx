import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useUser } from '../context/UserContext';
import { bookingApi } from '../api/bookingApi';
import { getCurrentUserId, ticketService } from '../api/ticketService';
import { useNavigate } from 'react-router-dom';
import {
  FaTicketAlt,
  FaCalendarCheck,
  FaBell,
  FaUserShield,
  FaGithub,
  FaGoogle,
  FaCheckCircle,
} from 'react-icons/fa';

export default function DashboardPage() {
  const { user, isAdmin, isTechnician } = useAuth();
  const { currentUser } = useUser();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);

  useEffect(() => {
    const loadBookingCount = async () => {
      if (!currentUser?.userId) {
        setBookingCount(0);
        return;
      }

      try {
        const res = await bookingApi.getMyBookings(currentUser.userId);
        setBookingCount(Array.isArray(res.data) ? res.data.length : 0);
      } catch {
        setBookingCount(0);
      }
    };

    loadBookingCount();
  }, [currentUser?.userId]);

  useEffect(() => {
    const loadTicketCount = async () => {
      const currentUserId = currentUser?.userId || getCurrentUserId();
      if (!currentUserId) {
        setTicketCount(0);
        return;
      }

      try {
        const data = await ticketService.getMyTickets(currentUserId);
        setTicketCount(Array.isArray(data) ? data.length : 0);
      } catch {
        setTicketCount(0);
      }
    };

    loadTicketCount();
  }, [currentUser?.userId]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleBadge = () => {
    if (isAdmin()) return { label: 'Admin', color: 'bg-red-500' };
    if (isTechnician()) return { label: 'Technician', color: 'bg-blue-500' };
    return { label: 'User', color: 'bg-green-500' };
  };

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {showProfile ? 'My Profile' : 'Dashboard'}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDate(new Date())}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfile(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                !showProfile
                  ? 'text-white border'
                  : 'text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
              style={{
                background: !showProfile ? 'linear-gradient(135deg, var(--accent-start), var(--accent-end))' : 'transparent',
                borderColor: !showProfile ? 'var(--accent-mid)' : 'rgba(148, 163, 184, 0.25)',
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setShowProfile(true)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                showProfile
                  ? 'text-white border'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              style={{
                background: showProfile ? 'linear-gradient(135deg, var(--accent-start), var(--accent-end))' : 'transparent',
                color: showProfile ? 'white' : 'var(--text-primary)',
                borderColor: showProfile ? 'var(--accent-mid)' : 'rgba(148, 163, 184, 0.25)',
              }}
            >
              Profile
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="px-3 py-2 rounded-lg text-sm font-medium border transition-colors inline-flex items-center gap-2"
              style={{
                background: 'rgba(15, 23, 42, 0.4)',
                borderColor: 'rgba(148, 163, 184, 0.25)',
                color: 'var(--text-primary)',
              }}
            >
              Notifications
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold text-white rounded-full px-1.5 py-0.5 min-w-5 text-center" style={{ background: 'var(--accent-start)' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {showProfile ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))' }}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24"></div>
              <div className="relative z-10 flex items-center gap-5">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-20 h-20 rounded-2xl ring-4 ring-white/30 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">
                      {user?.name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-white/70 text-sm mt-1">{user?.email}</p>
                  {user?.githubUsername && (
                  <div className="flex items-center gap-2 mt-2">
                    <FaGithub size={14} className="text-white/60" />
                    <span className="text-white/70 text-sm">@{user?.githubUsername}</span>
                  </div>
                )}
                {user?.provider === 'google' && !user?.githubUsername && (
                  <div className="flex items-center gap-2 mt-2">
                    <FaGoogle size={14} className="text-white/60" />
                    <span className="text-white/70 text-sm">Google Account</span>
                  </div>
                )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 border glass-card" style={{ borderColor: 'rgba(148, 163, 184, 0.25)' }}>
              <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Account Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'rgba(148, 163, 184, 0.15)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Full Name</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'rgba(148, 163, 184, 0.15)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.email}</span>
                </div>

                {user?.githubUsername && (
                  <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'rgba(148, 163, 184, 0.15)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>GitHub Username</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>@{user?.githubUsername}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'rgba(148, 163, 184, 0.15)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Account Status</span>
                  <span className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--accent-mid)' }}>
                    <FaCheckCircle size={12} />
                    Active
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Roles</span>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {user?.roles?.map((role) => (
                      <span
                        key={role}
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{ 
                          background: 'rgba(15, 23, 42, 0.4)',
                          color: 'var(--accent-mid)',
                          border: '1px solid rgba(148, 163, 184, 0.25)',
                        }}
                      >
                        {role.replace('ROLE_', '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">{getGreeting()} 👋</p>
                  <h2 className="text-2xl font-bold mb-1">
                    Welcome back, {user?.name?.split(' ')[0]}!
                  </h2>
                  <p className="text-white/70 text-sm">Here's what's happening in your campus today.</p>
                  {user?.githubUsername && (
                    <div className="flex items-center gap-2 mt-3">
                      <FaGithub size={14} className="text-white/60" />
                      <span className="text-white/70 text-xs">@{user?.githubUsername}</span>
                    </div>
                  )}
                  {user?.provider === 'google' && !user?.githubUsername && (
                    <div className="flex items-center gap-2 mt-3">
                      <FaGoogle size={14} className="text-white/60" />
                      <span className="text-white/70 text-xs">Google User</span>
                    </div>
                  )}
                </div>

                {user?.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-20 h-20 rounded-2xl ring-4 ring-white/30 hidden md:block object-cover"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className="rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer glass-card"
                style={{ borderColor: 'rgba(148, 163, 184, 0.25)' }}
                onClick={() => navigate('/my-bookings')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                    <FaCalendarCheck style={{ color: 'var(--accent-mid)' }} size={20} />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(15, 23, 42, 0.4)', color: 'var(--accent-mid)' }}>
                    Active
                  </span>
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{bookingCount}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>My Bookings</p>
              </div>

              <div
                className="rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer glass-card"
                style={{ borderColor: 'rgba(148, 163, 184, 0.25)' }}
                onClick={() => navigate('/my-tickets')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                    <FaTicketAlt style={{ color: 'var(--accent-mid)' }} size={20} />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(15, 23, 42, 0.4)', color: 'var(--accent-mid)' }}>
                    Open
                  </span>
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{ticketCount}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>My Tickets</p>
              </div>

              <div
                className="rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer glass-card"
                style={{ borderColor: 'rgba(148, 163, 184, 0.25)' }}
                onClick={() => navigate('/notifications')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                    <FaBell style={{ color: 'var(--accent-mid)' }} size={20} />
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'var(--accent-start)', color: 'white' }}>
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{unreadCount}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Unread Notifications</p>
              </div>

              <div className="rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 glass-card" style={{ borderColor: 'rgba(148, 163, 184, 0.25)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                    <FaUserShield style={{ color: 'var(--accent-mid)' }} size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{user?.roles?.length || 1}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Assigned Roles</p>
              </div>
            </div>

            <div className="rounded-2xl p-6 border glass-card" style={{ borderColor: 'rgba(148, 163, 184, 0.25)' }}>
              <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>🎭 Your Access Level</h3>
              <div className="flex flex-wrap gap-3">
                {user?.roles?.map((role) => (
                  <div
                    key={role}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))' }}
                  >
                    <FaUserShield className="text-white" size={14} />
                    <span className="text-white text-sm font-medium">{role.replace('ROLE_', '')}</span>
                  </div>
                ))}
                {!user?.roles?.length && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))' }}>
                    <FaUserShield className="text-white" size={14} />
                    <span className="text-white text-sm font-medium">{getRoleBadge().label}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}