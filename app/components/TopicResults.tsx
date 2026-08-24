"use client"

import { useState } from "react"
import type { TopicCandidate } from "@/lib/research/types"

type Props = { topics: TopicCandidate[]; loading?: boolean; error?: string | null; onRetry?: () => void; onSelect?: (topic: TopicCandidate) => void }

export default function TopicResults({ topics, loading = false, error, onRetry, onSelect }: Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  if (loading) return <p>Finding the juiciest history rabbit holes… 🔎</p>
  if (error) return <section><p>{error}</p>{onRetry && <button type="button" onClick={onRetry}>Try Again</button>}</section>
  if (!topics.length) return <p>No stories found yet.</p>

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 1200)
    } catch {
      setCopied(null)
    }
  }

  function selectTopic(topic: TopicCandidate) {
    setSelected(topic.id)
    onSelect?.(topic)
  }

  return (
    <section aria-label="Story candidates" style={{ display: "grid", gap: 16, marginTop: 24 }}>
      {topics.map((topic) => (
        <article key={topic.id} style={{ border: "1px solid #27272a", borderRadius: 16, padding: 20, textAlign: "left" }}>
          <h2 style={{ marginTop: 0 }}>{topic.title}</h2>
          <p style={{ color: "#a1a1aa" }}>{topic.summary}</p>
          <p><strong>Trend:</strong> {topic.trendScore}/100 · <strong>Curiosity:</strong> {topic.curiosityScore}/100 · <strong>Visual:</strong> {topic.visualScore}/100</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => copy(`${topic.id}-title`, topic.title)}>{copied === `${topic.id}-title` ? "✓ Copied" : "Copy Topic"}</button>
            <button type="button" onClick={() => copy(`${topic.id}-angle`, topic.angle)}>{copied === `${topic.id}-angle` ? "✓ Copied" : "Copy Angle"}</button>
            {topic.sources.map((source) => (
              <button key={source} type="button" onClick={() => copy(`${topic.id}-${source}`, source)}>{copied === `${topic.id}-${source}` ? "✓ Copied" : "Copy Source"}</button>
            ))}
            <button type="button" onClick={() => selectTopic(topic)}>{selected === topic.id ? "✓ Selected" : "Use This Topic"}</button>
          </div>
          {selected === topic.id && <p><strong>Locked in.</strong> This topic is ready for Story Brain.</p>}
          {topic.sources.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <strong>Sources</strong>
              <ul>{topic.sources.map((source) => <li key={source}><a href={source} target="_blank" rel="noreferrer">{source}</a></li>)}</ul>
            </div>
          )}
        </article>
      ))}
    </section>
  )
}
