// ─────────────────────────────────────────────────────────────────────────────
// Shared chat domain types.
//
// These types are the single source of truth for messages, conversations and
// branches across the client (hooks / components / persistence) and are kept
// intentionally small so the persistence layer stays minimal.
// ─────────────────────────────────────────────────────────────────────────────

export type Role = "user" | "assistant" | "tool";

/**
 * A single chat message.
 *
 * `tool` messages reuse the same persistence as normal messages (no separate
 * ToolCalls / ToolResponses tables). They carry the extra `tool` / `query` /
 * `result` fields so a tool event can be rendered and replayed from history.
 */
export interface Message {
  id: string;
  conversationId: string;
  branchId: string;
  role: Role;
  content: string;
  createdAt: number;

  // ── tool-message only ──
  tool?: string; // e.g. "searchWeb"
  query?: string; // the search query the model chose
  result?: string; // human-readable result summary (persisted)
  toolStatus?: ToolStatus;
}

export type ToolStatus = "running" | "done" | "error";

export interface Conversation {
  id: string;
  title: string;
  personaKey: string;
  currentBranchId: string;
  createdAt: number;
}

export interface Branch {
  id: string;
  conversationId: string;
  name: string;
  /** null → the root ("Main") branch. Otherwise the message this branch forks from. */
  parentMessageId: string | null;
  createdAt: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Streaming wire protocol (NDJSON).
//
// The /api/gemini route streams newline-delimited JSON events so a single
// response can carry both assistant text deltas and tool activity while the
// smooth token-by-token streaming experience is preserved.
// ─────────────────────────────────────────────────────────────────────────────

export type StreamEvent =
  | { type: "text"; value: string }
  | { type: "tool"; event: "start"; tool: string; query: string }
  | { type: "tool"; event: "done"; tool: string; query: string; result: string }
  | { type: "tool"; event: "error"; tool: string; query: string; message: string }
  | { type: "error"; message: string };
