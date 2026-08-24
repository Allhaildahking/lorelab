import type { ScoredSearchResult } from "./trend-score"

export function selectBestTopic(topics: ScoredSearchResult[]): ScoredSearchResult | null {
  if (!topics.length) return null

  return [...topics].sort((a, b) => b.trendScore - a.trendScore)[0]
}
