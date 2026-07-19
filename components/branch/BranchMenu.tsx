"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiMoreVertical, FiGitBranch } from "react-icons/fi";

// ─────────────────────────────────────────────────────────────────────────────
// BranchMenu — the "⋮" affordance revealed on message hover. A branch can start
// from ANY message; selecting "Create Branch" forks the thread at this message.
// ─────────────────────────────────────────────────────────────────────────────
export const BranchMenu: React.FC<{
  onCreateBranch: () => void;
  align?: "left" | "right";
}> = ({ onCreateBranch, align = "left" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full shadow-sm text-[#667085] hover:text-[#111111] dark:hover:text-white transition-all"
        aria-label="Message options"
      >
        <FiMoreVertical size={10} strokeWidth={2.5} />
      </button>

      {open && (
        <div
          className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full mt-1.5 w-40 z-50 bg-white/90 dark:bg-[#0F121C]/90 border border-white/60 dark:border-white/10 shadow-xl backdrop-blur-2xl rounded-xl overflow-hidden animate-message-appear`}
        >
          <button
            onClick={() => {
              setOpen(false);
              onCreateBranch();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold text-[#111111] dark:text-[#F8FAFC] hover:bg-[#6D5DF6]/10 transition-colors"
          >
            <FiGitBranch size={12} strokeWidth={2.5} className="text-[#6D5DF6]" />
            Create Branch
          </button>
        </div>
      )}
    </div>
  );
};
