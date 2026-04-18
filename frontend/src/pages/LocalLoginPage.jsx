import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { API_BASE_URL } from '../api/httpClient';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function LocalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const token = res?.data?.token;
      if (token) {
        window.location.href = `/auth/callback?token=${encodeURIComponent(token)}`;
      } else {
        setError('Invalid server response');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = `${API_BASE_URL.replace(/\/$/, '')}/oauth2/authorization/github`;
  };

  // ✅ Add Google login handler
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL.replace(/\/$/, '')}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4"
         style={{ backgroundColor: '#021026' }}>
      <div className="w-full max-w-4xl rounded-2xl bg-white/5 backdrop-blur-sm
                      border border-white/10 grid grid-cols-1 md:grid-cols-2
                      overflow-hidden shadow-2xl relative">

        {/* Left Visual Panel */}
        <div className="hidden md:flex flex-col justify-center gap-4 p-8
                        bg-gradient-to-br from-blue-500 to-purple-600
                        text-white relative overflow-hidden">
          <div className="absolute -right-16 -top-10 w-56 h-56 rounded-full
                          bg-white/10 blur-3xl transform rotate-12" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full
                          bg-pink-400/20 blur-2xl" />

          <h3 className="text-3xl font-black">Welcome back</h3>
          <p className="text-white/90">
            Sign in to access your dashboard, bookings and incident tickets.
            Use your email or social login.
          </p>

          <div className="mt-6 grid gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-300
                              to-blue-500 rounded-lg shadow" />
              <div>
                <p className="text-sm font-bold">Resource Booking</p>
                <p className="text-xs text-white/80">Manage bookings with ease</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-300
                              to-purple-500 rounded-lg shadow" />
              <div>
                <p className="text-sm font-bold">Incident Tickets</p>
                <p className="text-xs text-white/80">Report and track issues</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="p-8 bg-transparent">
          <h2 className="text-2xl font-bold mb-1 text-white">
            Sign in with email
          </h2>
          <p className="text-sm text-white/80 mb-6">
            Enter your campus email and password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white/80">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 p-3 rounded-lg bg-white/6
                           border border-white/10 placeholder-white/50
                           text-white outline-none
                           focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm text-white/80">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-3 rounded-lg bg-white/6
                           border border-white/10 placeholder-white/50
                           text-white outline-none
                           focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {error && (
              <div className="text-red-300 text-sm">{error}</div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 bg-gradient-to-r from-emerald-400
                           to-cyan-500 text-white rounded-lg font-semibold
                           shadow-lg hover:scale-[1.01] transition-transform
                           disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-white/80 underline"
              >
                Back
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <div className="text-xs text-white/80 uppercase font-semibold">
              Or continue with
            </div>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-1 gap-3">

            {/* ✅ Google Button - now working */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2
                         bg-gradient-to-r from-red-500 to-yellow-400
                         text-white px-4 py-3 rounded-lg text-sm
                         font-medium shadow-md hover:opacity-90
                         hover:scale-[1.01] transition-all duration-200
                         cursor-pointer"
            >
              <FaGoogle />
              Continue with Google
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGitHubLogin}
                className="flex-1 inline-flex items-center justify-center
                           gap-2 bg-black text-white px-4 py-3 rounded-lg
                           text-sm font-medium shadow-md hover:shadow-lg
                           hover:scale-[1.01] transition-all duration-200"
              >
                <FaGithub />
                Continue with GitHub
              </button>

              <button
                type="button"
                onClick={handleGitHubLogin}
                className="px-4 py-3 text-sm text-white
                           bg-gradient-to-r from-purple-500 to-pink-500
                           rounded-lg hover:opacity-95 shadow-md
                           hover:scale-[1.01] transition-all duration-200"
              >
                Connect Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}