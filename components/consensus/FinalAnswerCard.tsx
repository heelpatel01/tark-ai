"use client";
import React from "react";
import { Sparkles, Loader2, Clock } from "lucide-react";
import { MarkdownMessage } from "@/components/chat/Markdown";

// ─────────────────────────────────────────────────────────────────────────────
// FinalAnswerCard — the highlighted synthesis card. Shows a "Waiting" shell
// while models run, a shimmer while the evaluator works, then the answer.
// ─────────────────────────────────────────────────────────────────────────────

export const FinalAnswerCard: React.FC<{
  status: "waiting" | "synthesizing" | "done";
  answer?: string | null;
  latencyMs?: number | null;
}> = ({ status, answer, latencyMs }) => {
  return (
    <div className="rounded-2xl border border-[#6D5DF6]/25 bg-gradient-to-br from-[#6D5DF6]/[0.06] via-white/70 to-white/70 dark:from-[#7B61FF]/[0.1] dark:via-white/[0.03] dark:to-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(109,93,246,0.08)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#6D5DF6]/10">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6D5DF6] to-[#8b5cf6] flex items-center justify-center shadow-sm flex-shrink-0">
          <Sparkles size={14} className="text-white" strokeWidth={2.25} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-extrabold text-[#111111] dark:text-[#F8FAFC] tracking-tight">
            Final Synthesized Answer
          </h2>
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#6D5DF6]">
            Consensus of all successful responses
          </p>
        </div>
        {status === "waiting" && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8] bg-black/[0.03] dark:bg-white/[0.05]">
            <Clock size={9} strokeWidth={2.5} />
            Waiting
          </span>
        )}
        {status === "synthesizing" && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#6D5DF6] bg-[#6D5DF6]/10">
            <Loader2 size={9} strokeWidth={2.5} className="animate-spin" />
            Synthesizing
          </span>
        )}
        {status === "done" && typeof latencyMs === "number" && (
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#667085] dark:text-[#94A3B8]">
            {(latencyMs / 1000).toFixed(1)}s
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-4 text-sm">
        {status === "waiting" && (
          <p className="text-xs font-medium text-[#667085] dark:text-[#94A3B8]">
            The evaluator runs after every model finishes, comparing accuracy,
            completeness, reasoning and clarity to produce one polished answer.
          </p>
        )}
        {status === "synthesizing" && (
          <div className="space-y-2.5 py-1 animate-pulse">
            <div className="h-2.5 rounded-full bg-[#6D5DF6]/15 w-full" />
            <div className="h-2.5 rounded-full bg-[#6D5DF6]/15 w-11/12" />
            <div className="h-2.5 rounded-full bg-[#6D5DF6]/15 w-4/5" />
            <div className="h-2.5 rounded-full bg-[#6D5DF6]/15 w-3/5" />
          </div>
        )}
        {status === "done" && answer && (
          <MarkdownMessage content={answer} isUser={false} />
        )}
      </div>
    </div>
  );
};
