import React from 'react';
import { CheckCircle2, Terminal, Flag, Award, HelpCircle } from 'lucide-react';

const ChallengeCard = ({ challenge, onOpenModal }) => {
  const { title, category, difficulty, points, isSolved, containerPort } = challenge;

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
      className={`cyber-card p-6 flex flex-col justify-between relative overflow-hidden group ${
        isSolved ? 'border-emerald-500/40 bg-emerald-950/10' : ''
      }`}
    >
      {/* Solved overlay indicator */}
      {isSolved && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 badge-solved px-2.5 py-1 rounded-full text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Completed</span>
        </div>
      )}

      <div>
        {/* Category & Difficulty badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
            {category}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${getDifficultyBadge(difficulty)}`}>
            {difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-2">
          {title}
        </h3>

        {/* Info row */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-6 mt-4">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 font-semibold">{points} Pts</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Port: <strong className="text-slate-200">{containerPort}</strong></span>
          </div>

          {challenge.hints && challenge.hints.length > 0 && (
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>{challenge.hints.length} Hints</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Action Button */}
      <button
        onClick={() => onOpenModal(challenge)}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          isSolved
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            : 'cyber-button-primary'
        }`}
      >
        <Flag className="w-4 h-4" />
        <span>{isSolved ? 'View Solved Stage' : 'Launch Challenge'}</span>
      </button>
    </div>
  );
};

export default ChallengeCard;
