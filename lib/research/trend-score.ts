import type { WebSearchResult } from "./web-search"
import { sourceQuality } from "./source-quality"

export type ScoredSearchResult = WebSearchResult & {
  qualityScore: number
  freshnessScore: number
  relevanceScore: number
  trendScore: number
}

export function scoreSearchResult(result: WebSearchResult): ScoredSearchResult {
  const qualityScore = sourceQuality(result)
  const relevanceScore = scoreRelevance(result)
  const freshnessScore = getFreshnessScore(result)

  return {
    ...result,
    qualityScore,
    relevanceScore,
    freshnessScore,
    trendScore: Math.round(
      qualityScore * 0.35 + relevanceScore * 0.35 + freshnessScore * 0.3,
    ),
  }
}

function scoreRelevance(result: WebSearchResult): number {
  const text = `${result.title} ${result.snippet}`.toLowerCase()
  const signals = ["history", "historical", "ancient", "war", "emperor", "forgotten", "mystery"]
  const matches = signals.filter((signal) => text.includes(signal)).length
  return Math.min(100, 45 + matches * 8)
}

function getFreshnessScore(result: WebSearchResult): number {
  const text = `${result.title} ${result.snippet}`
  const year = text.match(/\b(20\d{2})\b/)
  if (!year) return 50

  const age = new Date().getFullYear() - Number(year[1])
  if (age <= 0) return 100
  if (age <= 1) return 90
  if (age <= 3) return 75
  if (age <= 5) return 60
  return 45
}
