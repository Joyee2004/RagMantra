import { uploadFile } from '@/api/api';
import { FileUpload } from './ui/file-upload';

interface PDFUploaderProps {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  selectedModel: string;
  setLoading: (loading: boolean) => void;
  onUploadSuccess: () => void;
  setAbortController: (controller: AbortController | null) => void;
}

const PDFUploader = ({
  pdfFile,
  setPdfFile,
  selectedModel,
  setLoading,
  onUploadSuccess,
  setAbortController,
}: PDFUploaderProps) => {
  const handleFileUpload = async () => {
    if (!pdfFile) return alert('Please select a PDF.');
    if (!selectedModel) return alert('Please select a model.');
    const controller = new AbortController();
    setAbortController(controller);

    try {
      setLoading(true);
      const message = await uploadFile(pdfFile, selectedModel, controller.signal);
      alert(message);
      onUploadSuccess(); // notify parent
    } catch (error) {
      alert('Upload failed.');
      console.error(error);
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };
  
  {/* <input
    type="file"
    accept="application/pdf"
    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
    className="mb-4"
  /> */}
  return (
  <div className="flex flex-col items-center gap-4 w-full ">
    <FileUpload onChange={(files) => setPdfFile(files?.[0] || null)} />
    <button
      onClick={handleFileUpload}
      className="bg-gradient-to-r from-orange-400 from-10% via-pink-500 via-30% to-purple-500 to-90% text-white px-4 py-2 rounded"
    >
      Upload PDF
    </button>
  </div>
);

};

export default PDFUploader;
