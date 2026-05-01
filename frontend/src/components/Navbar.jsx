import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50" style={{ boxShadow: '0 1px 20px rgba(0,0,0,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                <span className="text-white font-black text-sm">T</span>
              </div>
              <span className="font-black text-slate-900 text-lg tracking-tight">TaskFlow</span>
            </Link>
            <div className="flex items-center gap-1">
              {[{ path: '/dashboard', label: 'Dashboard', icon: '📊' }, { path: '/projects', label: 'Projects', icon: '📁' }].map(link => (
                <Link key={link.path} to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    location.pathname.startsWith(link.path)
                      ? 'text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  style={location.pathname.startsWith(link.path) ? { background: 'linear-gradient(135deg, #6366f1, #4f46e5)' } : {}}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }}
              className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-100">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;