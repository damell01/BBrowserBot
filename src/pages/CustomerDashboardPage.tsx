import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import LeadsTable from '../components/dashboard/LeadsTable';
import { useLeads } from '../context/LeadsContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowUpRight, AlertTriangle, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { leads, stats } = useLeads();
  
  // Filter leads for current customer
  const customerLeads = leads.filter(lead => lead.customerId === user?.id);
  
  // Calculate dashboard stats
  const dashboardStats = {
    total: stats.total,
    new: stats.new,
    trafficResolved: 68, // This would be calculated from actual traffic data in a real implementation
    pipelineValue: stats.total * 1000
  };

  const handleExportCSV = () => {
    // Convert leads to CSV format
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Created At'];
    const csvData = customerLeads.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      'resolved',
      lead.status,
      new Date(lead.createdAt).toLocaleDateString()
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create and download the file
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
  
  return (
    <DashboardLayout title="Dashboard">
      {/* Pixel Installation Banner */}
      {user?.role === 'customer' && !user.pixelInstalled && (
        <div className="mb-6 bg-amber-900/30 border border-amber-500/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-400 mr-3" />
            <div>
              <h3 className="font-medium text-amber-300">Tracking Pixel Not Installed</h3>
              <p className="text-amber-200/70 text-sm">Install the tracking pixel to start collecting leads from your website.</p>
            </div>
          </div>
          <Link
            to="/pixel-setup"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-amber-900 bg-amber-400 hover:bg-amber-500"
          >
            Setup Now
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      )}
      
      {/* Stats Cards */}
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
      
      {/* Recent Leads */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Leads</h2>
          <span className="text-xs bg-blue-900/30 text-blue-400 rounded-full px-3 py-1 border border-blue-500/30">
            Updates every minute
          </span>
        </div>
        <LeadsTable 
          leads={customerLeads} 
          onUpdateStatus={() => {}}
        />
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboardPage;