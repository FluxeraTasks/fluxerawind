import React, { useState, useEffect } from 'react';
import { Loader2, X, AlertCircle, MessageSquare } from 'lucide-react';
import { generateDocumentation } from '../lib/openai';
import DocumentationChat from './DocumentationChat';

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

  const renderSection = (content: string) => {
    const lines = content.split('\n');
    const sections: React.ReactNode[] = [];
    let currentSection: React.ReactNode[] = [];
    let inList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine === '') {
        if (currentSection.length > 0) {
          sections.push(...currentSection);
          currentSection = [];
        }
        inList = false;
        return;
      }

      if (trimmedLine.startsWith('# ')) {
        if (currentSection.length > 0) {
          sections.push(...currentSection);
          currentSection = [];
        }
        currentSection.push(
          <h2 key={`h2-${index}`} className="text-2xl font-semibold text-gray-900 mb-4">
            {trimmedLine.substring(2)}
          </h2>
        );
      } else if (trimmedLine.startsWith('## ')) {
        if (currentSection.length > 0) {
          sections.push(...currentSection);
          currentSection = [];
        }
        currentSection.push(
          <h3 key={`h3-${index}`} className="text-xl font-semibold text-gray-900 mb-3">
            {trimmedLine.substring(3)}
          </h3>
        );
      } else if (trimmedLine.startsWith('### ')) {
        if (currentSection.length > 0) {
          sections.push(...currentSection);
          currentSection = [];
        }
        currentSection.push(
          <h4 key={`h4-${index}`} className="text-lg font-semibold text-gray-900 mb-2">
            {trimmedLine.substring(4)}
          </h4>
        );
      } else if (trimmedLine.startsWith('- ')) {
        if (!inList) {
          inList = true;
          currentSection.push(
            <ul key={`list-${index}`} className="list-none space-y-2 mb-4">
              <li key={`item-${index}`} className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span className="text-gray-700">{trimmedLine.substring(2)}</span>
              </li>
            </ul>
          );
        } else {
          const lastItem = currentSection[currentSection.length - 1];
          if (React.isValidElement(lastItem) && lastItem.type === 'ul') {
            const newItem = (
              <li key={`item-${index}`} className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span className="text-gray-700">{trimmedLine.substring(2)}</span>
              </li>
            );
            const existingChildren = React.Children.toArray(lastItem.props.children);
            const newList = React.createElement('ul', {
              key: lastItem.key,
              className: lastItem.props.className,
              children: [...existingChildren, newItem]
            });
            currentSection[currentSection.length - 1] = newList;
          }
        }
      } else {
        currentSection.push(
          <p key={`p-${index}`} className="text-gray-700 mb-4">
            {trimmedLine}
          </p>
        );
      }
    });

    if (currentSection.length > 0) {
      sections.push(...currentSection);
    }

    return sections;
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
              onClick={() => setShowChat(!showChat)}
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
        
        <div className="flex-1 flex overflow-hidden">
          <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${showChat ? 'w-1/2 border-r' : 'w-full'}`}>
            {loading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-5">
                  <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Gerando documentação...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="m-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!loading && documentation && (
              <>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    {renderSection(documentation)}
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                  <div className="flex justify-end">
                    <button
                      onClick={handleGenerateDocumentation}
                      disabled={loading}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Regenerate
                    </button>
                  </div>
                </div>
              </>
            )}
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