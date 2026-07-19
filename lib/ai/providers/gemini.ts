import type { ProviderAdapter } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Google Gemini — direct provider (REST). Reuses the project's existing
// GEMINI_API_KEYY, also accepting the standard GEMINI_API_KEY name.
// Used as the default evaluator so synthesis works out of the box.
// ─────────────────────────────────────────────────────────────────────────────

function apiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYY;
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
      throw new Error(`HTTP ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`);
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
