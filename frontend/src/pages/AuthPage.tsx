import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login, isAuthenticated, loading, error, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username && password) {
      const success = await login(username, password);
      if (success) {
        // navigation handled in useEffect
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white flex items-center justify-center gap-3">
          <LogIn className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              'Login'
            )}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Hint: Try <span className="font-semibold">admin / admin123</span> or demo credentials
          </p>

        </form>
      </div>
    </div>
  );
};

export default AuthPage;
