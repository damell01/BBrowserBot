import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Link as LinkIcon, 
  RefreshCw,
  Settings,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CrmProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  connected: boolean;
  lastSync?: string;
}

const CrmIntegrationPage: React.FC = () => {
  const [selectedCrm, setSelectedCrm] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const crmProviders: CrmProvider[] = [
    {
      id: 'gohighlevel',
      name: 'GoHighLevel',
      logo: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Sync leads directly with your GoHighLevel account',
      connected: true,
      lastSync: '2 hours ago'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      logo: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Connect with HubSpot CRM for seamless lead management',
      connected: false
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      logo: 'https://images.pexels.com/photos/11035474/pexels-photo-11035474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Enterprise-grade CRM integration with Salesforce',
      connected: false
    }
  ];

  const handleConnect = async (crmId: string) => {
    setSelectedCrm(crmId);
    setIsConnecting(true);
    
    // Simulate API call to connect CRM
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Successfully connected to ${crmProviders.find(crm => crm.id === crmId)?.name}!`);
    setIsConnecting(false);
  };

  const handleSync = async (crmId: string) => {
    const crmName = crmProviders.find(crm => crm.id === crmId)?.name;
    
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: `Syncing with ${crmName}...`,
        success: `Successfully synced with ${crmName}!`,
        error: `Failed to sync with ${crmName}. Please try again.`
      }
    );
  };

  return (
    <DashboardLayout title="CRM Integration">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Connect Your CRM</h2>
          <p className="text-gray-400">
            Integrate with your preferred CRM to automatically sync leads and maintain a unified workflow.
          </p>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 rounded-full border border-blue-500/30">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Real-time sync</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 rounded-full border border-blue-500/30">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Automatic lead mapping</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 rounded-full border border-blue-500/30">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Bidirectional updates</span>
            </div>
          </div>
        </div>
        
        {/* CRM Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crmProviders.map((crm) => (
            <div 
              key={crm.id}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="h-32 bg-gray-700 relative overflow-hidden">
                <img 
                  src={crm.logo} 
                  alt={crm.name}
                  className="w-full h-full object-cover"
                />
                {crm.connected && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-900/80 rounded-full border border-emerald-500/30 backdrop-blur-sm">
                    <span className="text-xs font-medium text-emerald-400">Connected</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{crm.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{crm.description}</p>
                
                {crm.connected ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Last synced:</span>
                      <span className="text-gray-300">{crm.lastSync}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSync(crm.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium text-white transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Sync Now
                      </button>
                      
                      <Link
                        to={`/crm-settings/${crm.id}`}
                        className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect(crm.id)}
                    disabled={isConnecting && selectedCrm === crm.id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white transition-colors disabled:opacity-50"
                  >
                    {isConnecting && selectedCrm === crm.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        Connect
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Integration Guide */}
        <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-500/30">
              <AlertCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">How Lead Syncing Works</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <p>
                  1. When a new lead is identified through your tracking pixel, it's automatically added to your LeadSync dashboard.
                </p>
                <p>
                  2. If you have a CRM connected, the lead is instantly pushed to your CRM with all available information.
                </p>
                <p>
                  3. Any updates made to the lead status in either system will be synchronized in real-time.
                </p>
                <p>
                  4. You can customize field mappings and sync settings in the CRM settings page.
                </p>
              </div>
              
              <div className="mt-4">
                <Link
                  to="/documentation/crm-sync"
                  className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
                >
                  Learn more about CRM integration
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CrmIntegrationPage;