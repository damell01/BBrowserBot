import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Download, 
  Search, 
  DollarSign, 
  Users, 
  Activity, 
  Building, 
  TrendingUp, 
  TrendingDown,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCustomers, exportCustomerLeads } from '../lib/api';
import { useAuth } from '../context/AuthContext';

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

interface WeeklyLead {
  customer_id: string;
  week_start: string;
  week_number: number;
  lead_count: number;
}

interface EnrichmentStats {
  global: {
    enriched: number;
    failed: number;
    queued: number;
    attempted: number;
    percent: number;
  };
  filtered: {
    customer_id: string;
    enriched: number;
    failed: number;
    queued: number;
    attempted: number;
    percent: number;
  };
  customers: Array<{
    id: string;
    name: string;
  }>;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [weeklyLeads, setWeeklyLeads] = useState<WeeklyLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrichmentStats, setEnrichmentStats] = useState<EnrichmentStats | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [refreshingStats, setRefreshingStats] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchWeeklyLeads();
    fetchEnrichmentStats();
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

  const fetchWeeklyLeads = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/weekly_leadcount.php`, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success && data.all_weekly_leads) {
        setWeeklyLeads(data.all_weekly_leads);
      }
    } catch (error) {
      console.error('Failed to fetch weekly leads:', error);
      toast.error('Failed to fetch weekly leads');
    }
  };

  const fetchEnrichmentStats = async () => {
    try {
      setRefreshingStats(true);
      const url = new URL(`${import.meta.env.VITE_API_URL}/enrich_stats.php`);
      if (selectedCustomerId) {
        url.searchParams.append('customer_id', selectedCustomerId);
      }
      
      const response = await fetch(url.toString(), {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setEnrichmentStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch enrichment stats:', error);
      toast.error('Failed to fetch enrichment stats');
    } finally {
      setRefreshingStats(false);
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

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => parseInt(c.lead_count) > 0).length;
  const monthlyRevenue = customers.reduce((sum, customer) => sum + parseInt(customer.monthly_value || '0'), 0);
  const totalLeads = customers.reduce((sum, customer) => sum + parseInt(customer.lead_count), 0);

  const getCustomerWeeklyTrend = (customerId: string) => {
    const customerWeeks = weeklyLeads
      .filter(lead => lead.customer_id === customerId)
      .sort((a, b) => new Date(b.week_start).getTime() - new Date(a.week_start).getTime());

    if (customerWeeks.length < 2) return null;

    const currentWeek = customerWeeks[0].lead_count;
    const previousWeek = customerWeeks[1].lead_count;
    
    if (previousWeek === 0) return null;
    
    const percentageChange = ((currentWeek - previousWeek) / previousWeek) * 100;
    return {
      value: Math.abs(Math.round(percentageChange)),
      direction: percentageChange >= 0 ? 'up' : 'down',
      currentCount: currentWeek
    };
  };

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

      {/* Enrichment Stats Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Enrichment Statistics</h2>
            <p className="text-gray-400">Track lead enrichment performance across all customers</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                fetchEnrichmentStats();
              }}
              className="px-4 py-2 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Customers</option>
              {enrichmentStats?.customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <button
              onClick={fetchEnrichmentStats}
              disabled={refreshingStats}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshingStats ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {enrichmentStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm text-gray-400 mb-2">Enriched Leads</h4>
              <p className="text-2xl font-bold text-white">
                {(selectedCustomerId ? enrichmentStats.filtered.enriched : enrichmentStats.global.enriched).toLocaleString()}
              </p>
              <div className="mt-2 text-sm text-emerald-400">
                {(selectedCustomerId ? enrichmentStats.filtered.percent : enrichmentStats.global.percent)}% success rate
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm text-gray-400 mb-2">Failed Enrichments</h4>
              <p className="text-2xl font-bold text-white">
                {(selectedCustomerId ? enrichmentStats.filtered.failed : enrichmentStats.global.failed).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm text-gray-400 mb-2">Queued Leads</h4>
              <p className="text-2xl font-bold text-white">
                {(selectedCustomerId ? enrichmentStats.filtered.queued : enrichmentStats.global.queued).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm text-gray-400 mb-2">Total Attempted</h4>
              <p className="text-2xl font-bold text-white">
                {(selectedCustomerId ? enrichmentStats.filtered.attempted : enrichmentStats.global.attempted).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}
      </div>

      {/* Customer Management Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Customer Management</h2>
            <p className="text-gray-400">Manage system users and their roles</p>
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
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading customers...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map((customer) => {
              const weeklyTrend = getCustomerWeeklyTrend(customer.customer_id);
              
              return (
                <div 
                  key={customer.id} 
                  className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all duration-200"
                >
                  <div>
                    <h4 className="font-medium text-white">{customer.name}</h4>
                    <p className="text-sm text-gray-400">{customer.email}</p>
                    <div className="mt-2 flex items-center gap-6">
                      <span className="text-xs text-gray-500">
                        Total Leads: {customer.lead_count} / {customer.lead_limit}
                      </span>
                      <span className="text-xs text-gray-500">
                        Monthly Value: ${parseInt(customer.monthly_value || '0').toLocaleString()}
                      </span>
                      {weeklyTrend && (
                        <span className="flex items-center text-xs">
                          <span className="text-gray-500 mr-2">This Week: {weeklyTrend.currentCount}</span>
                          {weeklyTrend.direction === 'up' ? (
                            <span className="flex items-center text-emerald-400">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {weeklyTrend.value}%
                            </span>
                          ) : (
                            <span className="flex items-center text-rose-400">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              {weeklyTrend.value}%
                            </span>
                          )}
                        </span>
                      )}
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
              );
            })}

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