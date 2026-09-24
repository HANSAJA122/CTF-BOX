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
        message: err.response?.data?.message || 'Incorrect flag. Check your solving path and try again!',
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8">
        {/* Header */}
        <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded-md">
              {challenge.category}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                challenge.difficulty === 'Easy'
                  ? 'badge-easy'
                  : challenge.difficulty === 'Medium'
                  ? 'badge-medium'
                  : 'badge-hard'
              }`}
            >
              {challenge.difficulty}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Title & Status */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white mb-2">{challenge.title}</h2>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 font-bold text-sm">{challenge.points} Points</span>
              </div>
            </div>

            {/* Container Service Bar */}
            <div className="mt-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-mono">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">Target Container:</span>
                <span className="text-emerald-300 font-semibold">{challengeUrl}</span>
              </div>

              <div className="flex items-center gap-3">
                {containerStatus.loading ? (
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    Checking...
                  </span>
                ) : (
                  <a
                    href={challengeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cyber-button-primary text-xs py-1.5 px-3"
                  >
                    <span>Open Target</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Description / Scenario */}
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Scenario & Objective
            </h4>
            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 text-sm leading-relaxed text-slate-300 font-sans">
              {challenge.description}
            </div>
          </div>

          {/* Hints Section */}
          {challenge.hints && challenge.hints.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                Available Hints
              </h4>
              <div className="space-y-2">
                {challenge.hints.map((hint, idx) => {
                  const isRevealed = revealedHints.includes(idx);
                  return (
                    <div
                      key={idx}
                      className="bg-slate-950/60 border border-slate-800 rounded-lg overflow-hidden text-xs"
                    >
                      <button
                        onClick={() => toggleHint(idx)}
                        className="w-full px-4 py-2.5 text-left font-mono font-medium text-slate-300 hover:text-cyan-400 flex items-center justify-between transition-colors"
                      >
                        <span>Hint #{idx + 1}</span>
                        <span className="text-cyan-400 text-xs">
                          {isRevealed ? 'Hide Hint' : 'Reveal Hint'}
                        </span>
                      </button>
                      {isRevealed && (
                        <div className="px-4 py-3 bg-cyan-950/20 border-t border-slate-800 text-cyan-200 font-mono text-xs leading-relaxed">
                          {hint.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-4 rounded-lg border flex items-center gap-3 text-sm font-medium ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-red-950/40 border-red-500/50 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Flag Submission Form */}
          <form onSubmit={handleSubmitFlag} className="space-y-3 pt-2">
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
              Submit Discovered Flag
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Flag className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="flag{...}"
                  disabled={challenge.isSolved || submitting}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || challenge.isSolved || !flagInput.trim()}
                className="cyber-button-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm px-5"
              >
                {submitting ? 'Validating...' : challenge.isSolved ? 'Solved' : 'Submit Flag'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
