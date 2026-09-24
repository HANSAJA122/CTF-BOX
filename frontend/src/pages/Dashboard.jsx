import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from '../services/AuthContext';
import ChallengeCard from '../components/ChallengeCard';
import ChallengeModal from '../components/ChallengeModal';
import {
  Trophy,
  CheckCircle2,
  Terminal,
  Target,
  RefreshCw,
  Search,
  Filter,
  Shield,
  Clock,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await api.get('/challenges');
      if (res.data.success) {
        setChallenges(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load CTF targets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleSubmissionSuccess = (solvedChallengeId) => {
    setChallenges((prev) =>
      prev.map((ch) => (ch._id === solvedChallengeId ? { ...ch, isSolved: true } : ch))
    );
    if (selectedChallenge && selectedChallenge._id === solvedChallengeId) {
      setSelectedChallenge((prev) => ({ ...prev, isSolved: true }));
    }
  };

  const categories = useMemo(() => {
    const set = new Set(challenges.map((c) => c.category));
    return ['All', ...Array.from(set)];
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((ch) => {
      const matchesSearch =
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || ch.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || ch.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [challenges, searchQuery, selectedCategory, selectedDifficulty]);

  const solvedCount = challenges.filter((c) => c.isSolved).length;
  const totalPointsAvailable = challenges.reduce((acc, c) => acc + c.points, 0);
  const userProgressPct = totalPointsAvailable > 0 ? Math.round(((user?.score || 0) / totalPointsAvailable) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Statistics Banner */}
      <div className="htb-card p-6 border-[#1f293d] bg-[#121824] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <Terminal className="w-4 h-4 text-[#10b981]" />
              <span>SLIIT IE3132 PENETRATION TESTING LABS</span>
            </div>
            <h1 className="text-2xl font-mono font-bold text-slate-100">
              Target Matrix // <span className="text-[#10b981]">{user?.username}</span>
            </h1>
            <p className="text-xs font-sans text-slate-400 mt-1 max-w-2xl">
              Welcome to the CTF training arena. Select a stage from the vulnerability matrix below to launch its isolated Docker container, discover security flaws, and capture secret flags.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="bg-[#0b0e14] border border-[#1f293d] px-4 py-2.5 rounded text-center flex-1 lg:flex-none min-w-[110px]">
              <span className="block text-[10px] font-mono text-slate-500 uppercase">SCORE</span>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xl font-mono font-bold text-amber-400">{user?.score || 0}</span>
              </div>
            </div>

            <div className="bg-[#0b0e14] border border-[#1f293d] px-4 py-2.5 rounded text-center flex-1 lg:flex-none min-w-[110px]">
              <span className="block text-[10px] font-mono text-slate-500 uppercase">STAGES</span>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span className="text-xl font-mono font-bold text-[#10b981]">
                  {solvedCount}/{challenges.length}
                </span>
              </div>
            </div>

            <div className="bg-[#0b0e14] border border-[#1f293d] px-4 py-2.5 rounded text-center flex-1 lg:flex-none min-w-[110px]">
              <span className="block text-[10px] font-mono text-slate-500 uppercase">PROGRESS</span>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <Shield className="w-4 h-4 text-[#06b6d4]" />
                <span className="text-xl font-mono font-bold text-[#06b6d4]">{userProgressPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#1f293d]">
          <div className="w-full bg-[#0b0e14] h-2 rounded overflow-hidden border border-[#1f293d]">
            <div
              className="bg-[#10b981] h-full transition-all duration-300"
              style={{ width: `${userProgressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="htb-card p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search target stages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0b0e14] border border-[#1f293d] rounded text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#10b981]"
          />
        </div>

        {/* Domain & Difficulty Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0b0e14] border border-[#1f293d] text-slate-300 text-xs py-1.5 px-3 rounded focus:outline-none focus:border-[#10b981] font-mono"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Domain: {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-[#0b0e14] border border-[#1f293d] text-slate-300 text-xs py-1.5 px-3 rounded focus:outline-none focus:border-[#10b981] font-mono"
          >
            <option value="All">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button
            onClick={fetchChallenges}
            className="p-1.5 bg-[#0b0e14] border border-[#1f293d] hover:border-slate-600 text-slate-400 hover:text-white rounded transition-colors"
            title="Refresh Matrix"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#10b981]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Targets Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-6 h-6 text-[#10b981] animate-spin mx-auto mb-2" />
          <p className="text-slate-500 font-mono text-xs">Querying lab docker containers...</p>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="htb-card p-10 text-center text-xs font-mono text-slate-500">
          No active CTF stages match your selected query filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChallenges.map((ch) => (
            <ChallengeCard key={ch._id} challenge={ch} onOpenModal={(c) => setSelectedChallenge(c)} />
          ))}
        </div>
      )}

      {/* Target Briefing Modal */}
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
