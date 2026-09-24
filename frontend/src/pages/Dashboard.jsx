import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from '../services/AuthContext';
import ChallengeCard from '../components/ChallengeCard';
import ChallengeModal from '../components/ChallengeModal';
import { Flag, Trophy, CheckCircle2, RefreshCw, Search, Award } from 'lucide-react';

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
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleSubmissionSuccess = (solvedId) => {
    setChallenges((prev) =>
      prev.map((ch) => (ch._id === solvedId ? { ...ch, isSolved: true } : ch))
    );
    if (selectedChallenge && selectedChallenge._id === solvedId) {
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Google CTF Retro ASCII Header Banner */}
      <div className="gctf-card p-6 bg-[#080b14] border-[#1e293b] font-mono select-none">
        <pre className="text-[10px] md:text-xs text-[#4285f4] font-bold overflow-x-auto leading-none mb-4 hidden sm:block">
{`   ___  ___   ___  ___  _    ___   ___ _____ ___ 
  / __|/ _ \ / _ \/ __|| |  | __| / __|_   _| __|
 | (_ | (_) | (_) \__ \| |__| _| | (__  | | | _| 
  \___|\___/ \___/|___/|____|___| \___| |_| |_|  `}
        </pre>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-[#1e293b] pt-4">
          <div>
            <h1 className="text-xl font-pixel text-slate-100">
              <span className="text-[#4285f4]">G</span>
              <span className="text-[#ea4335]">o</span>
              <span className="text-[#fbbc04]">o</span>
              <span className="text-[#4285f4]">g</span>
              <span className="text-[#34a853]">l</span>
              <span className="text-[#ea4335]">e</span> CTF // LAB ARENA
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Welcome contestant <strong className="text-slate-100">{user?.username}</strong>. Solve vulnerability tasks, capture flags, and climb the scoreboard.
            </p>
          </div>

          {/* Quick Score Chips */}
          <div className="flex items-center gap-3 font-mono">
            <div className="bg-[#101625] border border-[#1e293b] px-4 py-2 rounded text-center">
              <span className="block text-[10px] text-slate-500 uppercase">SCORE</span>
              <span className="text-base font-bold text-[#fbbc04]">{user?.score || 0} PTS</span>
            </div>

            <div className="bg-[#101625] border border-[#1e293b] px-4 py-2 rounded text-center">
              <span className="block text-[10px] text-slate-500 uppercase">SOLVED</span>
              <span className="text-base font-bold text-[#34a853]">
                {solvedCount}/{challenges.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Category Filter Tabs (Google CTF Style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded whitespace-nowrap transition-all font-semibold ${
                isSelected
                  ? 'bg-[#4285f4] text-white'
                  : 'bg-[#101625] text-slate-400 hover:text-white border border-[#1e293b]'
              }`}
            >
              [ {cat === 'All' ? 'ALL TASKS' : cat.toUpperCase()} ]
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="gctf-card p-3 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search task title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#080b14] border border-[#1e293b] rounded text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#4285f4]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-[#080b14] border border-[#1e293b] text-slate-300 py-1.5 px-3 rounded focus:outline-none focus:border-[#4285f4]"
          >
            <option value="All">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button onClick={fetchChallenges} className="gctf-btn-secondary">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#4285f4]' : ''}`} />
            <span>REFRESH</span>
          </button>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      {loading ? (
        <div className="py-16 text-center font-mono text-xs text-slate-500">
          <RefreshCw className="w-6 h-6 text-[#4285f4] animate-spin mx-auto mb-2" />
          <span>Fetching Google CTF tasks...</span>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="gctf-card p-12 text-center font-mono text-xs text-slate-500">
          No Google CTF tasks match your query filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChallenges.map((ch) => (
            <ChallengeCard key={ch._id} challenge={ch} onOpenModal={(c) => setSelectedChallenge(c)} />
          ))}
        </div>
      )}

      {/* Task Dialog */}
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
