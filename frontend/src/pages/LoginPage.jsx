import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/httpClient';
import { FaGithub, FaShieldAlt, FaBell, FaTicketAlt, FaCalendarCheck, FaUsers, FaArrowRight, FaStar } from 'react-icons/fa';

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      const isAdmin = Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN');
      navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Track mouse for gradient effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGitHubLogin = () => {
    window.location.href = `${API_BASE_URL.replace(/\/$/, '')}/oauth2/authorization/github`;
  };

  const features = [
    {
      icon: <FaCalendarCheck size={22} />,
      title: 'Resource Booking',
      description: 'Book campus facilities and resources with ease.',
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: <FaTicketAlt size={22} />,
      title: 'Incident Tickets',
      description: 'Report and track campus maintenance issues.',
      color: 'from-orange-500 to-red-500',
      bg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: <FaBell size={22} />,
      title: 'Smart Notifications',
      description: 'Get real-time alerts for all campus activities.',
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: <FaShieldAlt size={22} />,
      title: 'Role Based Access',
      description: 'Secure access control for users and admins.',
      color: 'from-green-500 to-teal-500',
      bg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Users' },
    { value: '50+', label: 'Resources' },
    { value: '1000+', label: 'Bookings' },
    { value: '99%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">

      {/* ===== ANIMATED BACKGROUND ===== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl
                     bg-gradient-to-r from-blue-600 to-purple-600
                     transition-all duration-1000 ease-out"
          style={{
            left: mousePos.x - 192,
            top: mousePos.y - 192,
          }}
        />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full
                        opacity-10 blur-3xl
                        bg-gradient-to-r from-purple-600 to-pink-600
                        animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full
                        opacity-10 blur-3xl
                        bg-gradient-to-r from-blue-600 to-cyan-600
                        animate-pulse" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-400 opacity-30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `bounce ${2 + i * 0.5}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className="relative z-10 flex items-center justify-between
                      px-6 md:px-12 py-5
                      border-b border-white/10 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600
                          rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-lg">S</span>
          </div>
          <div>
            <h1 className="font-black text-lg text-white leading-none">
              SmartCampus
            </h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features"
            className="text-gray-400 hover:text-white text-sm transition-colors">
            Features
          </a>
          <a href="#stats"
            className="text-gray-400 hover:text-white text-sm transition-colors">
            Stats
          </a>
          <a href="#about"
            className="text-gray-400 hover:text-white text-sm transition-colors">
            About
          </a>
        </div>

        {/* Login Button - single entry point */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login/local')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                       px-4 py-2 rounded-xl font-semibold text-sm
                       hover:from-blue-500 hover:to-purple-500 transition-all duration-200
                       hover:shadow-lg"
          >
            <span className="hidden md:inline">Login</span>
            <span className="md:hidden">Sign In</span>
          </button>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative z-10 flex flex-col items-center
                          text-center px-6 pt-20 pb-16">

        {/* Badge */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm
                        border border-white/20 rounded-full px-4 py-2 mb-8">
          <FaStar className="text-yellow-400" size={12} />
          <span className="text-xs text-gray-300 font-medium">
            SLIIT IT3030 — Smart Campus System
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          <span className="text-white">Manage Your</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400
                           to-pink-400 bg-clip-text text-transparent">
            Campus Smarter
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          A unified platform for booking resources, managing incidents,
          and staying connected with real-time notifications.
          Built for the modern campus experience.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          {/* Primary - GitHub Login */}
          <button
            onClick={handleGitHubLogin}
            className="group flex items-center gap-3
                       bg-gradient-to-r from-blue-600 to-purple-600
                       hover:from-blue-500 hover:to-purple-500
                       text-white px-8 py-4 rounded-2xl font-bold text-base
                       transition-all duration-300
                       hover:shadow-2xl hover:shadow-blue-500/30
                       hover:-translate-y-1"
          >
            <FaGithub size={20} />
            Continue with GitHub
            <FaArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          {/* Secondary */}
          <button
            onClick={() => document.getElementById('features').scrollIntoView({
              behavior: 'smooth'
            })}
            className="flex items-center gap-2
                       border border-white/20 text-gray-300
                       px-8 py-4 rounded-2xl font-semibold text-base
                       hover:bg-white/10 hover:text-white
                       transition-all duration-300"
          >
            Learn More
          </button>
        </div>

        {/* Hero Image / Preview Card */}
        <div className="relative w-full max-w-4xl">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600
                          opacity-20 blur-3xl rounded-3xl"></div>

          {/* Preview Window */}
          <div className="relative bg-gray-900 rounded-3xl border border-white/10
                          overflow-hidden shadow-2xl">

            {/* Window Bar */}
            <div className="flex items-center gap-2 px-5 py-3
                            border-b border-white/10 bg-gray-800/50">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-700 rounded-lg px-3 py-1 text-xs
                                text-gray-400 text-center w-48 mx-auto">
                  localhost:5173/dashboard
                </div>
              </div>
            </div>

            {/* Fake Dashboard Preview */}
            <div className="p-5 bg-gray-950">
              {/* Fake Navbar */}
              <div className="flex items-center justify-between mb-5
                              bg-gray-900 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500
                                  to-purple-600 rounded-lg"></div>
                  <div className="w-24 h-3 bg-gray-700 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                </div>
              </div>

              {/* Fake Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600
                              rounded-xl p-4 mb-4">
                <div className="w-32 h-3 bg-white/30 rounded-full mb-2"></div>
                <div className="w-48 h-5 bg-white/40 rounded-full mb-2"></div>
                <div className="w-40 h-3 bg-white/20 rounded-full"></div>
              </div>

              {/* Fake Stats */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {['bg-blue-900', 'bg-orange-900', 'bg-purple-900', 'bg-green-900'].map(
                  (bg, i) => (
                    <div key={i} className={`${bg} rounded-xl p-3`}>
                      <div className="w-8 h-8 bg-white/10 rounded-lg mb-2"></div>
                      <div className="w-8 h-5 bg-white/20 rounded mb-1"></div>
                      <div className="w-12 h-2 bg-white/10 rounded-full"></div>
                    </div>
                  )
                )}
              </div>

              {/* Fake Bottom */}
              <div className="bg-gray-900 rounded-xl p-3 h-16
                              flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-xl flex-shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="w-32 h-2 bg-gray-700 rounded-full"></div>
                  <div className="w-24 h-2 bg-gray-800 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section id="stats" className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl bg-white/5
                           border border-white/10 backdrop-blur-sm
                           hover:bg-white/10 transition-all duration-300"
              >
                <p className="text-4xl font-black bg-gradient-to-r
                              from-blue-400 to-purple-400
                              bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-blue-400 text-sm font-semibold uppercase
                          tracking-widest mb-3">
              Features
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A complete suite of tools designed to make campus management
              effortless and efficient.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl
                           bg-white/5 border border-white/10
                           hover:bg-white/10 hover:border-white/20
                           transition-all duration-300
                           hover:-translate-y-1 hover:shadow-xl
                           hover:shadow-black/30"
              >
                {/* Gradient bar top */}
                <div className={`absolute top-0 left-6 right-6 h-0.5
                                rounded-full bg-gradient-to-r
                                ${feature.color} opacity-0
                                group-hover:opacity-100 transition-opacity`}>
                </div>

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center
                                   justify-center flex-shrink-0
                                   bg-gradient-to-br ${feature.color}`}>
                    <span className="text-white">{feature.icon}</span>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-base mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20
                          border border-white/10 rounded-3xl p-8 md:p-12
                          text-center backdrop-blur-sm">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 bg-white/10 rounded-full
                              px-4 py-2">
                <FaUsers className="text-blue-400" size={14} />
                <span className="text-xs text-gray-300">Group Project</span>
              </div>
            </div>

            <h2 className="text-3xl font-black text-white mb-4">
              Built for SLIIT IT3030
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
              Smart Campus is a collaborative project built by our team
              as part of the IT3030 module. It demonstrates real-world
              full-stack development with Spring Boot and React.
            </p>

            {/* Team Modules */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Resources', member: 'Member 1' },
                { label: 'Bookings', member: 'Member 2' },
                { label: 'Tickets', member: 'Member 3' },
                { label: 'Auth & Notify', member: 'Member 4' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10
                             rounded-xl p-3 text-center"
                >
                  <p className="text-white text-sm font-semibold">
                    {item.label}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{item.member}</p>
                </div>
              ))}
            </div>

            {/* Final CTA */}
            <button
              onClick={handleGitHubLogin}
              className="group inline-flex items-center gap-3
                         bg-gradient-to-r from-blue-600 to-purple-600
                         hover:from-blue-500 hover:to-purple-500
                         text-white px-8 py-4 rounded-2xl font-bold
                         transition-all duration-300
                         hover:shadow-2xl hover:shadow-blue-500/30
                         hover:-translate-y-1"
            >
              <FaGithub size={20} />
              Get Started with GitHub
              <FaArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row
                        items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500
                            to-purple-600 rounded-lg
                            flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-gray-400 text-sm">
              SmartCampus © 2024 — SLIIT IT3030
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FaShieldAlt size={12} />
            <span>Secured with GitHub OAuth 2.0 & JWT</span>
          </div>
        </div>
      </footer>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          from { transform: translateY(0px); }
          to { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}