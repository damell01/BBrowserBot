import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { getCustomers, exportCustomerLeads } from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Download, Search, DollarSign, Users, Activity, Building } from 'lucide-react';

interface Customer {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  role: string;
  lead_count: string;
  lead_limit: string;
  last_active: string;
  monthly_value: string;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getCustomers();
      if (response.success && response.user?.data) {
        setCustomers(response.user.data);
      }
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleExportLeads = async (customerId: string) => {
    try {
      await exportCustomerLeads(customerId);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dashboard metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => parseInt(c.lead_count) > 0).length;
  const monthlyRevenue = customers.reduce((sum, customer) => sum + parseInt(customer.monthly_value || '0'), 0);
  const totalLeads = customers.reduce((sum, customer) => sum + parseInt(customer.lead_count), 0);

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-emerald-500/20">
              <DollarSign className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full">
              +25% from last month
            </span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-white">${monthlyRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-400 bg-blue-500/20 px-2.5 py-1 rounded-full">
              +16.7% from last month
            </span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Customers</h3>
          <p className="text-2xl font-bold text-white">{totalCustomers}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Activity className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-purple-400 bg-purple-500/20 px-2.5 py-1 rounded-full">
              +33.3% vs yesterday
            </span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Leads</h3>
          <p className="text-2xl font-bold text-white">{totalLeads.toLocaleString()}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-amber-500/20">
              <Building className="h-6 w-6 text-amber-400" />
            </div>
            <span className="text-xs font-medium text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-full">
              +12.3% from last month
            </span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Active Customers</h3>
          <p className="text-2xl font-bold text-white">{activeCustomers}</p>
        </div>
      </div>

      {/* Customer Management Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Customer Management</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-900 text-gray-200 text-sm rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading customers...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div 
                key={customer.id} 
                className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all duration-200"
              >
                <div>
                  <h4 className="font-medium text-white">{customer.name}</h4>
                  <p className="text-sm text-gray-400">{customer.email}</p>
                  <div className="mt-1 flex items-center gap-4">
                    <span className="text-xs text-gray-500">
                      Leads: {customer.lead_count} / {customer.lead_limit}
                    </span>
                    <span className="text-xs text-gray-500">
                      Monthly Value: ${parseInt(customer.monthly_value || '0').toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    parseInt(customer.lead_count) > 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {parseInt(customer.lead_count) > 0 ? 'Active' : 'Inactive'}
                  </span>

                  <button
                    onClick={() => handleExportLeads(customer.customer_id)}
                    className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Export Leads
                  </button>
                </div>
              </div>
            ))}

            {filteredCustomers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No customers found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;