import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  iconBgColor?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  iconBgColor = 'bg-blue-500/20'
}) => {
  const isPositive = change !== undefined ? change >= 0 : undefined;
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          {icon}
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center text-xs font-medium ${
            isPositive ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            <span>{Math.abs(change)}% {changeLabel}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

export default MetricsCard;