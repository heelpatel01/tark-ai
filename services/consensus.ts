import type { ConsensusEvent } from "@/lib/ai/types";
import { readNdjsonStream } from "@/services/ndjson";

// ─────────────────────────────────────────────────────────────────────────────
// Consensus transport — POSTs the question to /api/self-consistency and
// dispatches typed progressive events. Framework-free; state lives in
// hooks/useConsensus.
// ─────────────────────────────────────────────────────────────────────────────

export interface ConsensusRequest {
  question: string;
  signal: AbortSignal;
  onEvent: (event: ConsensusEvent) => void;
}

export async function runConsensusRequest({
  question,
  signal,
  onEvent,
}: ConsensusRequest): Promise<void> {
  const response = await fetch("/api/self-consistency", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`HTTP ${response.status}`);
  }

  await readNdjsonStream<ConsensusEvent>(response.body, onEvent);
}
