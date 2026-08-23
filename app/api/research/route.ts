import { NextResponse } from "next/server"
import { discoverLiveHistoryTopics } from "@/lib/research/live-research"
import { discoverTopics } from "@/lib/research/topic-discovery"
import type { ContentFormat, ResearchRequest } from "@/lib/research/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ResearchRequest>
    const format: ContentFormat = body.format === "long" ? "long" : "short"

    let candidates
    if (process.env.SEARCH_API_URL && process.env.SEARCH_API_KEY) {
      candidates = await discoverLiveHistoryTopics(format)
    } else {
      candidates = discoverTopics(format)
    }

    return NextResponse.json({
      ok: true,
      source: process.env.SEARCH_API_URL ? "web" : "seed",
      format,
      niche: "history",
      candidates,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Research error:", error)
    return NextResponse.json({ ok: false, error: "Unable to research topics right now." }, { status: 500 })
  }
}
