import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Activity } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Activity className="h-16 w-16 text-blue-500" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;