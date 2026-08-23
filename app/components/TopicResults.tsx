"use client"

import { useState } from "react"
import type { TopicCandidate } from "@/lib/research/types"

type Props = { topics: TopicCandidate[]; loading?: boolean; error?: string | null; onRetry?: () => void }

export default function TopicResults({ topics, loading = false, error, onRetry }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  if (loading) return <p>Researching the history rabbit hole… 🔎</p>
  if (error) return <section><p>{error}</p>{onRetry && <button type="button" onClick={onRetry}>Try Again</button>}</section>
  if (!topics.length) return <p>No stories found yet.</p>

  async function copy(id: string, text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <section aria-label="Story candidates" style={{ display: "grid", gap: 16, marginTop: 24 }}>
      {topics.map((topic) => (
        <article key={topic.id} style={{ border: "1px solid #27272a", borderRadius: 16, padding: 20, textAlign: "left" }}>
          <h2 style={{ marginTop: 0 }}>{topic.title}</h2>
          <p style={{ color: "#a1a1aa" }}>{topic.summary}</p>
          <p><strong>Trend:</strong> {topic.trendScore}/100 · <strong>Curiosity:</strong> {topic.curiosityScore}/100 · <strong>Visual:</strong> {topic.visualScore}/100</p>
          <button type="button" onClick={() => copy(topic.id, topic.title)}>{copied === topic.id ? "✓ Copied" : "Copy Topic"}</button>
        </article>
      ))}
    </section>
  )
}
