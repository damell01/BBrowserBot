import React from 'react';
import { X, Download } from 'lucide-react';
import LeadsTable from '../dashboard/LeadsTable';
import { Lead } from '../../context/LeadsContext';
import { exportCustomerLeads } from '../../lib/api';

interface CustomerLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: {
    id: string;
    name: string;
    email: string;
    customer_id: string;
  };
  leads: Lead[];
  onUpdateStatus: (id: string, status: Lead['status']) => Promise<void>;
}

const CustomerLeadsModal: React.FC<CustomerLeadsModalProps> = ({
  isOpen,
  onClose,
  customer,
  leads,
  onUpdateStatus
}) => {
  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      await exportCustomerLeads(customer.customer_id);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-6xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">
                Leads for {customer.name}
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {customer.email}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <LeadsTable 
              leads={leads} 
              onUpdateStatus={onUpdateStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLeadsModal;