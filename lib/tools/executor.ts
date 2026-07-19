import { searchWeb } from "./search";
import type { SearchToolResult } from "./schemas";

// ─────────────────────────────────────────────────────────────────────────────
// Tool executor.
//
// Runs a tool by name and normalizes the result into:
//   • `modelText` — the string handed back to Gemini so it can keep reasoning.
//   • `displaySummary` — a short human-readable line persisted as the tool
//     message `result` and shown in the chat.
//
// Centralizing this keeps the registry's `execute` functions tiny and makes the
// same behavior reusable outside of the AI SDK if ever needed.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExecutedTool {
  ok: boolean;
  /** Rich context returned to the model to continue the answer. */
  modelText: string;
  /** Compact summary persisted + shown in the UI. */
  displaySummary: string;
}

function formatForModel(result: SearchToolResult): string {
  if (!result.ok) {
    return `Web search for "${result.query}" failed: ${result.error ?? "unknown error"}. Answer using your own knowledge and note that live data was unavailable.`;
  }

  const sources = result.results
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.url}\n${r.snippet}`)
    .join("\n\n");

  return [
    `Web search results for "${result.query}":`,
    result.summary && `Summary: ${result.summary}`,
    sources && `Sources:\n${sources}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function formatForDisplay(result: SearchToolResult): string {
  if (!result.ok) {
    return "Unable to retrieve live information.";
  }
  const count = result.results.length;
  const base = result.summary?.slice(0, 400) || "Search complete.";
  return count > 0 ? `${base}\n\nSources: ${count}` : base;
}

export async function executeSearchWeb(query: string): Promise<ExecutedTool> {
  const result = await searchWeb(query);
  return {
    ok: result.ok,
    modelText: formatForModel(result),
    displaySummary: formatForDisplay(result),
  };
}
