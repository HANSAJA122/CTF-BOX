import React from 'react';
import { useAuth } from '../services/AuthContext';
import { Shield, Award, Terminal } from 'lucide-react';

const Header = ({ pageTitle = 'DASHBOARD' }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="h-9 bg-[#090d14] border-b border-[#1c2436] px-4 flex items-center justify-between sticky top-0 z-20 select-none text-xs font-mono">
      {/* Left Title */}
      <div className="flex items-center gap-3">
        <span className="text-slate-200 font-bold tracking-wider flex items-center gap-1.5">
          <span className="text-[#10b981]">$</span> {pageTitle}
        </span>

        <span className="text-slate-600">|</span>

        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          <span className="text-slate-400">RANGE STATUS:</span>
          <span className="text-[#10b981] font-bold">[ONLINE]</span>
        </div>
      </div>

      {/* Right Specs */}
      <div className="flex items-center gap-3 text-[11px]">
        <div className="flex items-center gap-1 text-slate-400">
          <span>HANDLE:</span>
          <strong className="text-slate-200">{user?.username}</strong>
        </div>

        <div className="flex items-center gap-1 text-amber-400 font-bold">
          <Award className="w-3 h-3" />
          <span>{user?.score || 0} PTS</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
