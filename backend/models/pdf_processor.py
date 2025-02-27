import logging
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os

class PDFProcessor:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def ingest_pdf(self, doc_path):
        """Load PDF documents."""
        if os.path.exists(doc_path):
            loader = PyPDFLoader(file_path=doc_path)
            data = loader.load()
            self.logger.info("PDF loaded successfully.")
            return data
        else:
            self.logger.error(f"PDF file not found at path: {doc_path}")
            return None

    def split_documents(self, documents):
        """Split documents into smaller chunks."""
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=300)
        chunks = text_splitter.split_documents(documents)
        self.logger.info("Documents split into chunks.")
        return chunks