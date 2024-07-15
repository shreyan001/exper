// app/api/loader/route.ts
import { NextResponse,NextRequest } from 'next/server';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    NextResponse.json({ error: 'Method Not Allowed' },{status: 405});
    return;
 }
   
 
  try {
    const pdfFile = await req.formData();
    const file: File | null = pdfFile.get('pdfFile') as unknown as File;
   
    const loader = new PDFLoader(file);
    const rawDocs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize:1500,

      chunkOverlap:128,
    });
    const splitDocs = await splitter.splitDocuments(rawDocs);
    console.log(splitDocs); 
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );
    const vectorstore = new SupabaseVectorStore(new TogetherAIEmbeddings({
      apiKey: process.env.TOGETHER_AI_API_KEY, // Default value
      model: "togethercomputer/m2-bert-80M-8k-retrieval", // Default value
    }), {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });
    await vectorstore.addDocuments(splitDocs);

   return NextResponse.json(vectorstore);
     return NextResponse.json(file);

  } catch (error) {
    console.error("Error loading PDF:", error);
   return NextResponse.json({ error: "Failed to load PDF" },{status:404});

  }
}
