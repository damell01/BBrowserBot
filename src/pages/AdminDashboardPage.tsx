import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { getCustomers, exportCustomerLeads } from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Download } from 'lucide-react';

interface Customer {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  role: string;
  lead_count: string;
  lead_limit: string;
  last_active: string;
  active: boolean;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Customer Management</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading customers...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div>
                  <h4 className="font-medium text-white">{customer.name}</h4>
                  <p className="text-sm text-gray-400">{customer.email}</p>
                  <div className="mt-1 text-xs text-gray-500">
                    Leads: {customer.lead_count} / {customer.lead_limit}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    customer.active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {customer.active ? 'Active' : 'Inactive'}
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
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;