import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PRIVATE_KEY!,
  );

  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 },
    );
  }

  const data = await req.formData();
  const pdf1 = data.get("pdfFile");
  const loader = new PDFLoader(pdf1!);
  const rawDocs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,

    chunkOverlap: 128,
  });
  const contentList = await splitter.splitDocuments(rawDocs);
  const content = contentList.map((document) => document.pageContent);
  const author_address = data.get("author_address");
  const nft_address = data.get("nft_address");
  const cost_per_word = data.get("cost_per_word");
  const IPA = data.get("IP_ID");

  try {
    const { error } = await supabase.from("content").insert([
      {
        author_address: author_address,
        content: content,
        nft_address: nft_address,
        cost_per_word: cost_per_word,
        IPA: IPA,
      },
    ]);

    if (error) throw error;

    return NextResponse.json(
      { message: "Content uploaded successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading content:", error);
    return NextResponse.json(
      { message: "Error uploading content" },
      { status: 500 },
    );
  }
}
