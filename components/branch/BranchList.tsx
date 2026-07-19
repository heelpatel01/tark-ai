"use client";
import React, { useState } from "react";
import { FiGitBranch, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import type { Branch } from "@/types/chat";

// ─────────────────────────────────────────────────────────────────────────────
// BranchList — nested under the active conversation in the sidebar. Lists every
// branch with switch / rename / delete. "Main" (root) can't be deleted.
// ─────────────────────────────────────────────────────────────────────────────
export const BranchList: React.FC<{
  branches: Branch[];
  currentBranchId: string | null;
  accent: string;
  onSwitch: (branchId: string) => void;
  onRename: (branchId: string, name: string) => void;
  onDelete: (branchId: string) => void;
}> = ({ branches, currentBranchId, accent, onSwitch, onRename, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  if (branches.length <= 1) return null; // nothing to branch between yet

  const startEdit = (b: Branch) => {
    setEditingId(b.id);
    setDraft(b.name);
  };

  const commit = (id: string) => {
    if (draft.trim()) onRename(id, draft);
    setEditingId(null);
  };

  return (
    <div className="mt-2 ml-2 pl-2 border-l border-black/10 dark:border-white/10 space-y-1">
      {branches.map((b) => {
        const isActive = b.id === currentBranchId;
        const isMain = b.parentMessageId === null;
        const isEditing = editingId === b.id;

        return (
          <div
            key={b.id}
            className={`group/branch flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ${
              isActive
                ? "border-[#6D5DF6]/30 bg-[#6D5DF6]/5"
                : "border-transparent hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
            }`}
          >
            <FiGitBranch
              size={10}
              strokeWidth={2.5}
              style={{ color: isActive ? accent : "#94A3B8" }}
              className="flex-shrink-0"
            />

            {isEditing ? (
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commit(b.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 min-w-0 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#111111] dark:text-white focus:outline-none"
                />
                <button onClick={() => commit(b.id)} className="text-emerald-500 flex-shrink-0" aria-label="Save">
                  <FiCheck size={11} strokeWidth={3} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-[#667085] flex-shrink-0" aria-label="Cancel">
                  <FiX size={11} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onSwitch(b.id)}
                  className="flex-1 min-w-0 text-left truncate text-[10px] font-bold text-[#111111] dark:text-[#94A3B8]"
                  title={b.name}
                >
                  {b.name}
                </button>
                <div className="flex items-center gap-0.5 opacity-0 group-hover/branch:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => startEdit(b)} className="p-0.5 text-[#667085] hover:text-[#111111] dark:hover:text-white" aria-label="Rename branch">
                    <FiEdit2 size={10} />
                  </button>
                  {!isMain && (
                    <button onClick={() => onDelete(b.id)} className="p-0.5 text-[#667085] hover:text-red-500" aria-label="Delete branch">
                      <FiTrash2 size={10} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
