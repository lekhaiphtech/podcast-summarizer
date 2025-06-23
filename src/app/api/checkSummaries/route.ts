import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Summary } from "@/lib/models";

export async function POST(req: NextRequest) {
  const { episodeIds } = await req.json();

  if (!Array.isArray(episodeIds) || episodeIds.length === 0) {
    return NextResponse.json(
      { error: "episodeIds must be a non-empty array" },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    // ✅ Get both ID and summary for episodes in DB
    const existingSummaries = await Summary.find({
      episodeId: { $in: episodeIds },
    }).select("episodeId summary");

    // Separate list of IDs
    const summarizedIds = existingSummaries.map((s) => s.episodeId);

    // Map: episodeId -> summary
    const summaries = existingSummaries.reduce(
      (acc: Record<string, string>, item) => {
        acc[item.episodeId] = item.summary;
        return acc;
      },
      {}
    );

    return NextResponse.json({ summarizedIds, summaries });
  } catch (error) {
    console.error("[CheckSummaries Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
