import { buildHistoryQueries } from "./query-builder"
import { searchHistoryWeb, type WebSearchResult } from "./web-search"
import type { ContentFormat, TopicCandidate } from "./types"
import { normalizeSearchResults } from "./normalize"
import { retentionScore, rankTopics } from "./scoring"

function toCandidate(result: ReturnType<typeof normalizeSearchResults>[number], index: number): TopicCandidate {
  const base = {
    id: `web-${index}-${encodeURIComponent(result.title).slice(0, 32)}`,
    title: result.title,
    angle: result.snippet,
    summary: result.snippet,
    trendScore: result.trendScore,
    curiosityScore: result.relevanceScore,
    visualScore: Math.min(100, Math.round((result.qualityScore + result.relevanceScore) / 2)),
    retentionScore: 0,
    sourceQualityScore: result.qualityScore,
    factualConfidence: result.qualityScore,
    sources: [result.url],
  }
  return { ...base, retentionScore: retentionScore(base) }
}

export async function discoverLiveHistoryTopics(format: ContentFormat): Promise<TopicCandidate[]> {
  const queries = buildHistoryQueries(format)
  const results = (await Promise.all(queries.map(searchHistoryWeb))).flat() as WebSearchResult[]
  return rankTopics(normalizeSearchResults(results).slice(0, 20).map(toCandidate))
}
