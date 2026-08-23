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
  const freshnessScore = sourceCount
    ? Math.round(results.reduce((sum, result) => sum + freshness(result), 0) / sourceCount)
    : 0
  const sourceVolumeScore = Math.min(100, sourceCount * 10)
  const trendScore = Math.round(
    qualityScore * 0.35 + freshnessScore * 0.45 + sourceVolumeScore * 0.2,
  )

  return { sourceCount, qualityScore, freshnessScore, trendScore }
}

function freshness(result: WebSearchResult): number {
  if (!result.publishedAt) return 50
  const published = Date.parse(result.publishedAt)
  if (Number.isNaN(published)) return 50
  const ageDays = Math.max(0, (Date.now() - published) / 86_400_000)
  if (ageDays <= 1) return 100
  if (ageDays <= 7) return 95
  if (ageDays <= 30) return 85
  if (ageDays <= 90) return 70
  if (ageDays <= 365) return 55
  return 40
}
