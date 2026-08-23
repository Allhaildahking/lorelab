import { buildHistoryQueries } from "./query-builder"
import { searchHistoryWeb, type WebSearchResult } from "./web-search"
import type { ContentFormat, TopicCandidate } from "./types"
import { normalizeSearchResults } from "./normalize"

function toCandidate(result: ReturnType<typeof normalizeSearchResults>[number], index: number): TopicCandidate {
  return {
    id: `web-${index}-${encodeURIComponent(result.title).slice(0, 32)}`,
    title: result.title,
    angle: result.snippet,
    summary: result.snippet,
    trendScore: result.trendScore,
    curiosityScore: result.relevanceScore,
    visualScore: Math.min(100, Math.round((result.qualityScore + result.relevanceScore) / 2)),
    sources: [result.url],
  }
}

export async function discoverLiveHistoryTopics(format: ContentFormat): Promise<TopicCandidate[]> {
  const queries = buildHistoryQueries(format)
  const results = (await Promise.all(queries.map(searchHistoryWeb))).flat() as WebSearchResult[]
  return normalizeSearchResults(results).slice(0, 20).map(toCandidate)
}
