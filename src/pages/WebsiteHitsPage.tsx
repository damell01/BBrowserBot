import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Search, RefreshCw, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface PixelHit {
  id: string;
  page: string;
  ip: string;
  user_agent: string;
  timestamp: string;
  customer_id: string;
}

interface Customer {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  lead_count: string;
  lead_limit: string;
}

const WebsiteHitsPage: React.FC = () => {
  const [hits, setHits] = useState<PixelHit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { user } = useAuth();

  const fetchCustomers = async () => {
    if (user?.role !== 'admin') return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_customers.php`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setCustomers(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to fetch customers');
    }
  };

  const fetchHits = async () => {
    try {
      setRefreshing(true);
      const url = new URL('https://dbellcreations.com/browserbot/api/enrich_queue_test.php');
      
      if (user?.role === 'customer' && user?.customer_id) {
        url.searchParams.append('customer_id', user.customer_id);
      } else if (user?.role === 'admin' && selectedCustomer) {
        url.searchParams.append('customer_id', selectedCustomer);
      }
      
      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.success) {
        setHits(data.data);
      } else {
        throw new Error('Failed to fetch hits');
      }
    } catch (error) {
      toast.error('Failed to fetch website hits');
      console.error('Error fetching hits:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchCustomers();
    }
  }, [user]);

  useEffect(() => {
    fetchHits();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHits, 30000);
    return () => clearInterval(interval);
  }, [selectedCustomer, user]);

  const filteredHits = hits.filter(hit => 
    Object.values(hit).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <DashboardLayout title="Website Hits">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Website Hits</h2>
              <p className="text-gray-400">
                {user?.role === 'admin' 
                  ? 'Monitor all incoming website hits and visitor data'
                  : 'Monitor your website hits and visitor data'}
              </p>
            </div>
            <button
              onClick={fetchHits}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {user?.role === 'admin' && (
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
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search hits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Hits Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-400">Loading hits...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">IP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Timestamp</th>
                    {user?.role === 'admin' && !selectedCustomer && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Customer</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredHits.length > 0 ? (
                    filteredHits.map((hit) => (
                      <tr key={hit.id} className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {hit.page}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {hit.ip}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {hit.user_agent}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(hit.timestamp).toLocaleString()}
                        </td>
                        {user?.role === 'admin' && !selectedCustomer && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {customers.find(c => c.customer_id === hit.customer_id)?.name || hit.customer_id}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td 
                        colSpan={user?.role === 'admin' && !selectedCustomer ? 5 : 4} 
                        className="px-6 py-4 text-center text-gray-400"
                      >
                        No hits found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteHitsPage;