import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/ui';

const AuthDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            E-Learning Platform - Authentication Demo
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Explore our comprehensive authentication system with all the features you requested, 
            including login, registration, email verification, password management, and session handling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Login Features */}
          <Card>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Login System</h3>
              <p className="text-sm text-secondary-600 mb-4">
                Email/password authentication with "Remember Me" and "Forgot Password" options
              </p>
              <div className="space-y-2">
                <Link to="/login">
                  <Button className="w-full" size="sm">
                    Try Login
                  </Button>
                </Link>
                <p className="text-xs text-secondary-500">
                  Demo: john.doe@example.com / password
                </p>
              </div>
            </div>
          </Card>

          {/* Registration Features */}
          <Card>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Registration Flow</h3>
              <p className="text-sm text-secondary-600 mb-4">
                Multi-step signup with validation and email verification simulation
              </p>
              <Link to="/register">
                <Button className="w-full" size="sm">
                  Try Registration
                </Button>
              </Link>
            </div>
          </Card>

          {/* Email Verification */}
          <Card>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Email Verification</h3>
              <p className="text-sm text-secondary-600 mb-4">
                Simulated email verification with success, expired, and error states
              </p>
              <div className="space-y-2">
                <Link to="/verify-email?token=mock-verification-demo&email=demo@example.com">
                  <Button className="w-full" size="sm">
                    Success Demo
                  </Button>
                </Link>
                <Link to="/verify-email?token=expired-token&email=demo@example.com">
                  <Button variant="outline" className="w-full" size="sm">
                    Expired Demo
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Password Reset */}
          <Card>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 01-2 2H9a2 2 0 01-2-2m2-2h6m-6 0a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2h-6z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Password Reset</h3>
              <p className="text-sm text-secondary-600 mb-4">
                Forgot password flow with email simulation and secure reset process
              </p>
              <Link to="/forgot-password">
                <Button className="w-full" size="sm">
                  Try Password Reset
                </Button>
              </Link>
            </div>
          </Card>

          {/* Profile Management */}
          <Card>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">User Profile</h3>
              <p className="text-sm text-secondary-600 mb-4">
                Editable profile with avatar upload, preferences, and privacy controls
              </p>
              <Link to="/login">
                <Button className="w-full" size="sm">
                  Login to Access
                </Button>
              </Link>
            </div>
          </Card>

          {/* Session Management */}
          <Card>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Session Security</h3>
              <p className="text-sm text-secondary-600 mb-4">
                Auto-logout after inactivity, session warnings, and secure token management
              </p>
              <Link to="/login">
                <Button className="w-full" size="sm">
                  Login to Test
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Features List */}
        <Card>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
              Complete Authentication Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">✅ Login System</h3>
                <ul className="space-y-2 text-sm text-secondary-600">
                  <li>• Email/password authentication</li>
                  <li>• "Remember Me" functionality</li>
                  <li>• Password visibility toggle</li>
                  <li>• Form validation with real-time feedback</li>
                  <li>• Error handling and user feedback</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">✅ Registration Flow</h3>
                <ul className="space-y-2 text-sm text-secondary-600">
                  <li>• Multi-step registration process</li>
                  <li>• Comprehensive form validation</li>
                  <li>• Password strength indicator</li>
                  <li>• Terms acceptance requirement</li>
                  <li>• Email verification simulation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">✅ Email Verification</h3>
                <ul className="space-y-2 text-sm text-secondary-600">
                  <li>• Mock email verification system</li>
                  <li>• Success, error, and expired states</li>
                  <li>• Resend verification option</li>
                  <li>• Clear user feedback and guidance</li>
                  <li>• Automatic redirect after verification</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">✅ Password Management</h3>
                <ul className="space-y-2 text-sm text-secondary-600">
                  <li>• Forgot password flow</li>
                  <li>• Secure password change form</li>
                  <li>• Password strength validation</li>
                  <li>• Visual strength indicator</li>
                  <li>• Current password verification</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">✅ User Profile</h3>
                <ul className="space-y-2 text-sm text-secondary-600">
                  <li>• Editable profile information</li>
                  <li>• Avatar upload simulation</li>
                  <li>• Learning preference settings</li>
                  <li>• Notification controls</li>
                  <li>• Privacy and security options</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">✅ Session Management</h3>
                <ul className="space-y-2 text-sm text-secondary-600">
                  <li>• Auto-logout after 30min inactivity</li>
                  <li>• 5-minute warning before logout</li>
                  <li>• Session persistence with localStorage</li>
                  <li>• Protected route authentication</li>
                  <li>• Secure token handling</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🚀 Ready to Test</h4>
              <p className="text-sm text-blue-800">
                All features are fully functional with mock APIs. Start by trying the login with demo credentials 
                or create a new account to experience the complete authentication flow.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthDemo;
