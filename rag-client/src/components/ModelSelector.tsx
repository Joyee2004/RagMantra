import { useEffect, useState } from 'react';
import { fetchModels } from '@/api/api';

interface ModelSelectorProps {
  selectedChatModel: string;
  setSelectedChatModel: (model: string) => void;
  selectedEmbedModel: string;
  setSelectedEmbedModel: (model: string) => void;
}

const ModelSelector = ({
  selectedChatModel,
  setSelectedChatModel,
  selectedEmbedModel,
  setSelectedEmbedModel,
}: ModelSelectorProps) => {
  const [chatModels, setChatModels] = useState<string[]>([]);
  const [embedModels, setEmbedModels] = useState<string[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await fetchModels();
        setChatModels(data.chat_models || []);
        setEmbedModels(data.embedding_models || []);

        if (data.chat_models?.length && !selectedChatModel) {
          setSelectedChatModel(data.chat_models[0]);
        }

        if (data.embedding_models?.length && !selectedEmbedModel) {
          setSelectedEmbedModel(data.embedding_models[0]);
        }
      } catch (err) {
        console.error('Failed to load models', err);
      }
    };

    loadModels();
  }, []);

  return (
    <div className="mb-4 px-16 mt-8 flex justify-between gap-8">
      {/* Left (Chat Model) */}
      <div>
        <label className="block font-semibold mb-1 text-white">Select Chat Model:</label>
        <select
          value={selectedChatModel}
          onChange={(e) => setSelectedChatModel(e.target.value)}
          className="w-full border-2 border-white px-3 py-2 rounded"
        >
          {chatModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Right (Embedding Model) */}
      <div>
        <label className="block font-semibold mb-1 text-white">Select Embedding Model:</label>
        <select
          value={selectedEmbedModel}
          onChange={(e) => setSelectedEmbedModel(e.target.value)}
          className="w-full border-2 border-white px-3 py-2 rounded"
        >
          {embedModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
    </div>

  );
};

export default ModelSelector;
