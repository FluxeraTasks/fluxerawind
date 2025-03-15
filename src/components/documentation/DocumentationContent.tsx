import React, { useState } from 'react';
import { Loader2, AlertCircle, Edit2, Save, X } from 'lucide-react';

interface DocumentationContentProps {
  loading: boolean;
  error: string | null;
  documentation: string | null;
  onRegenerate: () => void;
  onUpdate: (newDocumentation: string) => void;
}

const DocumentationContent: React.FC<DocumentationContentProps> = ({
  loading,
  error,
  documentation,
  onRegenerate,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(documentation || '');

  const handleSave = () => {
    onUpdate(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(documentation || '');
    setIsEditing(false);
  };

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-medium">Erro ao gerar documentação</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={onRegenerate}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!documentation) {
    return (
      <div className="m-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <div>
            <h3 className="text-gray-800 font-medium">Nenhuma documentação</h3>
            <p className="text-gray-600 mt-1">Clique no botão abaixo para gerar a documentação.</p>
          </div>
        </div>
        <button
          onClick={onRegenerate}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Gerar Documentação
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-end mb-4 gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-1"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          )}
          <button
            onClick={onRegenerate}
            className="px-3 py-1.5 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
          >
            Regenerar
          </button>
        </div>

        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-[calc(100vh-200px)] p-4 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Digite a documentação aqui..."
          />
        ) : (
          <div className="prose prose-purple max-w-none">
            {renderSection(documentation)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationContent;
