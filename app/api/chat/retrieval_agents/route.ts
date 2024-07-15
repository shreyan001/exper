import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage } from "ai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";

export const runtime = "edge";



const TEMPLATE_STRING = `You are an experienced researcher, 
expert at interpreting and answering questions based on provided sources.
Using the provided context, answer the user's question 
to the best of your ability using only the resources provided. 
Be verbose!

<context>

{context}

</context>

Now, answer this question using the above context:

{question}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
 
    const messages = (body.messages ?? []).filter(
      (message: VercelChatMessage) =>
        message.role === "user" || message.role === "assistant",
    );
    const currentMessageContent = messages[messages.length - 1].content;

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
const retriever = vectorstore.asRetriever();



const convertDocsToString = (documents: Document[]): string => {
return documents.map((document) => {
  return `<doc>\n${document.pageContent}\n</doc>`
}).join("\n");
};


const converToString = (documents: Document[]): string => {
  return documents.map((document) => {
    return `${document.pageContent}`
  }).join("\n");
  };
   
    const documentRetrievalChain = RunnableSequence.from([
      (input) => input.question,
      retriever,
      convertDocsToString
  ]);
  const dataRetrieve = RunnableSequence.from([
    (input) => input.question,
    retriever,
    converToString
]);

    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama3-70b-8192",
      temperature: 0.4,
      // IMPORTANT: Must "streaming: true" on OpenAI to enable final output streaming below.
    
    });

 
    const answerGenerationPrompt = ChatPromptTemplate.fromTemplate(
      TEMPLATE_STRING
  );
  const retrievalChain = RunnableSequence.from([
    {
      context: documentRetrievalChain,
      question: (input) => input.question,
    },
    answerGenerationPrompt,
    model,
    new StringOutputParser(),
  ]);



  const getCostPerToken = async () => {
    const query = await dataRetrieve.invoke({
      question: currentMessageContent,
    });
    
    try {
      const { data, error } = await client
        .rpc('find_most_relevant_content',{search_text:query}

        )
  
      if (error) {
        console.error('Error fetching content:', error.message);
        return { error: 'Error fetching content' };
      }
  
      if (data) {
        const authorAddress = data.author_address;
        const nftAddress = data.nft_address;
        const costPerWord = data.cost_per_word;
  
        return {
          authorAddress,
          nftAddress,
          costPerWord,
        };
      } else {
        return "dataNotFound";
      }
    } catch (error) {
      console.error('Error fetching content:', error.message);
      return { error: 'Error fetching content' };
    }
  }
  
  const tokenData = await getCostPerToken();
 
  
  const result = await retrievalChain.invoke({
    question: currentMessageContent
  });
 
  return NextResponse.json(
        {output: result ,sources:tokenData },
        { status: 200 },
      );
    }
   catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
