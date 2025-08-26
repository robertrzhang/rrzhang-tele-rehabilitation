import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui';
import useStore from '../../store';

const Navigation: React.FC = () => {
  const { user, logout } = useStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Assignments', href: '/assignments', icon: '📝' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center min-w-0 flex-1">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-lg lg:text-xl font-bold text-primary-600 truncate">
                E-Learning Platform
              </Link>
            </div>
            <div className="hidden sm:ml-4 lg:ml-6 sm:flex sm:space-x-4 lg:space-x-8 min-w-0">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                      isActive
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                    }`}
                  >
                    <span className="mr-1 lg:mr-2">{item.icon}</span>
                    <span className="hidden md:inline">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-2 lg:space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="text-sm text-secondary-700 whitespace-nowrap hidden md:block">
                Welcome, {user?.firstName}!
              </div>
              <div className="text-sm text-secondary-700 whitespace-nowrap md:hidden">
                Hi, {user?.firstName}!
              </div>
              <div className="h-6 w-px bg-secondary-300 hidden md:block"></div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="whitespace-nowrap">
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 hover:border-secondary-300'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-secondary-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.avatar || 'https://via.placeholder.com/32'}
                  alt=""
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-secondary-800">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm font-medium text-secondary-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-base font-medium text-secondary-500 hover:text-secondary-800 hover:bg-secondary-100 w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
