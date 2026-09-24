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
      console.error('Failed to fetch scoreboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filtered = leaderboard.filter((item) =>
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-[#fbbc04]/10 text-[#fbbc04] border-[#fbbc04]/50 font-bold';
      case 2:
        return 'bg-slate-300/10 text-slate-200 border-slate-400/50 font-bold';
      case 3:
        return 'bg-amber-700/10 text-amber-500 border-amber-700/50 font-bold';
      default:
        return 'bg-[#080b14] text-slate-400 border-[#1e293b]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6 font-mono">
      {/* Header */}
      <div className="gctf-card p-5 bg-[#080b14] border-[#1e293b] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#fbbc04] font-bold uppercase mb-1">
            <Trophy className="w-4 h-4 text-[#fbbc04]" />
            <span>CyberVault Official Scoreboard</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100">Live Contestant Standings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time rankings calculated by total points and submission timestamps.
          </p>
        </div>

        <button onClick={fetchLeaderboard} className="gctf-btn-secondary">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#4285f4]' : ''}`} />
          <span>REFRESH SCOREBOARD</span>
        </button>
      </div>

      {/* Toolbar Search */}
      <div className="gctf-card p-3 flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contestant handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#080b14] border border-[#1e293b] rounded text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#4285f4]"
          />
        </div>

        <div className="text-slate-400 text-xs hidden md:block">
          TOTAL TEAMS / PLAYERS: <strong className="text-[#34a853]">{leaderboard.length}</strong>
        </div>
      </div>

      {/* Scoreboard Table */}
      <div className="gctf-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">
            <RefreshCw className="w-6 h-6 text-[#4285f4] animate-spin mx-auto mb-2" />
            <span>Fetching live scoreboard positions...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No contestants found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#080b14] border-b border-[#1e293b] text-slate-400 text-[11px] uppercase">
                  <th className="py-3 px-5">Rank</th>
                  <th className="py-3 px-5">Contestant</th>
                  <th className="py-3 px-5 text-center">Tasks Solved</th>
                  <th className="py-3 px-5 text-right">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#182235]/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded border text-xs ${getRankBadgeClass(item.rank)}`}>
                        #{item.rank}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-[#080b14] border border-[#1e293b] flex items-center justify-center text-[#4285f4] font-bold uppercase text-xs">
                          {item.username.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 block">{item.username}</span>
                          <span className="text-[10px] text-slate-500">
                            Joined {new Date(item.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <span className="px-2.5 py-1 rounded bg-[#34a853]/10 border border-[#34a853]/40 text-[#34a853] font-bold">
                        {item.solvedCount} SOLVED
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right font-bold text-[#fbbc04] text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <Award className="w-3.5 h-3.5 text-[#fbbc04]" />
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
