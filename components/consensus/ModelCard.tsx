"use client";
import React from "react";
import {
  Sparkles,
  Waves,
  Cpu,
  Bot,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { ModelConfig } from "@/lib/ai/types";
import type { ModelCardState, ModelCardStatus } from "@/hooks/useConsensus";
import { MarkdownMessage } from "@/components/chat/Markdown";

// ─────────────────────────────────────────────────────────────────────────────
// ModelCard — one card per configured model: icon, name, live status chip and
// the response once it lands. Unknown model keys fall back to a generic icon,
// so editing lib/ai/models.ts never breaks the UI.
// ─────────────────────────────────────────────────────────────────────────────

const MODEL_ICONS: Record<string, LucideIcon> = {
  gemini: Sparkles,
  deepseek: Waves,
  qwen: Cpu,
};

const STATUS_META: Record<
  ModelCardStatus,
  { label: string; className: string; icon: LucideIcon; spin?: boolean }
> = {
  waiting: {
    label: "Waiting",
    className: "text-[#667085] dark:text-[#94A3B8] bg-black/[0.03] dark:bg-white/[0.05]",
    icon: Clock,
  },
  loading: {
    label: "Loading",
    className: "text-[#6D5DF6] bg-[#6D5DF6]/10",
    icon: Loader2,
    spin: true,
  },
  completed: {
    label: "Finished",
    className: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className: "text-red-500 bg-red-500/10",
    icon: XCircle,
  },
};

export const ModelCard: React.FC<{
  config: ModelConfig;
  state: ModelCardState;
}> = ({ config, state }) => {
  const Icon = MODEL_ICONS[config.key] ?? Bot;
  const status = STATUS_META[state.status];
  const StatusIcon = status.icon;

  return (
    <div
      className="flex flex-col rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-sm overflow-hidden"
      style={{ borderTop: `3px solid ${config.accent}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-black/5 dark:border-white/5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `${config.accent}14`, color: config.accent }}
        >
          <Icon size={13} strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[#111111] dark:text-[#F8FAFC] truncate">
            {config.label}
          </p>
          <p className="text-[9px] font-semibold text-[#667085] dark:text-[#94A3B8] truncate">
            {config.modelId}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${status.className}`}
        >
          <StatusIcon size={9} strokeWidth={2.5} className={status.spin ? "animate-spin" : ""} />
          {status.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-3 text-xs min-h-[88px]">
        {state.status === "waiting" && (
          <p className="text-[11px] font-medium text-[#667085] dark:text-[#94A3B8]">
            Ask a question to query this model.
          </p>
        )}

        {state.status === "loading" && (
          <div className="space-y-2 py-1 animate-pulse">
            <div className="h-2 rounded-full bg-black/[0.06] dark:bg-white/10 w-full" />
            <div className="h-2 rounded-full bg-black/[0.06] dark:bg-white/10 w-4/5" />
            <div className="h-2 rounded-full bg-black/[0.06] dark:bg-white/10 w-3/5" />
          </div>
        )}

        {state.status === "completed" && state.text && (
          <div className="max-h-72 overflow-y-auto pr-1">
            <MarkdownMessage content={state.text} isUser={false} />
          </div>
        )}

        {state.status === "failed" && (
          <p className="text-[11px] font-semibold text-red-500 break-words">
            {state.error || "This model failed to respond."}
          </p>
        )}
      </div>

      {/* Footer latency */}
      {typeof state.latencyMs === "number" && state.latencyMs > 0 && (
        <div className="px-4 py-2 border-t border-black/5 dark:border-white/5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#667085] dark:text-[#94A3B8]">
            {(state.latencyMs / 1000).toFixed(1)}s
          </p>
        </div>
      )}
    </div>
  );
};
