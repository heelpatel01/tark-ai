// ─────────────────────────────────────────────────────────────────────────────
// Shared NDJSON stream reader — used by both the chat transport and the
// self-consistency transport. Parses newline-delimited JSON frames and
// dispatches each parsed event; malformed frames are skipped.
// ─────────────────────────────────────────────────────────────────────────────

export async function readNdjsonStream<T>(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: T) => void
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const flushLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      onEvent(JSON.parse(trimmed) as T);
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
