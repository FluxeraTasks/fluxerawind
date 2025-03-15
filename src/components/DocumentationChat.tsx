import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { updateDocumentation } from '../lib/openai';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DocumentationChatProps {
  artifactId: string;
  artifactName: string;
  artifactData: any;
  documentation: string;
  onDocumentationUpdate: (newDocumentation: string) => void;
}

const DocumentationChat: React.FC<DocumentationChatProps> = ({
  artifactId,
  artifactName,
  artifactData,
  documentation,
  onDocumentationUpdate
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const updatedDocumentation = await updateDocumentation(
        artifactData,
        artifactName,
        documentation,
        userMessage
      );

      // Save the updated documentation to the database
      const { error: saveError } = await supabase
        .from('artifacts')
        .update({ documentation: updatedDocumentation })
        .eq('id', artifactId);

      if (saveError) throw saveError;

      // Update the documentation in the UI
      onDocumentationUpdate(updatedDocumentation);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'ve updated the documentation based on your request. You can see the changes in the documentation panel.'
      }]);
    } catch (error: any) {
      console.error('Error updating documentation:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I apologize, but I encountered an error while updating the documentation: ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700">Documentation Chat</h3>
        <p className="text-sm text-gray-500">
          Ask me to update or add information to the documentation.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'assistant'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-purple-600 text-white'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to update the documentation..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentationChat;