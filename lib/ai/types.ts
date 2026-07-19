// ─────────────────────────────────────────────────────────────────────────────
// Self-Consistency Answer Engine — shared domain types.
//
// Pure types only (safe to import from both server and client code).
// ─────────────────────────────────────────────────────────────────────────────

export type ProviderId = "openrouter" | "gemini" | "openai" | "anthropic";

/** A single completion call, provider-agnostic. */
export interface CompletionRequest {
  modelId: string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

/**
 * A provider adapter. Implementations live in lib/ai/providers/* and are
 * registered in the orchestrator. Adding a new provider = one adapter file
 * + one registry entry; models.ts then references it by id.
 */
export interface ProviderAdapter {
  id: ProviderId;
  /** True when the required API key env var is present. */
  isConfigured(): boolean;
  /** Resolve to the completion text. Throw on failure — the orchestrator catches. */
  complete(req: CompletionRequest): Promise<string>;
}

/**
 * A configured model slot in the consensus panel. Swapping free models for
 * paid ones (or a different provider) only means editing this config —
 * the orchestrator, API route and UI are untouched.
 */
export interface ModelConfig {
  /** Stable key used in stream events and UI state. */
  key: string;
  /** Display name shown on the card. */
  label: string;
  provider: ProviderId;
  modelId: string;
  /** Card accent color (hex). */
  accent: string;
}

export type ModelResponseStatus = "completed" | "failed";

export interface ModelResponse {
  key: string;
  label: string;
  status: ModelResponseStatus;
  /** Present when status === "completed". */
  text?: string;
  /** Present when status === "failed". */
  error?: string;
  latencyMs: number;
}

export interface EvaluationRequest {
  question: string;
  /** Successful responses only — failed models are excluded upstream. */
  responses: ModelResponse[];
}

export interface EvaluationResult {
  finalAnswer: string;
  latencyMs: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// NDJSON wire protocol for /api/self-consistency.
//
// One POST streams progressive events so the UI can flip each model card from
// Loading → Completed/Failed as it settles, then show the evaluator phase.
// ─────────────────────────────────────────────────────────────────────────────

export type ConsensusEvent =
  | { type: "model"; response: ModelResponse }
  | { type: "phase"; phase: "synthesizing" }
  | { type: "final"; answer: string; latencyMs: number }
  | { type: "error"; message: string };
