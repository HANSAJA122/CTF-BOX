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
        setMessage({ type: 'success', text: 'CTF Challenge published to lab matrix successfully!' });
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
        text: err.response?.data?.message || 'Failed to publish challenge',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#1f293d] pb-4">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-semibold uppercase mb-1">
          <Shield className="w-4 h-4" />
          <span>Admin Controls</span>
        </div>
        <h1 className="text-2xl font-mono font-bold text-slate-100">Publish CTF Target Box</h1>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Define new target stages, container ports, solution flags, and hint disclosures.
        </p>
      </div>

      <div className="htb-card p-6 shadow-2xl">
        {message && (
          <div
            className={`mb-5 p-3 rounded border text-xs font-mono flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-950/40 border-[#10b981]/50 text-[#10b981]'
                : 'bg-red-950/40 border-red-500/50 text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1.5">$ target_title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Advanced Command Injection"
                className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1.5">$ domain_category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-slate-100 focus:outline-none focus:border-purple-500"
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
              <label className="block text-slate-400 uppercase font-semibold mb-1.5">$ difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1.5">$ points_value</label>
              <input
                type="number"
                required
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1.5">$ docker_port</label>
              <input
                type="number"
                required
                value={formData.containerPort}
                onChange={(e) => setFormData({ ...formData, containerPort: parseInt(e.target.value) || 3000 })}
                className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1.5">$ secret_flag</label>
              <input
                type="text"
                required
                value={formData.flag}
                onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                placeholder="flag{...}"
                className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-[#10b981] placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 uppercase font-semibold mb-1.5">$ scenario_description</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe problem scenario, learning objectives, and player tasks..."
              className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase font-semibold mb-1.5">$ hint_disclosure_1</label>
            <input
              type="text"
              value={formData.hint1}
              onChange={(e) => setFormData({ ...formData, hint1: e.target.value })}
              placeholder="e.g. Inspect the page HTTP headers."
              className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'PUBLISHING TARGET...' : 'PUBLISH TARGET STAGE'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
