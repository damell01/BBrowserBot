import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import LeadsTable from '../components/dashboard/LeadsTable';
import { useLeads } from '../context/LeadsContext';
import { useAuth } from '../context/AuthContext';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { leads, stats, updateLeadStatus } = useLeads();
  
  const customerLeads = leads;
  
  const dashboardStats = {
    total: stats.total,
    new: stats.new,
    trafficResolved: 68,
    pipelineValue: stats.total * 1000
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