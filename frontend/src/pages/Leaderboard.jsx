import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, RefreshCw, Search } from 'lucide-react';

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

  const filtered = leaderboard.filter((item) =>
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Search Toolbar */}
      <div className="soc-panel p-2.5 flex items-center justify-between gap-2">
        <input
          type="text"
          placeholder="Filter handle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-2.5 py-1 bg-[#05080c] border border-[#1c2436] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#10b981] w-64"
        />

        <button onClick={fetchLeaderboard} className="soc-btn-secondary py-1 px-3">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#10b981]' : ''}`} />
          <span>RELOAD RANKINGS</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="soc-panel">
        <div className="soc-panel-header">
          <span>CONTESTANT STANDINGS TABLE</span>
          <span>ENTRIES: {filtered.length}</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            Calculating rankings...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="soc-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Contestant Handle</th>
                  <th>Solved Count</th>
                  <th>Total Score</th>
                  <th className="text-right">Registered</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="font-bold text-[#d1d5db]">#{item.rank}</td>
                    <td className="font-bold text-slate-200">{item.username}</td>
                    <td className="text-[#06b6d4] font-bold">{item.solvedCount} STAGES</td>
                    <td className="text-amber-400 font-bold">{item.score} PTS</td>
                    <td className="text-right text-slate-500">
                      {new Date(item.joinedAt).toLocaleDateString()}
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
