"use client";
import React from "react";
import { FiGlobe, FiCheck, FiAlertTriangle, FiLoader } from "react-icons/fi";
import type { Message } from "@/types/chat";

// ─────────────────────────────────────────────────────────────────────────────
// ToolEvent — renders a `role: "tool"` message inline in the chat (no modal, no
// popup). Matches the required UX:
//   🌐 Searching Web...  → Searching: "query"  → ✓ Search Complete
// then generation continues naturally in the following assistant bubble.
// ─────────────────────────────────────────────────────────────────────────────
export const ToolEvent: React.FC<{ message: Message; accent?: string }> = ({
  message,
  accent = "#6D5DF6",
}) => {
  const status = message.toolStatus ?? "done";
  const isRunning = status === "running";
  const isError = status === "error";

  const label = isRunning
    ? "Searching Web..."
    : isError
      ? "Search Failed"
      : "Search Complete";

  return (
    <div className="flex gap-3 group animate-message-appear justify-start">
      {/* Globe avatar keeps the tool event visually distinct from the mentor. */}
      <div className="flex-shrink-0 mt-0.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm border border-white/60 dark:border-white/10"
          style={{ background: `${accent}14`, color: accent }}
        >
          <FiGlobe size={13} strokeWidth={2.5} />
        </div>
      </div>

      <div className="max-w-[82%] w-full flex flex-col gap-1.5 items-start">
        <div
          className="w-full px-4 py-3 border rounded-[20px] rounded-tl-none bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-sm border-white/60 dark:border-white/10"
          style={{ borderLeft: `3.5px solid ${accent}` }}
        >
          {/* Status line */}
          <div className="flex items-center gap-2">
            {isRunning ? (
              <FiLoader size={12} className="animate-spin" style={{ color: accent }} />
            ) : isError ? (
              <FiAlertTriangle size={12} className="text-amber-500" />
            ) : (
              <FiCheck size={12} strokeWidth={3} className="text-emerald-500" />
            )}
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: isError ? "#d97706" : accent }}
            >
              {label}
            </span>
          </div>

          {/* Query */}
          {message.query && (
            <p className="mt-1.5 text-[11px] font-semibold text-[#667085] dark:text-[#94A3B8]">
              Searching:{" "}
              <span className="text-[#111111] dark:text-[#F8FAFC]">
                &ldquo;{message.query}&rdquo;
              </span>
            </p>
          )}

          {/* Result / error detail */}
          {!isRunning && message.result && (
            <p className="mt-2 text-[11px] leading-relaxed font-medium text-[#667085] dark:text-[#94A3B8] whitespace-pre-wrap line-clamp-4">
              {message.result}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
