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

export interface Stats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
}

interface LeadsContextType {
  leads: Lead[];
  stats: Stats;
  loading: boolean;
  error: string | null;
  updateLeadStatus: (id: string, status: Lead['status']) => Promise<void>;
  refreshLeads: () => Promise<void>;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const calculateStats = (leads: Lead[]): Stats => {
    return {
      total: leads.length,
      new: leads.filter(lead => lead.status === 'new').length,
      contacted: leads.filter(lead => lead.status === 'contacted').length,
      qualified: leads.filter(lead => lead.status === 'qualified').length,
      converted: leads.filter(lead => lead.status === 'converted').length
    };
  };

  const fetchLeads = async () => {
    if (!user) return;
    
    try {
      const response = await api.getLeads();
      
      let leadsData: any[] = [];
      
      if (response.success) {
        if (response.user?.leads) {
          leadsData = response.user.leads;
        } 
        else if (response.leads) {
          leadsData = response.leads;
        } 
        else {
          throw new Error('No leads data found in response');
        }

        const formattedLeads = leadsData.map((lead: any) => ({
          id: lead.id || crypto.randomUUID(),
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          company: lead.company || '',
          source: lead.source || lead.page || '',
          createdAt: new Date(lead.createdAt || lead.created_at || lead.timestamp || Date.now()),
          status: lead.status || 'new'
        }));

        setLeads(formattedLeads);
        setStats(calculateStats(formattedLeads));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError('Failed to fetch leads');
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    try {
      const response = await api.updateLeadStatus(id, status);
      if (response.success) {
        const updatedLeads = leads.map(lead => 
          lead.id === id ? { ...lead, status } : lead
        );
        setLeads(updatedLeads);
        setStats(calculateStats(updatedLeads));
        toast.success('Lead status updated');
      } else {
        throw new Error('Failed to update lead status');
      }
    } catch (error) {
      toast.error('Failed to update lead status');
      throw error;
    }
  };

  return (
    <LeadsContext.Provider 
      value={{ 
        leads,
        stats,
        loading,
        error,
        updateLeadStatus,
        refreshLeads: fetchLeads
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