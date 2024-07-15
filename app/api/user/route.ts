import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PRIVATE_KEY!,
);

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    const data = await req.formData();
    const author_address = data.get("author_address");
    console.log(author_address);
    try {
      const { data, error } = await supabase
        .from("content")
        .select("IPA, nft_address")
        .eq("author_address", author_address)
        .single();

      if (error) throw error;

      if (!data) {
        return NextResponse.json(
          { message: "Address not found" },
          { status: 404 },
        );
      }
      console.log(data);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return NextResponse.json(
        { message: "Error uploading content" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: "Method not allowed" }, { status: 500 });
}
