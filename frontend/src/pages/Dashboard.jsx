import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../services/AuthContext';
import ChallengeModal from '../components/ChallengeModal';
import { Terminal, CheckCircle2, Award, Trophy, Shield, RefreshCw, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [chRes, lbRes] = await Promise.all([
        api.get('/challenges'),
        api.get('/leaderboard'),
      ]);

      if (chRes.data.success) {
        setChallenges(chRes.data.data);
      }
      if (lbRes.data.success) {
        setLeaderboard(lbRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load lab data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmissionSuccess = (solvedId) => {
    setChallenges((prev) =>
      prev.map((ch) => (ch._id === solvedId ? { ...ch, isSolved: true } : ch))
    );
    if (selectedChallenge && selectedChallenge._id === solvedId) {
      setSelectedChallenge((prev) => ({ ...prev, isSolved: true }));
    }
  };

  const solvedCount = challenges.filter((c) => c.isSolved).length;
  const userRankObj = leaderboard.find((item) => item.id === user?._id);
  const userRank = userRankObj ? `#${userRankObj.rank}` : '#-';

  return (
    <div className="space-y-4">
      {/* Top 4 Stats Panels Table Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Panel 1 */}
        <div className="soc-panel p-3">
          <div className="text-[10px] uppercase text-slate-500 font-bold mb-1 flex items-center justify-between">
            <span>COMPLETED CHALLENGES</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
          </div>
          <div className="text-xl font-bold text-[#10b981]">
            {solvedCount} / {challenges.length}
          </div>
        </div>

        {/* Panel 2 */}
        <div className="soc-panel p-3">
          <div className="text-[10px] uppercase text-slate-500 font-bold mb-1 flex items-center justify-between">
            <span>AVAILABLE CHALLENGES</span>
            <Shield className="w-3.5 h-3.5 text-[#06b6d4]" />
          </div>
          <div className="text-xl font-bold text-slate-200">
            {challenges.length - solvedCount}
          </div>
        </div>

        {/* Panel 3 */}
        <div className="soc-panel p-3">
          <div className="text-[10px] uppercase text-slate-500 font-bold mb-1 flex items-center justify-between">
            <span>TOTAL POINTS</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400">
            {user?.score || 0} PTS
          </div>
        </div>

        {/* Panel 4 */}
        <div className="soc-panel p-3">
          <div className="text-[10px] uppercase text-slate-500 font-bold mb-1 flex items-center justify-between">
            <span>RANK POSITION</span>
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400">
            {userRank}
          </div>
        </div>
      </div>

      {/* Target Directory Table Panel */}
      <div className="soc-panel">
        <div className="soc-panel-header">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#10b981]" />
            ACTIVE CTF TARGET STAGES
          </span>
          <button
            onClick={fetchData}
            className="soc-btn-secondary py-0.5 px-2 text-[10px]"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#10b981]' : ''}`} />
            <span>REFRESH</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            Querying lab targets...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="soc-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((ch, idx) => {
                  const chCode = `STAGE-300${idx + 1}`;
                  return (
                    <tr key={ch._id}>
                      <td className="font-bold text-[#d1d5db]">{chCode}</td>
                      <td className="font-bold text-slate-200">{ch.title}</td>
                      <td>
                        <span className="text-[#06b6d4]">{ch.category}</span>
                      </td>
                      <td>
                        <span
                          className={
                            ch.difficulty === 'Easy'
                              ? 'badge-easy'
                              : ch.difficulty === 'Medium'
                              ? 'badge-medium'
                              : 'badge-hard'
                          }
                        >
                          {ch.difficulty}
                        </span>
                      </td>
                      <td className="text-amber-400 font-bold">{ch.points}</td>
                      <td>
                        {ch.isSolved ? (
                          <span className="text-[#06b6d4] font-bold">[SOLVED]</span>
                        ) : (
                          <span className="text-[#10b981] font-bold">[OPEN]</span>
                        )}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedChallenge(ch)}
                          className="soc-btn-green py-0.5 px-2 text-[10px]"
                        >
                          <span>{ch.isSolved ? 'VIEW' : 'INSPECT'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* System Audit Specifications Panel */}
      <div className="soc-panel p-3 space-y-2">
        <div className="text-[11px] font-bold text-[#d1d5db] border-b border-[#1c2436] pb-1.5 flex items-center justify-between">
          <span>RANGE INFRASTRUCTURE SPECIFICATIONS</span>
          <span className="text-[#10b981]">[ISOLATED DOCKER ENVIRONMENT]</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] text-slate-400">
          <div>• Host System: macOS Sandbox Isolation</div>
          <div>• Database: MongoDB 7.0 Engine</div>
          <div>• Target Containers: 6 Active Bridge Networks</div>
        </div>
      </div>

      {/* Challenge Inspector Modal */}
      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onSubmissionSuccess={handleSubmissionSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
