import React, { useState, useEffect } from 'react';
import { getWebsiteHits } from '../../lib/api';
import { BarChart3, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
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

  const totalHits = hits.reduce((sum, page) => sum + page.hits, 0);
  const topPage = hits[0]?.page || 'No data';
  const averageHits = hits.length > 0 ? Math.round(totalHits / hits.length) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Total Page Views</h3>
          </div>
          <p className="text-2xl font-bold text-white">{totalHits.toLocaleString()}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Most Visited Page</h3>
          </div>
          <p className="text-lg font-bold text-white truncate" title={topPage}>
            {topPage}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <ArrowUpRight className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Average Views/Page</h3>
          </div>
          <p className="text-2xl font-bold text-white">{averageHits.toLocaleString()}</p>
        </div>
      </div>

      {/* Page Hits Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Page Performance</h3>
          <p className="text-sm text-gray-400 mt-1">Track which pages are getting the most traffic</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'page') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('page');
                        setSortOrder('asc');
                      }
                    }}
                  >
                    Page URL
                    {sortBy === 'page' && (
                      sortOrder === 'asc' ? 
                        <ArrowUpRight className="inline ml-1 w-4 h-4" /> : 
                        <ArrowDownRight className="inline ml-1 w-4 h-4" />
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'hits') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('hits');
                        setSortOrder('desc');
                      }
                    }}
                  >
                    Hits
                    {sortBy === 'hits' && (
                      sortOrder === 'asc' ? 
                        <ArrowUpRight className="inline ml-1 w-4 h-4" /> : 
                        <ArrowDownRight className="inline ml-1 w-4 h-4" />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {hits.map((hit, index) => (
                  <tr key={index} className="hover:bg-gray-750">
                    <td className="px-6 py-4 text-sm text-white">
                      {hit.page}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {hit.hits.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {hits.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-gray-400">
                      No page hits recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteHits;