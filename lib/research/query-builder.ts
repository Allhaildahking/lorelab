import type { ContentFormat } from "./types"

export function buildHistoryQueries(format: ContentFormat): string[] {
  const formatHint = format === "short" ? "viral short video history" : "history documentary storytelling"

  return [
    `weird shocking historical events ${formatHint}`,
    `historical mysteries recent interest ${formatHint}`,
    `forgotten history stories surprising facts ${formatHint}`,
  ]
}
