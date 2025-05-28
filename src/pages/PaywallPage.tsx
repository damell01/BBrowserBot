import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createStripeCheckoutSession } from '../lib/api';
import toast from 'react-hot-toast';

const PaywallPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'price_starter',
      name: 'Starter',
      price: 500,
      features: [
        'Up to 500 leads per month',
        'Basic lead enrichment',
        'Email & phone support',
        'Standard integrations'
      ]
    },
    {
      id: 'price_growth',
      name: 'Growth',
      price: 1000,
      features: [
        'Up to 1,000 leads per month',
        'Advanced lead enrichment',
        'Priority support',
        'Advanced integrations',
        'Custom fields'
      ]
    },
    {
      id: 'price_pro',
      name: 'Professional',
      price: 2500,
      features: [
        'Up to 2,500 leads per month',
        'Premium lead enrichment',
        'Dedicated support',
        'All integrations',
        'API access',
        'Custom reporting'
      ]
    }
  ];

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(priceId);
      const { url } = await createStripeCheckoutSession(priceId);
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to start subscription process');
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="flex items-center justify-center h-16 px-6 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center">
          <Bot className="w-7 h-7 text-blue-500" />
          <span className="ml-2 text-xl font-bold text-white">BrowserBot</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Get started with BrowserBot today and turn your website visitors into qualified leads.
            Select the plan that best fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-500/30 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading === plan.id}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading === plan.id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Subscribe Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaywallPage;