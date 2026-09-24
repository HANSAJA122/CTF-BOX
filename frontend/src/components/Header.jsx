import React from 'react';
import { useAuth } from '../services/AuthContext';
import { Shield, Award, Terminal, Activity } from 'lucide-react';

const Header = ({ pageTitle = 'Dashboard' }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="h-16 bg-[#0d1117] border-b border-[#1f293d] px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left Title & Status */}
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span className="text-[#10b981]">$</span> {pageTitle}
        </h2>

        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#121824] border border-[#1f293d] rounded text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="text-slate-400">DOCKER LAB:</span>
          <span className="text-[#10b981] font-semibold">ONLINE</span>
        </div>
      </div>

      {/* Right User Lab Stats */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-[#121824] border border-[#1f293d] px-3 py-1.5 rounded text-xs font-mono">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">SCORE:</span>
          <span className="text-amber-400 font-bold">{user?.score || 0} PTS</span>
        </div>

        <div className="flex items-center gap-2 bg-[#121824] border border-[#1f293d] px-3 py-1.5 rounded text-xs font-mono">
          <Shield className="w-3.5 h-3.5 text-[#10b981]" />
          <span className="text-slate-400">ROLE:</span>
          <span className="text-slate-200 font-semibold uppercase">{user?.role || 'STUDENT'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
