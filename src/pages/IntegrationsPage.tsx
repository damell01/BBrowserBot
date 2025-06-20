import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  AlertCircle, 
  MessageSquare, 
  Users, 
  Loader2, 
  Eye, 
  EyeOff, 
  Pencil, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  RefreshCw, 
  Clock,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface IntegrationFormData {
  hubspot_api_key: string;
  ghl_api_key: string;
}

interface StoredIntegrations {
  hubspot_api_key: string | null;
  ghl_api_key: string | null;
}

const IntegrationsPage: React.FC = () => {
  const [formData, setFormData] = useState<IntegrationFormData>({
    hubspot_api_key: '',
    ghl_api_key: '',
  });
  const [storedIntegrations, setStoredIntegrations] = useState<StoredIntegrations>({
    hubspot_api_key: null,
    ghl_api_key: null,
  });
  const [loading, setLoading] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [expandedInstructions, setExpandedInstructions] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchStoredIntegrations();
  }, []);

  const fetchStoredIntegrations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_integrations.php`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setStoredIntegrations({
          hubspot_api_key: data.hubspot_api_key || null,
          ghl_api_key: data.ghl_api_key || null,
        });
      }
    } catch (error) {
      toast.error('Failed to fetch integrations');
    }
  };

  const handleIntegrationUpdate = async (integration: string) => {
    setLoading(integration);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/update_integrations.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [integration]: formData[integration as keyof IntegrationFormData]
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Integration connected successfully! Leads will automatically sync to your CRM.');
        fetchStoredIntegrations();
        setEditing(null);
        setFormData(prev => ({
          ...prev,
          [integration]: ''
        }));
      } else {
        throw new Error(data.message || 'Failed to update integration');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update integration');
    } finally {
      setLoading(null);
    }
  };

  const toggleShowKey = (integration: string) => {
    setShowKeys(prev => ({
      ...prev,
      [integration]: !prev[integration]
    }));
  };

  const toggleInstructions = (integrationId: string) => {
    setExpandedInstructions(expandedInstructions === integrationId ? null : integrationId);
  };

  const integrations = [
    {
      id: 'ghl_api_key',
      name: 'GoHighLevel',
      description: 'Seamlessly sync leads and automation workflows with GoHighLevel CRM.',
      features: ['Lead synchronization', 'Automated workflows', 'Custom field mapping'],
      icon: <MessageSquare className="h-8 w-8 text-purple-400" />,
      color: 'purple',
      inputLabel: 'API Key',
      inputPlaceholder: 'Enter your GoHighLevel API key',
      instructions: [
        'Log in to your GoHighLevel account',
        'Go to Settings (gear icon in the left sidebar)',
        'Click Company Settings or Agency Settings',
        'Scroll down to find the API Key section',
        'Copy the API key shown there',
        'Paste the API key in the field below'
      ],
      additionalInfo: '🔒 GHL uses a simple Bearer token (no extra auth setup needed)'
    },
    {
      id: 'hubspot_api_key',
      name: 'HubSpot',
      description: 'Connect your HubSpot account for advanced lead management and tracking.',
      features: ['Contact creation', 'Deal pipeline sync', 'Activity tracking'],
      icon: <Users className="h-8 w-8 text-orange-400" />,
      color: 'orange',
      inputLabel: 'Private App Token',
      inputPlaceholder: 'Enter your HubSpot Private App Token (starts with pat-)',
      instructions: [
        'Log in to your HubSpot Dashboard',
        'Click your Profile icon > Account Settings',
        'Go to Integrations > Private Apps in the left sidebar',
        'Click Create Private App',
        'Name it (e.g., "BrowserBot Integration")',
        'In Scopes tab, add: crm.objects.contacts.read/write, crm.import, crm.export, crm.lists.read/write',
        'Click Create App and copy your Access Token',
        'Go to Settings > Data Management > Properties',
        'Click "Create property" under Contact properties',
        'Set Name: source, Label: Source, Type: single-line text',
        'Save the property'
      ],
      additionalInfo: '🔒 HubSpot uses Authorization: Bearer pat-xxxx as the header. The Source property is required for lead tracking.'
    }
  ];

  const comingSoonIntegrations = [
    {
      name: 'Zapier',
      description: 'Connect with thousands of apps through Zapier webhooks.',
      icon: <ArrowRight className="h-8 w-8 text-blue-400" />,
      color: 'blue',
      features: ['Custom workflows', 'Multi-app integration', 'Automated actions']
    }
  ];

  return (
    <DashboardLayout title="Integrations">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Available Integrations</h2>
          <p className="text-gray-400">
            Connect your favorite tools to streamline your lead management workflow. Leads will automatically sync to connected CRMs.
          </p>
          {Object.values(storedIntegrations).some(value => value) && (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/20 px-3 py-2 rounded-lg border border-emerald-500/30">
              <RefreshCw className="w-4 h-4" />
              <span>Leads are automatically syncing to your connected CRMs</span>
            </div>
          )}
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 gap-6">
          {integrations.map((integration) => {
            const storedValue = storedIntegrations[integration.id as keyof StoredIntegrations];
            const isEditing = editing === integration.id;
            const showKey = showKeys[integration.id];
            const isExpanded = expandedInstructions === integration.id;
            const isConnected = !!storedValue;

            return (
              <div
                key={integration.id}
                className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-${integration.color}-500/20`}>
                      {integration.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                        {isConnected && (
                          <span className="flex items-center text-sm text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{integration.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {integration.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${integration.color}-400`} />
                      {feature}
                    </div>
                  ))}
                </div>

                {(!storedValue || isEditing) && (
                  <button
                    onClick={() => toggleInstructions(integration.id)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-gray-900 rounded-lg mb-4 text-sm text-gray-300 hover:bg-gray-850"
                  >
                    <span>How to get your {integration.inputLabel}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}

                {isExpanded && (
                  <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-medium text-white mb-3">Setup Instructions:</h4>
                    <ol className="space-y-2">
                      {integration.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                    {integration.additionalInfo && (
                      <div className="mt-4 flex items-start gap-2 text-sm">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                        <p className="text-blue-300">{integration.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {storedValue && !isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-300">
                          {integration.inputLabel}
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleShowKey(integration.id)}
                            className="p-1.5 text-gray-400 hover:text-white"
                          >
                            {showKey ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditing(integration.id)}
                            className="p-1.5 text-blue-400 hover:text-blue-300"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 font-mono text-sm">
                        {showKey ? storedValue : '••••••••••••••••'}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {integration.inputLabel}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData[integration.id as keyof IntegrationFormData]}
                          onChange={(e) => setFormData({
                            ...formData,
                            [integration.id]: e.target.value
                          })}
                          placeholder={integration.inputPlaceholder}
                          className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                        {isEditing && (
                          <button
                            onClick={() => setEditing(null)}
                            className="px-3 py-2 text-gray-400 hover:text-white bg-gray-700 rounded-lg hover:bg-gray-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {(!storedValue || isEditing) && (
                    <button
                      onClick={() => handleIntegrationUpdate(integration.id)}
                      disabled={loading === integration.id || !formData[integration.id as keyof IntegrationFormData]}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading === integration.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          {isEditing ? 'Save Changes' : 'Connect'}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Coming Soon Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Coming Soon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonIntegrations.map((integration, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg border border-gray-700 p-6 opacity-75"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-${integration.color}-500/20`}>
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                      <p className="text-gray-400 text-sm">{integration.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {integration.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${integration.color}-400`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Banner */}
        <div className="mt-8 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white">Need Help?</h4>
              <p className="mt-1 text-sm text-blue-200/70">
                Contact our support team for assistance with integrations or custom requirements.
              </p>
              <Link
                to="/support"
                className="inline-flex items-center mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Contact Support
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationsPage;