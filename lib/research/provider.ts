import { searchHistoryWeb, type WebSearchResult } from "./web-search"

export interface ResearchProvider {
  search(query: string): Promise<WebSearchResult[]>
}

export const researchProvider: ResearchProvider = {
  search: searchHistoryWeb,
}
