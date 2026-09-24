import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../services/AuthContext';
import { X, ExternalLink, Terminal, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

const ChallengeModal = ({ challenge, onClose, onSubmissionSuccess }) => {
  const { refreshUser } = useAuth();
  const [flagInput, setFlagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [revealedHints, setRevealedHints] = useState([]);

  const handleSubmitFlag = async (e) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await api.post('/submissions', {
        challengeId: challenge._id,
        submittedFlag: flagInput.trim(),
      });

      if (res.data.success) {
        setFeedback({
          type: 'success',
          message: res.data.message,
        });
        await refreshUser();
        if (onSubmissionSuccess) {
          onSubmissionSuccess(challenge._id);
        }
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || '[-] Incorrect Flag. Verification failed.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHint = (index) => {
    if (revealedHints.includes(index)) {
      setRevealedHints(revealedHints.filter((i) => i !== index));
    } else {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const challengeUrl = challenge.serviceUrl || `http://localhost:${challenge.containerPort}`;
  const challengeCode = `STAGE-${challenge.containerPort || '000'}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 select-none font-mono text-xs">
      <div className="bg-[#090d14] border border-[#1c2436] w-full max-w-xl overflow-hidden text-slate-300 shadow-none relative">
        {/* Terminal Header Bar */}
        <div className="bg-[#0d111a] px-3 py-2 border-b border-[#1c2436] flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[#d1d5db]">
            <Terminal className="w-3.5 h-3.5 text-[#10b981]" />
            <span>CTF TARGET INSPECTOR // {challengeCode}</span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-0.5 hover:bg-[#1c2436] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Terminal Specification Layout */}
        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Key Metadata Block */}
          <div className="bg-[#05080c] border border-[#1c2436] p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Challenge ID:</span>
              <span className="text-[#d1d5db] font-bold">{challengeCode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Name:</span>
              <span className="text-slate-200 font-bold">{challenge.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="text-[#06b6d4]">{challenge.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Difficulty:</span>
              <span
                className={
                  challenge.difficulty === 'Easy'
                    ? 'badge-easy'
                    : challenge.difficulty === 'Medium'
                    ? 'badge-medium'
                    : 'badge-hard'
                }
              >
                {challenge.difficulty}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Points:</span>
              <span className="text-amber-400 font-bold">{challenge.points}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status:</span>
              <span className={challenge.isSolved ? 'text-[#06b6d4] font-bold' : 'text-emerald-400'}>
                {challenge.isSolved ? '[SOLVED]' : '[OPEN]'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">
              Description:
            </div>
            <div className="bg-[#05080c] p-3 border border-[#1c2436] text-slate-300 leading-relaxed whitespace-pre-wrap">
              {challenge.description}
            </div>
          </div>

          {/* Target URL */}
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">
              Target:
            </div>
            <div className="bg-[#05080c] p-2.5 border border-[#1c2436] flex items-center justify-between">
              <span className="text-[#10b981]">{challengeUrl}</span>
              <a
                href={challengeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="soc-btn-green py-0.5 px-2 text-[10px]"
              >
                <span>OPEN TARGET</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Progressive Hints */}
          {challenge.hints && challenge.hints.length > 0 && (
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                Hints:
              </div>
              <div className="space-y-1.5">
                {challenge.hints.map((hint, idx) => {
                  const isRevealed = revealedHints.includes(idx);
                  return (
                    <div key={idx} className="bg-[#05080c] border border-[#1c2436]">
                      <button
                        onClick={() => toggleHint(idx)}
                        className="w-full px-2.5 py-1.5 text-left text-slate-400 hover:text-cyan-400 flex items-center justify-between bg-[#0d111a]"
                      >
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>Hint #{idx + 1}</span>
                        </span>
                        <span className="text-cyan-400 text-[10px]">
                          {isRevealed ? '[HIDE]' : '[REVEAL]'}
                        </span>
                      </button>
                      {isRevealed && (
                        <div className="p-2.5 text-cyan-300 border-t border-[#1c2436] bg-[#070b12]">
                          {hint.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Audit Banner */}
          {feedback && (
            <div
              className={`p-2.5 border flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/30 border-[#10b981] text-[#10b981]'
                  : 'bg-red-950/30 border-red-500 text-red-400'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Submit Flag Terminal Form */}
          <form onSubmit={handleSubmitFlag} className="space-y-1.5 pt-1">
            <label className="block text-[10px] uppercase text-slate-400 font-bold">
              Submit Flag:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="flag{...}"
                disabled={challenge.isSolved || submitting}
                className="flex-1 px-3 py-1.5 bg-[#05080c] border border-[#1c2436] text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#10b981]"
              />

              <button
                type="submit"
                disabled={submitting || challenge.isSolved || !flagInput.trim()}
                className="soc-btn-green py-1.5 px-4 uppercase font-bold disabled:opacity-50"
              >
                {submitting ? 'VALIDATING...' : challenge.isSolved ? 'SOLVED' : 'SUBMIT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
