import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Terminal, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

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
      setError(err.response?.data?.message || '[-] Authentication Failed. Check email and password.');
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
            CYBER<span className="text-[#10b981]">VAULT</span> LABS
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-1 uppercase">
            Penetration Testing Authentication Portal
          </p>
        </div>

        {/* Auth Box */}
        <div className="htb-card p-6 border-[#1f293d] bg-[#121824] shadow-2xl">
          {error && (
            <div className="mb-5 p-3 bg-red-950/40 border border-red-500/50 rounded text-xs font-mono text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase font-semibold mb-1.5">
                $ login_email
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
                  className="w-full pl-9 pr-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase font-semibold mb-1.5">
                $ login_password
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
                  className="w-full pl-9 pr-3 py-2 bg-[#0b0e14] border border-[#1f293d] rounded text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="htb-btn-primary w-full py-2.5 text-xs font-mono font-bold mt-2"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'AUTHENTICATE LAB SESSION'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-5 pt-4 border-t border-[#1f293d] text-center font-mono text-[11px]">
            <p className="text-slate-500 uppercase mb-1 font-semibold">Demo Credentials:</p>
            <div className="bg-[#0b0e14] p-2.5 rounded border border-[#1f293d] space-y-1 text-slate-400 text-left">
              <p>
                Student: <span className="text-[#10b981]">student@cybervault.edu</span> / <span className="text-slate-300">StudentPassword123!</span>
              </p>
              <p>
                Admin: <span className="text-purple-400">admin@cybervault.edu</span> / <span className="text-slate-300">AdminPassword123!</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <p className="text-center text-xs font-mono text-slate-500 mt-4">
          Need a lab account?{' '}
          <Link to="/register" className="text-[#10b981] font-semibold hover:underline">
            Register handle here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
