import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-bg flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full"></div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-lg">T</span>
          </div>
          <span className="text-white font-bold text-xl">TaskFlow</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Start your journey<br /><span className="text-indigo-200">today. 🚀</span>
          </h2>
          <p className="text-indigo-200 text-lg">Create your free account and start managing your team tasks like a pro.</p>
          <div className="mt-8 space-y-4">
            {['✅ Free forever, no credit card required', '✅ Unlimited projects & tasks', '✅ Role-based team access control'].map(f => (
              <div key={f} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <p className="text-white font-medium text-sm">{f}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-indigo-300 text-sm">© 2025 TaskFlow. All rights reserved.</div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Create your account ✨</h1>
            <p className="text-slate-500">Join your team on TaskFlow today</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="John Doe" className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 transition-all bg-slate-50 font-medium" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="you@company.com" className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 transition-all bg-slate-50 font-medium" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="Min. 6 characters" className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 transition-all bg-slate-50 font-medium" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Free Account →'}
            </button>
          </form>
          <p className="text-center text-slate-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;