import type { WebSearchResult } from "./web-search"

export function dedupeSources(results: WebSearchResult[]): WebSearchResult[] {
  const seen = new Set<string>()
  return results.filter((result) => {
    if (!result.url || seen.has(result.url)) return false
    seen.add(result.url)
    return true
  })
}

export function sourceUrls(results: WebSearchResult[]): string[] {
  return dedupeSources(results).map((result) => result.url)
}
