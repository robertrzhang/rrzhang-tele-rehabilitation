import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import EmailVerification from './components/auth/EmailVerification';
import LogoutPage from './components/auth/LogoutPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SessionTimeout from './components/auth/SessionTimeout';
import Layout from './components/layout/Layout';

// Pages
import CourseDashboard from './pages/CourseDashboard';
import AssignmentTracker from './pages/AssignmentTracker';
import ProgressAnalytics from './pages/ProgressAnalytics';
import Profile from './pages/Profile';

// Hooks
import useStore from './store';
import { useSessionTimeout } from './hooks';

const App: React.FC = () => {
  const { loadUser, isAuthenticated } = useStore();

  // Auto-logout after 30 minutes of inactivity
  useSessionTimeout(30);

  useEffect(() => {
    // Load user on app start if token exists
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      loadUser();
    }
  }, [loadUser, isAuthenticated]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterForm />
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />
            } 
          />
          <Route 
            path="/verify-email" 
            element={<EmailVerification />} 
          />

          {/* Logout route for testing */}
          <Route 
            path="/logout" 
            element={<LogoutPage />} 
          />

          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <CourseDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assignments" 
            element={
              <ProtectedRoute>
                <Layout>
                  <AssignmentTracker />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProgressAnalytics />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Default redirect */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#059669',
              },
            },
            error: {
              style: {
                background: '#DC2626',
              },
            },
          }}
        />

        {/* Session timeout warning */}
        <SessionTimeout timeoutMinutes={30} warningMinutes={5} />
      </div>
    </Router>
  );
};

export default App;
