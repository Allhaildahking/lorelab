export type WebSearchResult = {
  title: string
  url: string
  snippet: string
  publishedAt?: string
}

export async function searchHistoryWeb(query: string): Promise<WebSearchResult[]> {
  const endpoint = process.env.SEARCH_API_URL
  const apiKey = process.env.SEARCH_API_KEY

  if (!endpoint || !apiKey) throw new Error("Search provider is not configured")

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, search_depth: "basic", max_results: 10 }),
    cache: "no-store",
  })

  if (!response.ok) throw new Error(`Search provider returned ${response.status}`)

  const data = (await response.json()) as {
    results?: Array<{ title?: string; url?: string; content?: string; published_date?: string }>
  }

  return (data.results ?? [])
    .filter((result) => result.title && result.url)
    .map((result) => ({
      title: result.title!,
      url: result.url!,
      snippet: result.content ?? "",
      publishedAt: result.published_date,
    }))
}
