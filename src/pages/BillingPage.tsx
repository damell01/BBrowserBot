import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getBillingTiers, getCurrentUsage, updateSubscription } from '../lib/api';
import { CreditCard, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface BillingTier {
  id: string;
  name: string;
  lead_limit: number;
  price_monthly: number;
}

interface Usage {
  current_leads: number;
  tier_limit: number;
  current_tier: BillingTier;
}

const BillingPage: React.FC = () => {
  const [tiers, setTiers] = useState<BillingTier[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tiersResponse, usageResponse] = await Promise.all([
        getBillingTiers(),
        getCurrentUsage()
      ]);

      if (tiersResponse.success && usageResponse.success) {
        setTiers(tiersResponse.tiers);
        setUsage(usageResponse.usage);
      }
    } catch (error) {
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tierId: string) => {
    try {
      setUpdating(true);
      const response = await updateSubscription(tierId);
      if (response.success) {
        toast.success('Subscription updated successfully');
        await fetchData();
      }
    } catch (error) {
      toast.error('Failed to update subscription');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Billing & Usage">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  const usagePercentage = usage ? (usage.current_leads / usage.tier_limit) * 100 : 0;
  const isNearLimit = usagePercentage >= 80;

  return (
    <DashboardLayout title="Billing & Usage">
      <div className="max-w-5xl mx-auto">
        {/* Usage Overview */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <CreditCard className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Current Usage</h2>
              <p className="text-gray-400">Track your leads usage and billing information</p>
            </div>
          </div>

          {usage && (
            <>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {usage.current_leads} of {usage.tier_limit} leads used
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

              {isNearLimit && (
                <div className="flex items-start gap-3 p-4 bg-amber-900/30 rounded-lg border border-amber-500/30">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-300">Approaching Lead Limit</h4>
                    <p className="text-sm text-amber-200/70">
                      You're at {usagePercentage.toFixed(1)}% of your lead limit. Consider upgrading to ensure uninterrupted service.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const isCurrentTier = usage?.current_tier.id === tier.id;
            
            return (
              <div
                key={tier.id}
                className={`bg-gray-800 rounded-lg border ${
                  isCurrentTier ? 'border-blue-500' : 'border-gray-700'
                } p-6 relative`}
              >
                {isCurrentTier && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-2xl font-bold text-white">${tier.price_monthly}</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-blue-400 mr-2" />
                    Up to {tier.lead_limit.toLocaleString()} leads
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-blue-400 mr-2" />
                    Real-time lead tracking
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-blue-400 mr-2" />
                    CRM integration
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-blue-400 mr-2" />
                    Email & phone support
                  </li>
                </ul>

                <button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={isCurrentTier || updating}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                    isCurrentTier
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } transition-colors`}
                >
                  {isCurrentTier ? (
                    'Current Plan'
                  ) : (
                    <>
                      {updating ? 'Updating...' : 'Upgrade'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;