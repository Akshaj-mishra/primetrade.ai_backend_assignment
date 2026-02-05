import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, LogOut, User as UserIcon, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center transition-colors duration-300">
      <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800 dark:text-white">
        <UserIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        <span>Keep Notes</span>
      </Link>

      <nav className="flex items-center space-x-4">
        {isAuthenticated && (
          <span className="text-gray-700 dark:text-gray-300 hidden sm:block">Welcome, {user?.username} ({user?.role})</span>
        )}

        {isAdmin && isAuthenticated && (
          <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
            <Settings className="h-5 w-5" />
            <span className="hidden sm:block">Admin</span>
          </Link>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:block">Logout</span>
          </button>
        ) : (
          <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
