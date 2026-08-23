import type { ContentFormat } from "./types"

export function buildHistoryQueries(format: ContentFormat): string[] {
  const formatHint = format === "short" ? "viral history short video" : "historical documentary story"

  return [
    `history trending stories ${formatHint}`,
    `weird shocking historical events ${formatHint}`,
    `forgotten history stories people are discussing ${formatHint}`,
    `recent history discoveries archaeology ${formatHint}`,
    `historical events anniversary this month ${formatHint}`,
  ]
}
