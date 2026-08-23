"use client"

import { useState } from "react"
import FormatPicker from "./FormatPicker"
import TopicResults from "./TopicResults"
import type { TopicCandidate } from "@/lib/research/types"

export default function ContentMode() {
  const [started, setStarted] = useState(false)
  const [format, setFormat] = useState<"short" | "long" | null>(null)
  const [topics, setTopics] = useState<TopicCandidate[]>([])
  const [loading, setLoading] = useState(false)

  async function research(selectedFormat: "short" | "long") {
    setFormat(selectedFormat)
    setLoading(true)
    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: selectedFormat, niche: "history" }),
      })
      const data = await response.json()
      setTopics(data.candidates ?? [])
    } finally {
      setLoading(false)
    }
  }

  if (!started) {
    return <button type="button" onClick={() => setStarted(true)}>LET&apos;S COOK 🔥</button>
  }

  if (!format) {
    return <FormatPicker onSelect={research} />
  }

  return <TopicResults topics={topics} loading={loading} />
}
