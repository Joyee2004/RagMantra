export const fetchModels = async (): Promise<string[]> => {
  const res = await fetch('http://localhost:8000/models');
  const data = await res.json();
  return data.models || [];
};

export const uploadFile = async (file: File, model: string, signal?: AbortSignal): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', model);

  const res = await fetch('http://localhost:8000/upload', {
    method: 'POST',
    body: formData,
    signal,
  });

  const data = await res.json();
  return data.message;
};

export const askQuestion = async (question: string, model: string,signal?: AbortSignal): Promise<string> => {
  const res = await fetch('http://localhost:8000/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      question,
      model,
    }),
    signal,
  });

  const data = await res.json();
  return data.answer;
};
