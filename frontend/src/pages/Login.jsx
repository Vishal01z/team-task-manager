import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <span className="text-white font-black text-lg">T</span>
            </div>
            <span className="text-white font-bold text-xl">TaskFlow</span>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Manage teams,<br />
            <span className="text-indigo-200">effortlessly.</span>
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Collaborate with your team, track progress in real-time, and never miss a deadline again.
          </p>
          <div className="mt-10 flex items-center gap-6">
            {[['500+', 'Teams'], ['10k+', 'Tasks Done'], ['99%', 'Uptime']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-white font-black text-2xl">{val}</p>
                <p className="text-indigo-300 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="flex -space-x-2">
              {['A','B','C'].map(l => (
                <div key={l} className="w-8 h-8 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{l}</span>
                </div>
              ))}
            </div>
            <p className="text-white text-sm">Join thousands of productive teams</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black">T</span>
            </div>
            <span className="font-bold text-lg text-slate-800">TaskFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome back 👋</h1>
            <p className="text-slate-500">Sign in to continue to your workspace</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
              <span className="text-red-500 text-lg">⚠️</span>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                placeholder="you@company.com"
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 transition-all bg-slate-50 text-slate-800 font-medium"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 transition-all bg-slate-50 text-slate-800 font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-60 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-slate-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;