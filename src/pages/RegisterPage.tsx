import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Mail, Lock, User, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(email, password, name, companyName);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
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
          <h2 className="mt-6 text-3xl font-bold text-white">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Join BrowserBot to start tracking website visitors
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                Your Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-400">
                Company Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Acme Inc."
                />
              </div>
            </div>
            
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;