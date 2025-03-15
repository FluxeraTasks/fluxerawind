import React, { useState, useEffect } from 'react';
import { Loader2, X, AlertCircle, MessageSquare } from 'lucide-react';
import { generateDocumentation } from '../lib/openai';
import { supabase } from '../lib/supabase';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documentation, setDocumentation] = useState(initialDocumentation || '');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!initialDocumentation) {
      handleGenerateDocumentation();
    }
  }, [initialDocumentation]);

  const handleGenerateDocumentation = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const docs = await generateDocumentation(artifactData, artifactName);
      
      const { error: saveError } = await supabase
        .from('artifacts')
        .update({ documentation: docs })
        .eq('id', artifactId);

      if (saveError) throw saveError;

      setDocumentation(docs);
    } catch (error: any) {
      console.error('Error generating documentation:', error);
      setError(error.message || 'Failed to generate documentation.');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentationUpdate = (newDocumentation: string) => {
    setDocumentation(newDocumentation);
  };

  const renderSection = (text: string) => {
    const sections: JSX.Element[] = [];
    let currentSection: JSX.Element[] = [];
    let sectionKey = 0;

    text.split('\n').forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        if (currentSection.length > 0) {
          sections.push(
            <div key={`section-${sectionKey++}`} className="mb-6">
              {currentSection}
            </div>
          );
          currentSection = [];
        }
        return;
      }

      // Handle section headers (all caps)
      if (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3) {
        if (currentSection.length > 0) {
          sections.push(
            <div key={`section-${sectionKey++}`} className="mb-6">
              {currentSection}
            </div>
          );
          currentSection = [];
        }
        currentSection.push(
          <h2 key={`header-${index}`} className="text-xl font-semibold text-gray-800 mb-4">
            {trimmedLine}
          </h2>
        );
      }
      // Handle bullet points
      else if (trimmedLine.startsWith('•')) {
        if (!currentSection.find(el => el.type === 'ul')) {
          currentSection.push(
            <ul key={`list-${index}`} className="list-none space-y-2 mb-4">
              <li key={`item-${index}`} className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span className="text-gray-700">{trimmedLine.substring(1).trim()}</span>
              </li>
            </ul>
          );
        } else {
          const list = currentSection[currentSection.length - 1];
          if (React.isValidElement(list) && list.type === 'ul') {
            const newList = React.cloneElement(list, {
              children: [...React.Children.toArray(list.props.children),
                <li key={`item-${index}`} className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span className="text-gray-700">{trimmedLine.substring(1).trim()}</span>
                </li>
              ]
            });
            currentSection[currentSection.length - 1] = newList;
          }
        }
      }
      // Handle regular paragraphs
      else {
        currentSection.push(
          <p key={`text-${index}`} className="text-gray-700 leading-relaxed mb-4">
            {trimmedLine}
          </p>
        );
      }
    });

    if (currentSection.length > 0) {
      sections.push(
        <div key={`section-${sectionKey}`} className="mb-6">
          {currentSection}
        </div>
      );
    }

    return sections;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
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
        
        <div className="flex-1 overflow-hidden flex">
          <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${showChat ? 'w-1/2' : 'w-full'}`}>
            {loading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
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
                
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-end">
                    <button
                      onClick={handleGenerateDocumentation}
                      disabled={loading}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Gerando...</span>
                        </>
                      ) : (
                        'Recriar Documentação'
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {showChat && documentation && (
            <div className="w-1/2 border-l flex flex-col h-full">
              <DocumentationChat
                artifactId={artifactId}
                artifactName={artifactName}
                artifactData={artifactData}
                documentation={documentation}
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