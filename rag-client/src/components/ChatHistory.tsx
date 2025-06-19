import React from 'react';
import Markdown from 'react-markdown';
interface ChatEntry {
  question: string;
  response: string;
}

interface ChatHistoryProps {
  chatHistory: ChatEntry[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory }) => {
  return (
    <div className="mt-6 space-y-4">
      {chatHistory.map((entry, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-end">
            <div className="bg-gray-800 px-4 py-2 rounded-lg max-w-[70%]">
              <strong>You:</strong> {entry.question}
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-2 rounded-lg w-[80%]">
              <strong>AI:</strong> 
              <Markdown>{entry.response}</Markdown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
