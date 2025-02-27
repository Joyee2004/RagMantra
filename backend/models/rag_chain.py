import logging
from langchain.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.retrievers.multi_query import MultiQueryRetriever

class RAGChain:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def create_retriever(self, vector_db, llm):
        """Create a multi-query retriever."""
        query_prompt = PromptTemplate(
            input_variables=["question"],
            template="""You are an AI language model assistant. Your task is to generate five
different versions of the given user question to retrieve relevant documents from
a vector database. By generating multiple perspectives on the user question, your
goal is to help the user overcome some of the limitations of the distance-based
similarity search. Provide these alternative questions separated by newlines.
Original question: {question}""",
        )

        retriever = MultiQueryRetriever.from_llm(
            vector_db.as_retriever(), llm, prompt=query_prompt
        )
        self.logger.info("Retriever created.")
        return retriever

    def create_chain(self, retriever, llm):
        """Create the chain"""
        template = """Answer the question based ONLY on the following context:
{context}
Question: {question}
"""
        prompt = ChatPromptTemplate.from_template(template)
        
        chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )
        
        self.logger.info("Chain created successfully.")
        return chain