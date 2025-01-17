import React, { useState, FormEvent, ChangeEvent } from 'react';
import { User, Lock } from 'lucide-react';
import { BACKEND_URL } from '@/config';
import { useNavigate } from 'react-router-dom';

interface LoginCredentials {
  username: string;
  password: string;
}


const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

   
    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        body: JSON.stringify(credentials), 
      });
      const data = await response.json();
      const jwt = data.token;
      localStorage.setItem("token", jwt);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                <User className="w-4 h-4" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;