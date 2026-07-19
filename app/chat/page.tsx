"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiRepeat,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { ChatSidebar } from "@/component/ChatSidebar";
import ThemeToggle from "@/component/ThemeToggle";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { useChat } from "@/hooks/useChat";

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

// ── Per-persona content ─────────────────────────────────────────────
const PERSONA_GREETINGS: Record<string, string> = {
  hiteshchoudhary: "Haanji!",
  piyushgarg: "Hey there!",
};

const PERSONA_TAGLINES: Record<string, string> = {
  hiteshchoudhary: "Ask me anything about coding, career, or tech.",
  piyushgarg: "Let's talk GenAI, backend, or startup building.",
};

const DYNAMIC_GREETING: Record<string, string> = {
  hiteshchoudhary: "Hi, I'm Hitesh. Let's build something practical today.",
  piyushgarg: "Hi, I'm Piyush. Let's understand systems before coding today.",
};

const PERSONA_PLACEHOLDERS: Record<string, string> = {
  hiteshchoudhary: "Haanji... kya banana hai aaj?",
  piyushgarg: "Ask about GenAI, system design...",
};

const PERSONA_TOPIC_CHIPS: Record<string, string[]> = {
  hiteshchoudhary: ["Web Dev", "JavaScript", "AI", "Career", "DSA", "Projects"],
  piyushgarg: ["GenAI", "Backend", "System Design", "Startup", "Node.js", "Docker"],
};

const PERSONA_PROMPTS: Record<string, string[]> = {
  hiteshchoudhary: [
    "How should I start learning backend development?",
    "What projects should I build as a beginner?",
    "How can AI help developers in 2026?",
    "What is the difference between SQL and NoSQL?",
    "How do I get my first dev job?",
    "Explain React hooks in simple terms",
  ],
  piyushgarg: [
    "How do I get started with GenAI development?",
    "What is system design and why does it matter?",
    "How to build a scalable backend from scratch?",
    "What are MCP servers and how do they work?",
    "Roadmap for becoming a full stack engineer",
    "How to scale a Node.js application?",
  ],
};

const PERSONA_ACCENT: Record<string, string> = {
  hiteshchoudhary: "#6D5DF6",
  piyushgarg: "#06B6D4",
};

const SWITCH_PERSONAS = [
  {
    key: "hiteshchoudhary",
    name: "Hitesh Choudhary",
    role: "Founder, Chai Code · Full-Stack & Career Mentor",
    image: "/hiteshchoudhary.png",
    accent: "#6D5DF6",
    badge: "Chai Code",
  },
  {
    key: "piyushgarg",
    name: "Piyush Garg",
    role: "Founder, Teachyst · AI & Backend Engineering Mentor",
    image: "/piyushgarg.png",
    accent: "#06B6D4",
    badge: "GenAI",
  },
];

const DEFAULT_PROMPTS = [
  "How should I start learning programming?",
  "What projects should I build as a beginner?",
  "How can AI help developers?",
  "Explain the difference between frontend and backend",
  "How to get my first developer job?",
  "What is system design?",
];

// ── Main Chat App ───────────────────────────────────────────────────
const ChatApp: React.FC = () => {
  const router = useRouter();

  const [selectedPersona, setSelectedPersona] = useState<PersonaData | null>(null);
  const personaKey = selectedPersona?.key ?? "";

  // All conversation/branch/message state + streaming lives in this hook.
  const chat = useChat(personaKey);
  const {
    thread,
    isLoading,
    isWaiting,
    sendMessage,
    stop,
    conversations,
    activeConversationId,
    branchesForActive,
    currentBranchId,
    startNewChat,
    selectConversation,
    deleteConversation,
    createBranchFromMessage,
    switchBranch,
    renameBranch,
    deleteBranch,
  } = chat;

  const [inputValue, setInputValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const wordCount = getWordCount(inputValue);
  const maxWords = 300;

  // Load selected persona (or bounce to the picker).
  useEffect(() => {
    const stored = localStorage.getItem("selectedPersona");
    if (stored) {
      try { setSelectedPersona(JSON.parse(stored)); }
      catch { /* ignore */ }
    } else {
      router.push("/persona");
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: isWaiting ? "smooth" : "auto" });
  }, [thread, isWaiting]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close switcher on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    if (switcherOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [switcherOpen]);

  const handleSwitchPersona = (p: typeof SWITCH_PERSONAS[0]) => {
    stop();
    const personaData: PersonaData = {
      key: p.key,
      name: p.name,
      role: p.role,
      personality: "",
      image: p.image,
      communicationStyle: "Engaging and thoughtful",
      tone: "Professional yet approachable",
      expertise: "Various fields of knowledge",
      additionalContext: "",
    };
    localStorage.setItem("selectedPersona", JSON.stringify(personaData));
    setSelectedPersona(personaData);
    startNewChat();
    setSwitcherOpen(false);
  };

  const send = (text: string) => {
    if (!text.trim() || isLoading || !selectedPersona) return;
    setInputValue("");
    sendMessage(text);
  };

  const handleSendMessage = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (wordCount <= maxWords) send(inputValue);
  };

  const handleNewChat = () => {
    stop();
    startNewChat();
    if (isMobile) setMobileSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    stop();
    selectConversation(id);
    if (isMobile) setMobileSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    if (activeConversationId === id) stop();
    deleteConversation(id);
  };

  const handleBackToPersonas = () => {
    stop();
    localStorage.removeItem("selectedPersona");
    router.push("/persona");
  };

  const toggleSidebar = () => {
    if (isMobile) setMobileSidebarOpen((prev) => !prev);
    else setSidebarOpen((prev) => !prev);
  };

  const greeting = PERSONA_GREETINGS[personaKey] ?? "Hello! 👋";
  const tagline = PERSONA_TAGLINES[personaKey] ?? "Ask me anything.";
  const placeholder = PERSONA_PLACEHOLDERS[personaKey] ?? "Type a message...";
  const topicChips = PERSONA_TOPIC_CHIPS[personaKey] ?? ["Web Dev", "AI", "Career", "Projects", "DSA", "Backend"];
  const suggestedPrompts = PERSONA_PROMPTS[personaKey] ?? DEFAULT_PROMPTS;
  const personaFirstName = selectedPersona?.name?.split(" ")[0] ?? "Tark AI";
  const accent = selectedPersona ? PERSONA_ACCENT[selectedPersona.key] ?? "#6D5DF6" : "#6D5DF6";

  // Silence unused-warning while keeping persona content available for future UI.
  void greeting; void tagline; void topicChips;

  return (
    <div className="flex h-screen bg-transparent font-sans overflow-hidden relative">

      {/* Background elements */}
      <div className="saas-grid" />
      <div className="hero-glow pointer-events-none" />

      {/* Sidebar */}
      <ChatSidebar
        isOpen={isMobile ? mobileSidebarOpen : sidebarOpen}
        isMobile={isMobile}
        selectedPersona={selectedPersona}
        conversations={conversations}
        activeConversationId={activeConversationId}
        branchesForActive={branchesForActive}
        currentBranchId={currentBranchId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onSwitchBranch={switchBranch}
        onRenameBranch={renameBranch}
        onDeleteBranch={deleteBranch}
        onBackToPersonas={handleBackToPersonas}
        onClose={() => setMobileSidebarOpen(false)}
        onSendTopic={send}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 z-10">

        {/* Chat Header */}
        <header className="flex-shrink-0 chat-header-glass px-5 py-2 flex items-center justify-between z-20 rounded-b-2xl transition-all duration-300">
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Sidebar toggle */}
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Toggle sidebar"
            >
              {isMobile
                ? (mobileSidebarOpen
                  ? <FiX size={16} strokeWidth={2.5} className="text-[#667085] dark:text-[#94A3B8]" />
                  : <FiMenu size={16} strokeWidth={2.5} className="text-[#667085] dark:text-[#94A3B8]" />)
                : (sidebarOpen
                  ? <FiChevronLeft size={16} strokeWidth={2.5} className="text-[#667085] dark:text-[#94A3B8]" />
                  : <FiChevronRight size={16} strokeWidth={2.5} className="text-[#667085] dark:text-[#94A3B8]" />)
              }
            </button>

            {/* Back button */}
            <button
              onClick={handleBackToPersonas}
              className="flex items-center gap-1 text-[10px] font-bold chat-header-back-text transition-colors px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Back to personas"
            >
              <FiArrowLeft size={12} strokeWidth={3} className="chat-header-back-text" />
              <span className="hidden sm:inline chat-header-back-text">Back</span>
            </button>
          </div>

          {/* Persona info + Switch dropdown */}
          {selectedPersona && (
            <div className="flex items-center gap-4 flex-1 min-w-0 justify-between ml-3">
              {/* Left: avatar + name & subtitle */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={selectedPersona.image}
                    alt={selectedPersona.name}
                    className="w-8 h-8 object-cover rounded-full shadow-sm"
                    style={{ border: "1.5px solid rgba(255,255,255,0.8)" }}
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border-2 border-white dark:border-[#0F121C] rounded-full" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h1 className="font-extrabold text-[13px] chat-header-name leading-none truncate tracking-tight">{selectedPersona.name}</h1>
                  <p className="text-[10px] chat-header-subtitle font-bold mt-0.5 leading-none hidden sm:block">Inspired by public lectures</p>
                </div>
              </div>

              {/* Right: theme toggle + switch button */}
              <div className="flex items-center gap-3.5 flex-shrink-0">
                <ThemeToggle />

                <div className="relative" ref={switcherRef}>
                  {/* Glass pill switch button */}
                  <button
                    onClick={() => setSwitcherOpen((o) => !o)}
                    aria-label="Switch mentor"
                    className="flex items-center gap-1.5 h-8 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider chat-switch-text transition-all duration-200 border border-black/10 dark:border-white/10 bg-white/60 hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.05)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DF6]/40 cursor-pointer"
                  >
                    <FiRepeat size={10} strokeWidth={2.5} className="chat-switch-text" />
                    <span className="hidden sm:inline chat-switch-text">Switch</span>
                    <FiChevronDown
                      size={10}
                      strokeWidth={2.5}
                      className={`chat-switch-text transition-transform duration-200 ${switcherOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown popup */}
                  {switcherOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white/80 dark:bg-[#0F121C]/80 border border-white/60 dark:border-white/5 shadow-xl backdrop-blur-3xl rounded-2xl overflow-hidden z-50 animate-message-appear">
                      <div className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5 px-4 py-3 flex items-center justify-between">
                        <span className="text-[#111111] dark:text-[#F8FAFC] font-bold text-[10px] uppercase tracking-widest">Switch Mentor</span>
                        <button
                          onClick={() => setSwitcherOpen(false)}
                          className="text-[#667085] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-[#F8FAFC] transition-colors"
                        >
                          <FiX size={13} strokeWidth={3} />
                        </button>
                      </div>

                      <div className="p-2 space-y-1">
                        {SWITCH_PERSONAS.map((p) => {
                          const isActive = selectedPersona?.key === p.key;
                          return (
                            <div
                              key={p.key}
                              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-150 ${isActive
                                ? "border-[#6D5DF6]/20 bg-[#6D5DF6]/5 cursor-default"
                                : "border-transparent hover:bg-black/[0.025] dark:hover:bg-white/[0.03] cursor-pointer"
                                }`}
                              onClick={() => !isActive && handleSwitchPersona(p)}
                            >
                              <div className="relative flex-shrink-0">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-10 h-10 object-cover border border-white dark:border-white/10 rounded-full"
                                />
                                {isActive && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-white rounded-full flex items-center justify-center">
                                    <FiCheck size={7} strokeWidth={4} className="text-white" />
                                  </span>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-xs text-[#111111] dark:text-[#F8FAFC] truncate">{p.name}</p>
                                <p className="text-[9px] text-[#667085] dark:text-[#94A3B8] font-semibold truncate mt-0.5">{p.role.split("·")[0]}</p>
                              </div>

                              {!isActive && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleSwitchPersona(p); }}
                                  className="flex-shrink-0 text-[8px] font-bold uppercase tracking-wider text-white px-2.5 py-1.5 rounded-full"
                                  style={{ background: p.accent }}
                                >
                                  Switch
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-transparent">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 w-full">

            {/* Empty State */}
            {thread.length === 0 && selectedPersona && (
              <div className="flex flex-col items-center text-center pt-16 pb-12 animate-message-appear max-w-xl mx-auto space-y-6">
                <div className="relative">
                  <img
                    src={selectedPersona.image}
                    alt={selectedPersona.name}
                    className="w-16 h-16 object-cover border border-white dark:border-white/10 rounded-full shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-white/10 rounded-full" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-[#111111]">{selectedPersona.name}</h2>
                  <p className="text-xs text-[#667085] font-semibold">
                    {DYNAMIC_GREETING[selectedPersona.key] || "Let's learn something new today."}
                  </p>
                </div>

                {/* Suggestion Chips */}
                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  {["Backend", "React", "AI", "Career", "Docker", "System Design"].map(chip => (
                    <button
                      key={chip}
                      onClick={() => setInputValue(prev => prev ? `${prev} ${chip}` : chip)}
                      className="px-3 py-1 bg-white border border-black/5 text-[10px] font-bold text-[#667085] rounded-full shadow-sm hover:bg-[#FAF9F5] transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* 4 Minimal Prompt Suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-4">
                  {suggestedPrompts.slice(0, 4).map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => send(prompt)}
                      className="
                        text-left px-4 py-3
                        bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5
                        rounded-xl shadow-sm
                        hover:border-[#6D5DF6]/35 dark:hover:border-[#7B61FF]/35
                        transition-all duration-200
                        text-xs font-semibold text-[#111111]
                      "
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Bubbles (branch-aware thread) */}
            {thread.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                personaImage={selectedPersona?.image}
                personaName={selectedPersona?.name}
                accent={accent}
                onCreateBranch={createBranchFromMessage}
              />
            ))}

            {/* Thinking Indicator (mentor avatar + name + animated dots, after 180ms) */}
            <div className={`transition-all duration-200 ease-in-out ${isWaiting ? 'h-9 opacity-100 translate-y-0 py-2' : 'h-0 opacity-0 -translate-y-1 overflow-hidden py-0'}`}>
              {selectedPersona && (
                <div className="flex items-center gap-3 px-1 text-[#667085] dark:text-[#94A3B8]">
                  <img
                    src={selectedPersona.image}
                    alt={selectedPersona.name}
                    className="w-7 h-7 object-cover border border-white dark:border-white/10 shadow rounded-full"
                  />
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span>{personaFirstName} is thinking</span>
                    <span className="flex gap-1 items-center">
                      <span className="w-1 h-1 bg-[#6D5DF6] rounded-full animate-pulse" />
                      <span className="w-1 h-1 bg-[#6D5DF6] rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                      <span className="w-1 h-1 bg-[#6D5DF6] rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex-shrink-0 bg-transparent">
          <div className="max-w-3xl mx-auto px-4 pb-6">
            <form
              onSubmit={handleSendMessage}
              className="relative flex items-center chat-composer-glass rounded-2xl px-4 py-2.5 gap-3 transition-all duration-300"
              style={isFocused && selectedPersona ? {
                borderColor: `${PERSONA_ACCENT[selectedPersona.key]}45`,
                boxShadow: `0 4px 24px ${PERSONA_ACCENT[selectedPersona.key]}0d, 0 0 0 2px ${PERSONA_ACCENT[selectedPersona.key]}1a`
              } : {}}
            >
              <textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isLoading && inputValue.trim() && wordCount <= maxWords) {
                      send(inputValue);
                    }
                  }
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={2}
                placeholder={placeholder !== "Type a message..." ? placeholder : `Ask ${personaFirstName} about React, Backend, AI, Career...`}
                className="
                  flex-1 chat-composer-textarea font-medium text-xs sm:text-sm
                  bg-transparent border-0 focus:outline-none resize-none
                  disabled:opacity-60 placeholder-[#8A94A6] dark:placeholder-[#8d94a7]
                  py-1.5 scrollbar-none h-[42px] max-h-[120px]
                "
              />

              {wordCount > maxWords && (
                <div className="absolute left-5 -bottom-5 text-[10px] font-bold text-red-500">Max 300 words</div>
              )}

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading || wordCount > maxWords}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                  ${inputValue.trim() && !isLoading && wordCount <= maxWords
                    ? "shadow-sm dark:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                    : "cursor-not-allowed"
                  }
                `}
                style={inputValue.trim() && !isLoading && wordCount <= maxWords ? {
                  background: `linear-gradient(135deg, ${selectedPersona ? PERSONA_ACCENT[selectedPersona.key] : "#6D5DF6"}, #8b5cf6)`,
                  color: "#ffffff"
                } : {
                  backgroundColor: selectedPersona ? `${PERSONA_ACCENT[selectedPersona.key]}14` : "rgba(109, 93, 246, 0.08)",
                  color: selectedPersona ? PERSONA_ACCENT[selectedPersona.key] : "#6D5DF6",
                  opacity: 0.4
                }}
              >
                <FiSend size={12} strokeWidth={3} />
              </button>
            </form>

            <p className="text-center text-[#667085] text-[9px] font-semibold mt-3">
              Tark AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
