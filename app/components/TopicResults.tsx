"use client"

import type { TopicCandidate } from "@/lib/research/types"

type Props = {
  topics: TopicCandidate[]
  loading?: boolean
}

export default function TopicResults({ topics, loading = false }: Props) {
  if (loading) return <p>Researching the history rabbit hole… 🔎</p>
  if (!topics.length) return <p>No stories found yet.</p>

  return (
    <section aria-label="Story candidates" style={{ display: "grid", gap: 16, marginTop: 24 }}>
      {topics.map((topic) => (
        <article key={topic.id} style={{ border: "1px solid #27272a", borderRadius: 16, padding: 20, textAlign: "left" }}>
          <h2 style={{ marginTop: 0 }}>{topic.title}</h2>
          <p style={{ color: "#a1a1aa" }}>{topic.summary}</p>
          <p><strong>Trend:</strong> {topic.trendScore}/100 · <strong>Curiosity:</strong> {topic.curiosityScore}/100 · <strong>Visual:</strong> {topic.visualScore}/100</p>
          <button type="button" onClick={() => navigator.clipboard.writeText(topic.title)}>Copy Topic</button>
        </article>
      ))}
    </section>
  )
}
