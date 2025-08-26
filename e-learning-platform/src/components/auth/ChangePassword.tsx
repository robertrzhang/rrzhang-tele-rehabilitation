import React, { useState } from 'react';
import { Button, Input, Card } from '../ui';
import { useFormValidation } from '../../hooks';
import { validatePassword } from '../../utils/helpers';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { values, errors, isValid, setValue } = useFormValidation<ChangePasswordData>(
    {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    {
      currentPassword: (value) => {
        if (!value) return 'Current password is required';
        return undefined;
      },
      newPassword: (value) => {
        const validation = validatePassword(value);
        if (!validation.isValid) return validation.errors[0];
        if (value === values.currentPassword) return 'New password must be different from current password';
        return undefined;
      },
      confirmPassword: (value) => {
        if (!value) return 'Please confirm your new password';
        if (value !== values.newPassword) return 'Passwords do not match';
        return undefined;
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSuccess?.();
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: 'bg-gray-200' };
    
    let score = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];
    
    score = checks.filter(Boolean).length;
    
    if (score < 2) return { strength: 1, label: 'Very Weak', color: 'bg-red-500' };
    if (score < 3) return { strength: 2, label: 'Weak', color: 'bg-orange-500' };
    if (score < 4) return { strength: 3, label: 'Fair', color: 'bg-yellow-500' };
    if (score < 5) return { strength: 4, label: 'Good', color: 'bg-blue-500' };
    return { strength: 5, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(values.newPassword);

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-secondary-900">Change Password</h3>
          <p className="text-sm text-secondary-600 mt-1">
            Ensure your account is secure by using a strong password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={values.currentPassword}
              onChange={(e) => setValue('currentPassword', e.target.value)}
              error={errors.currentPassword}
              placeholder="Enter your current password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600"
              onClick={() => togglePasswordVisibility('current')}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showPasswords.current ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L15.121 15.121M15.121 15.121L21 21" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={values.newPassword}
              onChange={(e) => setValue('newPassword', e.target.value)}
              error={errors.newPassword}
              placeholder="Enter your new password"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600"
              onClick={() => togglePasswordVisibility('new')}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showPasswords.new ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L15.121 15.121M15.121 15.121L21 21" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {values.newPassword && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-700">Password strength</span>
                <span className={`text-sm font-medium ${
                  passwordStrength.strength <= 2 ? 'text-red-600' : 
                  passwordStrength.strength <= 3 ? 'text-yellow-600' : 
                  passwordStrength.strength <= 4 ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${passwordStrength.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
              <div className="text-xs text-secondary-500 space-y-1">
                <p>Password should contain:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li className={values.newPassword.length >= 8 ? 'text-green-600' : 'text-secondary-500'}>
                    At least 8 characters
                  </li>
                  <li className={/[a-z]/.test(values.newPassword) ? 'text-green-600' : 'text-secondary-500'}>
                    Lowercase letter
                  </li>
                  <li className={/[A-Z]/.test(values.newPassword) ? 'text-green-600' : 'text-secondary-500'}>
                    Uppercase letter
                  </li>
                  <li className={/\d/.test(values.newPassword) ? 'text-green-600' : 'text-secondary-500'}>
                    Number
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(values.newPassword) ? 'text-green-600' : 'text-secondary-500'}>
                    Special character
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={values.confirmPassword}
              onChange={(e) => setValue('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showPasswords.confirm ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L15.121 15.121M15.121 15.121L21 21" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <div className="flex space-x-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!isValid}
              className={onCancel ? 'flex-1' : 'w-full'}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ChangePassword;
