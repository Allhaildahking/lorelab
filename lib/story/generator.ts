import { buildStoryPrompt } from "./prompt"
import type { StoryOutput, PostingRecommendation } from "./types"
import type { ContentFormat, TopicCandidate } from "@/lib/research/types"

const MODEL = "gemini-2.5-flash"

function buildPostingRecommendation(topic: TopicCandidate, format: ContentFormat): PostingRecommendation {
  const platform = format === "short" ? "YouTube Shorts" : "YouTube"
  const urgent = topic.trendScore >= 80
  return {
    platform,
    day: urgent ? "Next available high-traffic day" : "Saturday",
    time: urgent ? "As soon as practical" : "17:00–20:00",
    timezone: "Audience local time",
    urgency: urgent ? "Within 24h" : "This week",
    reason: urgent ? "The topic has strong current trend momentum, so speed matters more than waiting for a perfect generic posting slot." : "The topic is less time-sensitive, so a weekend evening audience window gives the history story room to reach viewers without relying on a breaking-trend spike.",
  }
}

function parseStory(text: string, topic: TopicCandidate, format: ContentFormat): StoryOutput {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim()
  const parsed = JSON.parse(cleaned) as StoryOutput
  if (!parsed.hook || !parsed.script || !Array.isArray(parsed.scenePrompts) || !Array.isArray(parsed.scenes) || !parsed.title || !parsed.description || !Array.isArray(parsed.hashtags)) throw new Error("Gemini returned an incomplete story")
  for (const scene of parsed.scenes) if (!scene.number || !Number.isFinite(scene.durationSeconds) || !scene.narration || !scene.imagePrompt || !scene.videoPrompt) throw new Error("Gemini returned an incomplete scene")
  parsed.postingRecommendation = buildPostingRecommendation(topic, format)
  return parsed
}

export async function generateStory(topic: TopicCandidate, format: ContentFormat): Promise<StoryOutput> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("Gemini is not configured")
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: buildStoryPrompt(topic, format) }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.8 } }), cache: "no-store" })
  if (!response.ok) throw new Error(`Gemini returned ${response.status}`)
  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("Gemini returned no story")
  return parseStory(text, topic, format)
}
