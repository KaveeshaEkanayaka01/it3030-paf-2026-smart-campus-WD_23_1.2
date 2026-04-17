import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

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
        // Redirect to the callback route which will finalize login
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900 border border-white/10">
        <h2 className="text-2xl font-bold mb-4">Sign in with email</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-2 rounded-md bg-gray-800 border border-white/5"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-2 rounded-md bg-gray-800 border border-white/5"
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 rounded-md font-semibold hover:bg-blue-500"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-gray-400 underline"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
