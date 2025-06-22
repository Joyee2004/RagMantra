import { useState } from 'react';
import { uploadFile } from '@/api/api';
import { FileUpload } from './ui/file-upload';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, X } from 'lucide-react'; // Import close icon
import { AnimatePresence, motion } from 'motion/react';

interface PDFUploaderProps {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  selectedChatModel: string;
  selectedEmbedModel: string;
  onUploadSuccess: () => void;
}

const PDFUploader = ({
  pdfFile,
  setPdfFile,
  selectedChatModel,
  selectedEmbedModel,
  onUploadSuccess,
}: PDFUploaderProps) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'default' | 'destructive'>('default');
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleFileUpload = async () => {
    if (!pdfFile) {
      triggerAlert('Please select a PDF file.', 'destructive');
      return;
    }

    if (!selectedChatModel) {
      triggerAlert('Please select a chat model.', 'destructive');
      return;
    }

    if (!selectedEmbedModel) {
      triggerAlert('Please select a embedding model.', 'destructive');
      return;
    }

    const controller = new AbortController();
    setAbortController(controller);

    try {
      setLoading(true);
      const response = await uploadFile(pdfFile, selectedChatModel, selectedEmbedModel, controller.signal);

      const formattedMessage = `${response.message}\nChat Model: ${response.chat_model}\nEmbedding Model: ${response.embedding_model}`;

      triggerAlert(formattedMessage, 'default');
      onUploadSuccess();
    } catch (error) {
      triggerAlert('Upload failed.', 'destructive');
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const triggerAlert = (message: string, type: 'default' | 'destructive') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showAlert && (
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
            <Alert variant={alertType} className="relative pr-10">
              <Terminal className="h-4 w-4" />
              <AlertTitle>{alertType === 'destructive' ? 'Error' : 'Success'}</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
              <button
                onClick={() => setShowAlert(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-4 h-4 cursor-pointer" />
              </button>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="flex flex-col items-center gap-4 w-full">
        <FileUpload onChange={(files) => setPdfFile(files?.[0] || null)} />
        <div className="flex items-center gap-4">
          <button
            onClick={handleFileUpload}
            disabled={loading}
            className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-orange-400 from-10% via-pink-500 via-30% to-purple-500 to-90% text-white px-4 py-2 rounded disabled:opacity-70"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
            )}
            {loading ? 'Uploading...' : 'Upload PDF'}
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
        </div>
      </div>

    </div>
  );
};

export default PDFUploader;
