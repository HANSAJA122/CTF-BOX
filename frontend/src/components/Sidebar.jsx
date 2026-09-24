import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import {
  Terminal,
  LayoutDashboard,
  Target,
  Trophy,
  User,
  PlusCircle,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <aside className="w-64 bg-[#0d1117] border-r border-[#1f293d] min-h-screen flex flex-col justify-between flex-shrink-0 z-30 select-none">
      <div>
        {/* Platform Brand Header */}
        <div className="p-5 border-b border-[#1f293d] flex items-center gap-3">
          <div className="p-2 bg-[#10b981]/10 border border-[#10b981]/30 rounded text-[#10b981]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-slate-100 tracking-tight text-base">
                CYBER<span className="text-[#10b981]">VAULT</span>
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              SLIIT Security Labs
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono uppercase text-slate-500 tracking-wider font-semibold">
            Lab Navigation
          </div>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-[#1a2332] text-[#10b981] border-l-2 border-[#10b981] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121824]'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/challenges"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-[#1a2332] text-[#10b981] border-l-2 border-[#10b981] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121824]'
              }`
            }
          >
            <Target className="w-4 h-4" />
            <span>CTF Challenges</span>
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-[#1a2332] text-[#10b981] border-l-2 border-[#10b981] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121824]'
              }`
            }
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-[#1a2332] text-[#10b981] border-l-2 border-[#10b981] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121824]'
              }`
            }
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </NavLink>

          {isAdmin && (
            <div className="pt-4 space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-purple-400 tracking-wider font-semibold">
                Admin Controls
              </div>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-purple-950/40 text-purple-400 border-l-2 border-purple-500 font-semibold'
                      : 'text-slate-400 hover:text-purple-300 hover:bg-[#121824]'
                  }`
                }
              >
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <span>Manage Stages</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Footer User Info & Logout */}
      <div className="p-3 border-t border-[#1f293d] bg-[#0b0e14]">
        <div className="flex items-center justify-between p-2 rounded bg-[#121824] border border-[#1f293d]">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-7 h-7 rounded bg-[#1f293d] border border-slate-700 flex items-center justify-center font-mono text-xs text-slate-200 font-bold uppercase">
              {user?.username ? user.username.charAt(0) : 'U'}
            </div>
            <div className="truncate text-left">
              <div className="text-xs font-mono font-semibold text-slate-200 truncate">
                {user?.username}
              </div>
              <div className="text-[10px] font-mono text-[#10b981] font-bold">
                {user?.score || 0} Pts
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
