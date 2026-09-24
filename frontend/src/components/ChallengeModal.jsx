import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../services/AuthContext';
import {
  X,
  ExternalLink,
  Flag,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Activity,
  Terminal,
  Award,
  Lock,
} from 'lucide-react';

const ChallengeModal = ({ challenge, onClose, onSubmissionSuccess }) => {
  const { refreshUser } = useAuth();
  const [flagInput, setFlagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [containerStatus, setContainerStatus] = useState({ online: null, loading: true });
  const [revealedHints, setRevealedHints] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const res = await api.get(`/challenges/${challenge._id}/status`);
        if (isMounted) {
          setContainerStatus({
            online: res.data.online,
            port: res.data.port,
            loading: false,
          });
        }
      } catch (err) {
        if (isMounted) {
          setContainerStatus({ online: false, loading: false });
        }
      }
    };

    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [challenge._id]);

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
        message: err.response?.data?.message || '[-] Incorrect Flag. Verify your exploit methodology!',
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
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-[#121824] border border-[#1f293d] rounded-md w-full max-w-2xl overflow-hidden shadow-2xl relative my-8">
        {/* Modal Header */}
        <div className="bg-[#0d1117] px-5 py-3.5 border-b border-[#1f293d] flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="domain-pill">{challenge.category}</span>
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
            {challenge.isSolved && (
              <span className="badge-solved flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#06b6d4]" />
                SOLVED
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1a2332] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Title & Points Bar */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-mono font-bold text-slate-100">{challenge.title}</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Target Port: <span className="text-[#10b981] font-semibold">{challenge.containerPort}</span>
              </p>
            </div>

            <div className="bg-[#0b0e14] border border-[#1f293d] px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{challenge.points} PTS</span>
            </div>
          </div>

          {/* Docker Container Target Status Bar */}
          <div className="p-3.5 bg-[#0b0e14] border border-[#1f293d] rounded flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Terminal className="w-4 h-4 text-[#10b981]" />
              <span className="text-slate-400">TARGET HOST:</span>
              <a
                href={challengeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#10b981] hover:underline font-semibold"
              >
                {challengeUrl}
              </a>
            </div>

            <div>
              {containerStatus.loading ? (
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 animate-spin text-[#10b981]" />
                  Checking Port...
                </span>
              ) : (
                <a
                  href={challengeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="htb-btn-primary text-xs py-1 px-3"
                >
                  <span>ACCESS TARGET</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Scenario & Objective */}
          <div>
            <div className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
              <span>$</span> Scenario Briefing & Objective
            </div>
            <div className="bg-[#0b0e14] p-4 rounded border border-[#1f293d] text-xs font-mono text-slate-300 leading-relaxed">
              {challenge.description}
            </div>
          </div>

          {/* Progressive Hints */}
          {challenge.hints && challenge.hints.length > 0 && (
            <div>
              <div className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Progressive Intel / Hints</span>
              </div>
              <div className="space-y-2">
                {challenge.hints.map((hint, idx) => {
                  const isRevealed = revealedHints.includes(idx);
                  return (
                    <div
                      key={idx}
                      className="bg-[#0b0e14] border border-[#1f293d] rounded overflow-hidden text-xs font-mono"
                    >
                      <button
                        onClick={() => toggleHint(idx)}
                        className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-cyan-400 flex items-center justify-between transition-colors bg-[#121824]"
                      >
                        <span className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Hint #{idx + 1}</span>
                        </span>
                        <span className="text-cyan-400 text-xs">
                          {isRevealed ? '[ HIDE INTEL ]' : '[ REVEAL INTEL ]'}
                        </span>
                      </button>
                      {isRevealed && (
                        <div className="p-3 bg-cyan-950/20 border-t border-[#1f293d] text-cyan-200 leading-relaxed">
                          {hint.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback Alert Banner */}
          {feedback && (
            <div
              className={`p-3 rounded border text-xs font-mono flex items-center gap-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/30 border-[#10b981]/50 text-[#10b981]'
                  : 'bg-red-950/30 border-red-500/50 text-red-400'
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

          {/* Flag Submission Terminal Form */}
          <form onSubmit={handleSubmitFlag} className="space-y-2 pt-2">
            <label className="block text-xs font-mono text-slate-400 uppercase font-semibold">
              $ submit_flag --flag=
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono text-xs">
                  <Flag className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="flag{...}"
                  disabled={challenge.isSolved || submitting}
                  className="w-full pl-9 pr-4 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#10b981] font-mono transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || challenge.isSolved || !flagInput.trim()}
                className="htb-btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-xs px-4"
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
