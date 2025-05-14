import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { getCustomers, grantAdminAccess, revokeAdminAccess } from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import CustomerLeadsModal from '../components/modals/CustomerLeadsModal';
import { Settings } from 'lucide-react';

interface Customer {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  role: string;
  lead_count: string;
  lead_limit: string;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showLeadsModal, setShowLeadsModal] = useState(false);

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
  
  const handleGrantAdmin = async (userId: string) => {
    try {
      await grantAdminAccess(userId);
      toast.success('Admin access granted successfully');
      fetchCustomers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to grant admin access');
    }
  };

  const handleRevokeAdmin = async (userId: string) => {
    try {
      await revokeAdminAccess(userId);
      toast.success('Admin access revoked successfully');
      fetchCustomers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to revoke admin access');
    }
  };

  const handleViewLeads = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowLeadsModal(true);
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
                    customer.role === 'admin' 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {customer.role}
                  </span>
                  
                  <button
                    onClick={() => handleViewLeads(customer)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => customer.role === 'admin' 
                      ? handleRevokeAdmin(customer.id)
                      : handleGrantAdmin(customer.id)
                    }
                    className="text-sm font-medium px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  >
                    {customer.role === 'admin' ? 'Revoke Admin' : 'Grant Admin'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCustomer && (
        <CustomerLeadsModal
          isOpen={showLeadsModal}
          onClose={() => setShowLeadsModal(false)}
          customer={selectedCustomer}
          leads={[]} // We'll need to fetch leads for the selected customer
          onUpdateStatus={async () => {}} // We'll need to implement this
        />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboardPage;