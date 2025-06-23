import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Summary } from "@/lib/models";
import { summarizeWithGemini } from "@/lib/summarise";

export async function POST(req: NextRequest) {
  const { episodeId, description } = await req.json();

  if (!episodeId || !description) {
    return NextResponse.json(
      { error: "Missing episodeId or description" },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    let existing = await Summary.findOne({ episodeId });
    console.log("Existing summary:", existing);
    if (existing) {
      return NextResponse.json({ summary: existing.summary });
    }
    const summary = await summarizeWithGemini(description);
    existing = new Summary({ episodeId, summary });
    await existing.save();
    console.log("New summary saved:", existing, episodeId, summary);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("[Summarize Error]", error);
    return NextResponse.json(
      { error: "Summarization failed" },
      { status: 500 }
    );
  }
}
