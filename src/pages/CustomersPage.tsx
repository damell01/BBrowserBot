import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getCustomers, exportCustomerLeads } from '../lib/api';
import { Search, Download, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

const CustomersPage: React.FC = () => {
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

  return (
    <DashboardLayout title="Customers">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Customer Management</h2>
                <p className="text-gray-400 mt-1">Manage and monitor all customer accounts</p>
              </div>
            </div>
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
        </div>

        {/* Customer List */}
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
                className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-500/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white">{customer.name}</h3>
                    <p className="text-gray-400">{customer.email}</p>
                    <div className="mt-2 grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-sm text-gray-500">Leads</p>
                        <p className="text-lg font-medium text-white">{customer.lead_count} / {customer.lead_limit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly Value</p>
                        <p className="text-lg font-medium text-white">${parseInt(customer.monthly_value || '0').toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Active</p>
                        <p className="text-lg font-medium text-white">{new Date(customer.last_active).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      parseInt(customer.lead_count) > 0
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {parseInt(customer.lead_count) > 0 ? 'Active' : 'Inactive'}
                    </span>

                    <button
                      onClick={() => handleExportLeads(customer.customer_id)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Leads
                    </button>
                  </div>
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

export default CustomersPage;