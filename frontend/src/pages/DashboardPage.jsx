
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {showProfile ? 'My Profile' : 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-500">{formatDate(new Date())}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfile(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                !showProfile
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setShowProfile(true)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                showProfile
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="px-3 py-2 rounded-lg text-sm font-medium border transition-colors bg-white text-gray-700 border-gray-200 hover:bg-gray-50 inline-flex items-center gap-2"
            >
              Notifications
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold text-white bg-red-500 rounded-full px-1.5 py-0.5 min-w-5 text-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {showProfile ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 text-white">
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
                  <p className="text-blue-200 text-sm mt-1">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <FaGithub size={14} className="text-blue-300" />
                    <span className="text-blue-200 text-sm">@{user?.githubUsername}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 border bg-white border-gray-100 shadow-sm">
              <h3 className="font-bold text-base mb-4 text-gray-800">Account Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-400 text-sm">Full Name</span>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-400 text-sm">Email</span>
                  <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-400 text-sm">GitHub Username</span>
                  <span className="text-sm font-medium text-gray-700">@{user?.githubUsername}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-400 text-sm">Account Status</span>
                  <span className="text-sm font-medium text-green-500 flex items-center gap-1">
                    <FaCheckCircle size={12} />
                    Active
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400 text-sm">Roles</span>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {user?.roles?.map((role) => (
                      <span
                        key={role}
                        className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
                      >
                        {role.replace('ROLE_', '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 border bg-white border-gray-100 shadow-sm">
              <h3 className="font-bold text-base mb-4 text-gray-800">Authentication</h3>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaGithub className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">GitHub OAuth 2.0</p>
                  <p className="text-gray-400 text-xs">Signed in via GitHub authentication</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-1">{getGreeting()} 👋</p>
                  <h2 className="text-2xl font-bold mb-1">
                    Welcome back, {user?.name?.split(' ')[0]}!
                  </h2>
                  <p className="text-blue-200 text-sm">Here's what's happening in your campus today.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <FaGithub size={14} className="text-blue-300" />
                    <span className="text-blue-200 text-xs">@{user?.githubUsername}</span>
                  </div>
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
                className="rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer bg-white border-gray-100 shadow-sm"
                onClick={() => navigate('/my-bookings')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaCalendarCheck className="text-blue-600" size={20} />
                  </div>
                  <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-3xl font-bold mb-1 text-gray-800">{bookingCount}</p>
                <p className="text-sm text-gray-400">My Bookings</p>
              </div>

              <div
                className="rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer bg-white border-gray-100 shadow-sm"
                onClick={() => navigate('/my-tickets')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FaTicketAlt className="text-orange-600" size={20} />
                  </div>
                  <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                    Open
                  </span>
                </div>
                <p className="text-3xl font-bold mb-1 text-gray-800">{ticketCount}</p>
                <p className="text-sm text-gray-400">My Tickets</p>
              </div>

              <div
                className="rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer bg-white border-gray-100 shadow-sm"
                onClick={() => navigate('/notifications')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FaBell className="text-purple-600" size={20} />
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold mb-1 text-gray-800">{unreadCount}</p>
                <p className="text-sm text-gray-400">Unread Notifications</p>
              </div>

              <div className="rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaUserShield className="text-green-600" size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1 text-gray-800">{user?.roles?.length || 1}</p>
                <p className="text-sm text-gray-400">Assigned Roles</p>
              </div>
            </div>

            <div className="rounded-2xl p-6 border bg-white border-gray-100 shadow-sm">
              <h3 className="font-bold text-base mb-4 text-gray-800">🎭 Your Access Level</h3>
              <div className="flex flex-wrap gap-3">
                {user?.roles?.map((role) => (
                  <div
                    key={role}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    <FaUserShield className="text-white" size={14} />
                    <span className="text-white text-sm font-medium">{role.replace('ROLE_', '')}</span>
                  </div>
                ))}
                {!user?.roles?.length && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${getRoleBadge().color}`}>
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
