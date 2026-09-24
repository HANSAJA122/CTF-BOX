import React from 'react';
import { Flag, CheckCircle2, Terminal, Award, ArrowRight } from 'lucide-react';

const ChallengeCard = ({ challenge, onOpenModal }) => {
  const { title, category, difficulty, points, isSolved, containerPort } = challenge;

  const getCategoryClass = (cat) => {
    if (cat.includes('Web')) return 'cat-web';
    if (cat.includes('Crypto')) return 'cat-crypto';
    if (cat.includes('Forensics')) return 'cat-forensics';
    if (cat.includes('Linux')) return 'cat-linux';
    if (cat.includes('Stego')) return 'cat-stego';
    return 'cat-osint';
  };

  return (
    <div
      className={`gctf-card p-5 flex flex-col justify-between relative group ${
        isSolved ? 'border-[#34a853]/50 bg-[#101625]' : ''
      }`}
    >
      <div>
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${getCategoryClass(category)}`}>
            {category}
          </span>
          
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400 font-semibold">{difficulty}</span>
            {isSolved && (
              <span className="text-[#34a853] font-bold flex items-center gap-1">
                ✓ SOLVED
              </span>
            )}
          </div>
        </div>

        {/* Challenge Name */}
        <h3 className="text-base font-mono font-bold text-slate-100 group-hover:text-[#4285f4] transition-colors mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Target Meta Information */}
        <div className="bg-[#080b14] border border-[#1e293b] p-3 rounded my-4 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Points:</span>
            <span className="text-[#fbbc04] font-bold">{points} PTS</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Target Port:</span>
            <span className="text-[#34a853] font-bold">{containerPort}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onOpenModal(challenge)}
        className={`w-full py-2 px-3 rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
          isSolved
            ? 'gctf-btn-secondary text-[#34a853]'
            : 'gctf-btn-blue'
        }`}
      >
        <span>{isSolved ? '[ REVIEW TASK ]' : '[ SOLVE TASK ]'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ChallengeCard;
