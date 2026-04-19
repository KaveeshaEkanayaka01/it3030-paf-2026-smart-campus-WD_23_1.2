import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/httpClient';
import {
  FaShieldAlt,
  FaBell,
  FaTicketAlt,
  FaCalendarCheck,
  FaUsers,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaLock,
  FaMobile,
  FaChartLine,
} from 'react-icons/fa';

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      const isAdmin =
        Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN');
      navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <FaCalendarCheck size={22} />,
      title: 'Resource Booking',
      description:
        'Book campus facilities, labs, and meeting rooms with real-time availability.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaTicketAlt size={22} />,
      title: 'Incident Tickets',
      description:
        'Report maintenance issues and track them from submission to resolution.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <FaBell size={22} />,
      title: 'Smart Notifications',
      description:
        'Get instant alerts for booking approvals, ticket updates and comments.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FaShieldAlt size={22} />,
      title: 'Role Based Access',
      description:
        'Secure multi-role system with Users, Admins and Technicians.',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: <FaChartLine size={22} />,
      title: 'Analytics Dashboard',
      description:
        'Visual insights into campus resource usage and incident trends.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <FaMobile size={22} />,
      title: 'Mobile Friendly',
      description:
        'Fully responsive design that works seamlessly on any device.',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Users' },
    { value: '50+', label: 'Resources' },
    { value: '1000+', label: 'Bookings' },
    { value: '99%', label: 'Uptime' },
  ];

  const benefits = [
    'Instant booking confirmation',
    'Real-time status tracking',
    'Secure OAuth 2.0 login',
    'Role-based access control',
    'Automated notifications',
    'Multi-device support',
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Sign In',
      description: 'Login securely using your GitHub or Google account.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      step: '02',
      title: 'Browse Resources',
      description: 'Explore available campus facilities and check real-time availability.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      step: '03',
      title: 'Book & Track',
      description: 'Make bookings, report issues and receive instant notifications.',
      color: 'from-green-500 to-teal-500',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student',
      text: 'Booking study rooms has never been easier. The real-time notifications keep me updated instantly.',
      avatar: 'SJ',
      color: 'from-blue-500 to-purple-500',
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Faculty',
      text: 'Managing lab bookings used to take hours. Now it takes minutes. Absolutely love this system.',
      avatar: 'MC',
      color: 'from-green-500 to-teal-500',
    },
    {
      name: 'James Wilson',
      role: 'IT Technician',
      text: 'The ticket system helps me prioritize and resolve campus issues much faster than before.',
      avatar: 'JW',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">

      {/* ===== ANIMATED BACKGROUND ===== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl
                     bg-gradient-to-r from-blue-600 to-purple-600
                     transition-all duration-1000 ease-out"
          style={{ left: mousePos.x - 192, top: mousePos.y - 192 }}
        />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full
                        opacity-10 blur-3xl
                        bg-gradient-to-r from-purple-600 to-pink-600
                        animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full
                        opacity-10 blur-3xl
                        bg-gradient-to-r from-blue-600 to-cyan-600
                        animate-pulse" />
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500
                          to-purple-600 rounded-xl
                          flex items-center justify-center">
            <span className="text-white font-black text-lg">S</span>
          </div>
          <div>
            <h1 className="font-black text-lg text-white leading-none">
              SmartCampus
            </h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features"
            className="text-gray-400 hover:text-white text-sm transition-colors">
            Features
          </a>
          <a href="#how-it-works"
            className="text-gray-400 hover:text-white text-sm transition-colors">
            How It Works
          </a>
          <a href="#stats"
            className="text-gray-400 hover:text-white text-sm transition-colors">
            Stats
          </a>
          <a href="#testimonials"
            className="text-gray-400 hover:text-white text-sm transition-colors">
            Reviews
          </a>
          <a href="#about"
            className="text-gray-400 hover:text-white text-sm transition-colors">
            About
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/login/local')}
            className="flex items-center gap-2 bg-white/10 border border-white/20
                       text-white px-4 py-2 rounded-xl font-semibold text-sm
                       hover:bg-white/20 transition-all duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center gap-2
                       bg-gradient-to-r from-blue-600 to-purple-600
                       text-white px-4 py-2 rounded-xl font-semibold text-sm
                       hover:from-blue-500 hover:to-purple-500
                       transition-all duration-200 hover:shadow-lg"
          >
            Sign Up
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
            Smart Campus Management Platform
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
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-6
                      leading-relaxed">
          A unified platform for booking resources, managing incidents,
          and staying connected with real-time notifications.
          Built for the modern campus experience.
        </p>

        {/* Benefits pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {benefits.map((benefit, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 bg-white/5 border
                         border-white/10 rounded-full px-3 py-1.5
                         text-xs text-gray-300"
            >
              <FaCheckCircle className="text-green-400" size={10} />
              {benefit}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            onClick={() => navigate('/login/local')}
            className="group flex items-center gap-3
                       bg-gradient-to-r from-blue-600 to-purple-600
                       hover:from-blue-500 hover:to-purple-500
                       text-white px-8 py-4 rounded-2xl font-bold text-base
                       transition-all duration-300
                       hover:shadow-2xl hover:shadow-blue-500/30
                       hover:-translate-y-1"
          >
            Get Started Free
            <FaArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          <button
            onClick={() =>
              document.getElementById('features').scrollIntoView({
                behavior: 'smooth',
              })
            }
            className="flex items-center gap-2
                       border border-white/20 text-gray-300
                       px-8 py-4 rounded-2xl font-semibold text-base
                       hover:bg-white/10 hover:text-white
                       transition-all duration-300"
          >
            Learn More
          </button>
        </div>

        {/* Preview Window */}
        <div className="relative w-full max-w-4xl">
          <div className="absolute inset-0 bg-gradient-to-r
                          from-blue-600 to-purple-600
                          opacity-20 blur-3xl rounded-3xl"></div>
          <div className="relative bg-gray-900 rounded-3xl
                          border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-5 py-3
                            border-b border-white/10 bg-gray-800/50">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-700 rounded-lg px-3 py-1 text-xs
                                text-gray-400 text-center w-48 mx-auto">
                  smartcampus.app/dashboard
                </div>
              </div>
            </div>
            <div className="p-5 bg-gray-950">
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600
                              rounded-xl p-4 mb-4">
                <div className="w-32 h-3 bg-white/30 rounded-full mb-2"></div>
                <div className="w-48 h-5 bg-white/40 rounded-full mb-2"></div>
                <div className="w-40 h-3 bg-white/20 rounded-full"></div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {['bg-blue-900', 'bg-orange-900',
                  'bg-purple-900', 'bg-green-900'].map((bg, i) => (
                  <div key={i} className={`${bg} rounded-xl p-3`}>
                    <div className="w-8 h-8 bg-white/10 rounded-lg mb-2"></div>
                    <div className="w-8 h-5 bg-white/20 rounded mb-1"></div>
                    <div className="w-12 h-2 bg-white/10 rounded-full"></div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-900 rounded-xl p-3 h-16
                              flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-xl
                                flex-shrink-0"></div>
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
              <div key={i}
                className="text-center p-6 rounded-2xl bg-white/5
                           border border-white/10 backdrop-blur-sm
                           hover:bg-white/10 transition-all duration-300">
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
              effortless and efficient for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div key={i}
                className="group relative p-6 rounded-2xl
                           bg-white/5 border border-white/10
                           hover:bg-white/10 hover:border-white/20
                           transition-all duration-300
                           hover:-translate-y-1 hover:shadow-xl
                           hover:shadow-black/30">
                <div className={`absolute top-0 left-6 right-6 h-0.5
                                rounded-full bg-gradient-to-r
                                ${feature.color} opacity-0
                                group-hover:opacity-100 transition-opacity`}>
                </div>
                <div className="flex items-start gap-4">
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

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-400 text-sm font-semibold uppercase
                          tracking-widest mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Three simple steps to access everything SmartCampus has to offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((item, i) => (
              <div key={i}
                className="relative p-6 rounded-2xl bg-white/5
                           border border-white/10 text-center
                           hover:bg-white/10 transition-all duration-300
                           hover:-translate-y-1">
                {/* Step number */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br
                                 ${item.color} flex items-center justify-center
                                 mx-auto mb-4`}>
                  <span className="text-white font-black text-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Connector arrow */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2
                                  -translate-y-1/2 z-10">
                    <FaArrowRight className="text-gray-600" size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-pink-400 text-sm font-semibold uppercase
                          tracking-widest mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Loved by Campus Users
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              See what students, faculty and staff are saying about SmartCampus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10
                           hover:bg-white/10 transition-all duration-300
                           hover:-translate-y-1">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <FaStar key={j} className="text-yellow-400" size={12} />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-5
                              italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br
                                   ${testimonial.color} flex items-center
                                   justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-xs">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-400 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECURITY SECTION ===== */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800
                          border border-white/10 rounded-3xl p-8
                          flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl
                                flex items-center justify-center">
                  <FaLock className="text-green-400" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Enterprise Grade Security
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Your data is always protected
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                SmartCampus uses industry-standard OAuth 2.0 authentication
                with JWT tokens. We never store your passwords and all
                data is encrypted in transit.
              </p>
              <div className="flex flex-wrap gap-2">
                {['OAuth 2.0', 'JWT Tokens', 'HTTPS', 'Role Based Access',
                  'Encrypted Storage'].map((tag, i) => (
                  <span key={i}
                    className="text-xs bg-green-500/10 text-green-400
                               border border-green-500/20
                               px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              {[
                { icon: <FaCheckCircle />, text: 'No passwords stored' },
                { icon: <FaCheckCircle />, text: 'Secure token auth' },
                { icon: <FaCheckCircle />, text: 'Role based control' },
                { icon: <FaCheckCircle />, text: 'Session management' },
              ].map((item, i) => (
                <div key={i}
                  className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
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
              <div className="flex items-center gap-2 bg-white/10
                              rounded-full px-4 py-2">
                <FaUsers className="text-blue-400" size={14} />
                <span className="text-xs text-gray-300">
                  Built by a Dedicated Team
                </span>
              </div>
            </div>
            <h2 className="text-3xl font-black text-white mb-4">
              About SmartCampus
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
              SmartCampus is a full-stack campus management platform
              built with Spring Boot and React. Designed to simplify
              how students, faculty and staff interact with campus
              resources and services every day.
            </p>

            {/* Modules */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                {
                  label: 'Resources',
                  desc: 'Manage campus assets',
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  label: 'Bookings',
                  desc: 'Reserve facilities',
                  color: 'from-purple-500 to-pink-500',
                },
                {
                  label: 'Tickets',
                  desc: 'Report incidents',
                  color: 'from-orange-500 to-red-500',
                },
                {
                  label: 'Auth & Notify',
                  desc: 'Secure & notify',
                  color: 'from-green-500 to-teal-500',
                },
              ].map((item, i) => (
                <div key={i}
                  className="bg-white/5 border border-white/10
                             rounded-xl p-4 text-center
                             hover:bg-white/10 transition-all duration-300">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br
                                   ${item.color} mx-auto mb-2`}></div>
                  <p className="text-white text-sm font-semibold">
                    {item.label}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/login/local')}
              className="group inline-flex items-center gap-3
                         bg-gradient-to-r from-blue-600 to-purple-600
                         hover:from-blue-500 hover:to-purple-500
                         text-white px-8 py-4 rounded-2xl font-bold
                         transition-all duration-300
                         hover:shadow-2xl hover:shadow-blue-500/30
                         hover:-translate-y-1"
            >
              Get Started Free
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
              SmartCampus © 2024 — All rights reserved
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FaShieldAlt size={12} />
            <span>Secured with GitHub & Google OAuth 2.0 + JWT</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0px); }
          to { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}