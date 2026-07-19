import type { StreamEvent } from "@/types/chat";

// ─────────────────────────────────────────────────────────────────────────────
// Chat transport service.
//
// Owns the network + NDJSON parsing for /api/gemini and surfaces typed events
// through handlers. Keeping this out of the React layer makes the streaming
// logic reusable and independently testable.
// ─────────────────────────────────────────────────────────────────────────────

export interface StreamHandlers {
  onText: (delta: string) => void;
  onToolStart: (payload: { tool: string; query: string }) => void;
  onToolDone: (payload: { tool: string; query: string; result: string }) => void;
  onToolError: (payload: { tool: string; query: string; message: string }) => void;
}

export interface StreamRequest {
  messages: { role: string; content: string }[];
  personaKey: string;
  signal: AbortSignal;
  handlers: StreamHandlers;
}

/**
 * POST to /api/gemini and dispatch each NDJSON event to the handlers.
 * Resolves when the stream ends. Throws on network / HTTP errors and on abort
 * (AbortError) so callers can distinguish cancellation.
 */
export async function streamChat({
  messages,
  personaKey,
  signal,
  handlers,
}: StreamRequest): Promise<void> {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, personaKey }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const dispatch = (event: StreamEvent) => {
    switch (event.type) {
      case "text":
        if (event.value) handlers.onText(event.value);
        break;
      case "tool":
        if (event.event === "start")
          handlers.onToolStart({ tool: event.tool, query: event.query });
        else if (event.event === "done")
          handlers.onToolDone({ tool: event.tool, query: event.query, result: event.result });
        else if (event.event === "error")
          handlers.onToolError({ tool: event.tool, query: event.query, message: event.message });
        break;
      case "error":
        // Non-fatal generation error — treated as end of stream by the caller.
        break;
    }
  };

  const flushLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      dispatch(JSON.parse(trimmed) as StreamEvent);
    } catch {
      /* ignore malformed frame */
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      flushLine(line);
    }
  }

  // Flush any trailing frame without a newline.
  flushLine(buffer);
}
