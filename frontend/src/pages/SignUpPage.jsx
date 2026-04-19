import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register(form);
      const token = res?.data?.token;

      if (!token) {
        setError('Registration succeeded but token is missing. Please login.');
        navigate('/login/local', { replace: true, state: { email: form.email } });
        return;
      }

      window.location.href = `/auth/callback?token=${encodeURIComponent(token)}`;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white px-4"
      style={{ backgroundColor: '#021026' }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white/5 backdrop-blur-sm
                   border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-1 text-white">
            Create your account
          </h2>
          <p className="text-sm text-white/80 mb-6">
            Sign up with email and password to use SmartCampus.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white/80">Full Name</label>
              <input
                required
                name="name"
                type="text"
                value={form.name}
                onChange={onChange}
                className="w-full mt-2 p-3 rounded-lg bg-white/6
                           border border-white/10 placeholder-white/50
                           text-white outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="text-sm text-white/80">Email</label>
              <input
                required
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                className="w-full mt-2 p-3 rounded-lg bg-white/6
                           border border-white/10 placeholder-white/50
                           text-white outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="yourname@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/80">Password</label>
                <input
                  required
                  name="password"
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={onChange}
                  className="w-full mt-2 p-3 rounded-lg bg-white/6
                             border border-white/10 placeholder-white/50
                             text-white outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div>
                <label className="text-sm text-white/80">Confirm Password</label>
                <input
                  required
                  name="confirmPassword"
                  type="password"
                  minLength={6}
                  value={form.confirmPassword}
                  onChange={onChange}
                  className="w-full mt-2 p-3 rounded-lg bg-white/6
                             border border-white/10 placeholder-white/50
                             text-white outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            {error && <div className="text-red-300 text-sm">{error}</div>}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 bg-gradient-to-r from-emerald-400 to-cyan-500
                           text-white rounded-lg font-semibold shadow-lg
                           hover:scale-[1.01] transition-transform disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/login/local')}
                className="px-5 py-3 border border-white/20 text-white rounded-lg
                           font-medium hover:bg-white/10 transition-colors"
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}