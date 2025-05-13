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
    o.src='https://tracker.browserbot.example/tracker.js';
    r.getElementsByTagName('head')[0].appendChild(o);
    b.BrowserBotTracker('init', '${user?.trackingId || "YOUR-TRACKING-ID"}');
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
      const response = await fetch('/api/scan-pixel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: websiteUrl,
          trackingId: user?.trackingId
        }),
      });

      const data = await response.json();
      
      if (data.pixelFound) {
        toast.success('Tracking script detected successfully!');
      } else {
        toast.error('Tracking script not found. Please check the installation.');
      }
    } catch (error) {
      toast.error('Failed to scan website. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };
  
  const steps = [
    {
      title: "Copy Your Tracking Script",
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
      title: "Legal Requirements",
      description: "Add required privacy policy updates and follow best practices for outreach.",
      content: (
        <div className="mt-4 space-y-6">
          <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-400" />
              Privacy Policy Add-On
            </h4>
            <div className="prose prose-sm prose-invert">
              <pre className="bg-gray-800 p-4 rounded-md text-sm text-gray-300 whitespace-pre-wrap">
{`Visitor Identification & Data Use
We use tracking technologies, including pixels, to collect data such as IP addresses and device/browser information when users visit our site. This data may be used in combination with third-party identity resolution services to associate anonymous website visits with contact details such as name, email, and phone number.

This information helps us:
• Improve marketing and outreach efforts
• Follow up with potential customers
• Analyze website traffic and engagement

We may share this data with verified service providers who assist in these functions, in accordance with applicable privacy laws.

Your Choices
If you prefer not to have your data used in this way, you can opt out by contacting us at [insert email] or disabling tracking in your browser settings.`}</pre>
            </div>
          </div>

          <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Scale className="h-5 w-5 mr-2 text-blue-400" />
              Legal Best Practices for Outreach
            </h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-blue-400 font-medium mb-2">📧 Email Outreach</h5>
                <div className="space-y-3 text-sm text-gray-300">
                  <div>
                    <p className="font-medium text-white mb-1">Required (per CAN-SPAM Act):</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Identify the sender clearly</li>
                      <li>Include a valid business mailing address</li>
                      <li>Provide a visible unsubscribe option</li>
                      <li>Avoid misleading subject lines or content</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">Best Practices:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Personalize each message</li>
                      <li>Reference site activity lightly (e.g., "We noticed interest in [product/service] recently")</li>
                      <li>Use a soft call-to-action</li>
                      <li>Include an opt-out line</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-blue-400 font-medium mb-2">📱 Phone & SMS Outreach</h5>
                <div className="space-y-3 text-sm text-gray-300">
                  <div>
                    <p className="font-medium text-white mb-1">U.S. Compliance (TCPA):</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Only call or text if:
                        <ul className="list-disc list-inside ml-4">
                          <li>You have prior consent OR</li>
                          <li>It's a business contact (B2B) and you're following state-specific rules</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">Best Practices:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Email first and wait for a response before texting or calling</li>
                      <li>Use a friendly and informative tone (never salesy or forceful)</li>
                      <li>Never auto-dial or send bulk SMS without written opt-in</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-blue-400 font-medium mb-2">✅ General Guidelines</h5>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-gray-300">
                  <li>Never mention IP tracking or geolocation explicitly in outreach</li>
                  <li>Always give recipients a clear, easy way to opt out</li>
                  <li>Keep messages compliant, respectful, and relevant</li>
                  <li>Maintain a record of communication history to protect your business</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Verify Installation",
      description: "Scan your website to confirm the tracking script is properly installed.",
      content: (
        <div className="mt-4 space-y-4">
          <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-3">Scan Your Website</h4>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Enter your website URL (e.g., https://example.com)"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleScanWebsite}
                  disabled={isScanning}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 flex items-center gap-2"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Scan Now
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-md border border-blue-500/30">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium text-blue-200">Important Note</p>
                  <p>Make sure your website is publicly accessible for the scan to work properly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <DashboardLayout title="Bot Setup">
      <div className="max-w-4xl mx-auto">
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