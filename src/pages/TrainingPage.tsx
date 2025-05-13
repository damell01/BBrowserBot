import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Play, Clock, Award } from 'lucide-react';

interface TrainingVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: 'getting-started' | 'best-practices' | 'advanced';
}

const TrainingPage: React.FC = () => {
  const trainingVideos: TrainingVideo[] = [
    {
      id: '1',
      title: 'Getting Started with LeadSync',
      description: 'Learn the basics of LeadSync and how to set up your first tracking pixel.',
      duration: '5:30',
      thumbnail: 'https://images.pexels.com/photos/8439094/pexels-photo-8439094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'getting-started'
    },
    {
      id: '2',
      title: 'Best Practices for Lead Management',
      description: 'Discover proven strategies for managing and qualifying leads effectively.',
      duration: '8:45',
      thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'best-practices'
    },
    {
      id: '3',
      title: 'Advanced Pixel Configuration',
      description: 'Deep dive into advanced pixel settings and customization options.',
      duration: '12:20',
      thumbnail: 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'advanced'
    },
    {
      id: '4',
      title: 'CRM Integration Guide',
      description: 'Step-by-step guide to integrating LeadSync with your favorite CRM.',
      duration: '7:15',
      thumbnail: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'getting-started'
    },
    {
      id: '5',
      title: 'Maximizing Lead Quality',
      description: 'Learn techniques to improve lead quality and conversion rates.',
      duration: '10:00',
      thumbnail: 'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'best-practices'
    }
  ];

  return (
    <DashboardLayout title="Training Center">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Training Videos</h2>
          <p className="text-gray-400">
            Master LeadSync with our comprehensive training videos and tutorials.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingVideos.map((video) => (
            <div
              key={video.id}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500/30 transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-4 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
                    <Play className="w-8 h-8 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-gray-900/80 rounded-md border border-gray-700/30 backdrop-blur-sm flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs font-medium text-gray-300">{video.duration}</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{video.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    video.category === 'getting-started' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    video.category === 'best-practices' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {video.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  <Award className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrainingPage;