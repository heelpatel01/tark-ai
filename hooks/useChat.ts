"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Message } from "@/types/chat";
import { streamChat } from "@/services/chatClient";
import { useConversations } from "@/hooks/useConversations";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const THINKING_DELAY_MS = 180;

// ─────────────────────────────────────────────────────────────────────────────
// useChat
//
// Orchestrates a send: ensures a conversation/branch, appends the user message,
// streams the assistant reply and materializes tool events as `role: "tool"`
// messages — all persisted through useConversations. The transport itself lives
// in services/chatClient.
// ─────────────────────────────────────────────────────────────────────────────
export function useChat(personaKey: string) {
  const convos = useConversations();
  const {
    ensureConversation,
    addMessage,
    patchMessage,
    removeMessage,
    currentBranchId,
  } = convos;

  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false); // 180ms-delayed thinking dots

  const abortRef = useRef<AbortController | null>(null);
  const thinkingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearThinking = useCallback(() => {
    if (thinkingTimer.current) {
      clearTimeout(thinkingTimer.current);
      thinkingTimer.current = null;
    }
    setIsWaiting(false);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    clearThinking();
    setIsLoading(false);
  }, [clearThinking]);

  // Abort any in-flight request on unmount.
  useEffect(() => () => {
    abortRef.current?.abort();
    if (thinkingTimer.current) clearTimeout(thinkingTimer.current);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading || !personaKey) return;

      stop();

      const { conversationId, branchId } = ensureConversation(trimmed, personaKey);
      const now = Date.now();

      // Context sent to the model = current branch thread + this user turn.
      // Tool messages are UI-only and excluded from the model context.
      const contextMessages = [
        ...convos.thread
          .filter((m) => m.role !== "tool")
          .map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: trimmed },
      ];

      const userMsg: Message = {
        id: uid(),
        conversationId,
        branchId,
        role: "user",
        content: trimmed,
        createdAt: now,
      };
      addMessage(userMsg);

      setIsLoading(true);
      thinkingTimer.current = setTimeout(() => setIsWaiting(true), THINKING_DELAY_MS);

      const controller = new AbortController();
      abortRef.current = controller;

      // Streaming-local state.
      let assistantId: string | null = null;
      let assistantContent = "";
      let currentToolId: string | null = null;

      const ensureAssistant = () => {
        clearThinking();
        if (!assistantId) {
          assistantId = uid();
          addMessage({
            id: assistantId,
            conversationId,
            branchId,
            role: "assistant",
            content: "",
            createdAt: Date.now(),
          });
        }
        return assistantId;
      };

      try {
        await streamChat({
          messages: contextMessages,
          personaKey,
          signal: controller.signal,
          handlers: {
            onText: (delta) => {
              const id = ensureAssistant();
              assistantContent += delta;
              patchMessage(id, { content: assistantContent });
            },
            onToolStart: ({ tool, query }) => {
              clearThinking();
              const toolId = uid();
              currentToolId = toolId;
              addMessage({
                id: toolId,
                conversationId,
                branchId,
                role: "tool",
                content: "",
                tool,
                query,
                result: "",
                toolStatus: "running",
                createdAt: Date.now(),
              });
            },
            onToolDone: ({ result }) => {
              if (currentToolId) patchMessage(currentToolId, { toolStatus: "done", result });
              currentToolId = null;
              // Model now composes its answer — show the thinking dots again.
              if (!assistantId) setIsWaiting(true);
            },
            onToolError: ({ message }) => {
              if (currentToolId) patchMessage(currentToolId, { toolStatus: "error", result: message });
              currentToolId = null;
              if (!assistantId) setIsWaiting(true);
            },
          },
        });

        // Drop an assistant bubble that never received any text.
        if (assistantId && assistantContent.trim() === "") {
          removeMessage(assistantId);
        }
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        // Network / HTTP failure (tool failures are handled gracefully server-side).
        const message = "Sorry, something went wrong. Please try again.";
        if (assistantId) patchMessage(assistantId, { content: message });
        else
          addMessage({
            id: uid(),
            conversationId,
            branchId,
            role: "assistant",
            content: message,
            createdAt: Date.now(),
          });
      } finally {
        clearThinking();
        if (abortRef.current === controller) {
          abortRef.current = null;
          setIsLoading(false);
        }
      }
    },
    [
      isLoading,
      personaKey,
      stop,
      ensureConversation,
      convos.thread,
      addMessage,
      patchMessage,
      removeMessage,
      clearThinking,
    ]
  );

  return { ...convos, isLoading, isWaiting, sendMessage, stop, currentBranchId };
}
