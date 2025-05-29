import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ExternalLink, AlertCircle, Bot, MessageSquare, Users } from 'lucide-react';

const IntegrationsPage: React.FC = () => {
  const upcomingIntegrations = [
    {
      name: 'GoHighLevel',
      description: 'Seamlessly sync leads and automation workflows with GoHighLevel CRM.',
      features: ['Lead synchronization', 'Automated workflows', 'Custom field mapping'],
      icon: <MessageSquare className="h-8 w-8 text-purple-400" />,
      color: 'purple'
    },
    {
      name: 'HubSpot',
      description: 'Connect your HubSpot account for advanced lead management and tracking.',
      features: ['Contact creation', 'Deal pipeline sync', 'Activity tracking'],
      icon: <Users className="h-8 w-8 text-orange-400" />,
      color: 'orange'
    },
    {
      name: 'Salesforce',
      description: 'Enterprise-grade CRM integration with complete data synchronization.',
      features: ['Bi-directional sync', 'Custom object support', 'Advanced reporting'],
      icon: <Bot className="h-8 w-8 text-blue-400" />,
      color: 'blue'
    }
  ];

  return (
    <DashboardLayout title="Integrations">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
          <p className="text-gray-400">
            We're working on powerful integrations to streamline your lead management workflow.
          </p>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingIntegrations.map((integration) => (
            <div
              key={integration.name}
              className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-${integration.color}-500/20`}>
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                    <p className="text-gray-400 text-sm">{integration.description}</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Coming Soon
                </span>
              </div>

              <div className="space-y-3">
                {integration.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${integration.color}-400`} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Notification Banner */}
        <div className="mt-8 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white">Get Notified</h4>
              <p className="mt-1 text-sm text-blue-200/70">
                Want to know when these integrations go live? Contact our support team to join the waitlist.
              </p>
              <a
                href="/support"
                className="inline-flex items-center mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Contact Support
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationsPage;