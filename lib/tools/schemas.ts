import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Tool input/output schemas.
//
// Input schemas are shared by the Gemini function-calling registry and by the
// executor so validation lives in exactly one place.
// ─────────────────────────────────────────────────────────────────────────────

export const searchWebInputSchema = z.object({
  query: z
    .string()
    .min(2)
    .describe(
      "A focused web search query for fresh, real-time or post-training information " +
        "(news, prices, releases, scores, current events, docs that change often)."
    ),
});

export type SearchWebInput = z.infer<typeof searchWebInputSchema>;

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
}

/**
 * Normalized result returned by every search provider. `ok: false` never throws
 * — it is a graceful, model-consumable signal so generation can continue using
 * the model's own knowledge.
 */
export interface SearchToolResult {
  ok: boolean;
  query: string;
  /** Short answer / synthesized summary when the provider offers one. */
  summary: string;
  results: SearchResultItem[];
  /** Present only when ok === false. */
  error?: string;
}
