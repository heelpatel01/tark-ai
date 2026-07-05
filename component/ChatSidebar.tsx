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
} from "react-icons/fi";
import { useRouter } from "next/navigation";

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

interface Conversation {
  id: string;
  title: string;
  persona_key: string;
  created_at: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  selectedPersona: PersonaData | null;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onBackToPersonas: () => void;
  onClose: () => void;
  onSendTopic?: (topic: string) => void;
}

// Per-persona config
const PERSONA_CONFIG: Record<
  string,
  { accent: string; traits: { icon: string; label: string }[]; learningPath: string }
> = {
  hiteshchoudhary: {
    accent: "#6D5DF6",
    traits: [
      { icon: "☕", label: "Chai Code" },
      { icon: "🚀", label: "Founder" },
      { icon: "🎯", label: "Practical" },
    ],
    learningPath: "Try: System Design → Backend → Deployment",
  },
  piyushgarg: {
    accent: "#06B6D4",
    traits: [
      { icon: "⚡", label: "GenAI" },
      { icon: "🏗️", label: "Teachyst" },
      { icon: "🔥", label: "Systems" },
    ],
    learningPath: "Try: AI Agents → MCP → Loop Engineering",
  },
};

const DEFAULT_CONFIG = {
  accent: "#6D5DF6",
  traits: [
    { icon: "🤖", label: "AI Mentor" },
    { icon: "💡", label: "Educator" },
    { icon: "🛠️", label: "Practical" },
  ],
  learningPath: "Try: Backend → System Design → AI",
};

const QUICK_TOPICS = [
  { label: "Backend", icon: "🔧" },
  { label: "React", icon: "⚛️" },
  { label: "AI / LLMs", icon: "🧠" },
  { label: "Career", icon: "🎯" },
  { label: "System Design", icon: "🏗️" },
  { label: "Projects", icon: "🚀" },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
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
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onBackToPersonas,
  onClose,
  onSendTopic,
}) => {
  const router = useRouter();
  const config = selectedPersona
    ? PERSONA_CONFIG[selectedPersona.key] ?? DEFAULT_CONFIG
    : DEFAULT_CONFIG;

  const filteredConversations = conversations.filter((c) =>
    selectedPersona ? c.persona_key === selectedPersona.key : true
  );

  const sidebarContent = (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">

      {/* ── Logo ── */}
      <div
        className="px-4 pt-4 pb-3 border-b-2 border-black cursor-pointer flex items-center gap-2.5 hover:bg-gray-50 transition-colors flex-shrink-0"
        onClick={() => { if (isMobile) onClose(); router.push("/"); }}
      >
        <img src="/tarkai-logo-navbar.png" alt="Tark AI" className="h-8 w-auto object-contain" />
        <div className="flex flex-col">
          <span className="font-black text-black text-sm leading-none">Tark AI</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
            Mentor Platform
          </span>
        </div>
      </div>

      {/* ── Current Mentor Card ── */}
      {selectedPersona && (
        <div className="px-3 py-3 border-b-2 border-black flex-shrink-0 bg-gray-50">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
            Current Mentor
          </p>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-shrink-0">
              <img
                src={selectedPersona.image}
                alt={selectedPersona.name}
                className="w-11 h-11 object-cover border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] rounded-full"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full"
                style={{ background: config.accent }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-black text-sm leading-tight truncate">
                {selectedPersona.name}
              </h3>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5 line-clamp-1">
                {selectedPersona.role.split(",")[0]}
              </p>
            </div>
          </div>

          {/* Trait pills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {config.traits.map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center gap-1 px-2 py-0.5 border border-black/20 text-[10px] font-bold text-black/70 bg-white"
              >
                {t.icon} {t.label}
              </span>
            ))}
          </div>

          <button
            onClick={onBackToPersonas}
            className="w-full flex items-center justify-center gap-1.5 text-[10px] font-black text-black border-2 border-black px-3 py-1.5 hover:bg-yellow-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <FiArrowLeft size={10} strokeWidth={3} />
            Switch Mentor
          </button>
        </div>
      )}

      {/* ── New Chat Button ── */}
      <div className="px-3 py-3 border-b-2 border-black flex-shrink-0">
        <button
          onClick={onNewChat}
          className="
            w-full flex items-center justify-center gap-2
            text-white font-black uppercase text-xs tracking-wider
            py-2.5 px-4
            border-2 border-black
            shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[2px] hover:translate-y-[2px]
            transition-all duration-150
          "
          style={{ background: `linear-gradient(135deg, ${config.accent}, ${config.accent}bb)` }}
        >
          <FiPlus strokeWidth={3} size={14} />
          New Session
        </button>
      </div>

      {/* ── Pinned Insights (placeholder) ── */}
      <div className="px-3 py-3 border-b-2 border-black flex-shrink-0 bg-violet-50/50">
        <div className="flex items-center gap-2 mb-2">
          <FiBookOpen size={11} strokeWidth={3} className="text-violet-400" />
          <p className="text-[9px] font-black text-violet-400 uppercase tracking-widest">
            Learning Path
          </p>
        </div>
        <div className="bg-white border border-black/10 px-3 py-2">
          <p className="text-[10px] font-bold text-black/60 leading-relaxed">
            {config.learningPath}
          </p>
        </div>
      </div>

      {/* ── Conversation Timeline ── */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden px-3 py-3">
        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
          <FiClock size={11} strokeWidth={3} className="text-gray-400" />
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Recent Sessions
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-6">
              <FiMessageSquare className="w-6 h-6 text-gray-200 mx-auto mb-2" />
              <p className="text-[10px] text-gray-400 font-medium">
                No sessions yet.
                <br />
                Start your first conversation!
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => { onSelectConversation(conv.id); if (isMobile) onClose(); }}
                className={`group flex items-start justify-between gap-2 p-2.5 border-l-2 cursor-pointer transition-all duration-150 ${
                  activeConversationId === conv.id
                    ? "border-l-violet-500 bg-violet-50 border border-violet-200"
                    : "border-l-transparent border border-transparent hover:bg-gray-50 hover:border-black/10"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-black truncate leading-snug">
                    {conv.title}
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                    {timeAgo(conv.created_at)}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all flex-shrink-0"
                  aria-label="Delete session"
                >
                  <FiTrash2 size={11} strokeWidth={2.5} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Quick Topics ── */}
      {onSendTopic && (
        <div className="px-3 py-3 border-t-2 border-black flex-shrink-0 bg-gray-50">
          <div className="flex items-center gap-2 mb-2.5">
            <FiZap size={11} strokeWidth={3} className="text-gray-400" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Quick Topics
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {QUICK_TOPICS.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => { onSendTopic(label); if (isMobile) onClose(); }}
                className="text-[10px] font-bold text-black border-2 border-black px-2 py-1.5 hover:bg-yellow-300 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 text-left flex items-center gap-1.5 bg-white"
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="px-4 py-2 border-t border-black/10 flex-shrink-0">
        <p className="text-[9px] text-gray-300 font-medium text-center">
          Reason. Learn. Build. — Tark AI
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div
          className={`md:hidden fixed inset-y-0 left-0 z-40 w-72 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out bg-white border-r-2 border-black flex flex-col h-full overflow-hidden shadow-xl`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black bg-white flex-shrink-0">
            <span className="font-black text-black text-sm uppercase tracking-wider">Mentor Session</span>
            <button
              onClick={onClose}
              className="p-1.5 border-2 border-black text-black hover:bg-yellow-100 transition-colors"
              aria-label="Close sidebar"
            >
              <FiX size={16} strokeWidth={3} />
            </button>
          </div>
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {sidebarContent}
          </div>
        </div>
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </>
    );
  }

  return (
    <aside
      className={`hidden md:flex flex-col z-30 overflow-hidden
        ${isOpen ? "w-72" : "w-0"} transition-[width] duration-300 ease-in-out
        bg-white border-r-2 border-black flex-shrink-0`}
    >
      {sidebarContent}
    </aside>
  );
};
