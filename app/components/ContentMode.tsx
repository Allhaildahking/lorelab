"use client"

import { useState } from "react"
import FormatPicker from "./FormatPicker"

export default function ContentMode() {
  const [started, setStarted] = useState(false)

  if (started) return <FormatPicker />

  return (
    <button type="button" onClick={() => setStarted(true)}>
      LET&apos;S COOK 🔥
    </button>
  )
}
