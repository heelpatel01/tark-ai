import type { Branch, Conversation, Message } from "@/types/chat";

// ─────────────────────────────────────────────────────────────────────────────
// Persistence layer (localStorage).
//
// The "database" is intentionally tiny and client-side: three flat collections
// (Conversation, Branch, Message) — no ToolCalls/ToolResponses tables, no event
// sourcing, no recursive trees. It works on serverless (Vercel) without any
// backend, migrations or env vars, and upgrades the previously in-memory history
// into something that survives reloads.
//
// This module only reads/writes state and provides ONE pure helper to
// reconstruct a branch thread. React state ownership lives in useConversations.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "tarkai:v1";

export interface PersistedState {
  conversations: Conversation[];
  branches: Branch[];
  messages: Message[];
}

const EMPTY: PersistedState = { conversations: [], branches: [], messages: [] };

export function loadState(): PersistedState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      conversations: parsed.conversations ?? [],
      branches: parsed.branches ?? [],
      messages: parsed.messages ?? [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveState(state: PersistedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota / privacy mode — fail silently, chat still works in-memory */
  }
}

export const MAIN_BRANCH_NAME = "Main";

/**
 * Reconstruct the full message thread for a branch:
 *   original messages up to (and including) the fork point + the branch's own
 *   messages. Walks the parent chain so nested branches inherit correctly.
 */
export function reconstructThread(
  messages: Message[],
  branches: Branch[],
  branchId: string,
  seen: Set<string> = new Set()
): Message[] {
  if (seen.has(branchId)) return []; // cycle guard (shouldn't happen)
  seen.add(branchId);

  const branch = branches.find((b) => b.id === branchId);
  if (!branch) return [];

  const own = messages
    .filter((m) => m.branchId === branchId)
    .sort((a, b) => a.createdAt - b.createdAt);

  // Root branch → just its own messages.
  if (!branch.parentMessageId) return own;

  const parentMessage = messages.find((m) => m.id === branch.parentMessageId);
  if (!parentMessage) return own;

  const parentThread = reconstructThread(
    messages,
    branches,
    parentMessage.branchId,
    seen
  );
  const forkIndex = parentThread.findIndex((m) => m.id === parentMessage.id);
  const inherited =
    forkIndex >= 0 ? parentThread.slice(0, forkIndex + 1) : parentThread;

  return [...inherited, ...own];
}
