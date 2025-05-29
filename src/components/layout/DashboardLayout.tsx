import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu, ChevronRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLeads } from '../../context/LeadsContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { leads } = useLeads();
  
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

  // Calculate weekly leads
  const getWeeklyLeads = () => {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    
    return leads.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= startOfWeek;
    }).length;
  };

  const weeklyLeadCount = getWeeklyLeads();
  
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar 
        isMobile={isMobile} 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Weekly Leads Banner - Only show for customers */}
        {user?.role === 'customer' && (
          <div className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Weekly Leads:</span>
                  <span className="text-sm font-medium text-white">{weeklyLeadCount}</span>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-blue-400">This Week's Activity</span>
                  </div>
                </div>
                <div className="h-1.5 w-32 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
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