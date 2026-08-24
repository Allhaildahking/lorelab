"use client"

import { useState } from "react"
import type { ContentFormat, TopicCandidate } from "@/lib/research/types"

type Props = { topic: TopicCandidate; format: ContentFormat; onBack: () => void }

export default function StoryBrain({ topic, format, onBack }: Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  async function copy(id: string, text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1200)
  }

  const prompt = `Story Brain is ready to generate a ${format} video about: ${topic.title}`

  return (
    <section style={{ marginTop: 28 }}>
      <button type="button" onClick={onBack}>← Back to topics</button>
      <h2>Story Brain 🧠</h2>
      <p>{topic.title}</p>
      <button type="button" onClick={() => setStarted(true)}>
        {started ? "✓ Brief Ready" : "Build My Story"}
      </button>
      {started && (
        <article style={{ marginTop: 20, border: "1px solid #27272a", borderRadius: 16, padding: 20 }}>
          <h3>Generation brief</h3>
          <p>{prompt}</p>
          <button type="button" onClick={() => copy("brief", prompt)}>
            {copied === "brief" ? "✓ Copied" : "Copy Brief"}
          </button>
          <p style={{ color: "#a1a1aa" }}>AI generation is the next connection. Your research pipeline is ready.</p>
        </article>
      )}
    </section>
  )
}
