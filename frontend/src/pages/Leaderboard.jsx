import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, Award, CheckCircle2, User, RefreshCw, ShieldAlert } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leaderboard');
      if (res.data.success) {
        setLeaderboard(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 2:
        return 'bg-slate-300/20 text-slate-200 border-slate-300/40';
      case 3:
        return 'bg-amber-700/20 text-amber-500 border-amber-700/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Contestant Standings</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">CyberVault Leaderboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time score rankings based on total points and speed of flag submissions.
          </p>
        </div>

        <button
          onClick={fetchLeaderboard}
          className="cyber-button-secondary text-xs flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh Standings</span>
        </button>
      </div>

      {/* Leaderboard Table Card */}
      <div className="cyber-card overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
            <p className="text-slate-400 font-mono text-sm">Calculating rankings...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldAlert className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 font-mono">No contestants registered on the leaderboard yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-wider">
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Contestant</th>
                  <th className="py-4 px-6 text-center">Stages Solved</th>
                  <th className="py-4 px-6 text-right">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-sm">
                {leaderboard.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      item.rank === 1 ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-6 font-mono font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs font-bold ${getRankBadge(
                          item.rank
                        )}`}
                      >
                        #{item.rank}
                      </span>
                    </td>

                    {/* Contestant */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
                          <User className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-100 block">{item.username}</span>
                          <span className="text-xs font-mono text-slate-400">
                            Joined {new Date(item.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Solved Count */}
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-xs font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-200 font-semibold">{item.solvedCount}</span>
                      </div>
                    </td>

                    {/* Total Score */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-amber-300 text-base">
                      <div className="flex items-center justify-end gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>{item.score} Pts</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
