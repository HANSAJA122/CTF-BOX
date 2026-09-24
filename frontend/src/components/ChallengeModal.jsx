import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../services/AuthContext';
import { X, ExternalLink, Flag, HelpCircle, CheckCircle2, AlertCircle, Terminal, Award, Lock } from 'lucide-react';

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
        message: err.response?.data?.message || '[-] Incorrect Flag. Verify your solution!',
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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 font-mono text-xs select-none">
      <div className="bg-[#101625] border border-[#1e293b] rounded w-full max-w-2xl overflow-hidden shadow-2xl relative my-8">
        {/* Google CTF Terminal Header Bar */}
        <div className="bg-[#080b14] px-4 py-3 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ea4335] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#fbbc04] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#34a853] inline-block"></span>
            <span className="text-slate-300 font-bold ml-2">GOOGLE CTF TASK // {challenge.title}</span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Header Metadata */}
          <div className="flex items-start justify-between gap-4 border-b border-[#1e293b] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#4285f4] font-bold uppercase">{challenge.category}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-semibold">{challenge.difficulty}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100">{challenge.title}</h2>
            </div>

            <div className="bg-[#080b14] border border-[#1e293b] px-3 py-1.5 rounded text-[#fbbc04] font-bold flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>{challenge.points} PTS</span>
            </div>
          </div>

          {/* Target Host Link */}
          <div className="bg-[#080b14] border border-[#1e293b] p-3 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#34a853]" />
              <span className="text-slate-400">Target Host:</span>
              <a
                href={challengeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4285f4] hover:underline font-bold"
              >
                {challengeUrl}
              </a>
            </div>

            <a
              href={challengeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gctf-btn-blue text-xs py-1 px-3"
            >
              <span>ACCESS TARGET</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Scenario Description */}
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-bold mb-2">
              TASK BRIEFING:
            </div>
            <div className="bg-[#080b14] p-4 rounded border border-[#1e293b] text-slate-300 leading-relaxed font-sans text-xs">
              {challenge.description}
            </div>
          </div>

          {/* Hints */}
          {challenge.hints && challenge.hints.length > 0 && (
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold mb-2">
                TASK HINTS:
              </div>
              <div className="space-y-2">
                {challenge.hints.map((hint, idx) => {
                  const isRevealed = revealedHints.includes(idx);
                  return (
                    <div key={idx} className="bg-[#080b14] border border-[#1e293b] rounded">
                      <button
                        onClick={() => toggleHint(idx)}
                        className="w-full px-3 py-2 text-left text-slate-400 hover:text-white flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-[#fbbc04]" />
                          <span>Hint #{idx + 1}</span>
                        </span>
                        <span className="text-[#4285f4]">
                          {isRevealed ? '[ HIDE HINT ]' : '[ REVEAL HINT ]'}
                        </span>
                      </button>
                      {isRevealed && (
                        <div className="p-3 border-t border-[#1e293b] text-[#4285f4] bg-[#0c101c]">
                          {hint.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-3 rounded border flex items-center gap-2 font-bold ${
                feedback.type === 'success'
                  ? 'bg-[#34a853]/10 border-[#34a853] text-[#34a853]'
                  : 'bg-[#ea4335]/10 border-[#ea4335] text-[#ea4335]'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#ea4335]" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Flag Submission Form */}
          <form onSubmit={handleSubmitFlag} className="space-y-2 pt-2">
            <label className="block text-[10px] uppercase text-slate-400 font-bold">
              $ ./submit_flag --flag=
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="CTF{...} or flag{...}"
                disabled={challenge.isSolved || submitting}
                className="flex-1 px-3 py-2 bg-[#080b14] border border-[#1e293b] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#4285f4]"
              />

              <button
                type="submit"
                disabled={submitting || challenge.isSolved || !flagInput.trim()}
                className="gctf-btn-green py-2 px-5 font-bold disabled:opacity-50"
              >
                {submitting ? 'VALIDATING...' : challenge.isSolved ? 'SOLVED' : 'SUBMIT FLAG'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
