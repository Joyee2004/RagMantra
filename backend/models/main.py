import logging
from langchain_ollama import ChatOllama
from models.pdf_processor import PDFProcessor
from models.vector_store import VectorStore
from models.rag_chain import RAGChain


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


DOC_PATH = "Professional_Profile (1).pdf"
MODEL_NAME = "mistral:7b-instruct"
EMBEDDING_MODEL = "nomic-embed-text"
VECTOR_STORE_NAME = "simple-rag"

def main():
    
    pdf_processor = PDFProcessor()
    vector_store = VectorStore(EMBEDDING_MODEL, VECTOR_STORE_NAME)
    rag_chain = RAGChain()
    

    data = pdf_processor.ingest_pdf(DOC_PATH)
    if data is None:
        return

    
    chunks = pdf_processor.split_documents(data)

   
    vector_db = vector_store.create_vector_db(chunks)

   
    llm = ChatOllama(model=MODEL_NAME)

    
    retriever = rag_chain.create_retriever(vector_db, llm)
    chain = rag_chain.create_chain(retriever, llm)

    while True:
      
        question = input("\nEnter your question (or 'quit' to exit): ")
        
        if question.lower() == 'quit':
            break

        
        try:
            res = chain.invoke(input=question)
            print("\nResponse:")
            print(res)
        except Exception as e:
            logger.error(f"Error processing question: {str(e)}")

if __name__ == "__main__":
    main()