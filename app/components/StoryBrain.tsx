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
  return <section style={{ marginTop: 16 }}><h3>{label}</h3><button type="button" onClick={copy}>{copied ? "✓ Copied" : `Copy ${label}`}</button><pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{text}</pre></section>
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

  return <section style={{ marginTop: 24, textAlign: "left" }}>
    <button type="button" onClick={onBack}>← Back to topics</button>
    <h2>Story Brain</h2><p><strong>{topic.title}</strong></p>
    {!story && <button type="button" onClick={generate} disabled={loading}>{loading ? "Cooking the story… 🧠" : "Generate Story 🔥"}</button>}
    {error && <p role="alert">{error}</p>}
    {story && <>
      <Copyable label="Hook" text={story.hook} />
      <Copyable label="Script" text={story.script} />
      <section><h3>Scene / Image Prompts</h3>{story.scenePrompts.map((prompt, i) => <Copyable key={i} label={`Scene ${i + 1}`} text={prompt} />)}</section>
      <Copyable label="SEO Title" text={story.title} />
      <Copyable label="Description" text={story.description} />
      <Copyable label="Hashtags" text={story.hashtags.join(" ")} />
    </>}
  </section>
}
