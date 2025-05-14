import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { grantAdminAccess, revokeAdminAccess } from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const handleGrantAdmin = async (userId: string) => {
    try {
      await grantAdminAccess(userId);
      toast.success('Admin access granted successfully');
    } catch (error) {
      toast.error('Failed to grant admin access');
    }
  };

  const handleRevokeAdmin = async (userId: string) => {
    try {
      await revokeAdminAccess(userId);
      toast.success('Admin access revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke admin access');
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Add User Management Section */}
      <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">User Management</h3>
        <div className="space-y-4">
          {mockCustomers.map((customer) => (
            <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div>
                <h4 className="font-medium text-white">{customer.name}</h4>
                <p className="text-sm text-gray-400">{customer.email}</p>
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
                  onClick={() => (customer.role === 'admin' 
                    ? handleRevokeAdmin(customer.id)
                    : handleGrantAdmin(customer.id))}
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                >
                  {customer.role === 'admin' ? 'Revoke Admin' : 'Grant Admin'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;