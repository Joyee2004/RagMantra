import { askQuestion } from '@/api/api';

interface QuestionFormProps {
  question: string;
  setQuestion: (question: string) => void;
  selectedModel: string;
  setResponse: (res: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  response: string;
  setAbortController: (controller: AbortController | null) => void;
}

const QuestionForm = ({
  question,
  setQuestion,
  selectedModel,
  setResponse,
  loading,
  setLoading,
  response,
  setAbortController,
}: QuestionFormProps) => {
  const handleAsk = async () => {
    if (!question) return alert("Please enter a question.");
    if (!selectedModel) return alert("Please select a model.");
    const controller = new AbortController();
    setAbortController(controller);

    try {
      setLoading(true);
      const answer = await askQuestion(question, selectedModel, controller.signal);
      setResponse(answer);
    } catch (error) {
      alert("Failed to get response.");
      console.error(error);
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  return (
    <div className='w-full m-8'>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleAsk();
      }} className="mb-4 flex items-center gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the uploaded PDF..."
          className="w-full p-2 border rounded-[20px]"
        />
        <button
          type='submit'
          disabled={loading}
          className="bg-green-500 text-white px-12 py-2 rounded bg-gradient-to-r from-orange-400 from-10% via-pink-500 via-30% to-purple-500 to-90%"
        >
          Ask
        </button>
      </form>



      {loading && <p className="mt-4 text-gray-600">Processing...</p>}

      {response && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="font-semibold mb-2">💡 Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionForm;
