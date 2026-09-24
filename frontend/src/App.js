import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';

// Helper component to resolve current page title for the Header bar
const GetPageTitle = () => {
  const location = useLocation();
  switch (location.pathname) {
    case '/':
      return 'LAB DASHBOARD';
    case '/challenges':
      return 'TARGET MATRIX';
    case '/leaderboard':
      return 'GLOBAL STANDINGS';
    case '/profile':
      return 'MY PROFILE & AUDIT LOGS';
    case '/admin':
      return 'ADMINISTRATIVE CONTROLS';
    default:
      return 'LAB ARENA';
  }
};

// Layout wrapper for authenticated contestant session
const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0b0e14] text-slate-300 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header pageTitle={<GetPageTitle />} />
        <main className="p-6 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

// Protected Route Guard for logged-in users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-[#10b981] font-mono text-xs">
        Initializing Security Lab Authenticator...
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
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-purple-400 font-mono text-xs">
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
            path="/challenges"
            element={
              <ProtectedRoute>
                <Challenges />
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
