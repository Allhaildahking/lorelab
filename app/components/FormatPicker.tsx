"use client"

import { useState } from "react"

type Format = "short" | "long"

export default function FormatPicker() {
  const [format, setFormat] = useState<Format | null>(null)

  return (
    <section aria-label="Choose video format">
      <p>What are we making?</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button type="button" onClick={() => setFormat("short")} aria-pressed={format === "short"}>
          SHORT ⚡
        </button>
        <button type="button" onClick={() => setFormat("long")} aria-pressed={format === "long"}>
          LONG 🎬
        </button>
      </div>
      {format && <p>Selected: {format === "short" ? "Short-form" : "Long-form"}</p>}
    </section>
  )
}
