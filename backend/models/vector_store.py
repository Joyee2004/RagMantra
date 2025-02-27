import logging
import ollama
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings

class VectorStore:
    def __init__(self, embedding_model, store_name):
        self.embedding_model = embedding_model
        self.store_name = store_name
        self.logger = logging.getLogger(__name__)

    def create_vector_db(self, chunks):
        """Create a vector database from document chunks."""
        ollama.pull(self.embedding_model)
        
        vector_db = Chroma.from_documents(
            documents=chunks,
            embedding=OllamaEmbeddings(model=self.embedding_model),
            collection_name=self.store_name,
        )
        self.logger.info("Vector database created.")
        return vector_db