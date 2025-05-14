import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import LeadsTable from '../components/dashboard/LeadsTable';
import { useLeads } from '../context/LeadsContext';
import { useAuth } from '../context/AuthContext';
import { Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTrafficStats } from '../lib/api';

interface TrafficData {
  page: string;
  hits: number;
}

const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { leads, stats, updateLeadStatus } = useLeads();
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  
  const customerLeads = leads;

  useEffect(() => {
    fetchTrafficData();
  }, []);

  const fetchTrafficData = async () => {
    try {
      const response = await getTrafficStats();
      if (response.success && response.pages) {
        setTrafficData(response.pages);
        // Calculate total hits
        const total = response.pages.reduce((sum, page) => sum + page.hits, 0);
        setTotalHits(total);
      }
    } catch (error) {
      console.error('Failed to fetch traffic data:', error);
    }
  };
  
  const dashboardStats = {
    total: stats.total,
    new: stats.new,
    trafficResolved: Math.round((stats.total / totalHits) * 100) || 0,
    pipelineValue: stats.total * 1000,
    websiteHits: totalHits
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Created At'];
    const csvData = customerLeads.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.source,
      lead.status,
      new Date(lead.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `browser-bot-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Leads exported successfully!');
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

      {/* Traffic Stats */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Website Traffic</h2>
          <span className="text-xs bg-blue-900/30 text-blue-400 rounded-full px-3 py-1 border border-blue-500/30">
            Last 30 days
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trafficData.slice(0, 3).map((page, index) => (
            <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-white truncate flex-1">
                  {page.page || 'Homepage'}
                </h3>
              </div>
              <p className="text-2xl font-bold text-white">{page.hits.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-1">Total visits</p>
            </div>
          ))}
        </div>
      </div>
      
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