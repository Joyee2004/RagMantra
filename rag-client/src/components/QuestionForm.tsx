import { useState } from 'react';
import { askQuestion } from '@/api/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import ChatHistory from './ChatHistory';

interface ChatEntry {
  question: string;
  response: string;
}

interface QuestionFormProps {
  question: string;
  setQuestion: (question: string) => void;
  selectedModel: string;
}

const QuestionForm = ({
  question,
  setQuestion,
  selectedModel,
}: QuestionFormProps) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleAsk = async () => {
    if (!question) {
      setAlertMessage("Please enter a question.");
      return;
    }
    if (!selectedModel) {
      setAlertMessage("Please select a model.");
      return;
    }

    const controller = new AbortController();
    setAbortController(controller);

    try {
      setAlertMessage('');
      setLoading(true);
      const answer = await askQuestion(question, selectedModel, controller.signal);
      setChatHistory(prev => [...prev, { question, response: answer }]);
      setQuestion(''); // clear input
    } catch (error) {
      setAlertMessage("Failed to get response.");
      console.error(error);
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  return (
    <div className='w-full flex flex-col'>
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              delay: 0.1,
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <Alert className="mb-4" variant="destructive">
              <AlertTitle>⚠️ Error</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
              <button
                onClick={() => setAlertMessage('')}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-4 h-4 cursor-pointer" />
              </button>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatHistory chatHistory={chatHistory}></ChatHistory>


      {loading && (
        <div className="flex items-center gap-4 justify-center mt-4">
          <div className="flex items-center gap-4">
            <p className="mt-4 text-gray-600">Processing...</p>
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin" />
          </div>
          <button
            onClick={() => {
              abortController?.abort();
              setLoading(false);
            }}
            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-red-900 via-pink-900 to-orange-900 text-white rounded"
          >
            Cancel
          </button>
        </div>
      )}


      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="w-full px-4 py-3 flex gap-2 sticky bottom-0"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the uploaded PDF..."
          className="w-full p-2 border rounded-[12px] bg-black "
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-12 py-2 rounded bg-gradient-to-r from-orange-400 from-10% via-pink-500 via-30% to-purple-500 to-90%"
        >
          Ask
        </button>
      </form>

    </div>
  );
};

export default QuestionForm;
