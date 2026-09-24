import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import api from '../services/api';
import { User, Award, CheckCircle2, Calendar, Terminal, Clock } from 'lucide-react';

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

  const domainBreakdown = {
    'OSINT Reconnaissance': correctSubmissions.filter((s) => s.challenge?.category === 'OSINT Reconnaissance').length,
    'Steganography': correctSubmissions.filter((s) => s.challenge?.category === 'Steganography').length,
    'Web Security': correctSubmissions.filter((s) => s.challenge?.category === 'Web Security').length,
    'Cryptography': correctSubmissions.filter((s) => s.challenge?.category === 'Cryptography').length,
    'Digital Forensics': correctSubmissions.filter((s) => s.challenge?.category === 'Digital Forensics').length,
    'Linux Security': correctSubmissions.filter((s) => s.challenge?.category === 'Linux Security').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6 font-mono">
      {/* Header Info */}
      <div className="gctf-card p-6 bg-[#080b14] border-[#1e293b]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded bg-[#101625] border-2 border-[#4285f4] flex items-center justify-center font-bold text-2xl text-[#4285f4] uppercase">
              {user?.username ? user.username.charAt(0) : 'U'}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-100">{user?.username}</h1>
                <span className="px-2.5 py-0.5 rounded bg-[#4285f4]/10 border border-[#4285f4]/40 text-[#4285f4] text-xs uppercase font-bold">
                  {user?.role || 'CONTESTANT'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-[#101625] border border-[#1e293b] px-5 py-3 rounded text-center flex-1 md:flex-none">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">TOTAL SCORE</span>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <Award className="w-4 h-4 text-[#fbbc04]" />
                <span className="text-xl font-bold text-[#fbbc04]">{user?.score || 0} PTS</span>
              </div>
            </div>

            <div className="bg-[#101625] border border-[#1e293b] px-5 py-3 rounded text-center flex-1 md:flex-none">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">TASKS SOLVED</span>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
                <span className="text-xl font-bold text-[#34a853]">
                  {correctSubmissions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Matrix */}
      <div className="gctf-card p-5">
        <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#4285f4]" />
          <span>Category Proficiency Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(domainBreakdown).map(([domain, count]) => (
            <div key={domain} className="bg-[#080b14] p-3 rounded border border-[#1e293b] flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">{domain}:</span>
              <strong className="text-[#34a853]">{count} Solved</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions Log */}
      <div className="gctf-card overflow-hidden">
        <div className="p-4 border-b border-[#1e293b] bg-[#080b14] flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-100 uppercase flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#4285f4]" />
            <span>Submission Audit Trail</span>
          </h3>
          <span className="text-xs text-slate-500">{submissions.length} Total Logs</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Loading submission logs...
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No submissions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#080b14] border-b border-[#1e293b] text-slate-400 text-[11px] uppercase">
                  <th className="py-3 px-4">Task Name</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Submitted Flag</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-[#182235]/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-200">
                      {sub.challenge?.title || 'CTF Task'}
                    </td>
                    <td className="py-3 px-4 text-[#4285f4]">
                      {sub.challenge?.category || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-[200px]">
                      {sub.submittedFlag}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sub.isCorrect ? (
                        <span className="text-[#34a853] font-bold">[CORRECT]</span>
                      ) : (
                        <span className="text-[#ea4335] font-bold">[INCORRECT]</span>
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
