import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  // Mock data for analytics
  const metrics = {
    totalRevenue: 401850,
    revenueGrowth: 25,
    totalCustomers: 28,
    customerGrowth: 16.7,
    totalLeads: 15000,
    leadGrowth: 33.3,
    activeCustomers: 28,
    activeGrowth: 12.3
  };

  return (
    <DashboardLayout title="Analytics">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Business Analytics</h2>
              <p className="text-gray-400 mt-1">Track and analyze business performance metrics</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-emerald-500/20">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="flex items-center text-emerald-400 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>{metrics.revenueGrowth}%</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Monthly Revenue</h3>
            <p className="text-2xl font-bold text-white">${metrics.totalRevenue.toLocaleString()}</p>
          </div>

          {/* Customers Card */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex items-center text-blue-400 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>{metrics.customerGrowth}%</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Customers</h3>
            <p className="text-2xl font-bold text-white">{metrics.totalCustomers}</p>
          </div>

          {/* Leads Card */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex items-center text-purple-400 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>{metrics.leadGrowth}%</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Leads</h3>
            <p className="text-2xl font-bold text-white">{metrics.totalLeads.toLocaleString()}</p>
          </div>

          {/* Active Customers Card */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-amber-500/20">
                <Users className="h-6 w-6 text-amber-400" />
              </div>
              <div className="flex items-center text-amber-400 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>{metrics.activeGrowth}%</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Active Customers</h3>
            <p className="text-2xl font-bold text-white">{metrics.activeCustomers}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Revenue Growth</h3>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400">Revenue chart will be implemented here</p>
            </div>
          </div>

          {/* Customer Growth Chart */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Customer Growth</h3>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400">Customer growth chart will be implemented here</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;