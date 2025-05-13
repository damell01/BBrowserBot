import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PixelVerificationPage: React.FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user } = useAuth();

  const resetVerification = () => {
    setVerificationStatus(null);
    setIsVerifying(false);
  };

  const verifyPixel = async () => {
    if (!websiteUrl) {
      toast.error('Please enter a website URL');
      return;
    }

    if (!user?.customer_id) {
      toast.error('Customer ID not found');
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(null);

    try {
      // Load the website in an iframe
      if (iframeRef.current) {
        iframeRef.current.src = websiteUrl;
      }

      // Wait for 5 seconds to allow pixel to fire
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Check if pixel fired
      const verifyUrl = `${import.meta.env.VITE_API_URL}/verify_pixel.php?customer_id=${user.customer_id}&domain=${encodeURIComponent(websiteUrl)}`;
      const response = await fetch(verifyUrl);
      const data = await response.json();

      if (data.success) {
        setVerificationStatus('success');
        toast.success('Pixel verified successfully!');
      } else {
        setVerificationStatus('error');
        toast.error('Pixel not detected. Please check installation.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      toast.error('Failed to verify pixel');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <DashboardLayout title="Pixel Verification">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Verify Your Pixel Installation</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-300 mb-2">
                Enter Your Website URL
              </label>
              <input
                type="url"
                id="websiteUrl"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={verifyPixel}
                disabled={isVerifying}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Pixel'
                )}
              </button>
            </div>

            {verificationStatus && (
              <div className={`mt-6 p-4 rounded-lg flex items-center justify-between ${
                verificationStatus === 'success' 
                  ? 'bg-emerald-900/30 border border-emerald-500/30' 
                  : 'bg-rose-900/30 border border-rose-500/30'
              }`}>
                <div className="flex items-center">
                  {verificationStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 mr-3" />
                  )}
                  <span className={verificationStatus === 'success' ? 'text-emerald-300' : 'text-rose-300'}>
                    {verificationStatus === 'success' 
                      ? 'Pixel successfully installed!' 
                      : 'Pixel not detected yet'}
                  </span>
                </div>
                <button
                  onClick={resetVerification}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hidden iframe for loading the website */}
        <iframe
          ref={iframeRef}
          style={{ width: 0, height: 0, position: 'absolute', visibility: 'hidden' }}
          title="Pixel Verification"
        />
      </div>
    </DashboardLayout>
  );
};

export default PixelVerificationPage;