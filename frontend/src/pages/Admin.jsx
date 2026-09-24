import React, { useState } from 'react';
import api from '../services/api';
import { PlusCircle, Shield, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Security',
    difficulty: 'Easy',
    points: 100,
    containerPort: 3007,
    dockerImage: 'cybervault-custom-ch',
    serviceUrl: '',
    description: '',
    flag: 'flag{...}',
    hint1: '',
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const hints = formData.hint1 ? [{ content: formData.hint1, cost: 0 }] : [];
      const res = await api.post('/challenges', {
        ...formData,
        serviceUrl: formData.serviceUrl || `http://localhost:${formData.containerPort}`,
        hints,
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: 'New CTF Challenge created successfully!' });
        setFormData({
          title: '',
          category: 'Web Security',
          difficulty: 'Easy',
          points: 100,
          containerPort: 3007,
          dockerImage: 'cybervault-custom-ch',
          serviceUrl: '',
          description: '',
          flag: 'flag{...}',
          hint1: '',
        });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to create challenge',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4" />
          <span>Platform Administration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Create CTF Challenge</h1>
        <p className="text-slate-400 text-sm mt-1">
          Add new cybersecurity stages, assign Docker target ports, define flags, and publish to students.
        </p>
      </div>

      <div className="cyber-card p-8 shadow-2xl">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-center gap-3 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/40 border-red-500/40 text-red-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
                Challenge Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Advanced XSS Exploitation"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value="OSINT Reconnaissance">OSINT Reconnaissance</option>
                <option value="Steganography">Steganography</option>
                <option value="Web Security">Web Security</option>
                <option value="Cryptography">Cryptography</option>
                <option value="Digital Forensics">Digital Forensics</option>
                <option value="Linux Security">Linux Security</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Points</label>
              <input
                type="number"
                required
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
                Docker Container Port
              </label>
              <input
                type="number"
                required
                value={formData.containerPort}
                onChange={(e) => setFormData({ ...formData, containerPort: parseInt(e.target.value) || 3000 })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
                Secret Flag
              </label>
              <input
                type="text"
                required
                value={formData.flag}
                onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                placeholder="flag{secret_string}"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-emerald-400 font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
              Scenario / Problem Description
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the challenge background scenario, learning objectives, and player tasks..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Optional Hint #1</label>
            <input
              type="text"
              value={formData.hint1}
              onChange={(e) => setFormData({ ...formData, hint1: e.target.value })}
              placeholder="e.g. Check for hidden comments in the page source."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Publishing Stage...' : 'Publish Challenge'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
