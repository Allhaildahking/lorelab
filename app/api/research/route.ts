import { NextResponse } from "next/server"
import { discoverTopics } from "@/lib/research/topic-discovery"
import type { ContentFormat, ResearchRequest } from "@/lib/research/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ResearchRequest>
    const format: ContentFormat = body.format === "long" ? "long" : "short"

    const candidates = discoverTopics(format)

    return NextResponse.json({
      format,
      niche: "history",
      candidates,
      generatedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: "Unable to research topics" }, { status: 500 })
  }
}
