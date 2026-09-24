import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Terminal, AlertCircle } from 'lucide-react';

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
      setError(err.response?.data?.message || '[-] Authentication failed. Invalid handle or passphrase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05080c] flex items-center justify-center p-4 font-mono text-xs select-none">
      <div className="w-full max-w-md">
        {/* Terminal Header */}
        <div className="bg-[#090d14] border border-[#1c2436] p-3 text-center mb-3">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-100 text-sm">
            <Terminal className="w-4 h-4 text-[#10b981]" />
            <span>CYBERVAULT // RANGE AUTHENTICATOR</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            SLIIT Security Labs System Login
          </div>
        </div>

        {/* Form Container Panel */}
        <div className="soc-panel p-4">
          {error && (
            <div className="mb-3 p-2 bg-red-950/30 border border-red-500 text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">
                $ login_email:
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@cybervault.edu"
                className="w-full px-3 py-1.5 bg-[#05080c] border border-[#1c2436] text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#10b981]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">
                $ login_password:
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-1.5 bg-[#05080c] border border-[#1c2436] text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#10b981]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="soc-btn-green w-full py-1.5 justify-center font-bold uppercase mt-2"
            >
              {loading ? '[ AUTHENTICATING... ]' : '[ AUTHENTICATE SESSION ]'}
            </button>
          </form>

          {/* Demo Specs Table */}
          <div className="mt-4 pt-3 border-t border-[#1c2436] space-y-1 text-[10px]">
            <div className="text-slate-500 font-bold uppercase">Demo Credentials:</div>
            <div className="bg-[#05080c] p-2 border border-[#1c2436] space-y-1 text-slate-400">
              <div>Student: <span className="text-[#10b981]">student@cybervault.edu</span> / <span className="text-slate-200">StudentPassword123!</span></div>
              <div>Admin: <span className="text-purple-400">admin@cybervault.edu</span> / <span className="text-slate-200">AdminPassword123!</span></div>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-500 mt-3">
          No lab account?{' '}
          <Link to="/register" className="text-[#10b981] hover:underline font-bold">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
