import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { updateDocumentation } from '../../lib/openai';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface DocumentationChatProps {
  artifactId: string;
  artifactName: string;
  artifactData: any;
  documentation: string;
  onDocumentationUpdate: (newDocumentation: string) => void;
}

const DocumentationChat: React.FC<DocumentationChatProps> = ({
  artifactName,
  artifactData,
  documentation,
  onDocumentationUpdate
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      role: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    try {
      const updatedDocumentation = await updateDocumentation(
        artifactData,
        artifactName,
        documentation,
        newMessage.trim()
      );
      
      onDocumentationUpdate(updatedDocumentation);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Documentação atualizada com sucesso!',
        role: 'assistant'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao atualizar a documentação.',
        role: 'assistant'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
        <p className="text-sm text-gray-500">Converse com a IA para melhorar a documentação</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentationChat;