import React from 'react';
import { Box, Link as LinkIcon, Users, Settings } from 'lucide-react';

interface WorkspaceHeaderProps {
  title: string;
  imageUrl: string | null;
  activeTab: 'artifacts' | 'apis' | 'members' | 'settings';
  onTabChange: (tab: 'artifacts' | 'apis' | 'members' | 'settings') => void;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  title,
  imageUrl,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-8 h-8 rounded object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-medium text-purple-600">
                  {title.charAt(0)}
                </span>
              </div>
            )}
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>
        </div>

        <div className="flex gap-8 -mb-px">
          <button
            onClick={() => onTabChange('artifacts')}
            className={`flex items-center gap-2 px-1 py-3 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'artifacts'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Box className="w-4 h-4" />
            Artefatos
          </button>
          <button
            onClick={() => onTabChange('apis')}
            className={`flex items-center gap-2 px-1 py-3 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'apis'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            APIs
          </button>
          <button
            onClick={() => onTabChange('members')}
            className={`flex items-center gap-2 px-1 py-3 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'members'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4" />
            Membros
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className={`flex items-center gap-2 px-1 py-3 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            Configuraçoes
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceHeader;