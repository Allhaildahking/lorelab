import { NextResponse } from "next/server"
import { generateStory } from "@/lib/story/generator"
import type { StoryRequest } from "@/lib/story/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StoryRequest
    if (!body.topic || !body.format) {
      return NextResponse.json({ ok: false, error: "Topic and format are required." }, { status: 400 })
    }

    const story = await generateStory(body.topic, body.format)
    return NextResponse.json({ ok: true, story })
  } catch (error) {
    console.error("Story generation error:", error)
    return NextResponse.json({ ok: false, error: "Unable to generate the story right now." }, { status: 500 })
  }
}
