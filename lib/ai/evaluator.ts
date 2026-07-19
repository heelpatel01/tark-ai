import type { EvaluationRequest, EvaluationResult, ModelConfig } from "./types";
import { EVALUATOR_MODEL, EVALUATOR_FALLBACK_MODEL } from "./models";
import { getProvider } from "./orchestrator";
import { isTransientProviderError } from "./errors";

// ─────────────────────────────────────────────────────────────────────────────
// Evaluator — runs ONLY after every model response has settled, receives the
// successful responses, and synthesizes one polished final answer.
// ─────────────────────────────────────────────────────────────────────────────

const EVALUATOR_SYSTEM_PROMPT = `You are an expert AI evaluator.

You are given responses from multiple language models.

Your task is NOT to copy any one response.

Instead:

• Compare factual accuracy
• Compare completeness
• Compare reasoning
• Compare clarity

If models disagree, determine which reasoning is strongest.

Merge only the strongest ideas.

Remove duplicated information.

Correct factual mistakes.

Produce one polished final answer.

Never mention model names.

Never mention which answer was selected.

Never mention that multiple responses exist or that you are synthesizing.

Write one seamless response, in Markdown, that directly answers the user's question.`;

function buildEvaluatorPrompt({ question, responses }: EvaluationRequest): string {
  const numbered = responses
    .map((r, i) => `### Response ${i + 1}\n\n${r.text}`)
    .join("\n\n---\n\n");

  return `## Original Question\n\n${question}\n\n## Candidate Responses\n\n${numbered}\n\n## Task\n\nProduce the single best possible answer to the original question, following your instructions.`;
}

const EVALUATOR_TIMEOUT_MS = 60_000;
const RETRY_DELAY_MS = 2_500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** One evaluator attempt against a specific model config, with its own timeout. */
async function runEvaluatorAttempt(
  config: ModelConfig,
  prompt: string
): Promise<string> {
  const provider = getProvider(config.provider);
  if (!provider.isConfigured()) {
    throw new Error(`Evaluator provider (${config.provider}) is not configured`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), EVALUATOR_TIMEOUT_MS);
  try {
    return await provider.complete({
      modelId: config.modelId,
      systemPrompt: EVALUATOR_SYSTEM_PROMPT,
      prompt,
      temperature: 0.4,
      maxTokens: 3072,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Synthesize the final answer from successful responses.
 *
 * Resilience: the primary (Gemini, direct Google API) is retried once after a
 * short delay when the failure is transient (rate limit / capacity), then the
 * configured fallback evaluator takes over. Throws only when every path fails —
 * the API route catches and degrades gracefully.
 */
export async function synthesizeFinalAnswer(
  request: EvaluationRequest
): Promise<EvaluationResult> {
  const started = Date.now();
  const prompt = buildEvaluatorPrompt(request);

  try {
    // Attempt 1 — primary evaluator.
    const finalAnswer = await runEvaluatorAttempt(EVALUATOR_MODEL, prompt);
    return { finalAnswer, latencyMs: Date.now() - started };
  } catch (primaryError) {
    // Attempt 2 — retry the primary once when the failure is transient.
    if (isTransientProviderError(primaryError)) {
      await sleep(RETRY_DELAY_MS);
      try {
        const finalAnswer = await runEvaluatorAttempt(EVALUATOR_MODEL, prompt);
        return { finalAnswer, latencyMs: Date.now() - started };
      } catch {
        /* fall through to the fallback evaluator */
      }
    }

    // Attempt 3 — fallback evaluator on a different provider.
    const fallback = EVALUATOR_FALLBACK_MODEL;
    if (fallback && getProvider(fallback.provider).isConfigured()) {
      console.warn(
        `Primary evaluator failed (${(primaryError as Error)?.message}); using fallback ${fallback.provider}/${fallback.modelId}`
      );
      const finalAnswer = await runEvaluatorAttempt(fallback, prompt);
      return { finalAnswer, latencyMs: Date.now() - started };
    }

    throw primaryError;
  }
}
