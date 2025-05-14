import React from 'react';
import { Users, BarChart, TrendingUp, DollarSign } from 'lucide-react';
import MetricsCard from './MetricsCard';

interface StatsOverviewProps {
  stats: {
    total: number;
    new: number;
    trafficResolved: number;
    pipelineValue: number;
  };
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <MetricsCard 
        title="Total Leads Resolved"
        value={stats.total}
        icon={<Users className="h-6 w-6 text-blue-400" />}
        change={7.2}
        changeLabel="from last month"
        iconBgColor="bg-blue-500/20"
      />
      
      <MetricsCard 
        title="New Leads"
        value={stats.new}
        icon={<BarChart className="h-6 w-6 text-indigo-400" />}
        change={12.5}
        changeLabel="from last month"
        iconBgColor="bg-indigo-500/20"
      />
      
      <MetricsCard 
        title="Traffic Resolved"
        value={`${stats.trafficResolved}%`}
        icon={<TrendingUp className="h-6 w-6 text-emerald-400" />}
        change={4.3}
        changeLabel="from last month"
        iconBgColor="bg-emerald-500/20"
      />
      
      <MetricsCard 
        title="Pipeline Value"
        value={`$${(stats.total * 1000).toLocaleString()}`}
        icon={<DollarSign className="h-6 w-6 text-amber-400" />}
        change={8.4}
        changeLabel="from last month"
        iconBgColor="bg-amber-500/20"
      />
    </div>
  );
};

export default StatsOverview;