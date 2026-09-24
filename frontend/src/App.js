import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';

// Google CTF Main Layout Wrapper
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0c101c] text-slate-300 font-mono flex flex-col">
      <Navbar />
      <main className="flex-1 pb-12">
        {children}
      </main>
      {/* Footer */}
      <footer className="border-t border-[#1e293b] bg-[#080b14] py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>CyberVault CTF // SLIIT Security Labs &copy; 2026</span>
          <span className="text-[#34a853]">Isolated Docker Challenge Network</span>
        </div>
      </footer>
    </div>
  );
};

// Protected Route Guard for logged-in contestants
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c101c] flex items-center justify-center text-[#4285f4] font-mono text-xs">
        Connecting to CyberVault Authenticator...
      </div>
    );
  }

  return isAuthenticated ? <AppLayout>{children}</AppLayout> : <Navigate to="/login" replace />;
};

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c101c] flex items-center justify-center text-[#ab47bc] font-mono text-xs">
        Verifying Administrative Credentials...
      </div>
    );
  }

  return isAuthenticated && isAdmin ? <AppLayout>{children}</AppLayout> : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
