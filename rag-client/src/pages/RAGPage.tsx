import { useState } from 'react';
import ModelSelector from '@/components/ModelSelector';
import PDFUploader from '@/components/PDFUploader';
import QuestionForm from '@/components/QuestionForm';
import GooeyNav from '@/components/ui/GooeyNavItem';

const RAGPage = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [isUploaded, setIsUploaded] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6 pt-32 relative">
            {/* Fixed Top Navbar */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                <GooeyNav />
            </div>

            <h1 className="text-3xl font-bold mb-6 mt-6">RAG PDF Chat</h1>

            <div className='grid md:grid-cols-2 gap-4'>
                <div className="flex flex-col items-center justify-center">
                    <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-6xl">
                        Upload file
                    </p>
                    <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-xl mt-2">
                        Drag or drop your files here or click to upload
                    </p>
                    <ModelSelector
                        selectedModel={selectedModel}
                        setSelectedModel={setSelectedModel}
                    />
                </div>

                <PDFUploader
                    pdfFile={pdfFile}
                    setPdfFile={setPdfFile}
                    selectedModel={selectedModel}
                    setLoading={setLoading}
                    onUploadSuccess={() => setIsUploaded(true)}
                    setAbortController={setAbortController}
                />
            </div>

            {isUploaded && (
                <QuestionForm
                    question={question}
                    setQuestion={setQuestion}
                    selectedModel={selectedModel}
                    setResponse={setResponse}
                    loading={loading}
                    setLoading={setLoading}
                    response={response}
                    setAbortController={setAbortController}
                />
            )}

            {loading && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 space-y-4">
                    <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mb-16"></div>
                    <button
                        className="cursor-pointer px-4 py-2 bg-gradient-to-r from-red-900 from-40% via-pink-900 via-30% to-orange-900 to-10% text-white rounded"
                        onClick={() => {
                            abortController?.abort();
                            setLoading(false);
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default RAGPage;
