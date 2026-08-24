import { NextResponse } from "next/server"
import { researchHistory } from "@/lib/research/provider"
import { selectBestTopic } from "@/lib/research/topic-selection"
import type { ContentFormat } from "@/lib/research/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { format?: ContentFormat }
    const format: ContentFormat = body.format === "long" ? "long" : "short"
    const candidates = await researchHistory(format)
    const bestTopic = selectBestTopic(candidates)

    return NextResponse.json({
      ok: true,
      source: "web",
      format,
      niche: "history",
      candidates,
      bestTopic,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Research error:", error)
    return NextResponse.json({ ok: false, error: "Unable to research topics right now." }, { status: 500 })
  }
}
