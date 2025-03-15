import React from 'react';
import { MessageSquare, X } from 'lucide-react';

interface DocumentationHeaderProps {
  artifactName: string;
  showChat: boolean;
  onToggleChat: () => void;
  onClose: () => void;
}

const DocumentationHeader: React.FC<DocumentationHeaderProps> = ({
  artifactName,
  showChat,
  onToggleChat,
  onClose
}) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Documentação para {artifactName}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Documentação gerada por IA
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleChat}
          className="text-gray-400 hover:text-purple-600 transition-colors p-2 rounded-lg hover:bg-purple-50"
          title={showChat ? "Hide Chat" : "Show Chat"}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default DocumentationHeader;
