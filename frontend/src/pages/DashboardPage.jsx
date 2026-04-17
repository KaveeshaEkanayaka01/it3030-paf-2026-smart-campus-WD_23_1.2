import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationBell from '../components/notifications/NotificationBell';
import { useNavigate } from 'react-router-dom';
import {
  FaTicketAlt,
  FaCalendarCheck,
  FaBell,
  FaUserShield,
  FaSignOutAlt,
  FaHome,
  FaUsers,
  FaChartBar,
  FaMoon,
  FaSun,
  FaGithub,
  FaCheckCircle,
  FaClock,
  FaUser,
} from 'react-icons/fa';

export default function DashboardPage() {
  const { user, logout, isAdmin, isTechnician } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
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
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>

      {/* ========== SIDEBAR ========== */}
      <aside
        className={`
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
          border-r transition-all duration-300 flex flex-col
          fixed h-full z-40
        `}
      >
        {/* Logo */}
        <div className={`p-5 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600
                            rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  SmartCampus
                </h1>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">

          {/* Dashboard */}
          <button
            onClick={() => { setShowProfile(false); navigate('/dashboard'); }}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl
              transition-all duration-200 text-left
              ${!showProfile
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : darkMode
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
            `}
          >
            <FaHome size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Dashboard</span>}
          </button>

          {/* Bookings */}
          <button
            onClick={() => navigate('/bookings')}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl
              transition-all duration-200 text-left
              ${darkMode
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
            `}
          >
            <FaCalendarCheck size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Bookings</span>}
          </button>

          {/* Tickets */}
          <button
            onClick={() => navigate('/tickets')}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl
              transition-all duration-200 text-left
              ${darkMode
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
            `}
          >
            <FaTicketAlt size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Tickets</span>}
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl
              transition-all duration-200 text-left relative
              ${darkMode
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
            `}
          >
            <FaBell size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Notifications</span>}
            {unreadCount > 0 && (
              <span className="absolute right-3 top-2 bg-red-500 text-white
                               text-xs rounded-full h-5 w-5 flex items-center
                               justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Admin Section */}
          {isAdmin() && (
            <>
              <div className="pt-3 pb-1 px-3">
                {sidebarOpen && (
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Admin
                  </p>
                )}
              </div>

              <button
                onClick={() => navigate('/admin/users')}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl
                  transition-all duration-200 text-left
                  ${darkMode
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <FaUsers size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">Manage Users</span>}
              </button>

              <button
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl
                  transition-all duration-200 text-left
                  ${darkMode
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <FaChartBar size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">Analytics</span>}
              </button>
            </>
          )}
        </nav>

        {/* ========== SIDEBAR BOTTOM ========== */}
        <div className={`p-3 border-t space-y-1
                        ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>

          {/* Profile Button */}
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl
              transition-all duration-200 text-left
              ${showProfile
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : darkMode
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
            `}
          >
            {/* Avatar or Icon */}
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
              />
            ) : (
              <FaUser size={18} className="flex-shrink-0" />
            )}
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.name?.split(' ')[0]}
                </p>
                <p className="text-xs opacity-70 truncate">
                  View Profile
                </p>
              </div>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl
              transition-all duration-200 text-left
              text-red-500
              ${darkMode ? 'hover:bg-red-950' : 'hover:bg-red-50'}
            `}
          >
            <FaSignOutAlt size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main
        className={`
          flex-1 transition-all duration-300
          ${sidebarOpen ? 'ml-64' : 'ml-20'}
        `}
      >
        {/* ========== TOP NAVBAR ========== */}
        <header
          className={`
            sticky top-0 z-30 px-6 py-4
            flex items-center justify-between
            border-b backdrop-blur-md
            ${darkMode
              ? 'bg-gray-950/90 border-gray-800'
              : 'bg-white/90 border-gray-200'}
          `}
        >
          {/* Left - Toggle + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors
                ${darkMode
                  ? 'text-gray-400 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="space-y-1.5">
                <span className={`block w-5 h-0.5
                  ${darkMode ? 'bg-gray-400' : 'bg-gray-600'}`}></span>
                <span className={`block w-5 h-0.5
                  ${darkMode ? 'bg-gray-400' : 'bg-gray-600'}`}></span>
                <span className={`block w-5 h-0.5
                  ${darkMode ? 'bg-gray-400' : 'bg-gray-600'}`}></span>
              </div>
            </button>
            <div>
              <h2 className={`font-bold text-lg
                ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {showProfile ? 'My Profile' : 'Dashboard'}
              </h2>
              <p className="text-xs text-gray-400">{formatDate(currentTime)}</p>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3">

            {/* Live Clock */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg
              ${darkMode
                ? 'bg-gray-800 text-gray-300'
                : 'bg-gray-100 text-gray-600'}`}>
              <FaClock size={12} />
              <span className="text-xs font-mono">{formatTime(currentTime)}</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors
                ${darkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* User Info */}
            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-9 h-9 rounded-full ring-2 ring-blue-500 ring-offset-2"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br
                                from-blue-500 to-purple-600
                                flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              )}
              <div className="hidden md:block">
                <p className={`text-sm font-medium
                  ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {user?.name}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full text-white
                                  ${getRoleBadge().color}`}>
                  {getRoleBadge().label}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ========== PAGE CONTENT ========== */}
        <div className="p-6 space-y-6">

          {/* ===== PROFILE VIEW ===== */}
          {showProfile ? (
            <div className="max-w-2xl mx-auto space-y-4">

              {/* Profile Header Card */}
              <div className="relative overflow-hidden rounded-2xl
                              bg-gradient-to-r from-blue-600 via-purple-600
                              to-indigo-700 p-6 text-white">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10
                                rounded-full -translate-y-24 translate-x-24"></div>
                <div className="relative z-10 flex items-center gap-5">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-20 h-20 rounded-2xl ring-4 ring-white/30 object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white/20
                                    flex items-center justify-center">
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
                      <span className="text-blue-200 text-sm">
                        @{user?.githubUsername}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details Card */}
              <div className={`rounded-2xl p-6 border
                              ${darkMode
                                ? 'bg-gray-900 border-gray-800'
                                : 'bg-white border-gray-100 shadow-sm'}`}>
                <h3 className={`font-bold text-base mb-4
                                ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Account Details
                </h3>

                <div className="space-y-4">
                  <div className={`flex justify-between items-center
                                  py-3 border-b
                                  ${darkMode
                                    ? 'border-gray-800'
                                    : 'border-gray-100'}`}>
                    <span className="text-gray-400 text-sm">Full Name</span>
                    <span className={`text-sm font-medium
                                      ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {user?.name}
                    </span>
                  </div>

                  <div className={`flex justify-between items-center
                                  py-3 border-b
                                  ${darkMode
                                    ? 'border-gray-800'
                                    : 'border-gray-100'}`}>
                    <span className="text-gray-400 text-sm">Email</span>
                    <span className={`text-sm font-medium
                                      ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {user?.email}
                    </span>
                  </div>

                  <div className={`flex justify-between items-center
                                  py-3 border-b
                                  ${darkMode
                                    ? 'border-gray-800'
                                    : 'border-gray-100'}`}>
                    <span className="text-gray-400 text-sm">GitHub Username</span>
                    <span className={`text-sm font-medium
                                      ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      @{user?.githubUsername}
                    </span>
                  </div>

                  <div className={`flex justify-between items-center
                                  py-3 border-b
                                  ${darkMode
                                    ? 'border-gray-800'
                                    : 'border-gray-100'}`}>
                    <span className="text-gray-400 text-sm">Account Status</span>
                    <span className="text-sm font-medium text-green-500
                                     flex items-center gap-1">
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
                          className="text-xs px-3 py-1 rounded-full
                                     bg-blue-100 text-blue-700 font-medium"
                        >
                          {role.replace('ROLE_', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Auth Info Card */}
              <div className={`rounded-2xl p-6 border
                              ${darkMode
                                ? 'bg-gray-900 border-gray-800'
                                : 'bg-white border-gray-100 shadow-sm'}`}>
                <h3 className={`font-bold text-base mb-4
                                ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Authentication
                </h3>
                <div className={`flex items-center gap-4 p-4 rounded-xl
                                ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="w-10 h-10 bg-gray-900 rounded-xl
                                  flex items-center justify-center flex-shrink-0">
                    <FaGithub className="text-white" size={20} />
                  </div>
                  <div>
                    <p className={`font-medium text-sm
                                   ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      GitHub OAuth 2.0
                    </p>
                    <p className="text-gray-400 text-xs">
                      Signed in via GitHub authentication
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-green-100 text-green-700
                                     px-2 py-1 rounded-full font-medium">
                      Connected
                    </span>
                  </div>
                </div>
              </div>
            </div>

          ) : (

            /* ===== DASHBOARD VIEW ===== */
            <>
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-2xl
                              bg-gradient-to-r from-blue-600 via-purple-600
                              to-indigo-700 p-6 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10
                                rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10
                                rounded-full translate-y-24 -translate-x-24"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">
                      {getGreeting()} 👋
                    </p>
                    <h2 className="text-2xl font-bold mb-1">
                      Welcome back, {user?.name?.split(' ')[0]}!
                    </h2>
                    <p className="text-blue-200 text-sm">
                      Here's what's happening in your campus today.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <FaGithub size={14} className="text-blue-300" />
                      <span className="text-blue-200 text-xs">
                        @{user?.githubUsername}
                      </span>
                    </div>
                  </div>

                  {user?.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-20 h-20 rounded-2xl ring-4 ring-white/30
                                 hidden md:block object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Bookings Card */}
                <div className={`rounded-2xl p-5 border transition-all duration-200
                                hover:shadow-lg hover:-translate-y-1 cursor-pointer
                                ${darkMode
                                  ? 'bg-gray-900 border-gray-800'
                                  : 'bg-white border-gray-100 shadow-sm'}`}
                  onClick={() => navigate('/bookings')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 bg-blue-100 rounded-xl
                                    flex items-center justify-center">
                      <FaCalendarCheck className="text-blue-600" size={20} />
                    </div>
                    <span className="text-xs font-medium text-green-500
                                     bg-green-50 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className={`text-3xl font-bold mb-1
                                ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    0
                  </p>
                  <p className="text-sm text-gray-400">My Bookings</p>
                </div>

                {/* Tickets Card */}
                <div className={`rounded-2xl p-5 border transition-all duration-200
                                hover:shadow-lg hover:-translate-y-1 cursor-pointer
                                ${darkMode
                                  ? 'bg-gray-900 border-gray-800'
                                  : 'bg-white border-gray-100 shadow-sm'}`}
                  onClick={() => navigate('/tickets')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 bg-orange-100 rounded-xl
                                    flex items-center justify-center">
                      <FaTicketAlt className="text-orange-600" size={20} />
                    </div>
                    <span className="text-xs font-medium text-orange-500
                                     bg-orange-50 px-2 py-1 rounded-full">
                      Open
                    </span>
                  </div>
                  <p className={`text-3xl font-bold mb-1
                                ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    0
                  </p>
                  <p className="text-sm text-gray-400">My Tickets</p>
                </div>

                {/* Notifications Card */}
                <div className={`rounded-2xl p-5 border transition-all duration-200
                                hover:shadow-lg hover:-translate-y-1 cursor-pointer
                                ${darkMode
                                  ? 'bg-gray-900 border-gray-800'
                                  : 'bg-white border-gray-100 shadow-sm'}`}
                  onClick={() => navigate('/notifications')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 bg-purple-100 rounded-xl
                                    flex items-center justify-center">
                      <FaBell className="text-purple-600" size={20} />
                    </div>
                    {unreadCount > 0 && (
                      <span className="text-xs font-medium text-red-500
                                       bg-red-50 px-2 py-1 rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <p className={`text-3xl font-bold mb-1
                                ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {unreadCount}
                  </p>
                  <p className="text-sm text-gray-400">Unread Notifications</p>
                </div>

                {/* Roles Card */}
                <div className={`rounded-2xl p-5 border transition-all duration-200
                                hover:shadow-lg hover:-translate-y-1
                                ${darkMode
                                  ? 'bg-gray-900 border-gray-800'
                                  : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 bg-green-100 rounded-xl
                                    flex items-center justify-center">
                      <FaUserShield className="text-green-600" size={20} />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold mb-1
                                ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {user?.roles?.length || 1}
                  </p>
                  <p className="text-sm text-gray-400">Assigned Roles</p>
                </div>
              </div>

              {/* Role Tags */}
              <div className={`rounded-2xl p-6 border
                              ${darkMode
                                ? 'bg-gray-900 border-gray-800'
                                : 'bg-white border-gray-100 shadow-sm'}`}>
                <h3 className={`font-bold text-base mb-4
                                ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  🎭 Your Access Level
                </h3>
                <div className="flex flex-wrap gap-3">
                  {user?.roles?.map((role) => (
                    <div
                      key={role}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl
                                 bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <FaUserShield className="text-white" size={14} />
                      <span className="text-white text-sm font-medium">
                        {role.replace('ROLE_', '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}