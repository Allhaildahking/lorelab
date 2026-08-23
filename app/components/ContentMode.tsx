"use client"

import { useState } from "react"
import FormatPicker from "./FormatPicker"
import TopicResults from "./TopicResults"
import type { TopicCandidate } from "@/lib/research/types"

type Status = "idle" | "loading" | "success" | "error"

export default function ContentMode() {
  const [started, setStarted] = useState(false)
  const [format, setFormat] = useState<"short" | "long" | null>(null)
  const [topics, setTopics] = useState<TopicCandidate[]>([])
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  async function research(selectedFormat: "short" | "long") {
    setFormat(selectedFormat)
    setStatus("loading")
    setError("")

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: selectedFormat, niche: "history" }),
      })

      if (!response.ok) throw new Error("Research request failed")
      const data = await response.json()
      setTopics(data.candidates ?? [])
      setStatus("success")
    } catch (caught) {
      setStatus("error")
      setError(caught instanceof Error ? caught.message : "Something went wrong")
    }
  }

  if (!started) return <button type="button" onClick={() => setStarted(true)}>LET&apos;S COOK 🔥</button>
  if (!format) return <FormatPicker onSelect={research} />
  if (status === "error") {
    return (
      <section>
        <p role="alert">Couldn&apos;t research topics. {error}</p>
        <button type="button" onClick={() => setFormat(null)}>Try Again</button>
      </section>
    )
  }

  return <TopicResults topics={topics} loading={status === "loading"} />
}
