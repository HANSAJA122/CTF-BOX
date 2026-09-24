import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, Award, CheckCircle2, User, RefreshCw, Search } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredLeaderboard = leaderboard.filter((item) =>
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/40 font-bold';
      case 2:
        return 'bg-slate-300/10 text-slate-200 border-slate-400/40 font-bold';
      case 3:
        return 'bg-amber-700/10 text-amber-600 border-amber-700/40 font-bold';
      default:
        return 'bg-[#0b0e14] text-slate-400 border-[#1f293d]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1f293d] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold uppercase mb-1">
            <Trophy className="w-4 h-4" />
            <span>Global Standings</span>
          </div>
          <h1 className="text-2xl font-mono font-bold text-slate-100">Lab Contestant Leaderboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Official ranking based on total points scored and speed of flag submissions across SLIIT CTF stages.
          </p>
        </div>

        <button
          onClick={fetchLeaderboard}
          className="htb-btn-secondary text-xs flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#10b981]' : ''}`} />
          <span>Refresh Standings</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="htb-card p-3 flex items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contestant handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0b0e14] border border-[#1f293d] rounded text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#10b981]"
          />
        </div>

        <div className="text-xs font-mono text-slate-400 hidden md:block">
          TOTAL CONTESTANTS: <span className="text-[#10b981] font-bold">{leaderboard.length}</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="htb-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center font-mono text-xs text-slate-500">
            <RefreshCw className="w-6 h-6 text-[#10b981] animate-spin mx-auto mb-2" />
            <span>Calculating live contestant rankings...</span>
          </div>
        ) : filteredLeaderboard.length === 0 ? (
          <div className="p-10 text-center font-mono text-xs text-slate-500">
            No contestants found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0d1117] border-b border-[#1f293d] text-slate-400 text-[11px] font-mono uppercase">
                  <th className="py-3.5 px-5">Rank</th>
                  <th className="py-3.5 px-5">Contestant Handle</th>
                  <th className="py-3.5 px-5 text-center">Stages Solved</th>
                  <th className="py-3.5 px-5 text-right">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f293d] font-mono text-xs">
                {filteredLeaderboard.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#1a2332]/50 transition-colors ${
                      item.rank === 1 ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    {/* Rank Position */}
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded border text-xs font-mono ${getRankBadgeClass(
                          item.rank
                        )}`}
                      >
                        #{item.rank}
                      </span>
                    </td>

                    {/* Contestant */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-[#0b0e14] border border-[#1f293d] flex items-center justify-center text-slate-300 font-bold uppercase text-xs">
                          {item.username.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-200 block">{item.username}</span>
                          <span className="text-[10px] text-slate-500">
                            Registered {new Date(item.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Solved Count */}
                    <td className="py-3.5 px-5 text-center">
                      <span className="badge-solved inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#06b6d4]" />
                        {item.solvedCount} SOLVED
                      </span>
                    </td>

                    {/* Total Score */}
                    <td className="py-3.5 px-5 text-right font-bold text-amber-400 text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.score} PTS</span>
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
