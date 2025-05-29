import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CreditCard, AlertCircle, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { redirectToCustomerPortal } from '../lib/api';
import { useLeads } from '../context/LeadsContext';
import toast from 'react-hot-toast';

const BillingPage: React.FC = () => {
  const { leads } = useLeads();

  // Calculate weekly leads by day
  const getWeeklyLeadsByDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    
    const weeklyLeads = days.map(day => ({
      day,
      count: leads.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        return leadDate >= startOfWeek && 
               leadDate.getDay() === days.indexOf(day);
      }).length
    }));

    // Rotate array so it starts with Monday
    return [...weeklyLeads.slice(1), weeklyLeads[0]];
  };

  const weeklyLeads = getWeeklyLeadsByDay();
  const totalWeeklyLeads = weeklyLeads.reduce((sum, day) => sum + day.count, 0);

  const handleUpgrade = async () => {
    try {
      const { url } = await redirectToCustomerPortal();
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to open billing portal');
    }
  };

  return (
    <DashboardLayout title="Billing & Usage">
      <div className="max-w-4xl mx-auto">
        {/* Weekly Lead Counter */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Weekly Lead Activity</h2>
              <p className="text-gray-400">Your lead generation performance this week</p>
            </div>
            <div className="px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <div className="text-sm text-gray-400">Total Weekly Leads</div>
              <div className="text-2xl font-bold text-white">{totalWeeklyLeads}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase">Day</th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase">Leads</th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {weeklyLeads.map((day, index) => (
                  <tr key={day.day} className="hover:bg-gray-750">
                    <td className="py-3 text-sm text-white">{day.day}</td>
                    <td className="py-3 text-sm text-gray-300">{day.count}</td>
                    <td className="py-3">
                      {index > 0 && (
                        <span className={`inline-flex items-center text-xs ${
                          day.count >= weeklyLeads[index - 1].count
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}>
                          <TrendingUp className={`h-4 w-4 mr-1 ${
                            day.count < weeklyLeads[index - 1].count && 'transform rotate-180'
                          }`} />
                          {Math.abs(day.count - weeklyLeads[index - 1].count)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription Management */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Subscription Management</h2>
              <p className="text-gray-400">Manage your subscription and billing information</p>
            </div>
            <button
              onClick={handleUpgrade}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Subscription
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="font-medium text-white">Total Leads</h4>
              </div>
              <p className="text-2xl font-bold text-white">{leads.length.toLocaleString()}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-400">New this week:</span>
                <span className="text-sm font-medium text-emerald-400">{totalWeeklyLeads.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="font-medium text-white">Conversion Rate</h4>
              </div>
              <p className="text-2xl font-bold text-white">
                {leads.length > 0 
                  ? ((leads.filter(lead => lead.status === 'converted').length / leads.length) * 100).toFixed(1)
                  : '0.0'}%
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-400">Converted leads:</span>
                <span className="text-sm font-medium text-emerald-400">
                  {leads.filter(lead => lead.status === 'converted').length.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Billing Portal</h4>
                <p className="text-sm text-gray-400">Click the button above to manage your subscription, view billing history, and update payment methods.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Included Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Unlimited website tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Real-time lead identification</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>CRM integrations</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Email & phone support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>API access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;