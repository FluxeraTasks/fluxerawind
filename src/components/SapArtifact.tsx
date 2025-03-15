import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  level?: number;
  isLast?: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, level = 0, isLast = true }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const indent = level * 20;
  const isObject = data && typeof data === 'object';
  const isArray = Array.isArray(data);

  if (!isObject) {
    return (
      <div style={{ marginLeft: indent }} className="font-mono">
        <span className="text-purple-600">{JSON.stringify(data)}</span>
        {!isLast && <span className="text-gray-500">,</span>}
      </div>
    );
  }

  const entries = Object.entries(data);

  return (
    <div style={{ marginLeft: indent }} className="font-mono">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-gray-700 hover:text-purple-600"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        <span>{isArray ? '[' : '{'}</span>
      </button>
      
      {isExpanded && (
        <div className="ml-4">
          {entries.map(([key, value], index) => (
            <div key={key} className="flex">
              <span className="text-blue-600">{isArray ? '' : `"${key}": `}</span>
              <JsonViewer
                data={value}
                level={level + 1}
                isLast={index === entries.length - 1}
              />
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginLeft: isExpanded ? 0 : 8 }}>
        {isArray ? ']' : '}'}
        {!isLast && <span className="text-gray-500">,</span>}
      </div>
    </div>
  );
};

interface SapArtifactProps {
  name: string;
  url: string;
  data: any;
}

const SapArtifact: React.FC<SapArtifactProps> = ({ name, url, data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 break-all">{url}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
        <JsonViewer data={data} />
      </div>
    </div>
  );
};

export default SapArtifact;