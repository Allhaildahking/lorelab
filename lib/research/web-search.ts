export type WebSearchResult = {
  title: string
  url: string
  snippet: string
  publishedAt?: string
}

export async function searchHistoryWeb(query: string): Promise<WebSearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) throw new Error("Tavily is not configured")

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      max_results: 10,
      include_answer: false,
      include_raw_content: false,
      topic: "news",
    }),
    cache: "no-store",
  })

  if (!response.ok) throw new Error(`Tavily returned ${response.status}`)

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
