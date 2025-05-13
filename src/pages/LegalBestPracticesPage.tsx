import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Mail, Phone, FileText, AlertCircle, CheckCircle2, XCircle, Clock, PhoneCall, Shield } from 'lucide-react';

const LegalBestPracticesPage: React.FC = () => {
  return (
    <DashboardLayout title="Legal Best Practices">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Legal Compliance Guide</h2>
          <p className="text-gray-400">
            Follow these guidelines to ensure compliant and effective lead outreach under U.S. laws (TCPA, CAN-SPAM).
          </p>
        </div>

        {/* Privacy Policy Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Privacy Policy Add-On</h3>
              <p className="text-gray-400 text-sm">Required privacy policy content for your website</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-medium text-white mb-4">Visitor Identification & Data Use</h4>
            <div className="space-y-4 text-gray-300">
              <p>
                We use tracking technologies, including pixels, to collect data such as IP addresses and device/browser information when users visit our site. This data may be used in combination with third-party identity resolution services to associate anonymous website visits with contact details such as name, email, and phone number.
              </p>

              <div>
                <p className="text-white font-medium mb-2">This information helps us:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Improve marketing and outreach efforts</li>
                  <li>Follow up with potential customers</li>
                  <li>Analyze website traffic and engagement</li>
                </ul>
              </div>

              <p>
                We may share this data with verified service providers who assist in these functions, in accordance with applicable privacy laws.
              </p>

              <div className="mt-6">
                <h4 className="text-lg font-medium text-white mb-2">Your Choices</h4>
                <p>
                  If you prefer not to have your data used in this way, you can opt out by contacting us at [insert email] or disabling tracking in your browser settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Guidelines for Phone Numbers */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <PhoneCall className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Legal Use of Resolved Phone Numbers</h3>
              <p className="text-gray-400 text-sm">Quick guidelines for compliant phone number usage</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-400" />
                  What You CAN Do
                </h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="text-emerald-400 mb-2">All numbers are DNC-scrubbed!</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      Manually call for business outreach
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      Use click-to-call with human action
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      Call B2B landlines for sales
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <XCircle className="h-5 w-5 mr-2 text-rose-400" />
                  What You CANNOT Do
                </h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="text-rose-400 mb-2">Without written consent:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                      Use auto-dialers or ringless voicemail
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                      Text using automated systems
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                      Assume email replies = consent
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-medium mb-3">State Law Compliance</h4>
              <div className="text-sm text-gray-300">
                <p className="mb-2">⚠️ Some states have stricter rules than federal law:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Florida, Oklahoma, and Washington have specific requirements</li>
                  <li>• Always use manual calls unless you have written opt-in</li>
                  <li>• Collect consent via forms or booking pages</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-medium mb-3">Best Practice Flow</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center text-blue-400">
                    <Mail className="h-4 w-4 mr-2" />
                    <p className="font-medium">Step 1: Email First</p>
                  </div>
                  <p>Send compliant email with footer + opt-out</p>
                </div>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center text-purple-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <p className="font-medium">Step 2: Get Opt-In</p>
                  </div>
                  <p>Collect consent via form/booking</p>
                </div>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center text-emerald-400">
                    <Phone className="h-4 w-4 mr-2" />
                    <p className="font-medium">Step 3: Full Contact</p>
                  </div>
                  <p>Now safe for texts/automated calls</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DNC Compliance Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">DNC Compliance & Phone Number Usage</h3>
              <p className="text-gray-400 text-sm">Understanding legal requirements for using resolved phone numbers</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-400" />
                  DNC Registry Protection
                </h4>
                <div className="space-y-3 text-sm text-gray-300">
                  <p>All phone numbers are automatically scrubbed against the National Do Not Call (DNC) Registry.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      No DNC-listed numbers provided
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      Legal for B2B/B2C outbound calls
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <XCircle className="h-5 w-5 mr-2 text-rose-400" />
                  Important Restrictions
                </h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="text-amber-400">Manual dialing required without written consent!</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                      No auto-dialers or predictive dialing
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                      No ringless voicemails
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                      No automated SMS systems
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-medium mb-3">Permitted Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="text-white font-medium">Manual Outreach:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" />
                      Manual dialing for business outreach
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" />
                      Click-to-call with human action
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" />
                      B2B landline calls for sales
                    </li>
                  </ul>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="text-white font-medium">Automation Path:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-400 mr-2" />
                      Send initial email
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-400 mr-2" />
                      Drive to opt-in form
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-400 mr-2" />
                      Collect written consent
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-900/30 rounded-lg p-4 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="text-amber-300 font-medium mb-1">TCPA Violation Warning</h4>
                  <p className="text-sm text-amber-200/70">
                    Using auto-dialers or automated systems without written consent can result in fines of $500–$1,500 per violation under TCPA regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Original Outreach Sequence Sections */}
        <div className="space-y-6">
          {/* Step 1: Email */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Mail className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">STEP 1: Start With Email (CAN-SPAM Safe)</h3>
                <p className="text-gray-400 text-sm">You can cold email resolved leads following these rules</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-400" />
                    Required Elements
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      Clearly identify yourself or your business
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      Include a physical mailing address in footer
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      Include a working unsubscribe link
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      Use clear, non-misleading subject lines
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <XCircle className="h-5 w-5 mr-2 text-rose-400" />
                    Important Don'ts
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                      Don't cold call or text at this stage
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                      Don't use misleading sender names
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                      Don't hide or obscure the unsubscribe option
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                      Don't continue emailing after opt-out
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Consent */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">STEP 2: Warm Them Up & Get Consent</h3>
                <p className="text-gray-400 text-sm">Build trust and obtain explicit permission for further contact</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3">Recommended Value Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm text-gray-300">
                    <p className="text-white font-medium">Content Offers:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Downloadable resources</li>
                      <li>• Industry reports</li>
                      <li>• Educational content</li>
                    </ul>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p className="text-white font-medium">Direct Engagement:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Book a consultation</li>
                      <li>• Request a demo</li>
                      <li>• Claim special offer</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3">Consent Language Example</h4>
                <div className="p-4 bg-gray-800 rounded-md border border-gray-600 text-sm text-gray-300">
                  <p>☑️ "I agree to receive marketing communications via SMS or phone calls from [Your Company]. I understand consent isn't required to purchase."</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Follow Up */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Phone className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">STEP 3: Now You Can Rip</h3>
                <p className="text-gray-400 text-sm">Leverage your legal consent for multi-channel outreach</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-medium mb-3">Permitted Actions</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" />
                      Make sales calls
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" />
                      Send SMS follow-ups
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" />
                      Multi-channel nurturing
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-medium mb-3">Prohibited Actions</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center">
                      <XCircle className="h-4 w-4 text-rose-400 mr-2" />
                      Contact without opt-in
                    </li>
                    <li className="flex items-center">
                      <XCircle className="h-4 w-4 text-rose-400 mr-2" />
                      Use pre-checked boxes
                    </li>
                    <li className="flex items-center">
                      <XCircle className="h-4 w-4 text-rose-400 mr-2" />
                      Skip email warming
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Important Note</h4>
                    <p className="text-sm text-gray-300">
                      Skipping the email step and going straight to phone contact can result in fines of $500–$1,500 per message under TCPA regulations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LegalBestPracticesPage;