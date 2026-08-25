"use client"

import { useState } from "react"
import type { TopicCandidate } from "@/lib/research/types"

type Props = { topics: TopicCandidate[]; loading?: boolean; error?: string | null; onRetry?: () => void; onSelect?: (topic: TopicCandidate) => void }

function scoreLabel(score: number) { return score >= 85 ? "Excellent" : score >= 70 ? "Strong" : score >= 50 ? "Decent" : "Weak" }

export default function TopicResults({ topics, loading = false, error, onRetry, onSelect }: Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  if (loading) return <section aria-live="polite"><p><strong>Researching…</strong></p><p>Searching → checking sources → scoring → removing duplicates → ranking 🔎</p></section>
  if (error) return <section><p>{error}</p>{onRetry && <button type="button" onClick={onRetry}>Try Again</button>}</section>
  if (!topics.length) return <p>No stories found yet.</p>
  async function copy(id: string, text: string) { try { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 1200) } catch {} }
  function selectTopic(topic: TopicCandidate) { setSelected(topic.id); onSelect?.(topic) }
  const bestId = topics[0]?.id
  return <section aria-label="Story candidates" style={{ display: "grid", gap: 16, marginTop: 24 }}>
    {topics.map((topic, index) => <article key={topic.id} style={{ border: "1px solid #27272a", borderRadius: 16, padding: 20, textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}><p style={{ margin: 0 }}><strong>#{index + 1}</strong> {topic.id === bestId && "🏆 Best Opportunity"}</p><span>Overall {Math.round((topic.trendScore + topic.curiosityScore + topic.visualScore + topic.retentionScore + topic.sourceQualityScore + topic.factualConfidence) / 6)}/100</span></div>
      <h2>{topic.title}</h2><p style={{ color: "#a1a1aa" }}>{topic.summary}</p>
      <p><strong>Trend:</strong> {topic.trendScore} ({scoreLabel(topic.trendScore)}) · <strong>Curiosity:</strong> {topic.curiosityScore} · <strong>Retention:</strong> {topic.retentionScore}</p>
      <p><strong>Visual:</strong> {topic.visualScore} · <strong>Source quality:</strong> {topic.sourceQualityScore} · <strong>Confidence:</strong> {topic.factualConfidence}</p>
      <p><strong>Why this topic?</strong> {topic.angle}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button type="button" onClick={() => copy(`${topic.id}-title`, topic.title)}>{copied === `${topic.id}-title` ? "✓ Copied" : "Copy Topic"}</button><button type="button" onClick={() => copy(`${topic.id}-angle`, topic.angle)}>{copied === `${topic.id}-angle` ? "✓ Copied" : "Copy Angle"}</button>{topic.sources.map(source => <button key={source} type="button" onClick={() => copy(`${topic.id}-${source}`, source)}>{copied === `${topic.id}-${source}` ? "✓ Copied" : "Copy Source"}</button>)}<button type="button" onClick={() => selectTopic(topic)}>{selected === topic.id ? "✓ Selected" : "Use This Topic"}</button></div>
      {selected === topic.id && <p><strong>Locked in.</strong> This topic is ready for Story Brain.</p>}
      {topic.sources.length > 0 && <div style={{ marginTop: 14 }}><strong>Sources</strong><ul>{topic.sources.map(source => <li key={source}><a href={source} target="_blank" rel="noreferrer">{source}</a></li>)}</ul></div>}
    </article>)}
  </section>
}
