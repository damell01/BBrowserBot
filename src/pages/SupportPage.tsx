import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Search,
  MessageSquare,
  Mail,
  Phone,
  Plus,
  Minus
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'billing';
}

const SupportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I install the tracking pixel?',
      answer: 'You can find detailed instructions for installing the tracking pixel in the Pixel Setup page. Simply copy the provided code and add it to your website\'s header section.',
      category: 'technical'
    },
    {
      id: '2',
      question: 'What CRM systems do you support?',
      answer: 'We currently support integration with major CRM platforms including GoHighLevel, HubSpot, and Salesforce. More integrations are being added regularly.',
      category: 'general'
    },
    {
      id: '3',
      question: 'How are leads verified?',
      answer: 'Our system uses advanced algorithms and multiple data points to verify lead information, ensuring high-quality leads for your business.',
      category: 'technical'
    },
    {
      id: '4',
      question: 'What is your refund policy?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with our service, contact our support team for a full refund.',
      category: 'billing'
    },
    {
      id: '5',
      question: 'How often are leads updated?',
      answer: 'Leads are updated in real-time as they are identified and verified by our system. You can see new leads in your dashboard immediately.',
      category: 'general'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Support">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Help & Support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <MessageSquare className="w-6 h-6 text-blue-400 mb-2" />
              <h3 className="font-medium text-white mb-1">Live Chat</h3>
              <p className="text-sm text-gray-400">Chat with our support team</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <Mail className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className="font-medium text-white mb-1">Email Support</h3>
              <p className="text-sm text-gray-400">support@leadsync.com</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <Phone className="w-6 h-6 text-emerald-400 mb-2" />
              <h3 className="font-medium text-white mb-1">Phone Support</h3>
              <p className="text-sm text-gray-400">Mon-Fri, 9am-5pm EST</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left bg-gray-900 hover:bg-gray-850"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <Minus className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {expandedFaq === faq.id && (
                  <div className="p-4 bg-gray-800 text-gray-300 text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupportPage;