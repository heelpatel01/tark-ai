import type { SearchResultItem, SearchToolResult } from "./schemas";

// ─────────────────────────────────────────────────────────────────────────────
// searchWeb — reusable, provider-agnostic web search.
//
// The provider is intentionally replaceable: swap `activeProvider` (or point it
// at a different implementation of `SearchProvider`) to change vendors without
// touching the registry, executor or API route. Tavily is the default.
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchProvider {
  readonly name: string;
  /** Must never throw — always resolve to a normalized SearchToolResult. */
  search(query: string): Promise<SearchToolResult>;
}

const MAX_RESULTS = 5;
const REQUEST_TIMEOUT_MS = 8000;

function emptyError(query: string, error: string): SearchToolResult {
  return { ok: false, query, summary: "", results: [], error };
}

/** Tavily (https://tavily.com) — good relevance + a synthesized `answer`. */
class TavilyProvider implements SearchProvider {
  readonly name = "tavily";

  async search(query: string): Promise<SearchToolResult> {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return emptyError(query, "TAVILY_API_KEY is not configured");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: "basic",
          include_answer: true,
          max_results: MAX_RESULTS,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        return emptyError(query, `Tavily responded with HTTP ${res.status}`);
      }

      const data = (await res.json()) as {
        answer?: string;
        results?: { title?: string; url?: string; content?: string }[];
      };

      const results: SearchResultItem[] = (data.results ?? [])
        .slice(0, MAX_RESULTS)
        .map((r) => ({
          title: r.title?.trim() || "Untitled",
          url: r.url ?? "",
          snippet: (r.content ?? "").trim().slice(0, 500),
        }));

      const summary =
        data.answer?.trim() ||
        results.map((r) => `• ${r.title}: ${r.snippet}`).join("\n") ||
        "No results found.";

      return { ok: results.length > 0 || Boolean(data.answer), query, summary, results };
    } catch (err) {
      const message =
        err instanceof Error && err.name === "AbortError"
          ? "Search request timed out"
          : err instanceof Error
            ? err.message
            : "Unknown search error";
      return emptyError(query, message);
    } finally {
      clearTimeout(timeout);
    }
  }
}

// The single active provider. Replace this line to swap vendors.
const activeProvider: SearchProvider = new TavilyProvider();

export function getSearchProvider(): SearchProvider {
  return activeProvider;
}

/**
 * Execute a web search. Always resolves (never throws) so the caller can decide
 * how to degrade gracefully.
 */
export async function searchWeb(query: string): Promise<SearchToolResult> {
  const trimmed = query?.trim();
  if (!trimmed) return emptyError(query ?? "", "Empty search query");
  return activeProvider.search(trimmed);
}
