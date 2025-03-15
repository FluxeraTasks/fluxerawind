import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface DocumentationContentProps {
  loading: boolean;
  error: string | null;
  documentation: string | null;
  onRegenerate: () => void;
}

const DocumentationContent: React.FC<DocumentationContentProps> = ({
  loading,
  error,
  documentation,
  onRegenerate
}) => {
  const renderSection = (content: string) => {
    const lines = content.split('\n');
    const sections: React.ReactNode[] = [];
    let currentSection: React.ReactNode[] = [];
    let inList = false;
    let inCodeBlock = false;
    let codeContent = '';

    const processText = (text: string) => {
      // Primeiro, preserva os espaços entre palavras convertendo-os em marcadores especiais
      text = text.replace(/\s+/g, '___SPACE___');
      
      // Processa texto em negrito (palavras entre ** **)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = text.split(boldRegex);
      
      // Processa cada parte e restaura os espaços
      return parts.map((part, index) => {
        // Restaura os espaços
        part = part.replace(/___SPACE___/g, ' ');
        
        if (index % 2 === 1) { // É um texto entre **
          return <strong key={index} className="font-semibold">{part}</strong>;
        }
        return part;
      });
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          currentSection.push(
            <pre key={`code-${index}`} className="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto font-mono text-sm">
              <code>{codeContent}</code>
            </pre>
          );
          inCodeBlock = false;
          codeContent = '';
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

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
        // Adiciona ** ** ao redor do texto do título se não existir
        let titleText = trimmedLine.substring(2);
        if (!titleText.startsWith('**')) {
          titleText = `**${titleText}**`;
        }
        currentSection.push(
          <div key={`section-${index}`} className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              {processText(titleText)}
            </h2>
          </div>
        );
      } else if (trimmedLine.startsWith('## ')) {
        if (currentSection.length > 0) {
          sections.push(...currentSection);
          currentSection = [];
        }
        let subtitleText = trimmedLine.substring(3);
        if (!subtitleText.startsWith('**')) {
          subtitleText = `**${subtitleText}**`;
        }
        currentSection.push(
          <h3 key={`h3-${index}`} className="text-2xl font-bold text-gray-800 mb-4 mt-6">
            {processText(subtitleText)}
          </h3>
        );
      } else if (trimmedLine.startsWith('### ')) {
        if (currentSection.length > 0) {
          sections.push(...currentSection);
          currentSection = [];
        }
        let subsubtitleText = trimmedLine.substring(4);
        if (!subsubtitleText.startsWith('**')) {
          subsubtitleText = `**${subsubtitleText}**`;
        }
        currentSection.push(
          <h4 key={`h4-${index}`} className="text-xl font-bold text-gray-700 mb-3 mt-5">
            {processText(subsubtitleText)}
          </h4>
        );
      } else if (trimmedLine.startsWith('- ')) {
        if (!inList) {
          inList = true;
          currentSection.push(
            <ul key={`list-${index}`} className="space-y-2 mb-6 ml-4">
              <li key={`item-${index}`} className="flex items-start group">
                <span className="text-purple-600 mr-3 mt-1.5 group-hover:text-purple-700">•</span>
                <span className="text-gray-700 leading-relaxed">
                  {processText(trimmedLine.substring(2))}
                </span>
              </li>
            </ul>
          );
        } else {
          const lastItem = currentSection[currentSection.length - 1];
          if (React.isValidElement(lastItem) && lastItem.type === 'ul') {
            const newItem = (
              <li key={`item-${index}`} className="flex items-start group">
                <span className="text-purple-600 mr-3 mt-1.5 group-hover:text-purple-700">•</span>
                <span className="text-gray-700 leading-relaxed">
                  {processText(trimmedLine.substring(2))}
                </span>
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
        // Check for inline code
        const parts = trimmedLine.split('`');
        if (parts.length > 1) {
          const formattedParts = parts.map((part, i) => {
            if (i % 2 === 1) { // Inside backticks
              return <code key={i} className="bg-gray-100 text-purple-700 px-1.5 py-0.5 rounded font-mono text-sm">{part}</code>;
            }
            return processText(part);
          });
          currentSection.push(
            <p key={`p-${index}`} className="text-gray-700 leading-relaxed mb-4">
              {formattedParts}
            </p>
          );
        } else {
          currentSection.push(
            <p key={`p-${index}`} className="text-gray-700 leading-relaxed mb-4">
              {processText(trimmedLine)}
            </p>
          );
        }
      }
    });

    if (currentSection.length > 0) {
      sections.push(...currentSection);
    }

    return sections;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-5">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Gerando documentação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!documentation) {
    return null;
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-3xl mx-auto">
          {renderSection(documentation)}
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex justify-end">
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Regenerate
          </button>
        </div>
      </div>
    </>
  );
};

export default DocumentationContent;
