import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LeadsTable from '../components/dashboard/LeadsTable';
import { Search, Users } from 'lucide-react';
import { useLeads } from '../context/LeadsContext';
import { toast } from 'react-hot-toast';

interface Customer {
  id: string;
  customer_id: string;
  name: string;
  email: string;
}

const AdminLeadsPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { leads, updateLeadStatus } = useLeads();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_customers.php`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setCustomers(data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCustomer) {
      return matchesSearch && lead.userId === selectedCustomer;
    }
    
    return matchesSearch;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateLeadStatus(id, status);
      toast.success('Lead status updated successfully');
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  return (
    <DashboardLayout title="Leads Management">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">All Leads</h2>
              <p className="text-gray-400">Manage and monitor leads across all customers</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Customers</option>
                {customers.map((customer) => (
                  <option key={customer.customer_id} value={customer.customer_id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading leads...</p>
          </div>
        ) : (
          <LeadsTable 
            leads={filteredLeads} 
            onUpdateStatus={handleStatusUpdate}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminLeadsPage;