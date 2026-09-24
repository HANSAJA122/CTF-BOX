import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import api from '../services/api';
import { Terminal, Award, CheckCircle2, Clock } from 'lucide-react';

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
    <div className="space-y-3">
      {/* Contestant Specs Panel */}
      <div className="soc-panel">
        <div className="soc-panel-header">
          <span>CONTESTANT PROFILE SPECIFICATIONS</span>
          <span className="text-[#10b981]">[ACTIVE LAB ACCOUNT]</span>
        </div>
        <div className="p-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">HANDLE:</span>
            <strong className="text-slate-200">{user?.username}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">EMAIL:</span>
            <span className="text-slate-300">{user?.email}</span>
          </div>
          <div>
            <span className="text-slate-500 block">SCORE:</span>
            <strong className="text-amber-400">{user?.score || 0} PTS</strong>
          </div>
          <div>
            <span className="text-slate-500 block">ROLE:</span>
            <span className="text-[#06b6d4] font-bold uppercase">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Domain Skill Matrix Table */}
      <div className="soc-panel">
        <div className="soc-panel-header">
          <span>DOMAIN MASTERY METRICS</span>
        </div>
        <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(domainBreakdown).map(([domain, count]) => (
            <div key={domain} className="bg-[#05080c] border border-[#1c2436] p-2 flex justify-between items-center text-xs">
              <span className="text-slate-400">{domain}:</span>
              <strong className="text-[#10b981]">{count} Solved</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Log Table */}
      <div className="soc-panel">
        <div className="soc-panel-header">
          <span>FLAG ATTEMPT AUDIT LOG</span>
          <span>TOTAL LOGS: {submissions.length}</span>
        </div>

        {loading ? (
          <div className="p-6 text-center text-slate-500 font-mono text-xs">
            Loading audit log entries...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="soc-table">
              <thead>
                <tr>
                  <th>Target Stage</th>
                  <th>Domain</th>
                  <th>Submitted Flag String</th>
                  <th className="text-center">Validation</th>
                  <th className="text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub._id}>
                    <td className="font-bold text-slate-200">{sub.challenge?.title || 'Target Box'}</td>
                    <td className="text-[#06b6d4]">{sub.challenge?.category || 'N/A'}</td>
                    <td className="text-slate-400 truncate max-w-[180px]">{sub.submittedFlag}</td>
                    <td className="text-center">
                      {sub.isCorrect ? (
                        <span className="text-[#10b981] font-bold">[CORRECT]</span>
                      ) : (
                        <span className="text-red-400 font-bold">[INCORRECT]</span>
                      )}
                    </td>
                    <td className="text-right text-slate-500">
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
