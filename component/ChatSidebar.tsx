"use client";
import React from "react";
import {
  FiPlus,
  FiTrash2,
  FiMessageSquare,
  FiArrowLeft,
  FiX,
  FiZap,
  FiClock,
  FiBookOpen,
  FiCoffee,
  FiTrendingUp,
  FiTarget,
  FiLayers,
  FiCpu,
  FiBook,
  FiSettings,
  FiAward,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import ThemeLogo from "@/component/ThemeLogo";
import type { Branch, Conversation } from "@/types/chat";
import { BranchList } from "@/components/branch/BranchList";

interface PersonaData {
  key: string;
  name: string;
  role: string;
  personality: string;
  image: string;
  communicationStyle: string;
  tone: string;
  expertise: string;
  additionalContext: string;
}

export type ChatSidebarProps = {
  isOpen: boolean;
  isMobile: boolean;
  selectedPersona: PersonaData | null;
  conversations: Conversation[];
  activeConversationId: string | null;
  branchesForActive: Branch[];
  currentBranchId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onSwitchBranch: (branchId: string) => void;
  onRenameBranch: (branchId: string, name: string) => void;
  onDeleteBranch: (branchId: string) => void;
  onBackToPersonas: () => void;
  onClose: () => void;
  onSendTopic?: (topic: string) => void;
};

// Per-persona config
const PERSONA_CONFIG: Record<
  string,
  { accent: string; traits: { icon: React.ReactNode; label: string }[]; learningPath: string }
> = {
  hiteshchoudhary: {
    accent: "#6D5DF6",
    traits: [
      { icon: <FiCoffee className="w-3 h-3 text-[#6D5DF6]" />, label: "Chai Code" },
      { icon: <FiTrendingUp className="w-3 h-3 text-[#6D5DF6]" />, label: "Founder" },
      { icon: <FiTarget className="w-3 h-3 text-[#6D5DF6]" />, label: "Practical" },
    ],
    learningPath: "Try: System Design → Backend → Deployment",
  },
  piyushgarg: {
    accent: "#06B6D4",
    traits: [
      { icon: <FiZap className="w-3 h-3 text-[#06B6D4]" />, label: "GenAI" },
      { icon: <FiLayers className="w-3 h-3 text-[#06B6D4]" />, label: "Teachyst" },
      { icon: <FiCpu className="w-3 h-3 text-[#06B6D4]" />, label: "Systems" },
    ],
    learningPath: "Try: AI Agents → MCP → Loop Engineering",
  },
};

const DEFAULT_CONFIG = {
  accent: "#6D5DF6",
  traits: [
    { icon: <FiCpu className="w-3 h-3 text-[#6D5DF6]" />, label: "AI Mentor" },
    { icon: <FiBook className="w-3 h-3 text-[#6D5DF6]" />, label: "Educator" },
    { icon: <FiSettings className="w-3 h-3 text-[#6D5DF6]" />, label: "Practical" },
  ],
  learningPath: "Try: Backend → System Design → AI",
};

const QUICK_TOPICS = [
  { label: "Backend", icon: <FiSettings className="w-3.5 h-3.5" /> },
  { label: "React", icon: <FiLayers className="w-3.5 h-3.5" /> },
  { label: "AI / LLMs", icon: <FiCpu className="w-3.5 h-3.5" /> },
  { label: "Career", icon: <FiTarget className="w-3.5 h-3.5" /> },
  { label: "System Design", icon: <FiAward className="w-3.5 h-3.5" /> },
  { label: "Projects", icon: <FiTrendingUp className="w-3.5 h-3.5" /> },
];

function timeAgo(createdAt: number): string {
  const diff = Date.now() - createdAt;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  isMobile,
  selectedPersona,
  conversations,
  activeConversationId,
  branchesForActive,
  currentBranchId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onSwitchBranch,
  onRenameBranch,
  onDeleteBranch,
  onBackToPersonas,
  onClose,
  onSendTopic,
}) => {
  const router = useRouter();
  const config = selectedPersona
    ? PERSONA_CONFIG[selectedPersona.key] ?? DEFAULT_CONFIG
    : DEFAULT_CONFIG;

  const filteredConversations = conversations.filter((c) =>
    selectedPersona ? c.personaKey === selectedPersona.key : true
  );

  const sidebarContent = (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-white/80 backdrop-blur-2xl">

      {/* Logo */}
      <div
        className="px-5 pt-5 pb-4 border-b border-black/5 cursor-pointer flex items-center gap-2.5 hover:bg-black/[0.02] transition-colors flex-shrink-0"
        onClick={() => { if (isMobile) onClose(); router.push("/"); }}
      >
        <ThemeLogo className="h-7 w-auto object-contain opacity-80" />
        <div className="flex flex-col">
          <span className="font-bold text-xs text-[#111111] leading-none">Tark AI</span>
          <span className="text-[8px] font-bold text-[#667085] uppercase tracking-widest mt-0.5">
            Mentor Platform
          </span>
        </div>
      </div>

      {/* Current Mentor Card */}
      {selectedPersona && (
        <div className="px-4 py-4 border-b border-black/5 flex-shrink-0 bg-black/[0.01]">
          <p className="text-[8px] font-bold text-[#667085] uppercase tracking-widest mb-3">
            Current Mentor
          </p>
          <div className="flex items-center gap-3 mb-3.5">
            <div className="relative flex-shrink-0">
              <img
                src={selectedPersona.image}
                alt={selectedPersona.name}
                className="w-10 h-10 object-cover border border-white shadow-sm rounded-full"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border border-white rounded-full"
                style={{ background: config.accent }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-[#111111] text-xs leading-tight truncate">
                {selectedPersona.name}
              </h3>
              <p className="text-[10px] text-[#667085] font-semibold mt-0.5 truncate">
                {selectedPersona.role.split(",")[0]}
              </p>
            </div>
          </div>

          {/* Trait pills */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {config.traits.map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-black/5 text-[9px] font-bold text-[#667085] bg-white rounded-full"
              >
                {t.icon} {t.label}
              </span>
            ))}
          </div>

          <button
            onClick={onBackToPersonas}
            className="w-full flex items-center justify-center gap-1.5 text-[9px] font-bold text-[#111111] border border-black/10 bg-white hover:bg-[#F8FAFC] py-2 rounded-full shadow-sm hover:shadow transition-all"
          >
            <FiArrowLeft size={10} strokeWidth={3} />
            Explore Personas
          </button>
        </div>
      )}

      {/* New Chat Button */}
      <div className="px-4 py-4 border-b border-black/5 flex-shrink-0">
        <button
          onClick={onNewChat}
          className="
            w-full flex items-center justify-center gap-2
            text-white font-bold uppercase text-[10px] tracking-wider
            py-3 px-4 rounded-full shadow-sm hover:opacity-90 transition-all
          "
          style={{ background: `linear-gradient(135deg, ${config.accent}, ${config.accent}cc)` }}
        >
          <FiPlus strokeWidth={3} size={13} />
          New Session
        </button>
      </div>

      {/* Learning Path */}
      <div className="px-4 py-4 border-b border-black/5 flex-shrink-0 bg-[#6D5DF6]/[0.02]">
        <div className="flex items-center gap-2 mb-2">
          <FiBookOpen size={11} strokeWidth={3} className="text-[#6D5DF6]" />
          <p className="text-[8px] font-bold text-[#6D5DF6] uppercase tracking-widest">
            Learning Path
          </p>
        </div>
        <div className="bg-white/75 dark:bg-[#151922] border border-[#6D5DF6]/10 dark:border-white/5 rounded-xl px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <p className="text-[10px] font-bold text-[#111111] dark:text-[#94A3B8] leading-relaxed">
            {config.learningPath}
          </p>
        </div>
      </div>

      {/* Conversation Timeline */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden px-4 py-4">
        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
          <FiClock size={11} strokeWidth={3} className="text-[#667085]" />
          <p className="text-[8px] font-bold text-[#667085] uppercase tracking-widest">
            Recent Sessions
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-6">
              <FiMessageSquare className="w-5 h-5 text-black/10 mx-auto mb-2" />
              <p className="text-[10px] text-[#667085] font-semibold">
                No sessions yet.
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = activeConversationId === conv.id;
              return (
                <div key={conv.id}>
                  <div
                    onClick={() => { onSelectConversation(conv.id); if (isMobile) onClose(); }}
                    className={`group flex items-start justify-between gap-2 p-2.5 rounded-xl border cursor-pointer transition-all duration-150 ${isActive
                      ? "border-[#6D5DF6]/30 bg-[#6D5DF6]/5 border"
                      : "border-transparent hover:bg-black/[0.01] hover:border-black/5"
                      }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#111111] truncate leading-snug">
                        {conv.title}
                      </p>
                      <p className="text-[9px] text-[#667085] font-semibold mt-0.5">
                        {timeAgo(conv.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#667085] hover:text-red-500 transition-all flex-shrink-0"
                      aria-label="Delete session"
                    >
                      <FiTrash2 size={11} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Branches of the active conversation */}
                  {isActive && (
                    <BranchList
                      branches={branchesForActive}
                      currentBranchId={currentBranchId}
                      accent={config.accent}
                      onSwitch={(id) => { onSwitchBranch(id); if (isMobile) onClose(); }}
                      onRename={onRenameBranch}
                      onDelete={onDeleteBranch}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Topics */}
      {onSendTopic && (
        <div className="px-4 py-4 border-t border-black/5 flex-shrink-0 bg-black/[0.01]">
          <div className="flex items-center gap-2 mb-3">
            <FiZap size={11} strokeWidth={3} className="text-[#667085]" />
            <p className="text-[8px] font-bold text-[#667085] uppercase tracking-widest">
              Quick Topics
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {QUICK_TOPICS.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => { onSendTopic(label); if (isMobile) onClose(); }}
                className="text-[9px] font-semibold text-[#111111] border border-black/5 bg-white rounded-lg px-2 py-2 hover:bg-[#F8FAFC] shadow-sm hover:shadow transition-all text-left flex items-center gap-1.5"
              >
                <span>{icon}</span>
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-black/5 flex-shrink-0 text-center">
        <p className="text-[8px] text-[#667085] font-semibold uppercase tracking-wider">
          Tark AI · Mentor Platform
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div
          className={`md:hidden fixed inset-y-0 left-0 z-40 w-72 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out bg-white border-r border-black/10 flex flex-col h-full overflow-hidden shadow-2xl`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-black/5 bg-white flex-shrink-0">
            <span className="font-bold text-xs uppercase tracking-wider text-[#111111]">Mentor Session</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full border border-black/10 text-[#111111] hover:bg-black/5 transition-colors"
              aria-label="Close sidebar"
            >
              <FiX size={15} strokeWidth={3} />
            </button>
          </div>
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {sidebarContent}
          </div>
        </div>
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/10 backdrop-blur-sm z-30"
            onClick={onClose}
          />
        )}
      </>
    );
  }

  return (
    <aside
      className={`hidden md:flex flex-col z-30 overflow-hidden border-r border-black/5
        ${isOpen ? "w-72" : "w-0"} transition-[width] duration-300 ease-in-out
        bg-white flex-shrink-0`}
    >
      {sidebarContent}
    </aside>
  );
};

