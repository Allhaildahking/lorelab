import { buildHistoryQueries } from "./query-builder"
import { searchHistoryWeb, type WebSearchResult } from "./web-search"
import type { ContentFormat, TopicCandidate } from "./types"
import { rankTopics } from "./scoring"

function toCandidate(result: WebSearchResult, index: number): TopicCandidate {
  return {
    id: `web-${index}-${encodeURIComponent(result.title).slice(0, 32)}`,
    title: result.title,
    angle: result.snippet,
    summary: result.snippet,
    trendScore: 60,
    curiosityScore: 70,
    visualScore: 70,
    sources: [result.url],
  }
}

export async function discoverLiveHistoryTopics(format: ContentFormat): Promise<TopicCandidate[]> {
  const queries = buildHistoryQueries(format)
  const results = (await Promise.all(queries.map(searchHistoryWeb))).flat()

  const unique = new Map<string, WebSearchResult>()
  for (const result of results) {
    if (result.title && result.url && !unique.has(result.url)) unique.set(result.url, result)
  }

  return rankTopics([...unique.values()].slice(0, 20).map(toCandidate))
}
