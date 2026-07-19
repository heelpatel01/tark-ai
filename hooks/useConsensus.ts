"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ModelResponse } from "@/lib/ai/types";
import { CONSENSUS_MODELS } from "@/lib/ai/models";
import { runConsensusRequest } from "@/services/consensus";

// ─────────────────────────────────────────────────────────────────────────────
// useConsensus — state machine for the Self-Consistency Answer Engine.
//
//   idle → generating → synthesizing → done
//                    ↘ error (all models failed / network failure)
//
// Per-model card state flips Waiting → Loading → Completed/Failed as NDJSON
// events arrive. Transport lives in services/consensus.
// ─────────────────────────────────────────────────────────────────────────────

export type ConsensusPhase = "idle" | "generating" | "synthesizing" | "done" | "error";

export type ModelCardStatus = "waiting" | "loading" | "completed" | "failed";

export interface ModelCardState {
  key: string;
  status: ModelCardStatus;
  text?: string;
  error?: string;
  latencyMs?: number;
}

function initialCards(status: ModelCardStatus): Record<string, ModelCardState> {
  return Object.fromEntries(
    CONSENSUS_MODELS.map((m) => [m.key, { key: m.key, status }])
  );
}

export function useConsensus() {
  const [phase, setPhase] = useState<ConsensusPhase>("idle");
  const [cards, setCards] = useState<Record<string, ModelCardState>>(() =>
    initialCards("waiting")
  );
  const [finalAnswer, setFinalAnswer] = useState<string | null>(null);
  const [finalLatencyMs, setFinalLatencyMs] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const isRunning = phase === "generating" || phase === "synthesizing";

  const applyModelResponse = useCallback((response: ModelResponse) => {
    setCards((prev) => ({
      ...prev,
      [response.key]: {
        key: response.key,
        status: response.status,
        text: response.text,
        error: response.error,
        latencyMs: response.latencyMs,
      },
    }));
  }, []);

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isRunning) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setPhase("generating");
      setCards(initialCards("loading"));
      setFinalAnswer(null);
      setFinalLatencyMs(null);
      setErrorMessage(null);

      try {
        await runConsensusRequest({
          question: trimmed,
          signal: controller.signal,
          onEvent: (event) => {
            switch (event.type) {
              case "model":
                applyModelResponse(event.response);
                break;
              case "phase":
                setPhase("synthesizing");
                break;
              case "final":
                setFinalAnswer(event.answer);
                setFinalLatencyMs(event.latencyMs);
                setPhase("done");
                break;
              case "error":
                setErrorMessage(event.message);
                setPhase("error");
                break;
            }
          },
        });

        // Stream ended without a terminal event — treat as soft failure.
        setPhase((p) => (p === "generating" || p === "synthesizing" ? "error" : p));
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        setErrorMessage("Something went wrong. Please try again.");
        setPhase("error");
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [isRunning, applyModelResponse]
  );

  return {
    phase,
    isRunning,
    cards,
    finalAnswer,
    finalLatencyMs,
    errorMessage,
    ask,
  };
}
