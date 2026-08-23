import type { WebSearchResult } from "./web-search"
import { scoreSearchResult, type ScoredSearchResult } from "./trend-score"

export function normalizeSearchResults(results: WebSearchResult[]): ScoredSearchResult[] {
  const seen = new Set<string>()
  const unique = results.filter((result) => {
    try {
      const key = new URL(result.url).hostname + new URL(result.url).pathname
      if (seen.has(key)) return false
      seen.add(key)
      return true
    } catch {
      return false
    }
  })

  return unique.map(scoreSearchResult).sort((a, b) => b.trendScore - a.trendScore)
}
