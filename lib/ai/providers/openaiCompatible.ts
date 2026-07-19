import type { CompletionRequest } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Shared completion call for OpenAI-compatible chat APIs (OpenAI, OpenRouter,
// and most future gateways). Plain fetch — no SDK coupling, server-side only.
// ─────────────────────────────────────────────────────────────────────────────

export async function openAiCompatibleComplete(
  baseUrl: string,
  apiKey: string,
  req: CompletionRequest,
  extraHeaders: Record<string, string> = {}
): Promise<string> {
  const messages = [
    ...(req.systemPrompt ? [{ role: "system", content: req.systemPrompt }] : []),
    { role: "user", content: req.prompt },
  ];

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model: req.modelId,
      messages,
      temperature: req.temperature ?? 0.7,
      max_tokens: req.maxTokens ?? 2048,
    }),
    signal: req.signal,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty completion");
  return text;
}
