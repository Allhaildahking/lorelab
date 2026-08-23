import { searchHistoryWeb, type WebSearchResult } from "./web-search"
import { buildHistoryQueries } from "./query-builder"
import { normalizeSearchResults } from "./normalize"
import type { ScoredSearchResult } from "./trend-score"
import type { ContentFormat } from "./types"

export interface ResearchProvider {
  search(query: string): Promise<WebSearchResult[]>
}

export const researchProvider: ResearchProvider = {
  search: searchHistoryWeb,
}

export async function researchHistory(format: ContentFormat): Promise<ScoredSearchResult[]> {
  const queries = buildHistoryQueries(format)
  const batches = await Promise.all(queries.map((query) => researchProvider.search(query)))
  return normalizeSearchResults(batches.flat())
}
