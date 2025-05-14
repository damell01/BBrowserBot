import React, { useState, useEffect } from 'react';
import { getWebsiteHits } from '../../lib/api';
import { BarChart3, Calendar, ArrowUpRight, ArrowDownRight, MousePointer2 } from 'lucide-react';
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
  const [timeframe, setTimeframe] = useState('7d'); // '24h', '7d', '30d'

  useEffect(() => {
    fetchHits();
  }, [sortBy, sortOrder, timeframe]);

  const fetchHits = async () => {
    try {
      setLoading(true);
      const now = new Date();
      let startDate = new Date();

      switch (timeframe) {
        case '24h':
          startDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
      }

      const response = await getWebsiteHits({
        start: startDate.toISOString(),
        end: now.toISOString(),
        sort: sortBy,
        order: sortOrder
      });

      if (response.success && response.pages) {
        setHits(response.pages);
      }
    } catch (error) {
      toast.error('Failed to fetch website hits');
    } finally {
      setLoading(false);
    }
  };

  const totalHits = hits.reduce((sum, hit) => sum + hit.hits, 0);
  const topPage = hits[0]?.page || 'No data';
  const averageHits = hits.length > 0 ? Math.round(totalHits / hits.length) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MousePointer2 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Hits</p>
              <p className="text-2xl font-bold text-white">{totalHits.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-emerald-400 mr-1" />
            <span className="text-emerald-400">12.5% increase</span>
            <span className="text-gray-400 ml-1">vs. last period</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Average Hits/Page</p>
              <p className="text-2xl font-bold text-white">{averageHits.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <ArrowDownRight className="w-4 h-4 text-rose-400 mr-1" />
            <span className="text-rose-400">3.2% decrease</span>
            <span className="text-gray-400 ml-1">vs. last period</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Most Visited Page</p>
              <p className="text-lg font-bold text-white truncate" title={topPage}>
                {topPage}
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-emerald-400 mr-1" />
            <span className="text-emerald-400">8.3% increase</span>
            <span className="text-gray-400 ml-1">in traffic</span>
          </div>
        </div>
      </div>

      {/* Hits Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Page Hits</h3>
          <div className="flex items-center gap-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-300"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
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
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
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
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : hits.length > 0 ? (
                hits.map((hit, index) => (
                  <tr key={index} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {hit.page}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {hit.hits.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {((hit.hits / totalHits) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                    No hits data available
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