import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Terminal, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Choose a different username or email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4 selection:bg-[#10b981]/30 select-none">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-[#121824] border border-[#1f293d] rounded mb-3 text-[#10b981]">
            <Terminal className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-mono font-bold text-slate-100 tracking-wider">
            REGISTER CONTESTANT
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-1 uppercase">
            Create Your SLIIT Security Labs Handle
          </p>
        </div>

        {/* Card Form */}
        <div className="htb-card p-6 border-[#1f293d] bg-[#121824] shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/50 rounded text-xs font-mono text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1.5">
                $ input_handle
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="cyber_hacker"
                  className="w-full pl-9 pr-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1.5">
                $ input_email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="hacker@cybervault.edu"
                  className="w-full pl-9 pr-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1.5">
                $ set_password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="htb-btn-primary w-full py-2.5 font-bold mt-2"
            >
              <span>{loading ? 'CREATING HANDLE...' : 'CREATE LAB ACCOUNT'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-mono text-slate-500 mt-4">
          Already registered?{' '}
          <Link to="/login" className="text-[#10b981] font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
