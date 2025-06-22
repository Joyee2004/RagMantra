from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pdf_processor import PDFProcessor
from vector_store import VectorStore
from rag_chain import RAGChain
from langchain_ollama import ChatOllama
import subprocess
import json
from fastapi.responses import JSONResponse


import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup
pdf_processor = PDFProcessor()
vector_store = None
rag_chain = RAGChain()
vector_db = None
llm = ChatOllama(model="granite3.3:2b")
chain = None


@app.get("/models")
async def list_models():
    try:
        result = subprocess.run(["ollama", "list"], capture_output=True, text=True, check=True)
        lines = result.stdout.strip().splitlines()

        model_names = [line.split()[0] for line in lines[1:]]

        chat_models = [name for name in model_names if "embed" not in name.lower()]
        embedding_models = [name for name in model_names if "embed" in name.lower()]

        return JSONResponse(content={
            "chat_models": chat_models,
            "embedding_models": embedding_models
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...), 
    model: str = Form(...), 
    embed_model: str = Form(...)
):
    with open("uploaded.pdf", "wb") as f:
        shutil.copyfileobj(file.file, f)

    data = pdf_processor.ingest_pdf("uploaded.pdf")
    chunks = pdf_processor.split_documents(data)

    global vector_db, vector_store, chain, llm

    vector_store = VectorStore(embed_model, "simple-rag")  
    vector_db = vector_store.create_vector_db(chunks)

    llm = ChatOllama(model=model)
    retriever = rag_chain.create_retriever(vector_db, llm)
    chain = rag_chain.create_chain(retriever, llm)

    return {
        "chat_model": model,
        "embedding_model": embed_model,
        "message": "PDF uploaded and processed successfully."
    }


@app.post("/ask")
async def ask_question(question: str = Form(...), model: str = Form(...)):
    global chain, llm, vector_db

    if vector_db is None:
        return {"answer": "No PDF uploaded yet."}

    llm = ChatOllama(model=model)
    retriever = rag_chain.create_retriever(vector_db, llm)
    chain = rag_chain.create_chain(retriever, llm)

    res = chain.invoke({"question": question})
    return {"answer": res}

