"use client";
import React, { useState } from "react";
import { Send, Loader2, AlertTriangle } from "lucide-react";
import { CONSENSUS_MODELS, MAX_QUESTION_LENGTH } from "@/lib/ai/models";
import { useConsensus } from "@/hooks/useConsensus";
import { ModelCard } from "@/components/consensus/ModelCard";
import { FinalAnswerCard } from "@/components/consensus/FinalAnswerCard";

// ─────────────────────────────────────────────────────────────────────────────
// ConsensusPlayground — input, model cards and the final answer. All state
// lives in useConsensus; this component is purely presentational wiring.
// ─────────────────────────────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  "Explain the CAP theorem with a real-world example",
  "SQL vs NoSQL — how should I choose for a new project?",
  "What are the trade-offs of microservices vs a monolith?",
  "How does HTTPS actually secure a connection?",
];

export const ConsensusPlayground: React.FC = () => {
  const { phase, isRunning, cards, finalAnswer, finalLatencyMs, errorMessage, ask } =
    useConsensus();
  const [question, setQuestion] = useState("");

  const canAsk = question.trim().length > 0 && !isRunning;

  const submit = () => {
    if (!canAsk) return;
    ask(question);
  };

  const finalStatus =
    phase === "synthesizing" ? "synthesizing" : phase === "done" ? "done" : "waiting";

  const showResults = phase !== "idle";

  return (
    <div className="space-y-8">
      {/* Composer */}
      <div className="chat-composer-glass rounded-2xl p-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value.slice(0, MAX_QUESTION_LENGTH))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={3}
          disabled={isRunning}
          placeholder="Ask anything — the same question goes to every model simultaneously..."
          className="w-full chat-composer-textarea font-medium text-sm bg-transparent border-0 focus:outline-none resize-none disabled:opacity-60 placeholder-[#8A94A6] dark:placeholder-[#8d94a7] scrollbar-none"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] font-semibold text-[#667085] dark:text-[#94A3B8]">
            {isRunning
              ? phase === "synthesizing"
                ? "Synthesizing Final Answer..."
                : "Generating responses..."
              : `${CONSENSUS_MODELS.length} models · 1 evaluator`}
          </p>
          <button
            onClick={submit}
            disabled={!canAsk}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              canAsk
                ? "text-white shadow-sm hover:scale-[1.03] active:scale-95 cursor-pointer"
                : "cursor-not-allowed opacity-40 text-[#6D5DF6] bg-[#6D5DF6]/10"
            }`}
            style={
              canAsk
                ? { background: "linear-gradient(135deg, #6D5DF6, #8b5cf6)" }
                : undefined
            }
          >
            {isRunning ? (
              <Loader2 size={12} strokeWidth={2.5} className="animate-spin" />
            ) : (
              <Send size={12} strokeWidth={2.5} />
            )}
            {isRunning ? "Running" : "Ask"}
          </button>
        </div>
      </div>

      {/* Suggested questions (idle only) */}
      {phase === "idle" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              className="text-left px-4 py-3 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl shadow-sm hover:border-[#6D5DF6]/35 dark:hover:border-[#7B61FF]/35 transition-all duration-200 text-xs font-semibold text-[#111111] dark:text-[#F8FAFC]"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Error banner */}
      {phase === "error" && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3">
          <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={2.25} />
          <p className="text-xs font-semibold text-[#111111] dark:text-[#F8FAFC]">
            {errorMessage || "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      {/* Model responses */}
      {showResults && (
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6D5DF6] mb-3">
            Model Responses
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CONSENSUS_MODELS.map((config) => (
              <ModelCard
                key={config.key}
                config={config}
                state={cards[config.key] ?? { key: config.key, status: "waiting" }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Final answer */}
      {showResults && phase !== "error" && (
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6D5DF6] mb-3">
            ✨ Consensus
          </p>
          <FinalAnswerCard
            status={finalStatus}
            answer={finalAnswer}
            latencyMs={finalLatencyMs}
          />
        </section>
      )}
    </div>
  );
};
