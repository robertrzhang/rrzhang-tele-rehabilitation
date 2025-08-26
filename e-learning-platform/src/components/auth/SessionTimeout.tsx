import React, { useEffect, useState } from 'react';
import { Button, Card } from '../ui';
import useStore from '../../store';

interface SessionTimeoutProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({ 
  timeoutMinutes = 30, 
  warningMinutes = 5 
}) => {
  const { user, logout } = useStore();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!user) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let warningTimeoutId: ReturnType<typeof setTimeout>;
    let countdownInterval: ReturnType<typeof setInterval>;
    let lastActivity = Date.now();

    const resetTimers = () => {
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      clearInterval(countdownInterval);
      setShowWarning(false);
      lastActivity = Date.now();
      
      // Set warning timer
      warningTimeoutId = setTimeout(() => {
        setShowWarning(true);
        setTimeRemaining(warningMinutes * 60);
        
        // Start countdown
        countdownInterval = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              logout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, (timeoutMinutes - warningMinutes) * 60 * 1000);

      // Set logout timer
      timeoutId = setTimeout(() => {
        logout();
      }, timeoutMinutes * 60 * 1000);
    };

    const handleActivity = () => {
      const now = Date.now();
      // Only reset if it's been more than 1 second since last activity
      if (now - lastActivity > 1000) {
        resetTimers();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initialize timers
    resetTimers();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      clearInterval(countdownInterval);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [user, logout, timeoutMinutes, warningMinutes]);

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    // This will trigger the useEffect to reset timers
  };

  const handleLogoutNow = () => {
    logout();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Session Timeout Warning
          </h3>
          <p className="text-secondary-600 mb-4">
            Your session will expire in <strong>{formatTime(timeRemaining)}</strong> due to inactivity.
          </p>
          <p className="text-sm text-secondary-500 mb-6">
            Click "Stay Logged In" to continue your session or "Logout" to end your session now.
          </p>
          <div className="space-x-3">
            <Button variant="outline" onClick={handleLogoutNow}>
              Logout Now
            </Button>
            <Button onClick={handleStayLoggedIn} autoFocus>
              Stay Logged In
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SessionTimeout;
