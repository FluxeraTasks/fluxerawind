import React, { useState, useEffect } from 'react';
import { generateDocumentation } from '../lib/openai';
import DocumentationHeader from './documentation/DocumentationHeader';
import DocumentationContent from './documentation/DocumentationContent';
import DocumentationChat from './documentation/DocumentationChat';

interface ArtifactDocumentationProps {
  artifactId: string;
  artifactName: string;
  artifactData: any;
  documentation: string | null;
  onClose: () => void;
}

const ArtifactDocumentation: React.FC<ArtifactDocumentationProps> = ({
  artifactId,
  artifactName,
  artifactData,
  documentation: initialDocumentation,
  onClose
}) => {
  const [documentation, setDocumentation] = useState<string | null>(initialDocumentation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    setDocumentation(initialDocumentation);
  }, [initialDocumentation]);

  const handleGenerateDocumentation = async () => {
    setLoading(true);
    setError(null);

    try {
      const newDocumentation = await generateDocumentation(artifactData, artifactName);
      setDocumentation(newDocumentation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate documentation');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentationUpdate = (newDocumentation: string) => {
    setDocumentation(newDocumentation);
  };

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      style={{ margin: 0, padding: 0, border: 0, boxSizing: 'border-box' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col h-[90vh] overflow-hidden" 
        style={{ margin: 0, padding: 0, border: 0, boxSizing: 'border-box' }}
        onClick={e => e.stopPropagation()}
      >
        <DocumentationHeader
          artifactName={artifactName}
          showChat={showChat}
          onToggleChat={() => setShowChat(!showChat)}
          onClose={onClose}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${showChat ? 'w-1/2 border-r' : 'w-full'}`}>
            <DocumentationContent
              loading={loading}
              error={error}
              documentation={documentation}
              onRegenerate={handleGenerateDocumentation}
            />
          </div>
          
          {showChat && (
            <div className="w-1/2 flex flex-col overflow-hidden">
              <DocumentationChat
                artifactId={artifactId}
                artifactName={artifactName}
                artifactData={artifactData}
                documentation={documentation || ''}
                onDocumentationUpdate={handleDocumentationUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtifactDocumentation;