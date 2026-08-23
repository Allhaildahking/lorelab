import type { WebSearchResult } from "./web-search"

const trustedDomains = ["britannica.com", "smithsonianmag.com", "history.com", "loc.gov", "archives.gov", "bl.uk", "jstor.org", "bbc.com"]

export function sourceQuality(result: WebSearchResult): number {
  try {
    const host = new URL(result.url).hostname.replace(/^www\./, "")
    if (trustedDomains.some((domain) => host === domain || host.endsWith(`.${domain}`))) return 95
    return 60
  } catch {
    return 20
  }
}
