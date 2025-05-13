import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import MetricsCard from '../components/dashboard/MetricsCard';
import LeadsTable from '../components/dashboard/LeadsTable';
import { useLeads } from '../context/LeadsContext';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  ArrowRight, 
  Users,
  Building,
  Activity,
  CheckCircle,
  Radar,
  DollarSign,
  Search,
  Settings
} from 'lucide-react';

// Mock customer data for admin view
const mockCustomers = [
  {
    id: '1',
    name: 'Enterprise Solutions Inc',
    email: 'enterprise@example.com',
    activeSince: 'Jan 15, 2025',
    status: 'active',
    leadsCount: 45000,
    pixelInstalled: true,
    monthlyValue: 45000
  },
  {
    id: '2',
    name: 'Tech Innovators',
    email: 'tech@example.com',
    activeSince: 'Feb 1, 2025',
    status: 'active',
    leadsCount: 30000,
    pixelInstalled: true,
    monthlyValue: 30000
  },
  {
    id: '3',
    name: 'Global Marketing Group',
    email: 'global@example.com',
    activeSince: 'Mar 10, 2025',
    status: 'active',
    leadsCount: 25000,
    pixelInstalled: true,
    monthlyValue: 25000
  },
  {
    id: '4',
    name: 'Digital Solutions Pro',
    email: 'digital@example.com',
    activeSince: 'Jan 5, 2025',
    status: 'active',
    leadsCount: 15000,
    pixelInstalled: true,
    monthlyValue: 15000
  },
  {
    id: '5',
    name: 'Marketing Masters',
    email: 'masters@example.com',
    activeSince: 'Feb 20, 2025',
    status: 'active',
    leadsCount: 12000,
    pixelInstalled: true,
    monthlyValue: 12000
  },
  {
    id: '6',
    name: 'Lead Generation Pro',
    email: 'leadgen@example.com',
    activeSince: 'Mar 1, 2025',
    status: 'active',
    leadsCount: 11000,
    pixelInstalled: true,
    monthlyValue: 11000
  },
  {
    id: '7',
    name: 'Sales Accelerator',
    email: 'sales@example.com',
    activeSince: 'Jan 25, 2025',
    status: 'active',
    leadsCount: 10000,
    pixelInstalled: true,
    monthlyValue: 10000
  },
  {
    id: '8',
    name: 'Growth Hackers LLC',
    email: 'growth@example.com',
    activeSince: 'Feb 15, 2025',
    status: 'active',
    leadsCount: 6000,
    pixelInstalled: true,
    monthlyValue: 6000
  },
  {
    id: '9',
    name: 'Revenue Boost Inc',
    email: 'revenue@example.com',
    activeSince: 'Mar 5, 2025',
    status: 'active',
    leadsCount: 5000,
    pixelInstalled: false,
    monthlyValue: 5000
  },
  {
    id: '10',
    name: 'Lead Masters Elite',
    email: 'elite@example.com',
    activeSince: 'Jan 30, 2025',
    status: 'active',
    leadsCount: 5000,
    pixelInstalled: false,
    monthlyValue: 5000
  }
];

const AdminDashboardPage: React.FC = () => {
  const { leads, stats, updateLeadStatus } = useLeads();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculate admin metrics
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.status === 'active').length;
  const monthlyRecurringRevenue = mockCustomers.reduce((sum, customer) => sum + customer.monthlyValue, 0);
  const leadsResolvedToday = 2500; // Example daily leads resolved
  
  // Filter customers by search term
  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Business Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <MetricsCard 
            title="Monthly Recurring Revenue"
            value={`$${monthlyRecurringRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6 text-emerald-400" />}
            change={25}
            changeLabel="from last month"
            iconBgColor="bg-emerald-500/20"
          />
          
          <MetricsCard 
            title="Total Customers"
            value={totalCustomers}
            icon={<Building className="h-6 w-6 text-purple-400" />}
            change={16.7}
            changeLabel="from last month"
            iconBgColor="bg-purple-500/20"
          />
          
          <MetricsCard 
            title="Leads Resolved Today"
            value={leadsResolvedToday}
            icon={<Activity className="h-6 w-6 text-blue-400" />}
            change={33.3}
            changeLabel="vs yesterday"
            iconBgColor="bg-blue-500/20"
          />
          
          <MetricsCard 
            title="Active Customers"
            value={activeCustomers}
            icon={<Users className="h-6 w-6 text-amber-400" />}
            change={12.3}
            changeLabel="from last month"
            iconBgColor="bg-amber-500/20"
          />
        </div>
        
        {/* Customer Management Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Customer Accounts</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900 text-gray-200 text-sm rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div 
                key={customer.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-blue-500/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-white">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{customer.name}</h4>
                      <p className="text-sm text-gray-400">{customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">${customer.monthlyValue.toLocaleString()}/mo</p>
                      <p className="text-xs text-gray-400">{customer.leadsCount.toLocaleString()} leads</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {customer.pixelInstalled ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Setup Needed
                        </span>
                      )}
                      
                      <button 
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Leads Overview */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Leads</h2>
          <span className="text-xs bg-blue-900/30 text-blue-400 rounded-full px-3 py-1 border border-blue-500/30">
            Live Updates
          </span>
        </div>
        <LeadsTable 
          leads={leads} 
          onUpdateStatus={updateLeadStatus}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;