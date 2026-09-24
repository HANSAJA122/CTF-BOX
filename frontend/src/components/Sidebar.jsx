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
  Shield,
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
    <aside className="w-56 bg-[#070a0f] border-r border-[#1c2436] min-h-screen flex flex-col justify-between flex-shrink-0 z-30 select-none">
      <div>
        {/* Header Header */}
        <div className="p-3 border-b border-[#1c2436] bg-[#090d14] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#10b981]" />
          <div>
            <div className="font-mono font-bold text-slate-100 text-xs tracking-wider">
              CYBER<span className="text-[#10b981]">VAULT</span>
            </div>
            <div className="text-[9px] font-mono text-slate-500 uppercase">
              SLIIT SECURITY RANGE v2.4
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="p-2 space-y-0.5">
          <div className="px-2 py-1.5 text-[9px] font-mono uppercase text-slate-500 tracking-wider font-semibold">
            NAVIGATION
          </div>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-xs font-mono transition-colors ${
                isActive
                  ? 'bg-[#141a27] text-[#10b981] font-bold border-l-2 border-[#10b981]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d111a]'
              }`
            }
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/challenges"
            className={({ isActive }) =>
              `flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-xs font-mono transition-colors ${
                isActive
                  ? 'bg-[#141a27] text-[#10b981] font-bold border-l-2 border-[#10b981]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d111a]'
              }`
            }
          >
            <Target className="w-3.5 h-3.5" />
            <span>Challenges</span>
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-xs font-mono transition-colors ${
                isActive
                  ? 'bg-[#141a27] text-[#10b981] font-bold border-l-2 border-[#10b981]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d111a]'
              }`
            }
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-xs font-mono transition-colors ${
                isActive
                  ? 'bg-[#141a27] text-[#10b981] font-bold border-l-2 border-[#10b981]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d111a]'
              }`
            }
          >
            <User className="w-3.5 h-3.5" />
            <span>User Profile</span>
          </NavLink>

          {isAdmin && (
            <div className="pt-3 space-y-0.5">
              <div className="px-2 py-1 text-[9px] font-mono uppercase text-purple-400 tracking-wider font-semibold">
                ADMINISTRATION
              </div>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-purple-950/40 text-purple-400 font-bold border-l-2 border-purple-500'
                      : 'text-slate-400 hover:text-purple-300 hover:bg-[#0d111a]'
                  }`
                }
              >
                <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Manage Stages</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Footer User Info & Exit */}
      <div className="p-2 border-t border-[#1c2436] bg-[#090d14]">
        <div className="flex items-center justify-between p-1.5 bg-[#05080c] border border-[#1c2436]">
          <div className="truncate">
            <div className="text-[11px] font-mono font-bold text-slate-200 truncate">
              {user?.username}
            </div>
            <div className="text-[10px] font-mono text-[#10b981]">
              {user?.score || 0} PTS
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
            title="Disconnect Session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
