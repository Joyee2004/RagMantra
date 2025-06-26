
# RAGMantra

RAGMantra is a local-first application that enables users to perform summarization, semantic search, and question answering using Local LLMs — ensuring complete data privacy and customizability.

## 🚨 Why RAGMantra ?

Modern LLMs like ChatGPT often store and use your prompts for future training. If you're working on sensitive, novel, or proprietary content — this can be a serious data privacy risk.

### Common Concerns:
Risk of intellectual property leakage

Lack of transparency in how prompts are stored or used

Inability to customize models for personal or enterprise use


### ✅ RAGMantra Solves That:
🖥️ Runs completely locally — no cloud API calls

🔐 Guarantees no prompt data leaks

🔄 Easily customizable and extendable for your own RAG workflows

### 🧪 Use Cases
Secure enterprise document chatbots

Research summarization

Local knowledge base assistants

Offline exam prep tools




## Getting Started

1. Clone the repository.
`git clone https://github.com/Joyee2004/RagMantra.git`

`cd RagMantra`

2. Set up the backend.

`uv venv --python 3.12.0`

uv is fast and efficient package manager. Refer https://docs.astral.sh/uv/ to learn more.
To install uv, simply run :

`pip install uv`

`.venv/Scripts/activate`

`uv pip install -r requirements.txt`

`cd .\backend\`

`cd .\models\`

`uvicorn main:app --reload`

3. Set up frontend on another terminal.
`cd RagMantra`

`cd .\rag-client\`

`npm install`

`npm run dev`

If frontend takes lot of time to render, then follow the below steps:
`npm run build`

`npx serve -s dist -l 5173`

Click on the link http://localhost:5173/ on the terminal. And you are ready to use RagMantra!!

### Insights on Ollama
RAGMantra runs LLMs entirely locally using Ollama, a robust and efficient tool to host state-of-the-art models on your own machine.

Steps to set up Ollama:
1. Download ollama from  https://ollama.com/
2. On your terminal , run

   ` ollama  pull cas/nous-hermes-2-mistral-7b-dpo:latest`
Note : Download model as per your task and hardware requirements.
3. To see the list of downloaded models:
    `ollama list`
## Demo

Here's a short demonstration of our project
Insert gif or link to demo

## Creators

Harshit Gangwar : https://github.com/harshit-G51102

Joyee Biswas : https://github.com/Joyee2004

