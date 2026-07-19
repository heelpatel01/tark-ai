import type { EvaluationRequest, EvaluationResult } from "./types";
import { EVALUATOR_MODEL } from "./models";
import { getProvider } from "./orchestrator";

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

/**
 * Synthesize the final answer from successful responses. Throws on failure —
 * the API route catches and degrades gracefully.
 */
export async function synthesizeFinalAnswer(
  request: EvaluationRequest
): Promise<EvaluationResult> {
  const started = Date.now();
  const provider = getProvider(EVALUATOR_MODEL.provider);

  if (!provider.isConfigured()) {
    throw new Error(`Evaluator provider (${EVALUATOR_MODEL.provider}) is not configured`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), EVALUATOR_TIMEOUT_MS);

  try {
    const finalAnswer = await provider.complete({
      modelId: EVALUATOR_MODEL.modelId,
      systemPrompt: EVALUATOR_SYSTEM_PROMPT,
      prompt: buildEvaluatorPrompt(request),
      temperature: 0.4,
      maxTokens: 3072,
      signal: controller.signal,
    });
    return { finalAnswer, latencyMs: Date.now() - started };
  } finally {
    clearTimeout(timeout);
  }
}
