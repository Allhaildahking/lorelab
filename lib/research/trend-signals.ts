import type { WebSearchResult } from "./web-search"
import { sourceQuality } from "./source-quality"

export type TrendSignal = {
  sourceCount: number
  qualityScore: number
  freshnessScore: number
  trendScore: number
}

export function calculateTrendSignals(results: WebSearchResult[]): TrendSignal {
  const sourceCount = results.length
  const qualityScore = sourceCount
    ? Math.round(results.reduce((sum, result) => sum + sourceQuality(result), 0) / sourceCount)
    : 0

  // Until the search provider exposes publication timestamps, keep freshness neutral.
  const freshnessScore = sourceCount ? 50 : 0
  const trendScore = Math.round(qualityScore * 0.65 + freshnessScore * 0.35)

  return { sourceCount, qualityScore, freshnessScore, trendScore }
}
