import { useState } from 'react';
import ModelSelector from '@/components/ModelSelector';
import PDFUploader from '@/components/PDFUploader';
import QuestionForm from '@/components/QuestionForm';
import GooeyNav from '@/components/ui/GooeyNavItem';


const RAGPage = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [question, setQuestion] = useState('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [isUploaded, setIsUploaded] = useState(false);
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6 pt-32 relative">
            {/* Fixed Top Navbar */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                <GooeyNav />
            </div>

            <h1 className="text-3xl font-bold mb-6 mt-6">RAG PDF Chat</h1>

            <div className="grid md:grid-cols-2 gap-4">
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
                    onUploadSuccess={() => setIsUploaded(true)}
                />
            </div>

            {isUploaded && (
                <QuestionForm
                    question={question}
                    setQuestion={setQuestion}
                    selectedModel={selectedModel}
                />
            )}
        </div>
    );
};

export default RAGPage;
