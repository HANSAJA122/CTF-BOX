import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Terminal, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-[#05080c] flex items-center justify-center p-4 font-mono text-xs select-none">
      <div className="w-full max-w-md">
        <div className="bg-[#090d14] border border-[#1c2436] p-3 text-center mb-3">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-100 text-sm">
            <Terminal className="w-4 h-4 text-[#10b981]" />
            <span>CREATE CONTESTANT HANDLE</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            SLIIT Security Range Registration
          </div>
        </div>

        <div className="soc-panel p-4">
          {error && (
            <div className="mb-3 p-2 bg-red-950/30 border border-red-500 text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">$ contestant_handle:</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="cyber_hacker"
                className="w-full px-3 py-1.5 bg-[#05080c] border border-[#1c2436] text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#10b981]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">$ email_address:</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hacker@cybervault.edu"
                className="w-full px-3 py-1.5 bg-[#05080c] border border-[#1c2436] text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#10b981]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">$ set_passphrase:</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-3 py-1.5 bg-[#05080c] border border-[#1c2436] text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#10b981]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="soc-btn-green w-full py-1.5 justify-center font-bold uppercase mt-2"
            >
              {loading ? '[ REGISTERING... ]' : '[ REGISTER HANDLE ]'}
            </button>
          </form>
        </div>

        <div className="text-center text-[10px] text-slate-500 mt-3">
          Registered contestant?{' '}
          <Link to="/login" className="text-[#10b981] hover:underline font-bold">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
