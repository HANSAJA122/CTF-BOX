import React from 'react';
import { CheckCircle2, Terminal, Award, HelpCircle, ArrowRight } from 'lucide-react';

const ChallengeCard = ({ challenge, onOpenModal }) => {
  const { title, category, difficulty, points, isSolved, containerPort, hints } = challenge;

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'badge-easy';
      case 'Medium':
        return 'badge-medium';
      case 'Hard':
        return 'badge-hard';
      default:
        return 'badge-easy';
    }
  };

  return (
    <div
      className={`htb-card p-5 flex flex-col justify-between relative group ${
        isSolved ? 'htb-card-active' : ''
      }`}
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="domain-pill truncate max-w-[150px]">{category}</span>
          <div className="flex items-center gap-1.5">
            <span className={getDifficultyBadge(difficulty)}>{difficulty}</span>
            {isSolved && (
              <span className="badge-solved flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#06b6d4]" />
                SOLVED
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-mono font-bold text-slate-100 group-hover:text-[#10b981] transition-colors mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Meta Stats Row */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 my-4 py-2 px-3 bg-[#0b0e14] border border-[#1f293d] rounded">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{points} PTS</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-[#10b981]" />
            <span>PORT: <strong className="text-slate-200">{containerPort}</strong></span>
          </div>

          {hints && hints.length > 0 && (
            <div className="flex items-center gap-1 text-cyan-400 ml-auto">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{hints.length} HINTS</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Action Button */}
      <button
        onClick={() => onOpenModal(challenge)}
        className={`w-full py-2 px-3 rounded text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
          isSolved
            ? 'bg-[#1a2332] text-[#06b6d4] border border-[#06b6d4]/40 hover:bg-[#06b6d4]/10'
            : 'htb-btn-primary'
        }`}
      >
        <span>{isSolved ? 'REVIEW SOLVED TARGET' : 'SPAWN TARGET'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ChallengeCard;
