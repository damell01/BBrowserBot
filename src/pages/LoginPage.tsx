import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Mail, Lock, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    try {
      await resetPassword(email);
      setShowForgotPassword(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
        <div className="text-center">
          <div className="flex justify-center">
            <Bot className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome to BrowserBot</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your visitor tracking dashboard
          </p>
        </div>

        {/* Test Credentials Box */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-5 w-5 text-blue-400" />
            <h3 className="text-sm font-medium text-white">Test Credentials</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-gray-400">Customer Login:</p>
                <p className="text-white">Email: Test1@email.com</p>
                <p className="text-white">Password: 123</p>
              </div>
              <div>
                <p className="text-gray-400">Admin Login:</p>
                <p className="text-white">Email: admin@example.com</p>
                <p className="text-white">Password: admin123</p>
              </div>
            </div>
          </div>
        </div>
        
        {!showForgotPassword ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  </span>
                ) : null}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <div>
              <h3 className="text-lg font-medium text-white">Reset Password</h3>
              <p className="mt-1 text-sm text-gray-400">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>
            
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-400">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
        
        <div className="text-center text-sm">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;