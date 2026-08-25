import { buildStoryPrompt } from "./prompt"
import type { StoryOutput } from "./types"
import type { ContentFormat, TopicCandidate } from "@/lib/research/types"

const MODEL = "gemini-2.5-flash"

function parseStory(text: string): StoryOutput {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim()
  const parsed = JSON.parse(cleaned) as StoryOutput
  if (!parsed.hook || !parsed.script || !Array.isArray(parsed.scenePrompts) || !parsed.title || !parsed.description || !Array.isArray(parsed.hashtags)) {
    throw new Error("Gemini returned an incomplete story")
  }
  return parsed
}

export async function generateStory(topic: TopicCandidate, format: ContentFormat): Promise<StoryOutput> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("Gemini is not configured")

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildStoryPrompt(topic, format) }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.8 },
    }),
    cache: "no-store",
  })

  if (!response.ok) throw new Error(`Gemini returned ${response.status}`)
  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("Gemini returned no story")
  return parseStory(text)
}
