import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import * as api from '../lib/api';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  createdAt: Date;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
}

interface LeadsContextType {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  stats: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
  };
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      console.log('Fetching leads for user:', user);
      const response = await api.getLeads();
      console.log('Leads response:', response);
      
      let leadsData: any[] = [];
      
      if (response.success) {
        // Check if leads are nested under user object
        if (response.user?.leads) {
          leadsData = response.user.leads;
        } 
        // Check if leads are directly in response
        else if (response.leads) {
          leadsData = response.leads;
        } 
        else {
          throw new Error('No leads data found in response');
        }

        const formattedLeads = leadsData.map((lead: any) => ({
          id: lead.id || crypto.randomUUID(), // Generate ID if not provided
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          company: lead.company || '',
          source: lead.source || lead.page || '',
          createdAt: new Date(lead.createdAt || lead.created_at || lead.timestamp || Date.now()),
          status: lead.status || 'new'
        }));

        console.log('Formatted leads:', formattedLeads);
        setLeads(formattedLeads);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Failed to fetch leads');
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    try {
      const response = await api.updateLeadStatus(id, status);
      if (response.success) {
        setLeads(leads.map(lead => 
          lead.id === id ? { ...lead, status } : lead
        ));
        toast.success('Lead status updated');
      }
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  const stats = {
    total: leads.length,
    new: leads.filter(lead => lead.status === 'new').length,
    contacted: leads.filter(lead => lead.status === 'contacted').length,
    qualified: leads.filter(lead => lead.status === 'qualified').length,
    converted: leads.filter(lead => lead.status === 'converted').length,
  };

  return (
    <LeadsContext.Provider 
      value={{ 
        leads,
        loading,
        error,
        updateLeadStatus,
        stats
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};