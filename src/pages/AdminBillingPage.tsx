import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CreditCard, Users, DollarSign, TrendingUp, ExternalLink } from 'lucide-react';

const AdminBillingPage: React.FC = () => {
  const billingStats = {
    totalRevenue: 401850,
    activeSubscriptions: 28,
    averageRevenue: 14350,
    monthlyGrowth: 25.4
  };

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