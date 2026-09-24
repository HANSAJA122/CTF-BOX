import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import ChallengeCard from '../components/ChallengeCard';
import ChallengeModal from '../components/ChallengeModal';
import { Target, Search, Filter, RefreshCw, CheckCircle2, Shield } from 'lucide-react';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Filters
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
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Solved' && ch.isSolved) ||
        (statusFilter === 'Unsolved' && !ch.isSolved);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [challenges, searchQuery, selectedCategory, selectedDifficulty, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1f293d] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#10b981] font-semibold uppercase mb-1">
            <Target className="w-4 h-4" />
            <span>Lab Arena</span>
          </div>
          <h1 className="text-2xl font-mono font-bold text-slate-100">CTF Target Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse all available vulnerability boxes across OSINT, Steganography, Web Security, Cryptography, Forensics, and Linux Security.
          </p>
        </div>

        <button
          onClick={fetchChallenges}
          className="htb-btn-secondary text-xs flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#10b981]' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Domain Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#1f293d]">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#10b981] text-[#0b0e14] font-bold'
                  : 'bg-[#121824] text-slate-400 hover:text-slate-200 border border-[#1f293d]'
              }`}
            >
              {cat === 'All' ? 'ALL DOMAINS' : cat.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Search and Secondary Filters Toolbar */}
      <div className="htb-card p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title, category, or port..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0b0e14] border border-[#1f293d] rounded text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#10b981]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0b0e14] border border-[#1f293d] text-slate-300 text-xs py-1.5 px-3 rounded focus:outline-none focus:border-[#10b981] font-mono"
          >
            <option value="All">Status: All</option>
            <option value="Unsolved">Status: Unsolved</option>
            <option value="Solved">Status: Solved</option>
          </select>
        </div>
      </div>

      {/* Grid of Targets */}
      {loading ? (
        <div className="py-16 text-center font-mono text-xs text-slate-500">
          <RefreshCw className="w-6 h-6 text-[#10b981] animate-spin mx-auto mb-2" />
          <span>Fetching targets from Docker engine...</span>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="htb-card p-12 text-center text-xs font-mono text-slate-500">
          No target stages match the selected filters.
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

export default Challenges;
