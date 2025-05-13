import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Calculator, DollarSign, Percent, Users, TrendingUp } from 'lucide-react';

const RoiCalculatorPage: React.FC = () => {
  const [pageViews, setPageViews] = useState(10000);
  const [resolveRate, setResolveRate] = useState(20);
  const [conversionRate, setConversionRate] = useState(10);
  const [ticketPrice, setTicketPrice] = useState(1000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);

  useEffect(() => {
    const resolvedLeads = (pageViews * (resolveRate / 100));
    const conversions = resolvedLeads * (conversionRate / 100);
    const monthly = conversions * ticketPrice;
    setMonthlyRevenue(monthly);
    setYearlyRevenue(monthly * 12);
  }, [pageViews, resolveRate, conversionRate, ticketPrice]);

  return (
    <DashboardLayout title="ROI Calculator">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Estimate Your ROI</h2>
              <p className="text-gray-400">Calculate your potential earnings based on website traffic and conversion rates.</p>
            </div>
          </div>

          {/* Calculator Inputs */}
          <div className="space-y-6">
            {/* Page Views Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monthly Page Views
              </label>
              <input
                type="range"
                min="1000"
                max="500000"
                step="1000"
                value={pageViews}
                onChange={(e) => setPageViews(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="mt-2 text-lg font-semibold text-white">
                {pageViews.toLocaleString()} views
              </div>
            </div>

            {/* Resolve Rate Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resolve Rate
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[20, 30, 40].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setResolveRate(rate)}
                    className={`p-4 rounded-lg border ${
                      resolveRate === rate
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-lg font-semibold">{rate}%</div>
                    <div className="text-sm">Resolution</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversion Rate Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Conversion Rate
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Enter conversion rate"
                />
              </div>
            </div>

            {/* Ticket Price Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Average Ticket Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  min="0"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Enter ticket price"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Revenue */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Monthly Revenue</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              ${monthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>

          {/* Yearly Revenue */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Yearly Revenue</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              ${yearlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>

          {/* Expected Leads */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Monthly Leads</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.round(pageViews * (resolveRate / 100)).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoiCalculatorPage;