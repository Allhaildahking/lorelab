export type WebSearchResult = {
  title: string
  url: string
  snippet: string
}

export async function searchHistoryWeb(query: string): Promise<WebSearchResult[]> {
  const endpoint = process.env.SEARCH_API_URL
  const apiKey = process.env.SEARCH_API_KEY

  if (!endpoint || !apiKey) {
    throw new Error("Search provider is not configured")
  }

  const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Search provider returned ${response.status}`)
  }

  const data = (await response.json()) as { results?: WebSearchResult[] }
  return data.results ?? []
}
