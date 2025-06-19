import { useState } from 'react';
import { askQuestion } from '@/api/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowUp, X } from 'lucide-react';
import ChatHistory from './ChatHistory';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [showDialog, setShowDialog] = useState(false);

  const clearChat = () => {
    setChatHistory([]);
    setShowDialog(false);
  };

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
      setQuestion('');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
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

      <ChatHistory chatHistory={chatHistory} />

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
          className="bg-green-500 text-white px-12 py-2 rounded bg-gradient-to-r from-orange-400 from-10% via-pink-500 via-30% to-purple-500 to-90% flex items-center justify-center gap-2"
        >
          {loading ? 'Getting_Response...' : 'Ask'}
        </button>
        {loading && (
          <button
            onClick={() => {
              abortController?.abort();
              setLoading(false);
            }}
            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-red-900 via-pink-900 to-orange-900 text-white rounded"
          >
            Cancel
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className='border-2 border-white px-4 rounded-md'>More</DropdownMenuTrigger>
          <DropdownMenuContent className='bg-black text-white'>
            <DropdownMenuLabel>More</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Top <ArrowUp className="ml-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
              Bottom <ArrowDown className="ml-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowDialog(true)}>
              Clear Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </form>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className='bg-black text-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to clear chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDialog(false)} className='text-black'>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearChat}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionForm;
