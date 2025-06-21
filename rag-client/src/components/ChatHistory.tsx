import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy } from 'lucide-react';

interface ChatEntry {
  question: string;
  response: string;
}

interface ChatHistoryProps {
  chatHistory: ChatEntry[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 5000); // Reset after 5 seconds
  };

  return (
    <div className="mt-6 space-y-4">
      {chatHistory.map((entry, index) => (
        <div key={index} className="space-y-2">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-gray-800 px-4 py-2 rounded-lg max-w-[70%] border-1 border-white">
              <strong>You:</strong> {entry.question}
            </div>
          </div>

          {/* AI Response */}
          <div className="flex justify-start">
            <div className="bg-gray-950 px-4 py-2 rounded-lg w-[80%] relative border-1 border-white">
              <strong>AI:</strong>

              {/* Copy button */}
              <button
                onClick={() => handleCopy(entry.response, index)}
                className="cursor-pointer absolute top-2 right-2 text-sm text-gray-300 hover:text-white"
                title="Copy response"
              >
                {copiedIndex === index ? (
                  <span className="text-green-400 text-xs">Copied!</span>
                ) : (
                  <Copy size={16} />
                )}
              </button>

              <Markdown>{entry.response}</Markdown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
