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
  const { user, updateUser } = useAuth();
  
  // Log user data when component mounts
  console.log('Current user data:', user);
  
  const pixelCode = `<!-- BrowserBot Tracking Script -->
<script>
  window.BrowserBotTrackingID = '${user?.customer_id || "YOUR-TRACKING-ID"}';
  (function(b,r,o,w,s){
    b.BrowserBotTracker=b.BrowserBotTracker||function(){
      (b.BrowserBotTracker.q=b.BrowserBotTracker.q||[]).push(arguments)
    };
    o=r.createElement('script');
    o.async=1;
    o.src='${import.meta.env.VITE_API_URL}/pixel.php';
    r.getElementsByTagName('head')[0].appendChild(o);
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
    // Check for user authentication first
    if (!user?.customer_id) {
      toast.error('Please log in to scan your website');
      return;
    }

    if (!websiteUrl) {
      toast.error('Please enter a website URL');
      return;
    }

    // Log scan attempt details
    console.log('Scan attempt:', {
      url: websiteUrl,
      trackingId: user.customer_id,
      apiUrl: import.meta.env.VITE_API_URL
    });

    setIsScanning(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify_pixel.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: websiteUrl,
          trackingId: user.customer_id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.pixelFound) {
        // Update user's pixel_installed status
        const updateResponse = await fetch(`${import.meta.env.VITE_API_URL}/update_pixel_status.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_id: user.customer_id,
            pixel_installed: true
          }),
        });

        const updateData = await updateResponse.json();
        
        if (updateData.success) {
          // Update local user state
          updateUser({ ...user, pixel_installed: true });
          toast.success('Tracking script verified and installation status updated!');
        } else {
          console.error('Failed to update pixel status:', updateData.error);
          toast.error('Tracking script found but failed to update installation status.');
        }
      } else {
        toast.error(data.message || 'Tracking script not found. Please check the installation.');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to verify tracking script. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const steps = [
    {
      title: "Copy Tracking Script",
      description: "Copy the unique tracking script for your website.",
      content: (
        <div className="relative mt-4">
          <div className="absolute right-4 top-4">
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md py-1 px-3 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-300 p-4 rounded-md border border-gray-700 overflow-x-auto text-sm">
            <code>{pixelCode}</code>
          </pre>
        </div>
      )
    },
    {
      title: "Add the Code to Your Website",
      description: "Add the tracking script to every page where you want to track visitors.",
      content: (
        <div className="mt-4 space-y-4">
          <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <span className="mr-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">1</span>
              Add to your HTML head section
            </h4>
            <p className="text-gray-300 text-sm">
              Place the tracking script between the <code className="text-blue-400">&lt;head&gt;</code> and <code className="text-blue-400">&lt;/head&gt;</code> tags of your website.
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <span className="mr-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">2</span>
              For common platforms
            </h4>
            <div className="space-y-3 text-sm text-gray-300">
              <p className="flex items-start">
                <span className="font-medium text-white w-20">WordPress:</span>
                <span>Add through Appearance → Editor → Theme header file (header.php)</span>
              </p>
              <p className="flex items-start">
                <span className="font-medium text-white w-20">Shopify:</span>
                <span>Add through Online Store → Themes → Edit Code → layout/theme.liquid</span>
              </p>
              <p className="flex items-start">
                <span className="font-medium text-white w-20">Wix:</span>
                <span>Add through Settings → Advanced → Custom Code → Add Custom Code → Header code</span>
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Verify Installation",
      description: "Enter your website URL to verify that the tracking script has been installed correctly.",
      content: (
        <div className="mt-4 space-y-4">
          <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
            <div className="mb-4">
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-300 mb-2">
                Website URL
              </label>
              <input
                type="url"
                id="websiteUrl"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <button
              onClick={handleScanWebsite}
              disabled={isScanning}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
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
        </div>
      )
    }
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
      </div>
    </DashboardLayout>
  );
};

export default PixelSetupPage;