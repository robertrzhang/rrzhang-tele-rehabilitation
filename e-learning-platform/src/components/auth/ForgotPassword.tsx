import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card } from '../ui';
import { useFormValidation } from '../../hooks';
import { validateEmail } from '../../utils/helpers';

interface ForgotPasswordData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { values, errors, isValid, setValue } = useFormValidation<ForgotPasswordData>(
    { email: '' },
    {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email';
        return undefined;
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Reset Link Sent!
            </h3>
            <p className="text-secondary-600 mb-6">
              We've sent a password reset link to {values.email}. Please check your inbox and follow the instructions.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-secondary-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-x-3">
                <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
                  Try Again
                </Button>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              error={errors.email}
              placeholder="Enter your email"
              autoComplete="email"
              autoFocus
              required
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={!isValid}
            >
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-secondary-500">or</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
