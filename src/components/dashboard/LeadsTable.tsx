import React, { useState, useMemo } from 'react';
import { Lead } from '../../context/LeadsContext';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Filter } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: Lead['status']) => void;
}

const LEADS_PER_PAGE = 10;

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  qualified: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  converted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onUpdateStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Lead>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showDuplicates, setShowDuplicates] = useState(false);
  
  // Deduplicate leads by email while preserving the original count
  const { uniqueLeads, totalLeads } = useMemo(() => {
    const emailMap = new Map<string, Lead>();
    leads.forEach(lead => {
      const email = lead.email.toLowerCase();
      if (!emailMap.has(email) || showDuplicates) {
        emailMap.set(email, lead);
      }
    });
    return {
      uniqueLeads: Array.from(emailMap.values()),
      totalLeads: leads.length
    };
  }, [leads, showDuplicates]);

  // Filter leads by search term and filters
  const filteredLeads = uniqueLeads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      
      const leadDate = new Date(lead.createdAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

      switch (dateFilter) {
        case 'today':
          return leadDate >= today;
        case 'week':
          return leadDate >= weekAgo;
        case 'month':
          return leadDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortField === 'createdAt') {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Paginate leads
  const totalPages = Math.ceil(sortedLeads.length / LEADS_PER_PAGE);
  const paginatedLeads = sortedLeads.slice(
    (currentPage - 1) * LEADS_PER_PAGE,
    currentPage * LEADS_PER_PAGE
  );
  
  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    onUpdateStatus(leadId, newStatus);
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setDateFilter('all');
    setShowFilters(false);
    setShowDuplicates(false);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Table Header with Search & Filters */}
      <div className="p-4 border-b border-gray-700 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 text-gray-200 text-sm rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-300 hover:text-white text-sm bg-gray-900 border border-gray-700 rounded-md px-3 py-2"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {(statusFilter !== 'all' || dateFilter !== 'all' || !showDuplicates) && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                {[
                  statusFilter !== 'all' ? 1 : 0,
                  dateFilter !== 'all' ? 1 : 0,
                  !showDuplicates ? 1 : 0
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Lead['status'] | 'all')}
                  className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-400 mb-1">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
                  className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-400 mb-1">Duplicates</label>
                <select
                  value={showDuplicates ? 'show' : 'hide'}
                  onChange={(e) => setShowDuplicates(e.target.value === 'show')}
                  className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hide">Hide Duplicates</option>
                  <option value="show">Show All</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {showDuplicates ? (
                  <span>Showing all {totalLeads} leads</span>
                ) : (
                  <span>Showing {uniqueLeads.length} unique leads (filtered from {totalLeads} total)</span>
                )}
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-md hover:bg-gray-700"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                Email
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('phone')}
              >
                Phone
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('source')}
              >
                Source
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                Date
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {paginatedLeads.length > 0 ? (
              paginatedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {lead.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {lead.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {lead.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {lead.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[lead.status]} bg-transparent focus:outline-none`}
                    >
                      <option value="new" className="bg-gray-900 text-blue-400">New</option>
                      <option value="contacted" className="bg-gray-900 text-amber-400">Contacted</option>
                      <option value="qualified" className="bg-gray-900 text-violet-400">Qualified</option>
                      <option value="converted" className="bg-gray-900 text-emerald-400">Converted</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredLeads.length > LEADS_PER_PAGE && (
        <div className="px-4 py-3 bg-gray-900 border-t border-gray-700 flex items-center justify-between">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing <span className="font-medium">{(currentPage - 1) * LEADS_PER_PAGE + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * LEADS_PER_PAGE, filteredLeads.length)}
                </span>{' '}
                of <span className="font-medium">{filteredLeads.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-blue-900 border-blue-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
          <div className="flex sm:hidden justify-between w-full">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-800 border border-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-800 border border-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;