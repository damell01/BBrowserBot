import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CreditCard, Users, DollarSign, TrendingUp, ExternalLink, Search, TrendingDown } from 'lucide-react';

interface WeeklyLead {
  customer_id: string;
  week_start: string;
  week_number: number;
  lead_count: number;
}

interface Customer {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  lead_count: string;
}

const AdminBillingPage: React.FC = () => {
  const [weeklyLeads, setWeeklyLeads] = useState<WeeklyLead[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const billingStats = {
    totalRevenue: 401850,
    activeSubscriptions: 28,
    averageRevenue: 14350,
    monthlyGrowth: 25.4
  };

  useEffect(() => {
    fetchWeeklyLeads();
    fetchCustomers();
  }, []);

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
    }
  };

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
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group leads by customer
  const groupedLeads = weeklyLeads.reduce((acc, lead) => {
    if (!acc[lead.customer_id]) {
      acc[lead.customer_id] = [];
    }
    acc[lead.customer_id].push(lead);
    return acc;
  }, {} as Record<string, WeeklyLead[]>);

  // Calculate week-over-week change for a customer
  const calculateWeeklyChange = (customerLeads: WeeklyLead[]) => {
    if (customerLeads.length < 2) return null;
    
    const sortedLeads = [...customerLeads].sort((a, b) => 
      new Date(b.week_start).getTime() - new Date(a.week_start).getTime()
    );
    
    const currentWeek = sortedLeads[0].lead_count;
    const previousWeek = sortedLeads[1].lead_count;
    
    if (previousWeek === 0) return null;
    
    const percentageChange = ((currentWeek - previousWeek) / previousWeek) * 100;
    return {
      value: Math.abs(Math.round(percentageChange)),
      direction: percentageChange >= 0 ? 'up' : 'down',
      currentCount: currentWeek
    };
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Billing Management">
      <div className="max-w-7xl mx-auto">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-emerald-500/20">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full">
                +{billingStats.monthlyGrowth}% from last month
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Monthly Revenue</h3>
            <p className="text-2xl font-bold text-white">${billingStats.totalRevenue.toLocaleString()}</p>
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
            <h3 className="text-gray-400 text-sm mb-1">Active Subscriptions</h3>
            <p className="text-2xl font-bold text-white">{billingStats.activeSubscriptions}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <CreditCard className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-xs font-medium text-purple-400 bg-purple-500/20 px-2.5 py-1 rounded-full">
                +12.3% from last month
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Average Revenue</h3>
            <p className="text-2xl font-bold text-white">${billingStats.averageRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-amber-500/20">
                <TrendingUp className="h-6 w-6 text-amber-400" />
              </div>
              <span className="text-xs font-medium text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-full">
                +33.3% vs yesterday
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Revenue Growth</h3>
            <p className="text-2xl font-bold text-white">{billingStats.monthlyGrowth}%</p>
          </div>
        </div>

        {/* Weekly Leads Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Weekly Lead Performance</h2>
              <p className="text-gray-400">Track weekly lead generation across all customers</p>
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
              <p className="mt-2 text-gray-400">Loading data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Current Week</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Previous Week</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredCustomers.map((customer) => {
                    const customerLeads = groupedLeads[customer.customer_id] || [];
                    const weeklyChange = calculateWeeklyChange(customerLeads);
                    const sortedLeads = [...customerLeads].sort((a, b) => 
                      new Date(b.week_start).getTime() - new Date(a.week_start).getTime()
                    );

                    return (
                      <tr key={customer.id} className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {sortedLeads[0]?.lead_count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {sortedLeads[1]?.lead_count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {weeklyChange && (
                            <div className="flex items-center text-sm">
                              {weeklyChange.direction === 'up' ? (
                                <>
                                  <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                                  <span className="text-emerald-400">+{weeklyChange.value}%</span>
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="w-4 h-4 text-rose-400 mr-1" />
                                  <span className="text-rose-400">-{weeklyChange.value}%</span>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stripe Portal Link */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Stripe Dashboard</h2>
              <p className="text-gray-400">
                Manage subscriptions, view detailed analytics, and handle customer billing through the Stripe dashboard.
              </p>
            </div>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Stripe Dashboard
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminBillingPage;