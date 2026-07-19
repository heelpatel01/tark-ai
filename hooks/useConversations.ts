"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Branch, Conversation, Message } from "@/types/chat";
import {
  loadState,
  saveState,
  reconstructThread,
  MAIN_BRANCH_NAME,
} from "@/services/persistence";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

// ─────────────────────────────────────────────────────────────────────────────
// useConversations
//
// Single owner of conversation / branch / message state and its persistence.
// Handles branching entirely here so components stay presentational. No
// networking lives in this hook.
// ─────────────────────────────────────────────────────────────────────────────
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // ── Hydrate from localStorage once ──
  useEffect(() => {
    const s = loadState();
    setConversations(s.conversations);
    setBranches(s.branches);
    setMessages(s.messages);
    setHydrated(true);
  }, []);

  // ── Persist (throttled trailing write) ──
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveState({ conversations, branches, messages });
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [conversations, branches, messages, hydrated]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId]
  );

  const currentBranchId = activeConversation?.currentBranchId ?? null;

  const branchesForActive = useMemo(
    () =>
      branches
        .filter((b) => b.conversationId === activeConversationId)
        .sort((a, b) => a.createdAt - b.createdAt),
    [branches, activeConversationId]
  );

  // Messages of the active branch thread (inherited + own).
  const thread = useMemo(() => {
    if (!activeConversationId || !currentBranchId) return [];
    return reconstructThread(messages, branches, currentBranchId);
  }, [messages, branches, activeConversationId, currentBranchId]);

  // ── Conversation lifecycle ──

  /** Reset to the empty "new chat" state (no conversation created yet). */
  const startNewChat = useCallback(() => setActiveConversationId(null), []);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  /**
   * Ensure there is an active conversation + branch to write into, creating a
   * conversation and its Main branch on first message. Returns the ids.
   */
  const ensureConversation = useCallback(
    (title: string, personaKey: string): { conversationId: string; branchId: string } => {
      if (activeConversation && currentBranchId) {
        return { conversationId: activeConversation.id, branchId: currentBranchId };
      }
      const conversationId = uid();
      const branchId = uid();
      const now = Date.now();
      const mainBranch: Branch = {
        id: branchId,
        conversationId,
        name: MAIN_BRANCH_NAME,
        parentMessageId: null,
        createdAt: now,
      };
      const conversation: Conversation = {
        id: conversationId,
        title: title.slice(0, 60) || "New session",
        personaKey,
        currentBranchId: branchId,
        createdAt: now,
      };
      setBranches((prev) => [...prev, mainBranch]);
      setConversations((prev) => [conversation, ...prev]);
      setActiveConversationId(conversationId);
      return { conversationId, branchId };
    },
    [activeConversation, currentBranchId]
  );

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setBranches((prev) => prev.filter((b) => b.conversationId !== id));
    setMessages((prev) => prev.filter((m) => m.conversationId !== id));
    setActiveConversationId((curr) => (curr === id ? null : curr));
  }, []);

  // ── Message operations (used by streaming) ──

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const patchMessage = useCallback((id: string, partial: Partial<Message>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...partial } : m)));
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // ── Branching ──

  const createBranchFromMessage = useCallback(
    (messageId: string, name?: string): string | null => {
      const source = messages.find((m) => m.id === messageId);
      if (!source) return null;
      const branchId = uid();
      const count = branches.filter(
        (b) => b.conversationId === source.conversationId
      ).length;
      const branch: Branch = {
        id: branchId,
        conversationId: source.conversationId,
        name: name?.trim() || `Branch ${count}`,
        parentMessageId: messageId,
        createdAt: Date.now(),
      };
      setBranches((prev) => [...prev, branch]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === source.conversationId ? { ...c, currentBranchId: branchId } : c
        )
      );
      setActiveConversationId(source.conversationId);
      return branchId;
    },
    [messages, branches]
  );

  const switchBranch = useCallback(
    (branchId: string) => {
      const branch = branches.find((b) => b.id === branchId);
      if (!branch) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === branch.conversationId ? { ...c, currentBranchId: branchId } : c
        )
      );
      setActiveConversationId(branch.conversationId);
    },
    [branches]
  );

  const renameBranch = useCallback((branchId: string, name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setBranches((prev) =>
      prev.map((b) => (b.id === branchId ? { ...b, name: clean } : b))
    );
  }, []);

  const deleteBranch = useCallback(
    (branchId: string) => {
      const branch = branches.find((b) => b.id === branchId);
      if (!branch || branch.parentMessageId === null) return; // never delete Main

      // Fall back to the Main branch if we're deleting the active one.
      const main = branches.find(
        (b) => b.conversationId === branch.conversationId && b.parentMessageId === null
      );
      setMessages((prev) => prev.filter((m) => m.branchId !== branchId));
      setBranches((prev) => prev.filter((b) => b.id !== branchId));
      if (main) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === branch.conversationId && c.currentBranchId === branchId
              ? { ...c, currentBranchId: main.id }
              : c
          )
        );
      }
    },
    [branches]
  );

  return {
    hydrated,
    conversations,
    branches,
    activeConversationId,
    activeConversation,
    currentBranchId,
    branchesForActive,
    thread,
    // lifecycle
    startNewChat,
    selectConversation,
    ensureConversation,
    deleteConversation,
    // messages
    addMessage,
    patchMessage,
    removeMessage,
    // branching
    createBranchFromMessage,
    switchBranch,
    renameBranch,
    deleteBranch,
  };
}

export type ConversationsApi = ReturnType<typeof useConversations>;
