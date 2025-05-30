import React from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface WeeklyLead {
  week_start: string;
  week_number: number;
  lead_count: number;
}

interface CustomerWeeklyLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: {
    name: string;
    email: string;
  };
  weeklyLeads: WeeklyLead[];
}

const CustomerWeeklyLeadsModal: React.FC<CustomerWeeklyLeadsModalProps> = ({
  isOpen,
  onClose,
  customer,
  weeklyLeads
}) => {
  if (!isOpen) return null;

  // Calculate week-over-week change
  const calculateWeeklyChange = (currentWeek: number, previousWeek: number) => {
    if (previousWeek === 0) return null;
    const percentageChange = ((currentWeek - previousWeek) / previousWeek) * 100;
    return {
      value: Math.abs(Math.round(percentageChange)),
      direction: percentageChange >= 0 ? 'up' : 'down'
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">
                Weekly Leads for {customer.name}
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {customer.email}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {weeklyLeads.map((week, index) => {
              const previousWeek = weeklyLeads[index + 1];
              const change = previousWeek 
                ? calculateWeeklyChange(week.lead_count, previousWeek.lead_count)
                : null;

              return (
                <div 
                  key={week.week_number}
                  className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700"
                >
                  <div>
                    <p className="text-sm text-gray-400">
                      Week of {new Date(week.week_start).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-lg font-medium text-white">
                      {week.lead_count} leads
                    </p>
                  </div>

                  {change && (
                    <div className={`flex items-center text-sm ${
                      change.direction === 'up' 
                        ? 'text-emerald-400' 
                        : 'text-rose-400'
                    }`}>
                      {change.direction === 'up' ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      <span>{change.value}% from previous week</span>
                    </div>
                  )}
                </div>
              );
            })}

            {weeklyLeads.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No leads data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerWeeklyLeadsModal;