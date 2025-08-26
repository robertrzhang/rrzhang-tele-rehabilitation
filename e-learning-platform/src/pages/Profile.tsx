import React, { useState } from 'react';
import { Card, Button, Input, Textarea } from '../components/ui';
import ChangePassword from '../components/auth/ChangePassword';
import useStore from '../store';
import { useFormValidation } from '../hooks';
import { validateEmail } from '../utils/helpers';

const Profile: React.FC = () => {
  const { user, updateUserProfile, isLoading } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const { values, errors, isValid, setValue } = useFormValidation(
    {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: '',
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
    }
  );

  const validateImageFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)';
    }
    
    if (file.size > maxSize) {
      return 'Image size must be less than 5MB';
    }
    
    return null;
  };

  const processImageFile = (file: File) => {
    const error = validateImageFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!isValid) return;
    
    await updateUserProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      avatar: avatarPreview,
    });
  };

  const handleSavePreferences = async () => {
    // Save preferences logic would go here
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-secondary-900">Profile Settings</h1>
          <p className="text-secondary-600 mt-1">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-secondary-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'profile', name: 'Profile Information' },
              { id: 'preferences', name: 'Learning Preferences' },
              { id: 'privacy', name: 'Privacy & Security' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <div className="space-y-6">
              {/* Enhanced Avatar Upload Section */}
              <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={avatarPreview || 'https://via.placeholder.com/120x120/e2e8f0/64748b?text=Upload'}
                      alt="Profile"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-secondary-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">Profile Photo</h3>
                  <p className="text-sm text-secondary-500 mb-4">
                    Upload a new profile photo. Drag and drop or click to browse.
                  </p>
                  
                  {/* Drag and Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragging
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-secondary-300 hover:border-primary-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <svg className="mx-auto h-12 w-12 text-secondary-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-4">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-secondary-900">
                          Drop your image here, or{' '}
                          <span className="text-primary-600 hover:text-primary-500">browse</span>
                        </span>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="mt-1 text-xs text-secondary-500">
                        PNG, JPG, GIF, WebP up to 5MB
                      </p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {uploadError && (
                    <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                      <div className="flex">
                        <svg className="h-4 w-4 text-red-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {uploadError}
                      </div>
                    </div>
                  )}

                  {/* Success message for demo */}
                  {avatarPreview && avatarPreview !== user?.avatar && (
                    <div className="mt-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex">
                        <svg className="h-4 w-4 text-green-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Image uploaded successfully! Click "Save Changes" to update your profile.
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-3">
                    {avatarPreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAvatarPreview('');
                          setUploadError('');
                        }}
                      >
                        Remove Photo
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAvatarPreview('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face');
                        setUploadError('');
                      }}
                    >
                      Use Demo Photo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  value={values.firstName}
                  onChange={(e) => setValue('firstName', e.target.value)}
                  error={errors.firstName}
                />
                <Input
                  label="Last Name"
                  value={values.lastName}
                  onChange={(e) => setValue('lastName', e.target.value)}
                  error={errors.lastName}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                error={errors.email}
              />

              <Textarea
                label="Bio (Optional)"
                placeholder="Tell us about yourself..."
                rows={4}
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  isLoading={isLoading}
                  disabled={!isValid}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <Card>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email notifications', description: 'Get notified about course updates via email' },
                    { id: 'push', label: 'Push notifications', description: 'Receive push notifications in your browser' },
                    { id: 'assignments', label: 'Assignment reminders', description: 'Get reminded about upcoming assignment deadlines' },
                    { id: 'courseUpdates', label: 'Course updates', description: 'Notifications about new content in your courses' },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={setting.id}
                          type="checkbox"
                          defaultChecked={user?.preferences?.notifications?.[setting.id as keyof typeof user.preferences.notifications]}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor={setting.id} className="text-sm font-medium text-secondary-700">
                          {setting.label}
                        </label>
                        <p className="text-sm text-secondary-500">{setting.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Preferred Study Times</h3>
                <div className="space-y-4">
                  {[
                    { id: 'morning', label: 'Morning (6AM - 12PM)', time: 'morning' },
                    { id: 'afternoon', label: 'Afternoon (12PM - 6PM)', time: 'afternoon' },
                    { id: 'evening', label: 'Evening (6PM - 12AM)', time: 'evening' },
                  ].map((time) => (
                    <div key={time.id} className="flex items-center">
                      <input
                        id={time.id}
                        type="checkbox"
                        defaultChecked={user?.preferences?.studyTimes?.[time.time as keyof typeof user.preferences.studyTimes]}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                      <label htmlFor={time.id} className="ml-3 text-sm font-medium text-secondary-700">
                        {time.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePreferences} isLoading={isLoading}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <Card>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="profileVisible"
                        type="checkbox"
                        defaultChecked={user?.preferences?.privacy?.profileVisible}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="profileVisible" className="text-sm font-medium text-secondary-700">
                        Make my profile visible to other students
                      </label>
                      <p className="text-sm text-secondary-500">
                        Allow other students to see your profile and learning activity
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="progressVisible"
                        type="checkbox"
                        defaultChecked={user?.preferences?.privacy?.progressVisible}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="progressVisible" className="text-sm font-medium text-secondary-700">
                        Show my progress on leaderboards
                      </label>
                      <p className="text-sm text-secondary-500">
                        Display your progress and achievements on public leaderboards
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Account Security</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-secondary-200">
                    <div>
                      <span className="text-sm font-medium text-secondary-900">Password</span>
                      <p className="text-sm text-secondary-500">Last updated 30 days ago</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowChangePassword(true)}
                    >
                      Change Password
                    </Button>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-secondary-200">
                    <div>
                      <span className="text-sm font-medium text-secondary-900">Two-Factor Authentication</span>
                      <p className="text-sm text-secondary-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="text-sm font-medium text-secondary-900">Download My Data</span>
                      <p className="text-sm text-secondary-500">Get a copy of your learning data</p>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-secondary-200">
                <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-secondary-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>

              <div className="flex justify-end">
                <Button isLoading={isLoading}>
                  Save Privacy Settings
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <ChangePassword
              onSuccess={() => {
                setShowChangePassword(false);
                // You could add a toast notification here
              }}
              onCancel={() => setShowChangePassword(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
