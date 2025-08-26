import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Card } from '../ui';
import useStore from '../../store';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, verifyEmail } = useStore();
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);

  const email = searchParams.get('email') || user?.email || 'your email';

  useEffect(() => {
    // Start cooldown timer if resending
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    // Simulate initial email being sent
    if (!emailSent) {
      setEmailSent(true);
    }
  }, [emailSent]);

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setCodeError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setCodeError('Verification code must be 6 digits');
      return;
    }

    setIsVerifying(true);
    setCodeError('');

    try {
      // Use the verifyEmail function from the store
      await verifyEmail(email, verificationCode);
      
      // Success - redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setCodeError(error instanceof Error ? error.message : 'Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setCodeError('');
    
    try {
      // Simulate resending verification code (mock API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      setCodeError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setCodeError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerifyCode();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-secondary-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            We've sent a verification code to
          </p>
          <p className="text-sm font-medium text-secondary-900 mb-4">
            {email}
          </p>
        </div>

        <Card>
          <div className="space-y-6">
            {/* Demo Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Demo Mode
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>For demo purposes, use the verification code: <strong>123456</strong></p>
                    <p className="text-xs mt-1">In a real application, this would be sent via email.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-secondary-700 mb-2">
                Enter 6-digit verification code
              </label>
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={handleCodeChange}
                onKeyPress={handleKeyPress}
                placeholder="123456"
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
                error={codeError}
              />
              {codeError && (
                <p className="mt-2 text-sm text-red-600">{codeError}</p>
              )}
            </div>

            <Button
              onClick={handleVerifyCode}
              className="w-full"
              isLoading={isVerifying}
              disabled={!verificationCode || verificationCode.length !== 6}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-secondary-600 mb-3">
                Didn't receive the code?
              </p>
              
              {resendCooldown > 0 ? (
                <p className="text-sm text-secondary-500">
                  Resend code in {resendCooldown} seconds
                </p>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleResendCode}
                  isLoading={isResending}
                  disabled={isResending}
                >
                  {isResending ? 'Sending...' : 'Resend Code'}
                </Button>
              )}
            </div>

            <div className="border-t border-secondary-200 pt-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-secondary-600">
                  Need help? Contact support
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tips */}
        <div className="text-center space-y-2">
          <p className="text-xs text-secondary-500">
            Tips: Check your spam folder or try resending the code
          </p>
          <p className="text-xs text-secondary-500">
            Code expires in 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
