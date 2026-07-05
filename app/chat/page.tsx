"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FiSend,
  FiUser,
  FiCopy,
  FiCheck,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiThumbsUp,
  FiThumbsDown,
  FiChevronDown,
  FiRepeat,
  FiPaperclip,
  FiArrowLeft,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import { ChatSidebar } from "@/component/ChatSidebar";
import ThemeToggle from "@/component/ThemeToggle";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

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
    "How can AI help developers in 2025?",
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

// ── Code Block ──────────────────────────────────────────────────────
const CodeBlockWithCopy: React.FC<{
  code: string;
  language: string;
}> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const languageMap: Record<string, string> = {
    javascript: "JavaScript", typescript: "TypeScript", python: "Python",
    jsx: "JSX", tsx: "TSX", css: "CSS", html: "HTML", json: "JSON",
    bash: "Bash", sql: "SQL", java: "Java", cpp: "C++", go: "Go", rust: "Rust",
  };

  return (
    <div className="relative group w-full my-4 overflow-hidden rounded-2xl border border-[#1e1e1e]/20 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between bg-[#1e1e1e] px-4 py-2">
        <span className="text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider">
          {languageMap[language.toLowerCase()] || language.toUpperCase()}
        </span>
        <button
          onClick={copyToClipboard}
          className="p-1 px-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all flex items-center gap-1 text-[10px] font-bold"
        >
          {copied ? <FiCheck size={11} strokeWidth={3} /> : <FiCopy size={11} strokeWidth={2.5} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="w-full overflow-x-auto bg-[#1e1e1e]">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          showLineNumbers
          className="!bg-transparent !p-0 !m-0"
          customStyle={{ margin: 0, padding: "1.2rem", background: "transparent", fontSize: "0.75rem", lineHeight: "1.6", minWidth: "100%", overflowX: "auto" }}
          codeTagProps={{ style: { fontSize: "0.75rem", lineHeight: "1.6", display: "block" } }}
          lineNumberStyle={{ minWidth: "2.5em", paddingRight: "1em", color: "#555", userSelect: "none" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const TableWithCopy: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  const copyToClipboard = async () => {
    try {
      if (!tableRef.current) return;
      const rows = Array.from(tableRef.current.querySelectorAll("tr"));
      const text = rows.map(r => Array.from(r.querySelectorAll("th, td")).map(c => c.textContent?.trim() || "").join("\t")).join("\n");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="relative group w-full my-4 overflow-hidden rounded-2xl border border-black/5 flex flex-col bg-white shadow-sm">
      <div className="flex items-center justify-between bg-black/[0.02] px-4 py-2 border-b border-black/5">
        <span className="text-[#111111] font-bold text-[10px] uppercase tracking-wider">Data Table</span>
        <button onClick={copyToClipboard} className="p-1 px-3 bg-white hover:bg-[#F8FAFC] text-[#111111] border border-black/5 rounded-full transition-all flex items-center gap-1 text-[10px] font-bold shadow-sm">
          {copied ? <FiCheck size={11} strokeWidth={3} /> : <FiCopy size={11} strokeWidth={2.5} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table ref={tableRef} className="w-full text-left border-collapse min-w-max text-xs">{children}</table>
      </div>
    </div>
  );
};

// ── Markdown renderer ───────────────────────────────────────────────
const MarkdownMessage: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  if (isUser) return <div className="whitespace-pre-wrap break-words font-semibold text-xs sm:text-sm">{content}</div>;

  const components: Components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");
      const isMultiLine = codeString.includes("\n");
      const hasLanguage = match && match[1];
      if (!inline && (hasLanguage || isMultiLine)) {
        return <div className="w-full max-w-full overflow-hidden"><CodeBlockWithCopy code={codeString} language={hasLanguage ? match[1] : "text"} /></div>;
      }
      return <code className="bg-[#6D5DF6]/10 text-[#6D5DF6] px-1.5 py-0.5 rounded font-mono text-xs font-semibold break-all" {...props}>{children}</code>;
    },
    h1: ({ children }) => <h1 className="text-lg font-bold text-[#111111] mt-4 mb-2 uppercase tracking-wide">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base font-bold text-[#111111] mt-4 mb-2 uppercase tracking-wide">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-bold text-[#111111] mt-3 mb-2 uppercase tracking-wide">{children}</h3>,
    ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 my-2.5 font-medium">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 my-2.5 font-medium">{children}</ol>,
    li: ({ children }) => <li className="text-[#111111] font-medium leading-relaxed">{children}</li>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-[#6D5DF6]/40 pl-4 font-semibold italic text-[#667085] my-3 bg-[#6D5DF6]/5 py-2.5 rounded-r-xl">{children}</blockquote>,
    a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#6D5DF6] font-bold underline hover:opacity-85 transition-opacity">{children}</a>,
    p: ({ children }) => <p className="mb-2.5 font-medium text-[#111111] leading-relaxed">{children}</p>,
    strong: ({ children }) => <strong className="font-bold text-[#111111]">{children}</strong>,
    table: ({ children }) => <TableWithCopy>{children}</TableWithCopy>,
    thead: ({ children }) => <thead className="border-b border-black/5 bg-black/[0.01]">{children}</thead>,
    tbody: ({ children }) => <tbody className="bg-white">{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-black/5 last:border-0 hover:bg-[#F8FAFC] transition-colors">{children}</tr>,
    th: ({ children }) => <th className="p-3 font-bold text-[#111111] uppercase tracking-wider whitespace-nowrap">{children}</th>,
    td: ({ children }) => <td className="p-3 font-medium text-[#667085] border-r border-black/5 last:border-r-0">{children}</td>,
  };

  return (
    <div className="prose prose-sm max-w-none overflow-hidden">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{content}</ReactMarkdown>
    </div>
  );
};

// ── Main Chat App ───────────────────────────────────────────────────
const ChatApp: React.FC = () => {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [feedback, setFeedback] = useState<{ [id: string]: "like" | "dislike" | null }>({});
  const [inputValue, setInputValue] = useState("");
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const thinkingTimeoutRef = useRef<any>(null);

  const cancelActiveRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
    setIsWaitingForResponse(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
      }
    };
  }, []);

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const wordCount = getWordCount(inputValue);
  const maxWords = 300;

  const [selectedPersona, setSelectedPersona] = useState<PersonaData | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const persistConversationMessages = useCallback((convId: string, nextMessages: Message[]) => {
    setConversationMessages(prev => ({ ...prev, [convId]: nextMessages }));
  }, []);

  const createConversation = useCallback((title: string, personaKey: string) => {
    const id = crypto.randomUUID();
    const conversation: Conversation = { id, title, persona_key: personaKey, created_at: new Date().toISOString() };
    setConversations(prev => [conversation, ...prev]);
    setConversationMessages(prev => ({ ...prev, [id]: [] }));
    return id;
  }, []);

  const loadMessages = useCallback((convId: string) => {
    setMessages(conversationMessages[convId] ?? []);
  }, [conversationMessages]);

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
    messagesEndRef.current?.scrollIntoView({
      behavior: isWaitingForResponse ? "smooth" : "auto",
    });
  }, [messages, isWaitingForResponse]);

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
    cancelActiveRequest();
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
    setMessages([]);
    setActiveConversationId(null);
    setSwitcherOpen(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !selectedPersona) return;

    cancelActiveRequest();

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text, timestamp: Date.now() };
    const nextMessages: Message[] = [...messages, userMsg];
    setMessages(nextMessages);

    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation(text.slice(0, 50), selectedPersona.key);
      setActiveConversationId(convId);
    }
    if (convId) persistConversationMessages(convId, nextMessages);

    setInputValue("");
    setIsLoading(true);

    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
    }
    thinkingTimeoutRef.current = setTimeout(() => {
      setIsWaitingForResponse(true);
    }, 180);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const assistantMsgId = crypto.randomUUID();
    let hasAddedAssistantMsg = false;

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          personaKey: selectedPersona.key,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });

        if (acc.trim() !== "") {
          if (thinkingTimeoutRef.current) {
            clearTimeout(thinkingTimeoutRef.current);
            thinkingTimeoutRef.current = null;
          }
          setIsWaitingForResponse(false);

          if (!hasAddedAssistantMsg) {
            hasAddedAssistantMsg = true;
            const assistantMsg: Message = {
              id: assistantMsgId,
              role: "assistant",
              content: acc,
              timestamp: Date.now(),
            };
            setMessages(prev => {
              if (prev.some(m => m.id === assistantMsgId)) {
                return prev.map(m => m.id === assistantMsgId ? { ...m, content: acc } : m);
              }
              const updated = [...prev, assistantMsg];
              if (convId) persistConversationMessages(convId, updated);
              return updated;
            });
          } else {
            setMessages(prev => {
              const updated = prev.map(m => m.id === assistantMsgId ? { ...m, content: acc } : m);
              if (convId) persistConversationMessages(convId, updated);
              return updated;
            });
          }
        }
      }

      if (acc.trim() === "") {
        setMessages(prev => {
          const updated = prev.filter(m => m.id !== assistantMsgId);
          if (convId) persistConversationMessages(convId, updated);
          return updated;
        });
      } else {
        if (convId) {
          persistConversationMessages(convId, [
            ...nextMessages,
            { id: assistantMsgId, role: "assistant", content: acc, timestamp: Date.now() },
          ]);
        }
      }
    } catch (err: any) {
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
        thinkingTimeoutRef.current = null;
      }
      setIsWaitingForResponse(false);

      if (err.name === "AbortError") {
        console.log("Fetch aborted");
        return;
      }
      console.error(err);
      
      const errorContent = "Sorry, something went wrong. Please try again.";
      const errorMsg: Message = {
        id: assistantMsgId,
        role: "assistant",
        content: errorContent,
        timestamp: Date.now(),
      };

      setMessages(prev => {
        const exists = prev.some(m => m.id === assistantMsgId);
        const updated = exists
          ? prev.map(m => m.id === assistantMsgId ? { ...m, content: errorContent } : m)
          : [...prev, errorMsg];
        if (convId) persistConversationMessages(convId, updated);
        return updated;
      });
    } finally {
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
        thinkingTimeoutRef.current = null;
      }
      setIsWaitingForResponse(false);

      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (wordCount <= maxWords) sendMessage(inputValue);
  };

  const handleSendTopic = (topic: string) => sendMessage(topic);

  const handleNewChat = () => {
    cancelActiveRequest();
    setMessages([]);
    setActiveConversationId(null);
    if (isMobile) setMobileSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    cancelActiveRequest();
    setActiveConversationId(id);
    loadMessages(id);
    if (isMobile) setMobileSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    if (activeConversationId === id) {
      cancelActiveRequest();
    }
    setConversations(prev => prev.filter(c => c.id !== id));
    setConversationMessages(prev => { const next = { ...prev }; delete next[id]; return next; });
    if (activeConversationId === id) handleNewChat();
  };

  const handleBackToPersonas = () => {
    cancelActiveRequest();
    localStorage.removeItem("selectedPersona");
    router.push("/persona");
  };

  const toggleSidebar = () => {
    if (isMobile) setMobileSidebarOpen(prev => !prev);
    else setSidebarOpen(prev => !prev);
  };

  const copyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(id);
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch { /* ignore */ }
  };

  const personaKey = selectedPersona?.key ?? "";
  const greeting = PERSONA_GREETINGS[personaKey] ?? "Hello! 👋";
  const tagline = PERSONA_TAGLINES[personaKey] ?? "Ask me anything.";
  const placeholder = PERSONA_PLACEHOLDERS[personaKey] ?? "Type a message...";
  const topicChips = PERSONA_TOPIC_CHIPS[personaKey] ?? ["Web Dev", "AI", "Career", "Projects", "DSA", "Backend"];
  const suggestedPrompts = PERSONA_PROMPTS[personaKey] ?? DEFAULT_PROMPTS;
  const personaFirstName = selectedPersona?.name?.split(" ")[0] ?? "Tark AI";

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
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onBackToPersonas={handleBackToPersonas}
        onClose={() => setMobileSidebarOpen(false)}
        onSendTopic={handleSendTopic}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 z-10">

        {/* Chat Header */}
        <header
          className="flex-shrink-0 chat-header-glass px-5 py-2 flex items-center justify-between z-20 rounded-b-2xl transition-all duration-300"
        >
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
                    onClick={() => setSwitcherOpen(o => !o)}
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
            {messages.length === 0 && selectedPersona && (
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
                      onClick={() => sendMessage(prompt)}
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

            {/* Message Bubbles */}
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const accent = selectedPersona ? PERSONA_ACCENT[selectedPersona.key] : "#6D5DF6";

              // Never render an assistant message whose content is empty or only whitespace.
              if (!isUser && (!msg.content || !msg.content.trim())) {
                return null;
              }

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 group animate-message-appear ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Avatar */}
                  {!isUser && (
                    <div className="flex-shrink-0 mt-0.5">
                      <img
                        src={selectedPersona?.image || "/favicon.ico"}
                        alt={selectedPersona?.name || "AI"}
                        className="w-7 h-7 object-cover border border-white shadow rounded-full"
                      />
                    </div>
                  )}

                  <div className={`max-w-[82%] flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
                    {msg.timestamp && (
                      <span className="text-[9px] text-[#667085] font-semibold opacity-0 group-hover:opacity-100 transition-opacity px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}

                    <div
                      className={`px-4.5 py-3 border text-xs sm:text-sm shadow-sm ${isUser
                        ? "text-white rounded-[20px] rounded-tr-none border-transparent"
                        : "bg-white/70 dark:bg-white/5 backdrop-blur-xl text-[#111111] rounded-[20px] rounded-tl-none border-white/60 dark:border-white/10"
                        }`}
                      style={isUser ? {
                        background: "linear-gradient(135deg, #6D5DF6 0%, #8b5cf6 100%)",
                      } : {
                        borderLeft: `3.5px solid ${accent}`
                      }}
                    >
                      {/* Thinking spinner */}
                      {!isUser && msg.content === "" && isLoading ? (
                        <div className="flex items-center gap-2 py-0.5">
                          <span className="text-[11px] text-[#667085] font-semibold">{personaFirstName} is thinking</span>
                          <span className="flex gap-1">
                            {[0, 1, 2].map(i => (
                              <span
                                key={i}
                                className="w-1 h-1 bg-[#6D5DF6] rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                              />
                            ))}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                          <MarkdownMessage content={msg.content} isUser={isUser} />
                        </div>
                      )}
                    </div>

                    {/* Action Panel */}
                    {msg.content && !isUser && (
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                        <button
                          onClick={() => copyMessage(msg.id, msg.content)}
                          className="flex items-center gap-1 text-[9px] font-bold text-[#667085] hover:text-[#111111] bg-white border border-black/5 px-2.5 py-1 rounded-full transition-all shadow-sm"
                          title="Copy message"
                        >
                          {copiedMsgId === msg.id ? <FiCheck size={10} className="text-green-600 font-extrabold" /> : <FiCopy size={10} />}
                          <span>{copiedMsgId === msg.id ? "Copied" : "Copy"}</span>
                        </button>
                        <button
                          onClick={() => setFeedback(f => ({ ...f, [msg.id]: f[msg.id] === "like" ? null : "like" }))}
                          className={`p-1.5 bg-white border border-black/5 rounded-full shadow-sm transition-all ${feedback[msg.id] === "like" ? "text-green-600" : "text-gray-400 hover:text-green-600"}`}
                          aria-label="Like"
                        >
                          <FiThumbsUp size={10} />
                        </button>
                        <button
                          onClick={() => setFeedback(f => ({ ...f, [msg.id]: f[msg.id] === "dislike" ? null : "dislike" }))}
                          className={`p-1.5 bg-white border border-black/5 rounded-full shadow-sm transition-all ${feedback[msg.id] === "dislike" ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                          aria-label="Dislike"
                        >
                          <FiThumbsDown size={10} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User icon */}
                  {isUser && (
                    <div className="flex-shrink-0 mt-0.5 w-7 h-7 bg-gradient-to-tr from-[#6D5DF6] to-[#8b5cf6] rounded-full flex items-center justify-center shadow-sm">
                      <FiUser className="text-white" size={13} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Thinking Indicator */}
            <div className={`transition-all duration-200 ease-in-out ${isWaitingForResponse ? 'h-9 opacity-100 translate-y-0 py-2' : 'h-0 opacity-0 -translate-y-1 overflow-hidden py-0'}`}>
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
                      sendMessage(inputValue);
                    }
                  }
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={2}
                placeholder={`Ask ${personaFirstName} about React, Backend, AI, Career...`}
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
