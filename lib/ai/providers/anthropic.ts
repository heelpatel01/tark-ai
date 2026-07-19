import type { ProviderAdapter } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Anthropic Claude — direct provider (REST). Becomes usable the moment
// ANTHROPIC_API_KEY is set; point a models.ts entry at
// { provider: "anthropic", modelId: "claude-sonnet-5" }.
// ─────────────────────────────────────────────────────────────────────────────

export const anthropicProvider: ProviderAdapter = {
  id: "anthropic",

  isConfigured() {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  },

  async complete(req) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: req.modelId,
        max_tokens: req.maxTokens ?? 2048,
        temperature: req.temperature ?? 0.7,
        ...(req.systemPrompt ? { system: req.systemPrompt } : {}),
        messages: [{ role: "user", content: req.prompt }],
      }),
      signal: req.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`);
    }

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };

    const text = data.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("")
      .trim();
    if (!text) throw new Error("Empty completion");
    return text;
  },
};
