"use client"

type Format = "short" | "long"

type Props = {
  onSelect: (format: Format) => void
}

export default function FormatPicker({ onSelect }: Props) {
  return (
    <section aria-label="Choose video format">
      <p>What are we making?</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button type="button" onClick={() => onSelect("short")}>SHORT ⚡</button>
        <button type="button" onClick={() => onSelect("long")}>LONG 🎬</button>
      </div>
    </section>
  )
}
