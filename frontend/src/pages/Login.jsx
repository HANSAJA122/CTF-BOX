import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Flag, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '[-] Authentication failed. Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c101c] flex items-center justify-center p-4 font-mono text-xs select-none">
      <div className="w-full max-w-md">
        {/* Google CTF Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-[#101625] border border-[#1e293b] rounded mb-3 text-[#ea4335]">
            <Flag className="w-8 h-8 fill-[#ea4335]/20" />
          </div>
          <h1 className="text-base font-pixel text-slate-100 tracking-wider">
            <span className="text-[#4285f4]">G</span>
            <span className="text-[#ea4335]">o</span>
            <span className="text-[#fbbc04]">o</span>
            <span className="text-[#4285f4]">g</span>
            <span className="text-[#34a853]">l</span>
            <span className="text-[#ea4335]">e</span> CTF
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase">
            SLIIT Security Range Authentication
          </p>
        </div>

        {/* Card Form */}
        <div className="gctf-card p-6 bg-[#101625]">
          {error && (
            <div className="mb-4 p-3 bg-[#ea4335]/10 border border-[#ea4335] rounded text-xs text-[#ea4335] flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase">
                $ login_email:
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
                  placeholder="student@cybervault.edu"
                  className="w-full pl-9 pr-3 py-2 bg-[#080b14] border border-[#1e293b] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#4285f4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase">
                $ login_password:
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
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#080b14] border border-[#1e293b] rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#4285f4]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gctf-btn-green w-full py-2.5 font-bold uppercase mt-2"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'AUTHENTICATE SESSION'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Demo Specs */}
          <div className="mt-5 pt-4 border-t border-[#1e293b] text-[11px] space-y-1">
            <div className="text-slate-500 uppercase font-bold">Demo Accounts:</div>
            <div className="bg-[#080b14] p-2.5 rounded border border-[#1e293b] space-y-1 text-slate-400">
              <div>Student: <span className="text-[#34a853]">student@cybervault.edu</span> / <span className="text-slate-200">StudentPassword123!</span></div>
              <div>Admin: <span className="text-[#ab47bc]">admin@cybervault.edu</span> / <span className="text-slate-200">AdminPassword123!</span></div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          Need a contestant handle?{' '}
          <Link to="/register" className="text-[#4285f4] font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
