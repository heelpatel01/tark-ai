import type { ModelConfig, ModelResponse, ProviderAdapter, ProviderId } from "./types";
import { openRouterProvider } from "./providers/openrouter";
import { geminiProvider } from "./providers/gemini";
import { openAiProvider } from "./providers/openai";
import { anthropicProvider } from "./providers/anthropic";

// ─────────────────────────────────────────────────────────────────────────────
// Orchestrator — provider registry + parallel fan-out.
//
// Generic over ModelConfig: every configured model gets the exact same prompt,
// runs concurrently (Promise.all), and settles into a ModelResponse that never
// throws — failures become { status: "failed" } so one dead provider can't
// take down the run. No model ever sees another model's response.
// ─────────────────────────────────────────────────────────────────────────────

const PROVIDERS: Record<ProviderId, ProviderAdapter> = {
  openrouter: openRouterProvider,
  gemini: geminiProvider,
  openai: openAiProvider,
  anthropic: anthropicProvider,
};

export function getProvider(id: ProviderId): ProviderAdapter {
  return PROVIDERS[id];
}

const MODEL_TIMEOUT_MS = 60_000;

/** Run one model; always resolves to a ModelResponse (never throws). */
export async function runModel(
  config: ModelConfig,
  prompt: string
): Promise<ModelResponse> {
  const started = Date.now();
  const base = { key: config.key, label: config.label };

  const provider = getProvider(config.provider);
  if (!provider.isConfigured()) {
    return {
      ...base,
      status: "failed",
      error: `${config.provider} API key not configured`,
      latencyMs: 0,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS);

  try {
    const text = await provider.complete({
      modelId: config.modelId,
      prompt,
      signal: controller.signal,
    });
    return { ...base, status: "completed", text, latencyMs: Date.now() - started };
  } catch (err) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "Timed out"
        : err instanceof Error
          ? err.message
          : "Unknown error";
    return { ...base, status: "failed", error: message, latencyMs: Date.now() - started };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fan the same prompt out to every model in parallel. `onModelSettled` fires
 * as each model finishes (success or failure) so callers can stream
 * progressive updates; the returned array is the complete result set.
 */
export async function runConsensus(
  models: ModelConfig[],
  prompt: string,
  onModelSettled?: (response: ModelResponse) => void
): Promise<ModelResponse[]> {
  return Promise.all(
    models.map(async (config) => {
      const response = await runModel(config, prompt);
      onModelSettled?.(response);
      return response;
    })
  );
}
