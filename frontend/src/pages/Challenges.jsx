import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ChallengeModal from '../components/ChallengeModal';
import { Terminal, RefreshCw, Search } from 'lucide-react';

const Challenges = () => {
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

  const categories = ['All', 'OSINT Reconnaissance', 'Steganography', 'Web Security', 'Cryptography', 'Digital Forensics', 'Linux Security'];

  const filteredChallenges = challenges.filter((ch) => {
    const matchesSearch =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ch.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || ch.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-3">
      {/* Search Toolbar */}
      <div className="soc-panel p-2.5 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search ID, Name, or Domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-2.5 py-1 bg-[#05080c] border border-[#1c2436] rounded-none text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#10b981] w-full md:w-64"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#05080c] border border-[#1c2436] text-slate-300 py-1 px-2 focus:outline-none focus:border-[#10b981]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-[#05080c] border border-[#1c2436] text-slate-300 py-1 px-2 focus:outline-none focus:border-[#10b981]"
          >
            <option value="All">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <button onClick={fetchChallenges} className="soc-btn-secondary py-1 px-3">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#10b981]' : ''}`} />
          <span>RELOAD MATRIX</span>
        </button>
      </div>

      {/* Main Required Table Layout */}
      <div className="soc-panel">
        <div className="soc-panel-header">
          <span>TARGET STAGES TABLE</span>
          <span>COUNT: {filteredChallenges.length}</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            Querying target directory...
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
                {filteredChallenges.map((ch, idx) => {
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
                          <span>{ch.isSolved ? 'REVIEW' : 'INSPECT'}</span>
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

export default Challenges;
