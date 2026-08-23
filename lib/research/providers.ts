import { searchHistoryWeb, type WebSearchResult } from "./web-search"

export interface ResearchProvider {
  search(query: string): Promise<WebSearchResult[]>
}

class WebResearchProvider implements ResearchProvider {
  search(query: string) {
    return searchHistoryWeb(query)
  }
}

export const researchProvider: ResearchProvider = new WebResearchProvider()
