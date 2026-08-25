"use client"

import { useEffect, useState } from "react"
import { getUsedTopics, type UsedTopic } from "@/lib/research/topic-memory"

export default function UsedTopics() {
  const [topics, setTopics] = useState<UsedTopic[]>([])
  useEffect(() => setTopics(getUsedTopics()), [])
  if (!topics.length) return null
  return <section style={{ marginTop: 32, textAlign: "left" }}><h2>Used Topics 📚</h2><p style={{ opacity: 0.7 }}>LORELAB keeps these out of future recommendations.</p><div style={{ display: "grid", gap: 10 }}>{topics.map(topic => <article key={`${topic.id}-${topic.usedAt}`} style={{ padding: 14, border: "1px solid #27272a", borderRadius: 12 }}><strong>{topic.title}</strong><small style={{ display: "block", marginTop: 6, opacity: 0.65 }}>{new Date(topic.usedAt).toLocaleDateString()}</small></article>)}</div></section>
}
