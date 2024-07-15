'use-Client';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { RunnableSequence } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";
import { NextRequest, NextResponse } from "next/server";

 

export async function loadAndSplitChunks({ chunkSize, chunkOverlap }) {
  try {
    const data = await fetch('../data/aicrypto.txt');
    console.log(data);
    const rawData = data;
    

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });
    const redDoc = await splitter.createDocuments(rawData);
    console.log(redDoc);
    const splitDocs = await splitter.splitDocuments(redDoc);
    return splitDocs;
  } catch (error) {
    console.error('Error loading and splitting PDF:', error);
    throw error; // Propagate the error to the caller
  }
}

 export async function initializeVectorstoreWithDocuments({
  documents,
}) {
  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey:process.env.HUGG_API_KEY,
  });
  const vectorstore = new MemoryVectorStore(embeddings);
  await vectorstore.addDocuments(documents);
  return vectorstore;
}


export function createDocumentRetrievalChain() {
  const convertDocsToString = (documents: Document[]): string => {
    return documents.map((document) => `<doc>\n${document.pageContent}\n</doc>`).join("\n");
  };

  const documentRetrievalChain = RunnableSequence.from([
    (input) => input.standalone_question,
    retriever,
    convertDocsToString,
  ]);
  
  return documentRetrievalChain;
}

