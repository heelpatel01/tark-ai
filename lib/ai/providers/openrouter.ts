import type { ProviderAdapter } from "../types";
import { openAiCompatibleComplete } from "./openaiCompatible";

// ─────────────────────────────────────────────────────────────────────────────
// OpenRouter — default provider. One key unlocks many models (including free
// tiers), which is why the consensus panel ships on it. Swapping to paid
// models later is a models.ts edit, not a code change here.
// ─────────────────────────────────────────────────────────────────────────────

export const openRouterProvider: ProviderAdapter = {
  id: "openrouter",

  isConfigured() {
    const key = process.env.OPENROUTER_API_KEY;
    return Boolean(key && !key.startsWith("your_"));
  },

  async complete(req) {
    return openAiCompatibleComplete(
      "https://openrouter.ai/api/v1",
      process.env.OPENROUTER_API_KEY!,
      req,
      {
        // Optional attribution headers recommended by OpenRouter.
        "HTTP-Referer": "https://tark-ai.online",
        "X-Title": "Tark AI - Self-Consistency Engine",
      }
    );
  },
};
