import type { ModelConfig } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Consensus panel configuration — THE single place to swap models/providers.
//
// Ships on OpenRouter free-tier models so one OPENROUTER_API_KEY runs the whole
// panel. Upgrading later is a config edit, e.g.:
//
//   { key: "gpt",    label: "GPT-4o",            provider: "openai",    modelId: "gpt-4o",            accent: "#10A37F" }
//   { key: "claude", label: "Claude Sonnet",     provider: "anthropic", modelId: "claude-sonnet-5",   accent: "#D97757" }
//   { key: "gemini", label: "Gemini 2.5 Pro",    provider: "gemini",    modelId: "gemini-2.5-pro",    accent: "#4285F4" }
//   { key: "grok",   label: "Grok 4",            provider: "openrouter", modelId: "x-ai/grok-4",      accent: "#111111" }
//
// Set the matching env var, edit this array — UI, API and orchestrator adapt
// automatically (cards, statuses and the evaluator all derive from it).
// ─────────────────────────────────────────────────────────────────────────────

export const CONSENSUS_MODELS: ModelConfig[] = [
  {
    key: "gemini-flash",
    label: "Gemini Flash",
    provider: "openrouter",
    modelId: "google/gemini-2.0-flash",
    accent: "#4285F4",
  },
  {
    key: "deepseek",
    label: "DeepSeek Chat",
    provider: "openrouter",
    modelId: "deepseek/deepseek-chat-v3-0324",
    accent: "#6D5DF6",
  },
  {
    key: "qwen",
    label: "Qwen 3",
    provider: "openrouter",
    modelId: "qwen/qwen3-14b",
    accent: "#06B6D4",
  },
];

/**
 * The evaluator that synthesizes the final answer. Defaults to direct Gemini
 * (the project's existing key) so synthesis works out of the box even before
 * an OpenRouter key is added. Swap provider/modelId freely.
 */
export const EVALUATOR_MODEL: ModelConfig = {
  key: "evaluator",
  label: "Evaluator",
  provider: "gemini",
  modelId: "gemini-2.5-flash",
  accent: "#8B5CF6",
};

/** Hard cap on question length accepted by the API. */
export const MAX_QUESTION_LENGTH = 4000;
