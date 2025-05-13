import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  // While checking authentication status, show nothing (or could add a loader here)
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If a specific role is required, check for it
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect admins to admin dashboard
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    
    // Redirect customers to customer dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated and has required role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;