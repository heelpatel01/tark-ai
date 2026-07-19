import { tool, type ToolSet } from "ai";
import { searchWebInputSchema } from "./schemas";
import { executeSearchWeb, type ExecutedTool } from "./executor";

// ─────────────────────────────────────────────────────────────────────────────
// Tool registry.
//
// Builds the Gemini function-calling `tools` object consumed by `streamText`.
// Adding a new tool = add one entry here; the API route needs no changes.
//
// The model decides *whether* to call a tool. The description is the contract
// that teaches Gemini when a call is worthwhile — so it stays idle for things it
// already knows and only reaches for the web when information must be live.
// ─────────────────────────────────────────────────────────────────────────────

export const TOOL_NAMES = {
  searchWeb: "searchWeb",
} as const;

export function buildAiTools(): ToolSet {
  return {
    [TOOL_NAMES.searchWeb]: tool({
      description:
        "Search the live web for fresh, real-time or post-training-cutoff information. " +
        "Call this ONLY when the answer depends on current data the model cannot already " +
        "know reliably: today's news, latest releases/versions, live prices, sports scores, " +
        "weather, or recent events. Do NOT call it for general knowledge, explanations, " +
        "opinions, coding help or anything stable that you already know.",
      inputSchema: searchWebInputSchema,
      execute: async ({ query }): Promise<ExecutedTool> => executeSearchWeb(query),
    }),
  };
}
