"use client";
import React, { useState } from "react";
import { FiUser, FiCopy, FiCheck, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import type { Message } from "@/types/chat";
import { MarkdownMessage } from "@/components/chat/Markdown";
import { ToolEvent } from "@/components/tool/ToolEvent";
import { BranchMenu } from "@/components/branch/BranchMenu";

// ─────────────────────────────────────────────────────────────────────────────
// MessageBubble — one chat row. Renders tool events via ToolEvent and reuses the
// exact bubble styling from the original page, adding the hover branch menu.
// ─────────────────────────────────────────────────────────────────────────────
export const MessageBubble: React.FC<{
  message: Message;
  personaImage?: string;
  personaName?: string;
  accent: string;
  onCreateBranch: (messageId: string) => void;
}> = ({ message, personaImage, personaName, accent, onCreateBranch }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  if (message.role === "tool") {
    return <ToolEvent message={message} accent={accent} />;
  }

  const isUser = message.role === "user";

  // Never render an assistant message whose content is only whitespace.
  if (!isUser && (!message.content || !message.content.trim())) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`flex gap-3 group animate-message-appear ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 mt-0.5">
          <img
            src={personaImage || "/favicon.ico"}
            alt={personaName || "AI"}
            className="w-7 h-7 object-cover border border-white shadow rounded-full"
          />
        </div>
      )}

      <div className={`max-w-[82%] flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4.5 py-3 border text-xs sm:text-sm shadow-sm ${
            isUser
              ? "text-white rounded-[20px] rounded-tr-none border-transparent"
              : "bg-white/70 dark:bg-white/5 backdrop-blur-xl text-[#111111] rounded-[20px] rounded-tl-none border-white/60 dark:border-white/10"
          }`}
          style={
            isUser
              ? { background: "linear-gradient(135deg, #6D5DF6 0%, #8b5cf6 100%)" }
              : { borderLeft: `3.5px solid ${accent}` }
          }
        >
          <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
            <MarkdownMessage content={message.content} isUser={isUser} />
          </div>
        </div>

        {/* Action panel + branch menu (revealed on hover) */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity px-1">
          {!isUser && (
            <>
              <button
                onClick={copy}
                className="flex items-center gap-1 text-[9px] font-bold text-[#667085] hover:text-[#111111] bg-white border border-black/5 px-2.5 py-1 rounded-full transition-all shadow-sm"
                title="Copy message"
              >
                {copied ? <FiCheck size={10} className="text-green-600 font-extrabold" /> : <FiCopy size={10} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={() => setFeedback((f) => (f === "like" ? null : "like"))}
                className={`p-1.5 bg-white border border-black/5 rounded-full shadow-sm transition-all ${feedback === "like" ? "text-green-600" : "text-gray-400 hover:text-green-600"}`}
                aria-label="Like"
              >
                <FiThumbsUp size={10} />
              </button>
              <button
                onClick={() => setFeedback((f) => (f === "dislike" ? null : "dislike"))}
                className={`p-1.5 bg-white border border-black/5 rounded-full shadow-sm transition-all ${feedback === "dislike" ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                aria-label="Dislike"
              >
                <FiThumbsDown size={10} />
              </button>
            </>
          )}
          <BranchMenu onCreateBranch={() => onCreateBranch(message.id)} align={isUser ? "right" : "left"} />
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 mt-0.5 w-7 h-7 bg-gradient-to-tr from-[#6D5DF6] to-[#8b5cf6] rounded-full flex items-center justify-center shadow-sm">
          <FiUser className="text-white" size={13} strokeWidth={3} />
        </div>
      )}
    </div>
  );
};
