import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar 
        isMobile={isMobile} 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Status Badge */}
        {user?.role === 'customer' && (
          <div className={`${
            user.pixelInstalled 
              ? 'bg-emerald-900/30 border-emerald-500/30' 
              : 'bg-amber-900/30 border-amber-500/30'
          } border-b py-1.5`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
              {user.pixelInstalled ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                  <span className="text-sm text-emerald-300">Tracking pixel is active and collecting data</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400 mr-2" />
                  <span className="text-sm text-amber-300">Tracking pixel not installed - <a href="/pixel-setup" className="underline hover:text-amber-200">Set up now</a></span>
                </>
              )}
            </div>
          </div>
        )}

        <header className="flex items-center justify-between h-16 px-6 bg-gray-900 border-b border-gray-800">
          {isMobile && (
            <button 
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
          )}
          
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-700 rounded-full">
              <span className="text-sm font-medium text-white">
                {user?.name.charAt(0)}
              </span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;