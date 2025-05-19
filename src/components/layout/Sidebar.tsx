import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  UserCog, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  PlusCircle,
  Bot,
  HelpCircle,
  GraduationCap,
  CreditCard,
  Calculator,
  Scale,
  Activity
} from 'lucide-react';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const sidebarClasses = `${
    isMobile 
      ? `fixed inset-y-0 left-0 z-40 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`
      : 'relative w-64'
  } flex flex-col h-full bg-gray-900 border-r border-gray-800`;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  const adminLinks = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/customers', icon: <Users size={20} />, label: 'Customers' },
    { path: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/admin/billing', icon: <CreditCard size={20} />, label: 'Billing' },
    { path: '/admin/users', icon: <UserCog size={20} />, label: 'Users' },
    { path: '/admin/hits', icon: <Activity size={20} />, label: 'Website Hits' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const customerLinks = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/pixel-setup', icon: <PlusCircle size={20} />, label: 'Bot Setup' },
    { path: '/hits', icon: <Activity size={20} />, label: 'Website Hits' },
    { path: '/legal-best-practices', icon: <Scale size={20} />, label: 'Legal Best Practices' },
    { path: '/roi-calculator', icon: <Calculator size={20} />, label: 'ROI Calculator' },
    { path: '/training', icon: <GraduationCap size={20} />, label: 'Training' },
    { path: '/support', icon: <HelpCircle size={20} />, label: 'Support' },
    { path: '/billing', icon: <CreditCard size={20} />, label: 'Billing & Usage' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const links = user?.role === 'admin' ? adminLinks : customerLinks;

  return (
    <>
      {/* Sidebar Backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Logo & Header */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-800">
          <div className="flex items-center">
            <Bot className="w-7 h-7 text-blue-500" />
            <span className="ml-2 text-xl font-bold text-white">BrowserBot</span>
          </div>
        </div>
        
        {/* User Info */}
        <div className="flex items-center px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-700 rounded-full">
            <span className="text-lg font-medium text-white">
              {user?.name.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
        
        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(link.path)
                    ? 'bg-gray-800 text-blue-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
        
        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;