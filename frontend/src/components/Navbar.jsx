import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Shield, Trophy, LayoutDashboard, LogOut, User, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 text-emerald-400 font-bold text-xl tracking-wide group">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg group-hover:bg-emerald-500/20 transition-all">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <span>CyberVault <span className="text-slate-400 text-sm font-mono font-normal">CTF Platform</span></span>
        </Link>

        {/* Navigation Links */}
        {isAuthenticated && (
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md transition-all ${
                isActive('/')
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/leaderboard"
              className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md transition-all ${
                isActive('/leaderboard')
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md transition-all ${
                  isActive('/admin')
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>
        )}

        {/* User Badge / Auth controls */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-3.5 py-1.5 rounded-full">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-200">{user?.username}</span>
              <span className="bg-emerald-500/20 text-emerald-400 font-mono text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                {user?.score || 0} pts
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="cyber-button-secondary text-sm">
              Log In
            </Link>
            <Link to="/register" className="cyber-button-primary text-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
