import type { ProviderAdapter } from "../types";
import { openAiCompatibleComplete } from "./openaiCompatible";

// ─────────────────────────────────────────────────────────────────────────────
// OpenAI — direct provider. Becomes usable the moment OPENAI_API_KEY is set;
// point a models.ts entry at { provider: "openai", modelId: "gpt-4o-mini" }.
// ─────────────────────────────────────────────────────────────────────────────

export const openAiProvider: ProviderAdapter = {
  id: "openai",

  isConfigured() {
    return Boolean(process.env.OPENAI_API_KEY);
  },

  async complete(req) {
    return openAiCompatibleComplete(
      "https://api.openai.com/v1",
      process.env.OPENAI_API_KEY!,
      req
    );
  },
};
