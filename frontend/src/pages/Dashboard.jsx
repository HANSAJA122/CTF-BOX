import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from '../services/AuthContext';
import ChallengeCard from '../components/ChallengeCard';
import ChallengeModal from '../components/ChallengeModal';
import {
  Trophy,
  CheckCircle2,
  Filter,
  Search,
  RefreshCw,
  Terminal,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await api.get('/challenges');
      if (res.data.success) {
        setChallenges(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load CTF stages:', err);
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

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(challenges.map((c) => c.category));
    return ['All', ...Array.from(set)];
  }, [challenges]);

  // Filter challenges logic
  const filteredChallenges = useMemo(() => {
    return challenges.filter((ch) => {
      const matchesSearch =
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || ch.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || ch.difficulty === selectedDifficulty;
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Solved' && ch.isSolved) ||
        (statusFilter === 'Unsolved' && !ch.isSolved);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [challenges, searchQuery, selectedCategory, selectedDifficulty, statusFilter]);

  const solvedCount = challenges.filter((c) => c.isSolved).length;
  const totalPointsAvailable = challenges.reduce((acc, c) => acc + c.points, 0);
  const userProgressPct = totalPointsAvailable > 0 ? Math.round(((user?.score || 0) / totalPointsAvailable) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Top Banner & Stats Overview */}
      <div className="cyber-card p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs px-3 py-1 rounded-full mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>IE3132 Penetration Testing Play Box</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-wide">
              Welcome back, <span className="text-emerald-400">{user?.username}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Select a stage below to launch its Docker container, solve security flaws, and capture flags.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-950/80 border border-slate-800 px-5 py-3 rounded-xl text-center min-w-[120px]">
              <span className="block text-xs font-mono text-slate-400 uppercase">Score</span>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-2xl font-black text-amber-300 font-mono">{user?.score || 0}</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 px-5 py-3 rounded-xl text-center min-w-[120px]">
              <span className="block text-xs font-mono text-slate-400 uppercase">Solved</span>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {solvedCount} / {challenges.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex justify-between text-xs font-mono mb-2 text-slate-400">
            <span>Overall Platform Mastery</span>
            <span className="text-emerald-400 font-bold">{userProgressPct}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500 rounded-full"
              style={{ width: `${userProgressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="cyber-card p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Domain: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="All">Difficulty: All</option>
            <option value="Easy">Difficulty: Easy</option>
            <option value="Medium">Difficulty: Medium</option>
            <option value="Hard">Difficulty: Hard</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="All">Status: All</option>
            <option value="Unsolved">Status: Unsolved</option>
            <option value="Solved">Status: Solved</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchChallenges}
            className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors ml-auto lg:ml-0"
            title="Refresh Challenges"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 font-mono text-sm">Loading CyberVault challenge matrix...</p>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="cyber-card p-12 text-center">
          <p className="text-slate-400 font-mono">No CTF stages match your selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((ch) => (
            <ChallengeCard key={ch._id} challenge={ch} onOpenModal={(c) => setSelectedChallenge(c)} />
          ))}
        </div>
      )}

      {/* Challenge Detail & Flag Submission Modal */}
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
