import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Flag, User, LogOut, Award } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-[#080b14] border-b border-[#1e293b] px-6 py-3 sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Platform Name */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="p-1.5 bg-[#4285f4]/10 border border-[#4285f4]/30 rounded text-[#4285f4] group-hover:bg-[#4285f4]/20 transition-colors">
            <Flag className="w-5 h-5 text-[#ea4335] fill-[#ea4335]/20" />
          </div>
          <div>
            <div className="font-pixel text-xs text-slate-100 tracking-wider">
              <span className="text-[#4285f4]">CYBER</span>
              <span className="text-[#34a853]">VAULT</span> CTF
            </div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
              SLIIT Security Range
            </div>
          </div>
        </NavLink>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#101625] border border-[#1e293b] p-1 rounded font-mono text-xs">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded transition-all font-semibold ${
                isActive
                  ? 'bg-[#4285f4] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-[#182235]'
              }`
            }
          >
            [ CHALLENGES ]
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded transition-all font-semibold ${
                isActive
                  ? 'bg-[#4285f4] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-[#182235]'
              }`
            }
          >
            [ SCOREBOARD ]
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded transition-all font-semibold ${
                isActive
                  ? 'bg-[#4285f4] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-[#182235]'
              }`
            }
          >
            [ MY PROFILE ]
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded transition-all font-semibold ${
                  isActive
                    ? 'bg-[#ab47bc] text-white'
                    : 'text-purple-400 hover:text-white hover:bg-[#182235]'
                }`
              }
            >
              [ ADMIN ]
            </NavLink>
          )}
        </div>

        {/* Contestant Specs & Disconnect */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#101625] border border-[#1e293b] px-3 py-1.5 rounded font-mono text-xs">
            <User className="w-3.5 h-3.5 text-[#4285f4]" />
            <span className="text-slate-200 font-bold">{user?.username}</span>
            <span className="text-slate-600">|</span>
            <Award className="w-3.5 h-3.5 text-[#fbbc04]" />
            <span className="text-[#fbbc04] font-bold">{user?.score || 0} PTS</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded border border-[#1e293b] transition-colors"
            title="Disconnect"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
