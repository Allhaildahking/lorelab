import { NextResponse } from "next/server"
import { discoverLiveHistoryTopics } from "@/lib/research/live-research"
import { discoverTopics } from "@/lib/research/topic-discovery"
import type { ContentFormat, ResearchRequest } from "@/lib/research/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ResearchRequest>
    const format: ContentFormat = body.format === "long" ? "long" : "short"
    const useWeb = Boolean(process.env.SEARCH_API_URL && process.env.SEARCH_API_KEY)
    const candidates = useWeb ? await discoverLiveHistoryTopics(format) : discoverTopics(format)

    return NextResponse.json({
      ok: true,
      source: useWeb ? "web" : "seed",
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
