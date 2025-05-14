import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import LeadsTable from '../components/dashboard/LeadsTable';
import { useLeads } from '../context/LeadsContext';
import { getCustomers } from '../lib/api';
import { 
  BarChart3, 
  ArrowRight, 
  Users,
  Building,
  Activity,
  DollarSign,
  Search,
  Settings,
  Loader2
} from 'lucide-react';

interface Customer {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  lead_count: string;
  lead_limit: string;
}

const AdminDashboardPage: React.FC = () => {
  const { leads, stats, updateLeadStatus } = useLeads();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getCustomers();
      console.log('Customer response:', response);
      if (response.success && response.data) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate admin metrics from real data
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => parseInt(c.lead_count) > 0).length;
  const totalLeads = customers.reduce((sum, customer) => sum + parseInt(customer.lead_count), 0);
  const leadsResolvedToday = leads.filter(lead => 
    new Date(lead.createdAt).toDateString() === new Date().toDateString()
  ).length;
  
  // Filter customers by search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Business Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Total Leads</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              {totalLeads.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Building className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Total Customers</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              {totalCustomers}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Today's Leads</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              {leadsResolvedToday}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Users className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Active Customers</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              {activeCustomers}
            </div>
          </div>
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

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
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
                        <p className="text-sm font-medium text-white">
                          {parseInt(customer.lead_count).toLocaleString()} / {parseInt(customer.lead_limit).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">leads used</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {parseInt(customer.lead_count) > 0 ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Inactive
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
          )}
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