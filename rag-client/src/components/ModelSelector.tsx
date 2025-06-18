import { useEffect, useState } from 'react';
import { fetchModels } from '@/api/api';

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

// List of models to exclude (embedding models, not chat-compatible)
const EXCLUDED_MODELS = ['nomic-embed-text'];

const ModelSelector = ({ selectedModel, setSelectedModel }: ModelSelectorProps) => {
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const modelList = await fetchModels();

        // Filter out models that include any of the excluded keywords
        const filteredModels = modelList.filter(
          (model) =>
            !EXCLUDED_MODELS.some((excluded) => model.toLowerCase().includes(excluded))
        );

        setModels(filteredModels);

        if (filteredModels.length > 0 && !selectedModel) {
          setSelectedModel(filteredModels[0]);
        }
      } catch (err) {
        console.error('Failed to load models', err);
      }
    };

    loadModels();
  }, []);

  return (
    <div className="mb-4 px-16 mt-16">
      <label className="block font-semibold mb-1 text-white px-40">Select Model:</label>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="w-full border-2 border-white px-3 py-2 rounded"
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
