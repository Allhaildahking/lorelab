"use client"

import { useState } from "react"
import FormatPicker from "./FormatPicker"
import TopicResults from "./TopicResults"
import StoryBrain from "./StoryBrain"
import UsedTopics from "./UsedTopics"
import { filterUsedTopics, getUsedTopics } from "@/lib/research/topic-memory"
import type { TopicCandidate } from "@/lib/research/types"

type Status = "idle" | "loading" | "success" | "error"

export default function ContentMode() {
  const [started, setStarted] = useState(false)
  const [format, setFormat] = useState<"short" | "long" | null>(null)
  const [topics, setTopics] = useState<TopicCandidate[]>([])
  const [selectedTopic, setSelectedTopic] = useState<TopicCandidate | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  async function research(selectedFormat: "short" | "long") {
    setFormat(selectedFormat); setSelectedTopic(null); setStatus("loading"); setError("")
    try {
      const response = await fetch("/api/research", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ format: selectedFormat, niche: "history" }) })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Unable to research topics")
      const freshTopics = filterUsedTopics(data.candidates ?? [], getUsedTopics())
      setTopics(freshTopics); setStatus("success")
    } catch (caught) { setStatus("error"); setError(caught instanceof Error ? caught.message : "Something went wrong") }
  }

  if (!started) return <><button type="button" onClick={() => setStarted(true)}>LET&apos;S COOK 🔥</button><UsedTopics /></>
  if (!format) return <><FormatPicker onSelect={research} /><UsedTopics /></>
  if (selectedTopic) return <StoryBrain topic={selectedTopic} format={format} onBack={() => setSelectedTopic(null)} />
  return <><TopicResults topics={topics} loading={status === "loading"} error={status === "error" ? `Couldn't research topics. ${error}` : null} onRetry={() => { setFormat(null); setStatus("idle"); setTopics([]); setSelectedTopic(null) }} onSelect={setSelectedTopic} />{status === "success" && !topics.length && <p>No fresh topics found. Try again and we&apos;ll hunt for different angles.</p>}<UsedTopics /></>
}
