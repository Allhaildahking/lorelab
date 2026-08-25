"use client"

import { useState } from "react"
import type { ContentFormat, TopicCandidate } from "@/lib/research/types"
import type { StoryOutput } from "@/lib/story/types"

type Props = { topic: TopicCandidate; format: ContentFormat; onBack: () => void }

function Copyable({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200) } catch {}
  }
  return <section style={{ marginTop: 16, padding: 16, border: "1px solid #27272a", borderRadius: 14 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}><h3 style={{ margin: 0 }}>{label}</h3><button type="button" onClick={copy}>{copied ? "✓ Copied" : `Copy ${label}`}</button></div><div style={{ whiteSpace: "pre-wrap", marginTop: 12, lineHeight: 1.6 }}>{text}</div></section>
}

export default function StoryBrain({ topic, format, onBack }: Props) {
  const [story, setStory] = useState<StoryOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function generate() {
    setLoading(true); setError("")
    try {
      const response = await fetch("/api/story", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, format }) })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Generation failed")
      setStory(data.story)
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Something went wrong") }
    finally { setLoading(false) }
  }

  async function copyAll() {
    if (!story) return
    const text = `HOOK\n${story.hook}\n\nSCRIPT\n${story.script}\n\nSCENES\n${story.scenes.map(scene => `SCENE ${scene.number} (${scene.durationSeconds}s)\nNARRATION: ${scene.narration}\nIMAGE PROMPT: ${scene.imagePrompt}\nVIDEO PROMPT: ${scene.videoPrompt}`).join("\n\n")}\n\nTITLE\n${story.title}\n\nDESCRIPTION\n${story.description}\n\nHASHTAGS\n${story.hashtags.join(" ")}`
    await navigator.clipboard.writeText(text)
  }

  return <section style={{ marginTop: 24, textAlign: "left" }}>
    <button type="button" onClick={onBack}>← Back to topics</button>
    <h2>Story Brain 🧠</h2><p><strong>{topic.title}</strong></p>
    {!story && <button type="button" onClick={generate} disabled={loading}>{loading ? "Cooking the story… 🧠" : "Generate Story 🔥"}</button>}
    {story && <div style={{ display: "flex", gap: 10, marginTop: 12 }}><button type="button" onClick={generate} disabled={loading}>{loading ? "Regenerating…" : "Regenerate 🔄"}</button><button type="button" onClick={copyAll}>Copy Production Pack 📋</button></div>}
    {error && <p role="alert">{error}</p>}
    {story && <><Copyable label="Hook" text={story.hook} /><Copyable label="Script" text={story.script} /><section><h3 style={{ marginTop: 24 }}>Production Scenes 🎬</h3>{story.scenes.map(scene => <section key={scene.number} style={{ marginTop: 16, padding: 16, border: "1px solid #27272a", borderRadius: 14 }}><h3 style={{ marginTop: 0 }}>Scene {scene.number} · {scene.durationSeconds}s</h3><Copyable label="Narration" text={scene.narration} /><Copyable label="Image Prompt" text={scene.imagePrompt} /><Copyable label="Video Prompt" text={scene.videoPrompt} /></section>)}</section><Copyable label="SEO Title" text={story.title} /><Copyable label="Description" text={story.description} /><Copyable label="Hashtags" text={story.hashtags.join(" ")} /></>}
  </section>
}
