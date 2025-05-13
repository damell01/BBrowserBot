import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Code, Copy, CheckCircle, ExternalLink, ArrowRight, Lightbulb, Search, AlertCircle, Loader2, Scale, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const PixelSetupPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const { user } = useAuth();
  
  const pixelCode = `<!-- BrowserBot Tracking Script -->
<script>
  (function(b,r,o,w,s){
    b.BrowserBotTracker=b.BrowserBotTracker||function(){
      (b.BrowserBotTracker.q=b.BrowserBotTracker.q||[]).push(arguments)
    };
    o=r.createElement('script');
    o.async=1;
    o.src='${import.meta.env.VITE_API_URL}/tracker.js';
    r.getElementsByTagName('head')[0].appendChild(o);
    b.BrowserBotTracker('init', '${user?.trackingId || user?.customer_id || "YOUR-TRACKING-ID"}');
  })(window,document);
</script>
<!-- End BrowserBot Tracking Script -->`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pixelCode);
    setCopied(true);
    toast.success('Tracking code copied to clipboard!');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleScanWebsite = async () => {
    if (!websiteUrl) {
      toast.error('Please enter a website URL');
      return;
    }

    setIsScanning(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-pixel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          url: websiteUrl,
          trackingId: user?.trackingId || user?.customer_id
        }),
      });

      const data = await response.json();
      
      if (data.success && data.pixelFound) {
        toast.success('Tracking script detected successfully!');
      } else {
        toast.error(data.message || 'Tracking script not found. Please check the installation.');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to scan website. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const steps = [
    {
      title: 'Copy Tracking Script',
      description: 'Copy the tracking script below and paste it into the `<head>` section of your website.',
      content: (
        <div>
          <div className="bg-gray-900 rounded-md p-4 mb-4">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{pixelCode}</pre>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={copied}
            >
              {copied ? (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied!
                </div>
              ) : (
                <div className="flex items-center">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </div>
              )}
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Verify Installation',
      description: 'Enter your website URL to verify that the tracking script has been installed correctly.',
      content: (
        <div>
          <div className="mb-4">
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-300 mb-1">
              Website URL
            </label>
            <input
              type="url"
              id="websiteUrl"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <button
            onClick={handleScanWebsite}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Scan Website
              </>
            )}
          </button>
        </div>
      ),
    },
    {
      title: 'Legal Best Practices',
      description: 'Ensure your website is compliant with privacy laws and regulations.',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-300">Privacy Policy</h4>
              <p className="text-sm text-blue-200/70">
                Make sure your website has a clear and comprehensive privacy policy that explains how you collect and use visitor data.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <Scale className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-300">Terms of Service</h4>
              <p className="text-sm text-blue-200/70">
                Provide clear terms of service that outline the rules and guidelines for using your website.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-300">Consent</h4>
              <p className="text-sm text-blue-200/70">
                Obtain user consent before collecting any personal data. Implement a cookie consent banner if necessary.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-amber-900/30 rounded-lg border border-amber-500/30">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-300">Disclaimer</h4>
              <p className="text-sm text-amber-200/70">
                This information is not legal advice. Consult with a legal professional to ensure full compliance with all applicable laws and regulations.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Bot Setup">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 mb-6">
          <div className="bg-gray-900 border-b border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-2">Tracking Script Setup</h2>
            <p className="text-gray-400">
              Follow these steps to install your unique tracking script and start collecting visitor data.
            </p>
          </div>
          
          <div className="flex border-b border-gray-700">
            {steps.map((step, index) => (
              <button
                key={index}
                className={`flex-1 py-3 px-4 text-center text-sm font-medium ${
                  setupStep === index + 1
                    ? 'text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setSetupStep(index + 1)}
              >
                <div className="flex items-center justify-center">
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 ${
                    setupStep === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {index + 1}
                  </span>
                  {step.title}
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-6">
            <div>
              <h3 className="text-lg font-medium text-white flex items-center">
                <Code className="h-5 w-5 mr-2 text-blue-400" />
                {steps[setupStep - 1].title}
              </h3>
              <p className="text-gray-400 mt-1">
                {steps[setupStep - 1].description}
              </p>
              
              {steps[setupStep - 1].content}
            </div>
          </div>
          
          <div className="border-t border-gray-700 p-4 flex justify-between">
            <button
              onClick={() => setSetupStep(Math.max(1, setupStep - 1))}
              disabled={setupStep === 1}
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={() => {
                if (setupStep < steps.length) {
                  setSetupStep(setupStep + 1);
                }
              }}
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center"
            >
              {setupStep === steps.length ? 'Finish' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Additional Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="#"
              className="flex items-start p-4 bg-gray-900 rounded-md border border-gray-700 hover:border-blue-500/30 group transition-all"
            >
              <div className="mr-4 p-2 bg-blue-500/20 rounded-md group-hover:bg-blue-500/30 transition-colors">
                <ExternalLink className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">Developer Documentation</h4>
                <p className="text-sm text-gray-400 mt-1">Access detailed API and implementation guides</p>
              </div>
            </a>
            
            <a
              href="#"
              className="flex items-start p-4 bg-gray-900 rounded-md border border-gray-700 hover:border-blue-500/30 group transition-all"
            >
              <div className="mr-4 p-2 bg-blue-500/20 rounded-md group-hover:bg-blue-500/30 transition-colors">
                <ExternalLink className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">Troubleshooting Guide</h4>
                <p className="text-sm text-gray-400 mt-1">Common issues and how to resolve them</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PixelSetupPage;