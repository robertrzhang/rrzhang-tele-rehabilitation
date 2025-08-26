import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useStore();

  useEffect(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-secondary-600">Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
