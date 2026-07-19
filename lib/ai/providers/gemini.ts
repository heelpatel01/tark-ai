import type { ProviderAdapter } from "../types";
import { TransientProviderError } from "../errors";

// ─────────────────────────────────────────────────────────────────────────────
// Google Gemini — direct provider (REST). Reuses the project's existing
// GEMINI_API_KEYY, also accepting the standard GEMINI_API_KEY name.
// Used as the default evaluator so synthesis works out of the box.
// ─────────────────────────────────────────────────────────────────────────────

function apiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYY;
}

/**
 * Turn Google's raw error payload into a developer-friendly message. Model
 * deprecations/removals surface as an actionable hint instead of an HTTP dump.
 */
function toGeminiError(status: number, body: string, modelId: string): Error {
  let apiMessage = "";
  try {
    apiMessage = (JSON.parse(body) as { error?: { message?: string } }).error?.message ?? "";
  } catch {
    apiMessage = body;
  }

  const lower = apiMessage.toLowerCase();

  // Rate limits / capacity issues clear on their own — mark them retryable so
  // the evaluator can retry or fall back instead of failing the synthesis.
  const isTransient =
    status === 429 ||
    status === 503 ||
    lower.includes("overloaded") ||
    lower.includes("try again later") ||
    lower.includes("resource has been exhausted") ||
    lower.includes("quota");
  if (isTransient) {
    return new TransientProviderError(
      `Gemini is temporarily rate-limited or over capacity (HTTP ${status}). This usually clears within moments.`
    );
  }

  const isModelGone =
    status === 404 ||
    lower.includes("no longer available") ||
    lower.includes("deprecated") ||
    lower.includes("is not found") ||
    lower.includes("not supported");

  if (isModelGone) {
    return new Error(
      `Gemini model "${modelId}" is unavailable or deprecated for this API key. ` +
        `Update the GEMINI_*_MODEL_ID constants in lib/ai/models.ts to a current model ` +
        `(see https://ai.google.dev/gemini-api/docs/models — "gemini-flash-latest" always tracks the newest stable Flash).`
    );
  }

  return new Error(`HTTP ${status}${apiMessage ? `: ${apiMessage.slice(0, 200)}` : ""}`);
}

export const geminiProvider: ProviderAdapter = {
  id: "gemini",

  isConfigured() {
    return Boolean(apiKey());
  },

  async complete(req) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${req.modelId}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey()!,
        },
        body: JSON.stringify({
          ...(req.systemPrompt
            ? { systemInstruction: { parts: [{ text: req.systemPrompt }] } }
            : {}),
          contents: [{ role: "user", parts: [{ text: req.prompt }] }],
          generationConfig: {
            temperature: req.temperature ?? 0.7,
            maxOutputTokens: req.maxTokens ?? 2048,
          },
        }),
        signal: req.signal,
      }
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw toGeminiError(res.status, detail, req.modelId);
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim();
    if (!text) throw new Error("Empty completion");
    return text;
  },
};
