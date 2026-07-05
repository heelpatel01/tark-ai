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
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import { ChatSidebar } from "@/component/ChatSidebar";

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
  hiteshchoudhary: "👋 Haanji!",
  piyushgarg: "Hey there! 👋",
};

const PERSONA_TAGLINES: Record<string, string> = {
  hiteshchoudhary: "Ask me anything about coding, career, or tech.",
  piyushgarg: "Let's talk GenAI, backend, or startup building.",
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
    <div className="relative group w-full my-3 overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-between bg-[#1e1e1e] border-b-2 border-black px-3 py-2">
        <span className="text-cyan-400 font-mono text-xs font-bold uppercase">
          {languageMap[language.toLowerCase()] || language.toUpperCase()}
        </span>
        <button
          onClick={copyToClipboard}
          className="p-1.5 px-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold border-2 border-black transition-all flex items-center gap-1.5 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          {copied ? <><FiCheck size={13} strokeWidth={3} /><span>Copied!</span></> : <><FiCopy size={13} strokeWidth={3} /><span>Copy</span></>}
        </button>
      </div>
      <div className="w-full overflow-x-auto bg-[#1e1e1e]">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          showLineNumbers
          className="!bg-transparent !p-0 !m-0"
          customStyle={{ margin: 0, padding: "1rem", background: "transparent", fontSize: "0.8rem", lineHeight: "1.5", minWidth: "100%", overflowX: "auto" }}
          codeTagProps={{ style: { fontSize: "0.8rem", lineHeight: "1.5", display: "block" } }}
          lineNumberStyle={{ minWidth: "3em", paddingRight: "1em", color: "#555", userSelect: "none" }}
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
    <div className="relative group w-full my-4 overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col bg-white">
      <div className="flex items-center justify-between bg-yellow-200 border-b-4 border-black px-3 py-2">
        <span className="text-black font-black text-xs uppercase">Data Table</span>
        <button onClick={copyToClipboard} className="p-1.5 px-2.5 bg-white hover:bg-yellow-100 text-black font-bold border-2 border-black transition-all flex items-center gap-1.5 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
          {copied ? <><FiCheck size={13} strokeWidth={3} /><span>Copied!</span></> : <><FiCopy size={13} strokeWidth={3} /><span>Copy</span></>}
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table ref={tableRef} className="w-full text-left border-collapse min-w-max">{children}</table>
      </div>
    </div>
  );
};

// ── Markdown renderer ───────────────────────────────────────────────
const MarkdownMessage: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  if (isUser) return <div className="whitespace-pre-wrap break-words font-semibold">{content}</div>;

  const components: Components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");
      const isMultiLine = codeString.includes("\n");
      const hasLanguage = match && match[1];
      if (!inline && (hasLanguage || isMultiLine)) {
        return <div className="w-full max-w-full overflow-hidden"><CodeBlockWithCopy code={codeString} language={hasLanguage ? match[1] : "text"} /></div>;
      }
      return <code className="bg-yellow-200 px-1.5 py-0.5 border-2 border-black font-mono text-xs font-bold break-all" {...props}>{children}</code>;
    },
    h1: ({ children }) => <h1 className="text-xl font-black text-black mt-4 mb-2 uppercase">{children}</h1>,
    h2: ({ children }) => <h2 className="text-lg font-black text-black mt-4 mb-2 uppercase">{children}</h2>,
    h3: ({ children }) => <h3 className="text-base font-black text-black mt-3 mb-2 uppercase">{children}</h3>,
    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 font-bold">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 font-bold">{children}</ol>,
    li: ({ children }) => <li className="text-black font-medium">{children}</li>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-black pl-4 font-bold italic text-black my-2 bg-pink-100 py-2">{children}</blockquote>,
    a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-violet-700 underline decoration-2 decoration-violet-300 hover:bg-violet-50 transition-colors font-bold">{children}</a>,
    p: ({ children }) => <p className="mb-2 font-medium text-black leading-relaxed">{children}</p>,
    strong: ({ children }) => <strong className="font-black text-black">{children}</strong>,
    table: ({ children }) => <TableWithCopy>{children}</TableWithCopy>,
    thead: ({ children }) => <thead className="border-b-4 border-black">{children}</thead>,
    tbody: ({ children }) => <tbody className="bg-white">{children}</tbody>,
    tr: ({ children }) => <tr className="border-b-2 border-black last:border-0 hover:bg-yellow-100 transition-colors">{children}</tr>,
    th: ({ children }) => <th className="p-3 font-black text-black uppercase border-r-2 border-black last:border-r-0 whitespace-nowrap">{children}</th>,
    td: ({ children }) => <td className="p-3 font-medium text-black border-r-2 border-black last:border-r-0">{children}</td>,
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
  const [feedback, setFeedback] = useState<{ [id: string]: "like" | "dislike" | null }>({});
  const [inputValue, setInputValue] = useState("");
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !selectedPersona) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text, timestamp: Date.now() };
    let nextMessages: Message[] = [...messages, userMsg];
    setMessages(nextMessages);

    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation(text.slice(0, 50), selectedPersona.key);
      setActiveConversationId(convId);
    }
    if (convId) persistConversationMessages(convId, nextMessages);

    const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "", timestamp: Date.now() };
    nextMessages = [...nextMessages, assistantMsg];
    setMessages(nextMessages);
    if (convId) persistConversationMessages(convId, nextMessages);

    setInputValue("");
    setIsLoading(true);

    try {
      // Always use gemini — model is an implementation detail
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          personaKey: selectedPersona.key,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = prev.map(m => m.id === assistantMsg.id ? { ...m, content: acc } : m);
          if (convId) persistConversationMessages(convId, updated);
          return updated;
        });
      }

      if (convId) {
        persistConversationMessages(convId, [
          ...nextMessages.slice(0, -1),
          { ...assistantMsg, content: acc },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: "Sorry, something went wrong. Please try again." } : m));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (wordCount <= maxWords) sendMessage(inputValue);
  };

  const handleSendTopic = (topic: string) => sendMessage(topic);

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
    if (isMobile) setMobileSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    loadMessages(id);
    if (isMobile) setMobileSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setConversationMessages(prev => { const next = { ...prev }; delete next[id]; return next; });
    if (activeConversationId === id) handleNewChat();
  };

  const handleBackToPersonas = () => {
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

  // Resolved persona-specific content
  const personaKey = selectedPersona?.key ?? "";
  const greeting = PERSONA_GREETINGS[personaKey] ?? "Hello! 👋";
  const tagline = PERSONA_TAGLINES[personaKey] ?? "Ask me anything.";
  const placeholder = PERSONA_PLACEHOLDERS[personaKey] ?? "Type a message...";
  const topicChips = PERSONA_TOPIC_CHIPS[personaKey] ?? ["Web Dev", "AI", "Career", "Projects", "DSA", "Backend"];
  const suggestedPrompts = PERSONA_PROMPTS[personaKey] ?? DEFAULT_PROMPTS;
  const personaFirstName = selectedPersona?.name?.split(" ")[0] ?? "Tark AI";

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">

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
      <div className="flex-1 flex flex-col min-h-0 min-w-0">

        {/* ── Chat Header ── */}
        <header className="flex-shrink-0 bg-white border-b-2 border-black px-4 py-3 flex items-center gap-3 z-20">
          {/* Sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 border-2 border-black text-black hover:bg-yellow-100 transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {isMobile
              ? (mobileSidebarOpen ? <FiX size={18} strokeWidth={3} /> : <FiMenu size={18} strokeWidth={3} />)
              : (sidebarOpen ? <FiChevronLeft size={18} strokeWidth={3} /> : <FiChevronRight size={18} strokeWidth={3} />)
            }
          </button>

          {/* Persona info */}
          {selectedPersona && (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={selectedPersona.image}
                  alt={selectedPersona.name}
                  className="w-9 h-9 object-cover border-2 border-black rounded-full"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-black text-base leading-none truncate">{selectedPersona.name}</h1>
                  <span className="hidden sm:flex items-center gap-1 text-[9px] font-bold text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 hidden sm:block">Inspired by public talks and videos</p>
              </div>
            </div>
          )}

          {/* Right slot — intentionally empty for clean look */}
          <div className="flex-shrink-0" />
        </header>

        {/* ── Message Area ── */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 w-full">

            {/* Empty state */}
            {messages.length === 0 && selectedPersona && (
              <div className="flex flex-col items-center text-center pt-4 pb-8 animate-fade-up">
                {/* Large Avatar */}
                <div className="relative mb-5">
                  <img
                    src={selectedPersona.image}
                    alt={selectedPersona.name}
                    className="w-24 h-24 object-cover border-4 border-black rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)]"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-white rounded-full" style={{ borderWidth: 3, borderColor: "white" }} />
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-black mb-2">{greeting}</h2>
                <p className="text-gray-500 font-medium text-base mb-6 max-w-sm">{tagline}</p>

                {/* Topic pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {["Web Development", "AI", "Career", "System Design"].map(t => (
                    <button
                      key={t}
                      onClick={() => sendMessage(t)}
                      className="px-3.5 py-1.5 text-xs font-bold border-2 border-black bg-white hover:bg-yellow-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Suggested prompts grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      className="
                        text-left px-4 py-3
                        bg-white border-2 border-black
                        shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]
                        hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)]
                        hover:translate-x-[2px] hover:translate-y-[2px]
                        hover:bg-yellow-50
                        transition-all duration-150
                        text-xs font-medium text-gray-700
                        group
                      "
                    >
                      <span className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 group ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Assistant avatar */}
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 mt-1">
                    <img
                      src={selectedPersona?.image || "/favicon.ico"}
                      alt={selectedPersona?.name || "AI"}
                      className="w-8 h-8 object-cover border-2 border-black rounded-full"
                    />
                  </div>
                )}

                {/* Bubble */}
                <div className={`max-w-[78%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {/* Timestamp - visible on group hover */}
                  {msg.timestamp && (
                    <span className="text-[9px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}

                  <div
                    className={`px-4 py-3 border-2 border-black text-sm overflow-x-auto ${
                      msg.role === "user"
                        ? "text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.9)]"
                        : "bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)]"
                    }`}
                    style={msg.role === "user" ? {
                      background: "linear-gradient(135deg, #6D5DF6 0%, #9333EA 100%)",
                    } : {}}
                  >
                    {/* Typing indicator */}
                    {msg.role === "assistant" && msg.content === "" && isLoading ? (
                      <div className="flex items-center gap-2 py-0.5">
                        <span className="text-xs text-gray-500 font-medium">{personaFirstName} is thinking</span>
                        <span className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <span
                              key={i}
                              className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.18}s` }}
                            />
                          ))}
                        </span>
                      </div>
                    ) : (
                      <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                        <MarkdownMessage content={msg.content} isUser={msg.role === "user"} />
                      </div>
                    )}
                  </div>

                  {/* Actions (copy/like/dislike) — visible on group hover */}
                  {msg.content && msg.role === "assistant" && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                      <button
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-black border border-transparent hover:border-black px-2 py-1 transition-all"
                        title="Copy"
                      >
                        {copiedMsgId === msg.id ? <FiCheck size={11} strokeWidth={3} className="text-green-600" /> : <FiCopy size={11} strokeWidth={3} />}
                        {copiedMsgId === msg.id ? "Copied" : "Copy"}
                      </button>
                      <button
                        onClick={() => setFeedback(f => ({ ...f, [msg.id]: f[msg.id] === "like" ? null : "like" }))}
                        className={`p-1.5 border border-transparent hover:border-black transition-all ${feedback[msg.id] === "like" ? "text-green-600" : "text-gray-400 hover:text-green-600"}`}
                        aria-label="Like"
                      >
                        <FiThumbsUp size={11} strokeWidth={3} />
                      </button>
                      <button
                        onClick={() => setFeedback(f => ({ ...f, [msg.id]: f[msg.id] === "dislike" ? null : "dislike" }))}
                        className={`p-1.5 border border-transparent hover:border-black transition-all ${feedback[msg.id] === "dislike" ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                        aria-label="Dislike"
                      >
                        <FiThumbsDown size={11} strokeWidth={3} />
                      </button>
                    </div>
                  )}
                </div>

                {/* User avatar */}
                {msg.role === "user" && (
                  <div className="flex-shrink-0 mt-1 w-8 h-8 bg-violet-600 border-2 border-black rounded-full flex items-center justify-center">
                    <FiUser className="text-white" size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Input Area ── */}
        <div className="flex-shrink-0 bg-white border-t-2 border-black">
          {/* Topic chips — only when chat is empty */}
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto px-4 pt-3 flex flex-wrap gap-2">
              {topicChips.map(chip => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="text-[10px] font-bold text-gray-600 border border-black/30 px-3 py-1.5 hover:bg-violet-50 hover:border-violet-400 hover:text-violet-700 transition-all duration-150 rounded-full"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div className="max-w-2xl mx-auto px-4 py-3">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !isLoading && wordCount <= maxWords) handleSendMessage(e); }}
                placeholder={placeholder}
                disabled={isLoading}
                className="
                  w-full text-black font-medium text-sm
                  border-2 border-black
                  bg-white
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]
                  focus:shadow-[2px_2px_0px_0px_rgba(109,93,246,0.6)]
                  focus:border-violet-500
                  px-4 py-3.5 pr-14
                  focus:outline-none
                  disabled:opacity-50
                  transition-all duration-200
                  placeholder:text-gray-400 placeholder:font-normal
                "
              />
              {/* Word count warning */}
              {wordCount > maxWords && (
                <div className="absolute left-0 -bottom-5 text-xs font-black text-red-600">Max 300 words</div>
              )}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading || wordCount > maxWords}
                className={`
                  absolute right-2 top-2 w-10 h-10
                  border-2 border-black
                  flex items-center justify-center
                  transition-all duration-200
                  ${inputValue.trim() && !isLoading && wordCount <= maxWords
                    ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <FiSend size={15} strokeWidth={3} />
              </button>
            </form>

            {/* Footer disclaimer */}
            <p className="text-center text-gray-300 text-[10px] font-medium mt-2">
              Tark AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
