import type { ModelConfig } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Consensus panel configuration — THE single place to swap models/providers.
//
// Ships on OpenRouter free-tier models so one OPENROUTER_API_KEY runs the whole
// panel. Upgrading later is a config edit, e.g.:
//
//   { key: "gpt",    label: "GPT-4o",            provider: "openai",    modelId: "gpt-4o",            accent: "#10A37F" }
//   { key: "claude", label: "Claude Sonnet",     provider: "anthropic", modelId: "claude-sonnet-5",   accent: "#D97757" }
//   { key: "gemini", label: "Gemini Pro",        provider: "gemini",    modelId: "gemini-pro-latest", accent: "#4285F4" }
//   { key: "grok",   label: "Grok 4",            provider: "openrouter", modelId: "x-ai/grok-4",      accent: "#111111" }
//
// Set the matching env var, edit this array — UI, API and orchestrator adapt
// automatically (cards, statuses and the evaluator all derive from it).
// ─────────────────────────────────────────────────────────────────────────────

// ── Gemini model ids (Google Gemini Developer API — direct, NOT OpenRouter) ──
// Single source of truth for every Gemini call in the app. Verified against
// Google's ListModels endpoint. If Google deprecates a model again, update
// these three constants only. `gemini-flash-latest` is a rolling alias that
// always points at the newest stable Flash if you prefer auto-upgrades over
// pinning. Current list: https://ai.google.dev/gemini-api/docs/models
export const GEMINI_CHAT_MODEL_ID = "gemini-3.5-flash"; // persona chat (/api/gemini)
export const GEMINI_CONSENSUS_MODEL_ID = "gemini-3.5-flash"; // consensus panel slot
export const GEMINI_EVALUATOR_MODEL_ID = "gemini-3.5-flash"; // final-answer evaluator

export const CONSENSUS_MODELS: ModelConfig[] = [
  {
    key: "gemini",
    label: "Gemini Flash",
    provider: "gemini",
    modelId: GEMINI_CONSENSUS_MODEL_ID,
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
  modelId: GEMINI_EVALUATOR_MODEL_ID,
  accent: "#8B5CF6",
};

/**
 * Backup evaluator used only when the primary evaluator is rate-limited or
 * over capacity after a retry. Keeps synthesis alive during Gemini load
 * spikes. Set to null to disable the fallback entirely.
 */
export const EVALUATOR_FALLBACK_MODEL: ModelConfig | null = {
  key: "evaluator-fallback",
  label: "Evaluator (Fallback)",
  provider: "openrouter",
  modelId: "deepseek/deepseek-chat-v3-0324",
  accent: "#8B5CF6",
};

/** Hard cap on question length accepted by the API. */
export const MAX_QUESTION_LENGTH = 4000;
