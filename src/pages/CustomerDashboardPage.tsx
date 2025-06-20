import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import LeadsTable from '../components/dashboard/LeadsTable';
import { useLeads } from '../context/LeadsContext';
import { useAuth } from '../context/AuthContext';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface WeeklyLead {
  week_start: string;
  week_number: number;
  lead_count: number;
}

const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { leads, stats, updateLeadStatus } = useLeads();
  const [weeklyLeads, setWeeklyLeads] = useState<WeeklyLead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const customerLeads = leads;

  useEffect(() => {
    fetchWeeklyLeads();
  }, [user]);

  const fetchWeeklyLeads = async () => {
    if (!user?.customer_id) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/weekly_leadcount.php?customer_id=${user.customer_id}`, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success && data.weekly_leads) {
        setWeeklyLeads(data.weekly_leads);
      }
    } catch (error) {
      console.error('Failed to fetch weekly leads:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const dashboardStats = {
    total: stats.total,
    new: stats.new,
    trafficResolved: Math.round((stats.contacted + stats.qualified + stats.converted) / stats.total * 100) || 0,
    pipelineValue: stats.total * 1000,
    weeklyLeads: weeklyLeads[0]?.lead_count || 0
  };

  const handleExportCSV = () => {
    const url = new URL(`${import.meta.env.VITE_API_URL}/get_leads.php`);
    url.searchParams.append('format', 'csv');
    url.searchParams.append('dedupe', 'true');
    
    window.location.href = url.toString();
    toast.success('Exporting leads...');
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateLeadStatus(id, status);
      toast.success('Lead status updated successfully');
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Overview</h2>
          <button
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Leads
          </button>
        </div>
        <StatsOverview stats={dashboardStats} />
      </div>

      {/* Weekly Performance Card */}
      {!loading && weeklyLeads.length > 0 && (
        <div className="mb-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm text-gray-400 mb-2">This Week's Leads</h4>
              <p className="text-2xl font-bold text-white">{weeklyLeads[0]?.lead_count || 0}</p>
              {weeklyLeads.length > 1 && (
                <div className="mt-2 flex items-center text-sm">
                  {weeklyLeads[0].lead_count > weeklyLeads[1].lead_count ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                      <span className="text-emerald-400">
                        {Math.round(((weeklyLeads[0].lead_count - weeklyLeads[1].lead_count) / weeklyLeads[1].lead_count) * 100)}% from last week
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-rose-400 mr-1" />
                      <span className="text-rose-400">
                        {Math.round(((weeklyLeads[1].lead_count - weeklyLeads[0].lead_count) / weeklyLeads[1].lead_count) * 100)}% from last week
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {weeklyLeads.slice(0, 3).map((week, index) => (
              <div key={week.week_number} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm text-gray-400 mb-2">
                  {index === 0 ? "This Week" : 
                   index === 1 ? "Last Week" : 
                   "Two Weeks Ago"}
                </h4>
                <p className="text-2xl font-bold text-white">{week.lead_count}</p>
                <p className="mt-2 text-sm text-gray-400">
                  Week of {new Date(week.week_start).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Leads</h2>
          <span className="text-xs bg-blue-900/30 text-blue-400 rounded-full px-3 py-1 border border-blue-500/30">
            Updates every minute
          </span>
        </div>
        <LeadsTable 
          leads={customerLeads} 
          onUpdateStatus={handleStatusUpdate}
        />
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboardPage;