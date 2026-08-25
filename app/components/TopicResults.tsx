"use client"

import { useState } from "react"
import type { TopicCandidate } from "@/lib/research/types"

type Props = { topics: TopicCandidate[]; loading?: boolean; error?: string | null; onRetry?: () => void; onSelect?: (topic: TopicCandidate) => void }
function scoreLabel(score: number) { return score >= 85 ? "Excellent" : score >= 70 ? "Strong" : score >= 50 ? "Decent" : "Weak" }
function overall(topic: TopicCandidate) { return Math.round(topic.trendScore * .2 + topic.curiosityScore * .2 + topic.retentionScore * .2 + topic.visualScore * .15 + topic.sourceQualityScore * .1 + topic.factualConfidence * .15) }

export default function TopicResults({ topics, loading = false, error, onRetry, onSelect }: Props) {
  const [copied, setCopied] = useState<string | null>(null); const [selected, setSelected] = useState<string | null>(null)
  if (loading) return <section aria-live="polite"><p><strong>Researching…</strong></p><p>Searching → checking sources → scoring → removing duplicates → ranking 🔎</p></section>
  if (error) return <section><p>{error}</p>{onRetry && <button type="button" onClick={onRetry}>Try Again</button>}</section>
  if (!topics.length) return <p>No stories found yet.</p>
  async function copy(id: string, text: string) { try { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 1200) } catch {} }
  function selectTopic(topic: TopicCandidate) { setSelected(topic.id); onSelect?.(topic) }
  const ranked = [...topics].sort((a, b) => overall(b) - overall(a)); const bestId = ranked[0]?.id
  return <section aria-label="Story candidates" style={{ display: "grid", gap: 16, marginTop: 24, width: "100%", maxWidth: 900, marginInline: "auto", paddingInline: 8 }}>
    {ranked.map((topic, index) => { const score = overall(topic); return <article key={topic.id} style={{ border: "1px solid #27272a", borderRadius: 16, padding: "clamp(14px, 4vw, 20px)", textAlign: "left", overflowWrap: "anywhere" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}><p style={{ margin: 0 }}><strong>#{index + 1}</strong> {topic.id === bestId && "🏆 Best Opportunity"}</p><span><strong>{score}/100</strong> opportunity</span></div>
      <h2 style={{ fontSize: "clamp(1.15rem, 4vw, 1.5rem)" }}>{topic.title}</h2><p style={{ opacity: .75 }}>{topic.summary}</p>
      <p><strong>Trend:</strong> {topic.trendScore} ({scoreLabel(topic.trendScore)}) · <strong>Curiosity:</strong> {topic.curiosityScore} · <strong>Retention:</strong> {topic.retentionScore}</p>
      <p><strong>Visual:</strong> {topic.visualScore} · <strong>Source quality:</strong> {topic.sourceQualityScore} · <strong>Confidence:</strong> {topic.factualConfidence}</p>
      <p><strong>Why this topic?</strong> {topic.angle}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button type="button" onClick={() => copy(`${topic.id}-title`, topic.title)}>{copied === `${topic.id}-title` ? "✓ Copied" : "Copy Topic"}</button><button type="button" onClick={() => copy(`${topic.id}-angle`, topic.angle)}>{copied === `${topic.id}-angle` ? "✓ Copied" : "Copy Angle"}</button>{topic.sources.map(source => <button key={source} type="button" onClick={() => copy(`${topic.id}-${source}`, source)}>{copied === `${topic.id}-${source}` ? "✓ Copied" : "Copy Source"}</button>)}<button type="button" onClick={() => selectTopic(topic)}>{selected === topic.id ? "✓ Selected" : "Use This Topic"}</button></div>
      {selected === topic.id && <p><strong>Locked in.</strong> This topic is ready for Story Brain.</p>}
      {topic.sources.length > 0 && <details style={{ marginTop: 14 }}><summary><strong>Sources ({topic.sources.length})</strong></summary><ul>{topic.sources.map(source => <li key={source}><a href={source} target="_blank" rel="noreferrer">{source}</a></li>)}</ul></details>}
    </article> })}
  </section>
}
