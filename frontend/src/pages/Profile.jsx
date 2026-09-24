import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import api from '../services/api';
import { User, Award, CheckCircle2, Shield, Calendar, Terminal, Clock, Activity } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/submissions/my');
        if (res.data.success) {
          setSubmissions(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load user submission history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const correctSubmissions = submissions.filter((s) => s.isCorrect);

  // Group solved by domain category
  const domainBreakdown = {
    'OSINT Reconnaissance': correctSubmissions.filter((s) => s.challenge?.category === 'OSINT Reconnaissance').length,
    'Steganography': correctSubmissions.filter((s) => s.challenge?.category === 'Steganography').length,
    'Web Security': correctSubmissions.filter((s) => s.challenge?.category === 'Web Security').length,
    'Cryptography': correctSubmissions.filter((s) => s.challenge?.category === 'Cryptography').length,
    'Digital Forensics': correctSubmissions.filter((s) => s.challenge?.category === 'Digital Forensics').length,
    'Linux Security': correctSubmissions.filter((s) => s.challenge?.category === 'Linux Security').length,
  };

  return (
    <div className="space-y-6">
      {/* Header Info Card */}
      <div className="htb-card p-6 bg-[#121824] border-[#1f293d]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded bg-[#0b0e14] border-2 border-[#10b981] flex items-center justify-center font-mono text-2xl text-[#10b981] font-bold uppercase">
              {user?.username ? user.username.charAt(0) : 'U'}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-mono font-bold text-slate-100">{user?.username}</h1>
                <span className="domain-pill">{user?.role || 'STUDENT'}</span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">{user?.email}</p>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-[#10b981]">
                  <Activity className="w-3.5 h-3.5" />
                  Active Lab Student
                </span>
              </div>
            </div>
          </div>

          {/* Stats Box */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-[#0b0e14] border border-[#1f293d] px-5 py-3 rounded text-center flex-1 md:flex-none">
              <span className="block text-[10px] font-mono text-slate-500 uppercase">TOTAL POINTS</span>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-2xl font-mono font-bold text-amber-400">{user?.score || 0}</span>
              </div>
            </div>

            <div className="bg-[#0b0e14] border border-[#1f293d] px-5 py-3 rounded text-center flex-1 md:flex-none">
              <span className="block text-[10px] font-mono text-slate-500 uppercase">SOLVED BOXES</span>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span className="text-2xl font-mono font-bold text-[#10b981]">
                  {correctSubmissions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Proficiency Breakdown */}
      <div className="htb-card p-6">
        <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#10b981]" />
          <span>Domain Skill Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(domainBreakdown).map(([domain, count]) => (
            <div key={domain} className="bg-[#0b0e14] p-3.5 rounded border border-[#1f293d]">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-300 font-semibold">{domain}</span>
                <span className="text-[#10b981] font-bold">{count} Solved</span>
              </div>
              <div className="w-full bg-[#121824] h-1.5 rounded overflow-hidden border border-[#1f293d]">
                <div
                  className="bg-[#10b981] h-full"
                  style={{ width: `${Math.min(count * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flag Submission History */}
      <div className="htb-card overflow-hidden">
        <div className="p-4 border-b border-[#1f293d] bg-[#0d1117] flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Submission Log Audit</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">{submissions.length} Total Attempts</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500">
            Loading submission audit logs...
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500">
            No flag submissions recorded yet. Launch a target to submit your first flag!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b0e14] border-b border-[#1f293d] text-slate-400 text-[11px] font-mono uppercase">
                  <th className="py-3 px-4">Stage / Challenge</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Submitted Flag</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f293d] text-xs font-mono">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-[#1a2332]/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {sub.challenge?.title || 'CTF Target'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="domain-pill">{sub.challenge?.category || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-[200px]">
                      {sub.submittedFlag}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sub.isCorrect ? (
                        <span className="badge-solved">CORRECT</span>
                      ) : (
                        <span className="badge-hard">INCORRECT</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
