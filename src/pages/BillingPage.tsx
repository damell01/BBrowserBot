import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CreditCard, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { redirectToCustomerPortal } from '../lib/api';
import toast from 'react-hot-toast';

const BillingPage: React.FC = () => {
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
        {/* Usage Overview */}
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