import React, { useState, useEffect } from 'react';
import { getWebsiteHits } from '../../lib/api';
import { BarChart3, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface PageHit {
  page: string;
  hits: number;
}

const WebsiteHits: React.FC = () => {
  const [hits, setHits] = useState<PageHit[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'hits' | 'page'>('hits');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchHits();
  }, [sortBy, sortOrder]);

  const fetchHits = async () => {
    try {
      setLoading(true);
      const response = await getWebsiteHits({ sort: sortBy, order: sortOrder });
      if (response.success && response.pages) {
        setHits(response.pages);
      }
    } catch (error) {
      toast.error('Failed to fetch website hits');
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (field: 'hits' | 'page') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const totalHits = hits.reduce((sum, page) => sum + page.hits, 0);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Website Traffic</h3>
              <p className="text-sm text-gray-400">Track your most visited pages</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-400">Last 30 days</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="text-sm text-gray-400 mb-1">Total Hits</h4>
            <p className="text-2xl font-bold text-white">{totalHits.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="text-sm text-gray-400 mb-1">Pages Tracked</h4>
            <p className="text-2xl font-bold text-white">{hits.length.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 hidden sm:block">
            <h4 className="text-sm text-gray-400 mb-1">Avg. Hits/Page</h4>
            <p className="text-2xl font-bold text-white">
              {hits.length > 0 ? Math.round(totalHits / hits.length).toLocaleString() : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th 
                  className="pb-3 text-sm font-medium text-gray-400 cursor-pointer"
                  onClick={() => toggleSort('page')}
                >
                  <div className="flex items-center gap-2">
                    Page URL
                    {sortBy === 'page' && (
                      sortOrder === 'asc' ? 
                        <ArrowUp className="h-4 w-4" /> : 
                        <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="pb-3 text-sm font-medium text-gray-400 cursor-pointer"
                  onClick={() => toggleSort('hits')}
                >
                  <div className="flex items-center gap-2">
                    Hits
                    {sortBy === 'hits' && (
                      sortOrder === 'asc' ? 
                        <ArrowUp className="h-4 w-4" /> : 
                        <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-400">
                    Loading website hits...
                  </td>
                </tr>
              ) : hits.length > 0 ? (
                hits.map((hit, index) => (
                  <tr key={index} className="group hover:bg-gray-750">
                    <td className="py-3 text-sm">
                      <div className="flex items-center">
                        <span className="text-white font-medium">{hit.page}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {hit.hits.toLocaleString()} hits
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-400">
                    No website hits recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WebsiteHits;