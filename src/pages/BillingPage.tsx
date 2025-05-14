import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useLeads } from '../context/LeadsContext';
import { CreditCard, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const BillingPage: React.FC = () => {
  const { leads, leadsQuota, updateLeadsQuota } = useLeads();
  
  const handleUpgrade = async () => {
    toast.success('Your leads quota has been increased!');
    updateLeadsQuota(leadsQuota + 500);
  };

  const usedLeads = leads.length;
  const usagePercentage = (usedLeads / leadsQuota) * 100;
  const isNearLimit = usagePercentage >= 80;
  const currentTierCost = Math.max(500, Math.ceil(usedLeads / 500) * 500);
  const nextTierCost = currentTierCost + 500;

  return (
    <DashboardLayout title="Billing & Usage">
      <div className="max-w-4xl mx-auto">
        {/* Usage Overview */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Leads Usage</h2>
              <p className="text-gray-400">Track your leads usage and billing information</p>
            </div>
            <button
              onClick={handleUpgrade}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upgrade Plan
            </button>
          </div>

          {/* Usage Bar */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                {usedLeads} of {leadsQuota} leads used
              </span>
              <span className="text-gray-400">
                {usagePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isNearLimit ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Alert for near limit */}
          {isNearLimit && (
            <div className="flex items-start gap-3 p-4 bg-amber-900/30 rounded-lg border border-amber-500/30">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-300">Approaching Leads Limit</h4>
                <p className="text-sm text-amber-200/70">
                  You're approaching your leads limit. Upgrade now to ensure uninterrupted service.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Current Plan */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Pay As You Grow</h4>
                <p className="text-sm text-gray-400">$1 per lead (min. 500 leads)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-lg font-semibold text-white">${currentTierCost}</span>
              <span className="text-xs text-gray-400">Current Billing</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>$1 per lead pricing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Minimum 500 leads ($500)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Automatic tier upgrades</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>All features included</span>
            </div>
          </div>
        </div>

        {/* Next Tier */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Next Tier Details</h3>
              <p className="text-gray-400 mb-4">
                When you exceed {currentTierCost} leads, you'll automatically upgrade to the next tier.
              </p>
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Next tier cost</span>
                  <span className="text-white font-medium">${nextTierCost}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Additional leads</span>
                  <span className="text-white font-medium">+500 leads</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Cost per lead</span>
                    <span className="text-white font-medium">$1.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;