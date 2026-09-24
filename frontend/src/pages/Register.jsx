import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Flag, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';

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
      setError(err.response?.data?.message || '[-] Registration failed. Choose another handle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c101c] flex items-center justify-center p-4 font-mono text-xs select-none">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-[#101625] border border-[#1e293b] rounded mb-3 text-[#ea4335]">
            <Flag className="w-8 h-8 fill-[#ea4335]/20" />
          </div>
          <h1 className="text-base font-pixel text-slate-100 tracking-wider">
            REGISTER CONTESTANT
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase">
            Create Your Google CTF Handle
          </p>
        </div>

        <div className="gctf-card p-6 bg-[#101625]">
          {error && (
            <div className="mb-4 p-3 bg-[#ea4335]/10 border border-[#ea4335] rounded text-xs text-[#ea4335] flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase">$ input_handle:</label>
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
                  className="w-full pl-9 pr-3 py-2 bg-[#080b14] border border-[#1e293b] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#4285f4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase">$ input_email:</label>
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
                  className="w-full pl-9 pr-3 py-2 bg-[#080b14] border border-[#1e293b] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#4285f4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase">$ set_password:</label>
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
                  className="w-full pl-9 pr-3 py-2 bg-[#080b14] border border-[#1e293b] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#4285f4]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gctf-btn-green w-full py-2.5 font-bold uppercase mt-2"
            >
              <span>{loading ? 'REGISTERING...' : 'REGISTER CONTESTANT'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          Registered contestant?{' '}
          <Link to="/register" className="text-[#4285f4] font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
