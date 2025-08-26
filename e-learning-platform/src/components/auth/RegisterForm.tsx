import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../ui';
import useStore from '../../store';
import { useFormValidation } from '../../hooks';
import { validateEmail, validatePassword } from '../../utils/helpers';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useStore();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const { values, errors, isValid, setValue } = useFormValidation<RegisterFormData>(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    {
      firstName: (value) => {
        if (!value) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        return undefined;
      },
      lastName: (value) => {
        if (!value) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        return undefined;
      },
      email: (value) => {
        if (!value) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email';
        return undefined;
      },
      password: (value) => {
        const validation = validatePassword(value);
        if (!validation.isValid) return validation.errors[0];
        return undefined;
      },
      confirmPassword: (value) => {
        if (!value) return 'Please confirm your password';
        if (value !== values.password) return 'Passwords do not match';
        return undefined;
      },
      agreeToTerms: (value) => {
        if (!value) return 'You must agree to the terms and conditions';
        return undefined;
      },
    }
  );

  const handleNextStep = () => {
    if (step === 1) {
      // Validate step 1 fields
      if (!values.firstName || !values.lastName || errors.firstName || errors.lastName) {
        return;
      }
      setStep(2);
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      await register(values.email, values.password, values.firstName, values.lastName);
      setEmailVerificationSent(true);
      setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(values.email)}`), 2000);
    } catch (err) {
      // Error is handled by the store
    }
  };

  if (emailVerificationSent) {
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
              Registration Successful!
            </h3>
            <p className="text-secondary-600 mb-4">
              A verification code has been sent to <strong>{values.email}</strong>. 
              You'll be redirected to enter the verification code shortly.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> Use code <strong>123456</strong> when prompted
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-secondary-500">
                Redirecting to verification page...
              </p>
              <div className="space-x-3">
                <Button variant="outline" size="sm" onClick={() => setEmailVerificationSent(false)}>
                  Try Different Email
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 1 ? 'bg-primary-600 text-white' : 'bg-secondary-200 text-secondary-600'
          }`}>
            1
          </div>
          <div className={`h-0.5 w-12 ${step >= 2 ? 'bg-primary-600' : 'bg-secondary-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 2 ? 'bg-primary-600 text-white' : 'bg-secondary-200 text-secondary-600'
          }`}>
            2
          </div>
        </div>

        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    type="text"
                    value={values.firstName}
                    onChange={(e) => setValue('firstName', e.target.value)}
                    error={errors.firstName}
                    placeholder="John"
                    autoComplete="given-name"
                    required
                  />
                  <Input
                    label="Last name"
                    type="text"
                    value={values.lastName}
                    onChange={(e) => setValue('lastName', e.target.value)}
                    error={errors.lastName}
                    placeholder="Doe"
                    autoComplete="family-name"
                    required
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full"
                  disabled={!values.firstName || !values.lastName || !!errors.firstName || !!errors.lastName}
                >
                  Continue
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Input
                  label="Email address"
                  type="email"
                  value={values.email}
                  onChange={(e) => setValue('email', e.target.value)}
                  error={errors.email}
                  placeholder="john.doe@example.com"
                  autoComplete="email"
                  required
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={(e) => setValue('password', e.target.value)}
                    error={errors.password}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L15.121 15.121M15.121 15.121L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                <Input
                  label="Confirm password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={(e) => setValue('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agree-terms"
                      name="agree-terms"
                      type="checkbox"
                      checked={values.agreeToTerms}
                      onChange={(e) => setValue('agreeToTerms', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="agree-terms" className="text-sm text-secondary-700">
                      I agree to the{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500">
                        Privacy Policy
                      </a>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    isLoading={isLoading}
                    disabled={!isValid}
                  >
                    Create Account
                  </Button>
                </div>
              </>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
