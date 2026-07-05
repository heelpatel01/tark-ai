"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Terminal,
  GitBranch,
  Cpu,
  Zap,
  ChevronDown,
  Users,
  MessageSquare,
  Brain,
  Server,
  Code2,
  CheckCircle2,
  Github,
  Sparkles,
  Send,
  Check,
  Play,
  ArrowUpRight,
} from "lucide-react";
import ThemeLogo from "@/component/ThemeLogo";

// ── Interactive preset Q&A for the comparison block ────────────────
const INTERACTIVE_QA = [
  {
    question: "Should I learn React or Vue?",
    hitesh: {
      answer: "Haanji! React seekh lo. Ecosystem bahut bada hai, library support kamal ki hai aur jobs market mein priority hai. Lekin framework tabhi samajh aayega jab core JavaScript strong hogi. Pehle normal JavaScript project banao, phir framework decide karo.",
      score: "9.6/10",
      style: "Direct & Practical",
      analogy: "React = Shahrukh Khan popularity",
    },
    piyush: {
      answer: "Dekho, pure tech perspective se systems understand karo. React robust ecosystem provide karta hai but Vue simple project structures ke liye clean hai. React seekhna secure bet hai, but framework worship mat karo. Focus on building real apps.",
      score: "9.8/10",
      style: "Systems & Trade-offs",
      analogy: "Frameworks = tools in a toolbox",
    },
  },
  {
    question: "Will AI replace software engineers?",
    hitesh: {
      answer: "Haanji, bilkul nahi! AI code snippets generate kar sakta hai but clean architecture design karna, complex requirements solve karna aur scale handle karna human logic hi karega. AI ko productivity tool ki tarah use karna seekho.",
      score: "9.5/10",
      style: "Calming & Realist",
      analogy: "AI = powerful compiler",
    },
    piyush: {
      answer: "Simple si baat hai: AI syntax typists ko replace kar dega but actual product builders ko nahi. Agar tum system level engineering aur loop mechanics samajhte ho, AI tumhari velocity 10x badha dega. Don't fear it, lead it.",
      score: "9.9/10",
      style: "Forward & Agentic",
      analogy: "AI Agent = junior intern",
    },
  },
  {
    question: "How do I start backend development?",
    hitesh: {
      answer: "Haanji! Sabse pehle HTTP fundamentals, headers aur status codes samjho. Phir Node.js aur Express uthao. Direct database connect mat karna. Pehle memory arrays mein crud handle karo, uske baad MongoDB ya Postgres database add karo.",
      score: "9.7/10",
      style: "Fundamentals-First",
      analogy: "Database = store diary",
    },
    piyush: {
      answer: "Dekho, basic CRUD simple hai. Real scaling backend seekho. System dynamics, caching with Redis, reverse proxies with Nginx aur database normalization focus karo. API routes write karne ke baad deployment containerize zaroor karna.",
      score: "9.8/10",
      style: "Production-Focused",
      analogy: "Backend = engine of a sports car",
    },
  },
];

// ── Conversation data for hero simulation ──
const HERO_CONV_CARDS = [
  { id: 1, role: "user", text: "Explain React hooks simply." },
  { id: 2, role: "assistant", name: "Hitesh", avatar: "/hiteshchoudhary.png", text: "Haanji! Hooks se direct dynamic state render kar sakte ho bina generic class lifecycle function complex banaye. Real simple hai.", accent: "#6D5DF6" },
  { id: 3, role: "user", text: "How should I structure Node APIs?" },
  { id: 4, role: "assistant", name: "Piyush", avatar: "/piyushgarg.png", text: "Dekho — controller layer, route definition, aur business logic controller separate rakho. Simple logic separation simplifies backend scale. Systems scale properly.", accent: "#06B6D4" },
];

// ── Mentors database ──
const MENTORS = [
  {
    key: "hiteshchoudhary",
    name: "Hitesh Choudhary",
    role: "Founder",
    company: "Chai Code",
    avatar: "/hiteshchoudhary.png",
    accent: "#6D5DF6",
    quote: "Haanji! Kya seekhna hai aaj?",
    philosophy: "Build projects, not tutorials. Real software teaches what theory never will.",
    strengths: [
      { label: "Backend Dev", value: 85 },
      { label: "Career Guidance", value: 92 },
      { label: "Full Stack", value: 80 },
    ],
    topics: ["JavaScript", "Node.js", "Startup Build", "DSA Patterns", "DevOps Setup"],
    style: ["Hinglish Explanations", "Practical Analogy", "Humble Encourager"],
    status: "Active Mentor",
    quoteFull: "Fundamentals over frameworks, always.",
    topicsCount: "50+ Projects",
    latency: "< 5s latency",
    sampleAnswer: "Haanji! HTTP headers ko samjho pehle, Express router to bas clean path mapping hai.",
    availability: "Available Now",
  },
  {
    key: "piyushgarg",
    name: "Piyush Garg",
    role: "Founder",
    company: "Teachyst",
    avatar: "/piyushgarg.png",
    accent: "#06B6D4",
    quote: "Let's build something real.",
    philosophy: "Curiosity first, intuition second, implementation last. That's the only way to truly understand systems.",
    strengths: [
      { label: "AI Agents & LLMs", value: 95 },
      { label: "System Architecture", value: 88 },
      { label: "Node & TS Backend", value: 92 },
    ],
    topics: ["AI Agent loops", "MCP Protocol", "TypeScript APIs", "Docker Deploy", "Next.js routing"],
    style: ["Hinglish Systems", "Product Mindset", "Startup Velocity"],
    status: "Active Mentor",
    quoteFull: "Evolve with technology instead of resisting it.",
    topicsCount: "25+ Deep Dives",
    latency: "< 3s latency",
    sampleAnswer: "Dekho, pure tech structures load balance karo. Redis cache use karne se latencies direct control hoti hain.",
    availability: "Available Now",
  },
];

// ── Hero Conversation Simulation Component with Typing Cursor ──
const HeroConversation: React.FC = () => {
  const [visible, setVisible] = useState<number[]>([]);
  const [typedText, setTypedText] = useState("");
  const [activeTypingCard, setActiveTypingCard] = useState<number | null>(null);

  useEffect(() => {
    let cardIdx = 0;
    let cardTimer: ReturnType<typeof setTimeout>;
    let charTimer: ReturnType<typeof setInterval>;
    let resetTimer: ReturnType<typeof setTimeout>;

    const playTimeline = () => {
      if (cardIdx < HERO_CONV_CARDS.length) {
        const currentCard = HERO_CONV_CARDS[cardIdx];
        if (currentCard) {
          setActiveTypingCard(currentCard.id);
          setTypedText("");
          let charIdx = 0;

          charTimer = setInterval(() => {
            if (charIdx <= currentCard.text.length) {
              setTypedText(currentCard.text.slice(0, charIdx));
              charIdx++;
            } else {
              clearInterval(charTimer);
              setVisible((prev) => [...prev, currentCard.id]);
              setActiveTypingCard(null);
              cardIdx++;
              cardTimer = setTimeout(playTimeline, 800);
            }
          }, 20);
        }
      } else {
        resetTimer = setTimeout(() => {
          setVisible([]);
          setTypedText("");
          cardIdx = 0;
          playTimeline();
        }, 3500);
      }
    };

    playTimeline();
    return () => {
      clearTimeout(cardTimer);
      clearInterval(charTimer);
      clearTimeout(resetTimer);
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col gap-3 justify-center p-1">
      {HERO_CONV_CARDS.map((card) => {
        const isVisible = visible.includes(card.id);
        const isCurrentlyTyping = activeTypingCard === card.id;
        const isUser = card.role === "user";

        if (!isVisible && !isCurrentlyTyping) return null;

        return (
          <div
            key={card.id}
            className="transition-all duration-300 ease-out animate-message-appear"
          >
            {isUser ? (
              <div className="flex justify-end">
                <div className="max-w-[90%] bg-[#FAF9F5] border border-black/5 rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm">
                  <p className="text-[8px] font-bold text-[#667085] uppercase tracking-wider mb-0.5">You</p>
                  <p className="text-xs font-semibold text-[#111827] inline flex items-center">
                    {isCurrentlyTyping ? typedText : card.text}
                    {isCurrentlyTyping && <span className="w-1.5 h-3 bg-[#6D5DF6] ml-0.5 inline-block typing-cursor" />}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start gap-2.5">
                <div className="relative flex-shrink-0">
                  <img
                    src={card.avatar}
                    alt={card.name}
                    className="w-7 h-7 object-cover rounded-full border border-black/5 shadow-sm"
                  />
                  <span
                    className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white"
                    style={{ backgroundColor: card.accent }}
                  />
                </div>
                <div className="max-w-[90%]">
                  <div
                    className="border border-black/5 bg-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm"
                    style={{ borderLeft: `3px solid ${card.accent}` }}
                  >
                    <p className="text-[8px] font-bold uppercase tracking-wider mb-0.5" style={{ color: card.accent }}>{card.name}</p>
                    <p className="text-xs font-medium text-[#111827] leading-relaxed inline flex items-center">
                      {isCurrentlyTyping ? typedText : card.text}
                      {isCurrentlyTyping && <span className="w-1.5 h-3 bg-[#6D5DF6] ml-0.5 inline-block typing-cursor" />}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── MAIN LANDING PAGE ──
const LandingPage: React.FC = () => {
  const router = useRouter();

  // Comparison State
  const [activeQAIndex, setActiveQAIndex] = useState(0);
  const [comparisonThinking, setComparisonThinking] = useState(false);

  // Bento Interactive Chat Demo States
  const [bentoChatInput, setBentoChatInput] = useState("");
  const [bentoChatMessages, setBentoChatMessages] = useState<
    { role: "user" | "assistant"; text: string; mentor: string }[]
  >([
    { role: "assistant", text: "Haanji! Kuch build karna hai aaj?", mentor: "Hitesh" },
  ]);
  const [bentoChatThinking, setBentoChatThinking] = useState(false);

  const handleQASelect = (index: number) => {
    if (index === activeQAIndex) return;
    setComparisonThinking(true);
    setTimeout(() => {
      setActiveQAIndex(index);
      setComparisonThinking(false);
    }, 600);
  };

  const handleBentoChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bentoChatInput.trim() || bentoChatThinking) return;

    const userText = bentoChatInput;
    setBentoChatMessages((prev) => [...prev, { role: "user", text: userText, mentor: "User" }]);
    setBentoChatInput("");
    setBentoChatThinking(true);

    setTimeout(() => {
      let reply = "Haanji! Accha question hai. Direct tutorials se mat seekho, real system components compile karo!";
      if (userText.toLowerCase().includes("react") || userText.toLowerCase().includes("vue")) {
        reply = "React is great choice buddy! Lekin pehle vanilla JS strong karo, basic DOM loops deploy karo.";
      } else if (userText.toLowerCase().includes("backend") || userText.toLowerCase().includes("database")) {
        reply = "Dekho! Express route build karo, database setup containerize karo. Docker helps backend scale.";
      } else if (userText.toLowerCase().includes("ai") || userText.toLowerCase().includes("agent")) {
        reply = "AI integration standard tools setup pe base hoti hai. Look into Claude or Gemini APIs.";
      }

      setBentoChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply, mentor: "Hitesh/Piyush Sim" },
      ]);
      setBentoChatThinking(false);
    }, 1000);
  };

  const handleMentorChatSelect = (key: string, name: string, role: string, image: string, philosophy: string) => {
    const data = {
      key,
      name,
      role,
      personality: philosophy,
      image,
      communicationStyle: "Engaging and thoughtful",
      tone: "Professional yet approachable",
      expertise: "Various fields",
      additionalContext: "",
    };
    localStorage.setItem("selectedPersona", JSON.stringify(data));
    router.push("/chat");
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F5] font-sans pb-12">

      {/* Subtle SaaS grid pattern */}
      <div className="saas-grid" />

      {/* Hero Radial Glow */}
      <div className="hero-glow pointer-events-none" />

      {/* ── SECTION 1: HERO & CORE ASYMMETRICAL BENTO ── */}
      <section className="pt-24 pb-6 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Hero Content (Spans 8 columns on desktop) */}
          <div className="lg:col-span-8 bento-card p-8 md:p-10 flex flex-col justify-center relative overflow-hidden group">

            <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 bg-black/[0.02] self-start">
              <Sparkles className="w-3 h-3 text-[#6D5DF6]" />
              <span className="font-bold text-[9px] uppercase tracking-widest text-[#4B5563]">
                AI-Powered Engineering Cohort
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#111827] mb-5 tracking-tight flex flex-col leading-[1.02]">
              <span>Stop watching tutorials.</span>
              <span className="text-[#6D5DF6]">Start building with mentors.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed mb-8 max-w-xl font-medium">
              Learn software engineering directly from AI mentors trained on the teaching styles, reasoning patterns, and communication of experienced developers. Ask real project questions. Get practical answers.
            </p>

            {/* Premium SaaS buttons layout */}
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => router.push("/persona")}
                className="
                  w-[220px] h-[58px] min-w-[220px] rounded-xl text-white font-bold text-sm uppercase tracking-wider
                  flex items-center justify-center gap-2 group transition-all duration-200
                  bg-gradient-to-r from-[#6D5DF6] to-[#8B5CF6]
                  shadow-[0_4px_16px_rgba(109,93,246,0.25)]
                  hover:shadow-[0_6px_20px_rgba(109,93,246,0.35)] hover:-translate-y-[1px]
                "
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => document.getElementById("meet-mentors")?.scrollIntoView({ behavior: "smooth" })}
                className="
                  btn-secondary h-[58px] px-8 font-bold text-xs uppercase tracking-wider rounded-xl
                  flex items-center justify-center gap-1.5 transition-all duration-200 border border-black/5 hover:bg-black/[0.02]
                "
              >
                Meet the Mentors
              </button>
            </div>
          </div>

          {/* Hero Right Bento preview (SaaS Screenshot/App feel) */}
          <div className="lg:col-span-4 lg:row-span-2 bento-card p-6 flex flex-col justify-between overflow-hidden relative">

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold tracking-widest text-[#4B5563] uppercase">Live Mentor Session</span>
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#6D5DF6] bg-[#6D5DF6]/5 border border-[#6D5DF6]/10 px-2.5 py-0.5 rounded-full">Gemini Active</span>
            </div>

            {/* Chat preview stream */}
            <div className="flex-1 flex flex-col justify-center min-h-[220px]">
              <HeroConversation />
            </div>

            {/* Bottom code widget placeholder */}
            <div className="mt-4 pt-3 border-t border-black/5 space-y-2 flex-shrink-0">
              <p className="text-[8px] font-bold text-[#4B5563] uppercase tracking-wider">Suggested next question:</p>
              <button
                onClick={() => router.push("/persona")}
                className="w-full text-left bg-[#FAF9F5] border border-black/5 rounded-lg px-3 py-2 hover:bg-black/[0.01] transition-all flex items-center justify-between"
              >
                <span className="text-[10px] font-semibold text-[#111827] truncate">Explain docker volume caching patterns</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#4B5563] flex-shrink-0 ml-2" />
              </button>
            </div>
          </div>

          {/* Card C: Interactive Mentors Bottom card */}
          <div className="lg:col-span-4 bento-card p-6 flex flex-col justify-between hover:-translate-y-[1px] transition-all duration-200 min-h-[160px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[8px] font-bold text-[#4B5563] uppercase tracking-widest">Active Status</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] font-bold text-green-700 uppercase">2 mentors online</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                <img src="/hiteshchoudhary.png" alt="Hitesh" className="w-9 h-9 object-cover rounded-full border border-white shadow-sm" />
                <img src="/piyushgarg.png" alt="Piyush" className="w-9 h-9 object-cover rounded-full border border-white shadow-sm" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#111827]">Teaching style: Hinglish</p>
                <p className="text-[10px] text-[#4B5563] font-semibold">Response speed: ~1 sec</p>
              </div>
            </div>
          </div>

          {/* Card D: Model Pipeline Bottom card */}
          <div className="lg:col-span-4 bento-card p-6 flex flex-col justify-between hover:-translate-y-[1px] transition-all duration-200 min-h-[160px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[8px] font-bold text-[#4B5563] uppercase tracking-widest">Model Pipeline</span>
              <span className="text-[8px] font-bold text-[#6D5DF6] uppercase">Auto Routing</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {["GPT", "Gemini", "Claude"].map((model) => (
                <span key={model} className="bg-[#FAF9F5] border border-black/5 rounded-lg px-2.5 py-1 text-[9px] font-bold text-[#111827]">{model}</span>
              ))}
            </div>
            <p className="text-[10px] text-[#4B5563] font-semibold">Decides routing dynamically depending on query complexity.</p>
          </div>

          {/* Card E: Popular Topics Bottom card */}
          <div className="lg:col-span-4 bento-card p-6 flex flex-col justify-between hover:-translate-y-[1px] transition-all duration-200 min-h-[160px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[8px] font-bold text-[#4B5563] uppercase tracking-widest">Syllabus Focus</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {["Backend", "AI", "React", "Node", "Docker", "System Design"].map((topic) => (
                <span key={topic} className="bg-[#FAF9F5] border border-black/5 rounded-lg px-2.5 py-0.5 text-[9px] font-bold text-[#111827]">{topic}</span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 2: BENTO PLATFORM FEATURES (WHY TARK AI) ── */}
      <section id="features" className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 text-[#6D5DF6] font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm mb-3">
            Platform Capabilities
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] leading-tight tracking-tight max-w-xl mx-auto">
            Engineered for clarity.
            <br />
            <span className="premium-gradient-text">Focused on shipping code.</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Live Streaming Demo */}
          <div className="bento-card p-6 rounded-[24px] flex flex-col justify-between group min-h-[220px]">
            <div>
              <span className="text-[8px] font-bold text-[#6D5DF6] uppercase tracking-widest block mb-1">Interactive Stream</span>
              <h4 className="text-base font-bold text-[#111827] mb-2">Live code execution</h4>
              <p className="text-xs font-semibold text-[#4B5563] leading-relaxed">Watch mock cohort coding logic compile with animated feedback indicators.</p>
            </div>
            <div className="font-mono text-[9px] bg-black/85 text-green-400 p-3 rounded-xl border border-white/5 shadow-inner mt-4">
              $ npm run docker:build
              <br /><span className="text-white/40">Loading server containers...</span>
            </div>
          </div>

          {/* Card 2: Today's Topics */}
          <div className="bento-card p-6 rounded-[24px] flex flex-col justify-between group min-h-[220px]">
            <div>
              <span className="text-[8px] font-bold text-[#06B6D4] uppercase tracking-widest block mb-1">Today's Topics</span>
              <h4 className="text-base font-bold text-[#111827] mb-2">Active syllabus</h4>
              <p className="text-xs font-semibold text-[#4B5563] leading-relaxed mb-4">Core concepts currently prioritized in mentor models.</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["React", "Node.js", "Docker", "MCP", "AI Agents", "Backend"].map((topic) => (
                <span key={topic} className="bg-[#FAF9F5] border border-black/5 rounded-lg px-2.5 py-0.5 text-[9px] font-bold text-[#111827]">{topic}</span>
              ))}
            </div>
          </div>

          {/* Card 3: Average Response Time */}
          <div className="bento-card p-6 rounded-[24px] flex flex-col justify-between group min-h-[220px]">
            <div>
              <span className="text-[8px] font-bold text-[#A855F7] uppercase tracking-widest block mb-1">Latency metric</span>
              <h4 className="text-base font-bold text-[#111111] mb-2">Response Speed</h4>
              <p className="text-xs font-semibold text-[#4B5563] leading-relaxed">Direct API routing guarantees extremely rapid message streaming.</p>
            </div>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-4xl font-extrabold text-[#111827] tracking-tight">~1 sec</span>
              <span className="text-[10px] text-[#A855F7] font-bold uppercase tracking-wider">average</span>
            </div>
          </div>

          {/* Card 4: Conversation Memory */}
          <div className="bento-card p-6 rounded-[24px] flex flex-col justify-between group min-h-[220px]">
            <div>
              <span className="text-[8px] font-bold text-[#6D5DF6] uppercase tracking-widest block mb-1">Context Memory</span>
              <h4 className="text-base font-bold text-[#111827] mb-2">Full Session Context</h4>
              <p className="text-xs font-semibold text-[#4B5563] leading-relaxed">Follow-up questions are processed within context memory windows.</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#4B5563]">active state retention</span>
            </div>
          </div>

          {/* Card 5: Response Style */}
          <div className="bento-card p-6 rounded-[24px] flex flex-col justify-between group min-h-[220px]">
            <div>
              <span className="text-[8px] font-bold text-[#06B6D4] uppercase tracking-widest block mb-1">Tone & Voice</span>
              <h4 className="text-base font-bold text-[#111827] mb-2">Response Style</h4>
              <p className="text-xs font-semibold text-[#4B5563] leading-relaxed mb-4">Mentors employ real-world anecdotes and step-by-step logic.</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {["Practical Advice", "Step-by-step", "Systems Logic", "Real Examples"].map((tag) => (
                <span key={tag} className="text-[8px] font-bold bg-[#06B6D4]/5 border border-[#06B6D4]/10 px-2 py-0.5 rounded-full text-[#06B6D4]">{tag}</span>
              ))}
            </div>
          </div>

          {/* Card 6: Multi Model Routing */}
          <div className="bento-card p-6 rounded-[24px] flex flex-col justify-between group min-h-[220px]">
            <div>
              <span className="text-[8px] font-bold text-[#A855F7] uppercase tracking-widest block mb-1">Architecture</span>
              <h4 className="text-base font-bold text-[#111827] mb-2">Multi-Model Routing</h4>
              <p className="text-xs font-semibold text-[#4B5563] leading-relaxed">Auto-selects optimal logic models depending on input depth.</p>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#4B5563] mt-4">
              <span>Query Input</span>
              <ArrowRight className="w-3 h-3 text-[#A855F7]" />
              <span className="bg-black/5 px-2 py-0.5 rounded-full">LLM pipeline</span>
            </div>
          </div>

          {/* Card 7: Interactive Chat Sandbox (Full Width) */}
          <div className="md:col-span-3 bento-card p-6 md:p-8 flex flex-col gap-6">
            <div>
              <span className="text-[8px] font-bold text-[#6D5DF6] uppercase tracking-wider block mb-1">Instant Sandbox</span>
              <h3 className="text-xl font-bold text-[#111827]">Interactive Sandbox Chat</h3>
              <p className="text-xs font-semibold text-[#4B5563] leading-relaxed mt-1">
                Type a quick coding question below to see the simulated mentor response instantly.
              </p>
            </div>

            <div className="border border-black/5 bg-[#FAF9F5] rounded-2xl p-4 flex flex-col gap-4">
              {/* Message list */}
              <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto">
                {bentoChatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`px-3 py-2 rounded-xl text-xs max-w-[85%] ${msg.role === "user"
                      ? "bg-[#6D5DF6] text-white rounded-tr-none"
                      : "bg-white text-[#111827] border border-black/5 rounded-tl-none"
                      }`}>
                      <p className="text-[8px] font-bold opacity-60 mb-0.5">{msg.mentor}</p>
                      <p className="font-medium">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {bentoChatThinking && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-black/5 px-3 py-2 rounded-xl rounded-tl-none text-xs flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6D5DF6] animate-ping" />
                      <span className="text-[10px] text-[#4B5563] font-semibold">Simulating Hinglish response...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input box */}
              <form onSubmit={handleBentoChatSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={bentoChatInput}
                  onChange={(e) => setBentoChatInput(e.target.value)}
                  placeholder="Ask about React hooks, backend, Nginx..."
                  className="w-full bg-white border border-black/5 rounded-full pl-4 pr-12 py-3 text-xs font-medium text-black focus:outline-none focus:border-[#6D5DF6]/35 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 w-8 h-8 rounded-full bg-[#6D5DF6] hover:bg-[#6D5DF6]/90 text-white flex items-center justify-center shadow transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 3: MENTOR BENTO PROFILE WIDGETS ── */}
      <section id="meet-mentors" className="py-16 px-4 md:px-6 max-w-7xl mx-auto border-t border-black/5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-block bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 text-[#6D5DF6] font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm mb-4">
              Mentors Database
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] leading-tight tracking-tight">
              Learn from engineers who
              <br />
              <span className="premium-gradient-text">built real tech products.</span>
            </h2>
          </div>
          <button
            onClick={() => router.push("/persona")}
            className="self-start md:self-end btn-secondary font-bold text-xs uppercase tracking-wider px-5 py-3 flex items-center gap-2"
          >
            See All Personas <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {MENTORS.map((mentor, i) => (
            <div
              key={mentor.key}
              className="bento-card p-6 md:p-8 rounded-[28px] flex flex-col gap-6 relative overflow-hidden group"
            >
              {/* Online status indicator */}
              <div className="absolute top-6 right-6 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold text-green-700 uppercase tracking-wider">{mentor.status}</span>
              </div>

              {/* Header Info */}
              <div className="flex items-center gap-4 pt-2">
                <div className="relative">
                  <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 object-cover border border-white shadow-md rounded-full" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white" style={{ backgroundColor: mentor.accent }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">{mentor.name}</h3>
                  <p className="text-xs text-[#4B5563] font-semibold">{mentor.role} at {mentor.company}</p>
                  <p className="text-[9px] font-bold text-[#6D5DF6] mt-1 uppercase tracking-wider">{mentor.latency}</p>
                </div>
              </div>

              {/* Bento profile widgets layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Teaching Philosophy */}
                <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-4">
                  <p className="text-[8px] font-bold text-[#4B5563] uppercase tracking-wider mb-1.5">Philosophy</p>
                  <p className="text-xs font-semibold text-[#4B5563] leading-relaxed">{mentor.philosophy}</p>
                </div>

                {/* Expertise Strengths Progress */}
                <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-4 space-y-2.5">
                  <p className="text-[8px] font-bold text-[#4B5563] uppercase tracking-wider">Strengths</p>
                  {mentor.strengths.map((str) => (
                    <div key={str.label}>
                      <div className="flex justify-between items-center mb-0.5 text-[9px] font-bold text-[#111827]">
                        <span>{str.label}</span>
                        <span style={{ color: mentor.accent }}>{str.value}%</span>
                      </div>
                      <div className="premium-strength-bar">
                        <div className="premium-strength-fill" style={{ width: `${str.value}%`, backgroundColor: mentor.accent }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quote Compartment */}
                <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-4">
                  <p className="text-[8px] font-bold text-[#4B5563] uppercase tracking-wider mb-1.5">Signature Quote</p>
                  <p className="text-xs font-bold text-[#111827] leading-relaxed italic">"{mentor.quoteFull}"</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {mentor.style.map((sty) => (
                      <span key={sty} className="text-[8px] font-bold bg-[#6D5DF6]/5 border border-[#6D5DF6]/10 px-2 py-0.5 rounded-full text-[#6D5DF6]">{sty}</span>
                    ))}
                  </div>
                </div>

                {/* Favorite Topics */}
                <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-4">
                  <p className="text-[8px] font-bold text-[#4B5563] uppercase tracking-wider mb-2">Favorite Topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.topics.map((t) => (
                      <span key={t} className="text-[9px] font-bold border border-black/5 bg-white px-2.5 py-0.5 rounded-full text-[#111111]">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Sample Answer Box */}
                <div className="sm:col-span-2 bg-[#FAF9F5] border border-black/5 rounded-2xl p-4">
                  <p className="text-[8px] font-bold text-[#4B5563] uppercase tracking-wider mb-1.5">Sample Answer</p>
                  <p className="text-xs font-medium text-[#4B5563] leading-relaxed italic">"{mentor.sampleAnswer}"</p>
                </div>
              </div>

              {/* Switch Primary Action Button */}
              <button
                onClick={() => handleMentorChatSelect(mentor.key, mentor.name, mentor.role, mentor.avatar, mentor.philosophy)}
                className="w-full btn-primary py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white"
              >
                Talk to {mentor.name.split(" ")[0]} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: INTERACTIVE COMPARISON & PROCESS TIMELINE ── */}
      <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto border-t border-black/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left side: Interactive Comparison */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
              Real-time Sandbox Comparison
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight">
              Ask Hitesh & Piyush.
              <br />
              <span className="premium-gradient-text">Compare side-by-side.</span>
            </h2>

            {/* Selector preset buttons */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Select a sample question</p>
              <div className="flex flex-wrap gap-2">
                {INTERACTIVE_QA.map((qa, index) => (
                  <button
                    key={index}
                    onClick={() => handleQASelect(index)}
                    className={`px-4.5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 ${activeQAIndex === index
                      ? "bg-[#6D5DF6] text-white border-[#6D5DF6]"
                      : "bg-white border-black/5 text-[#4B5563] hover:bg-white"
                      }`}
                  >
                    {qa.question}
                  </button>
                ))}
              </div>
            </div>

            {/* Answers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {comparisonThinking && (
                <div className="absolute inset-0 bg-[#FAF9F5]/70 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#6D5DF6] rounded-full animate-ping" />
                    <span className="text-xs font-bold text-[#6D5DF6]">Processing responses...</span>
                  </div>
                </div>
              )}

              {/* Hitesh Column */}
              <div className="bento-card p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <img src="/hiteshchoudhary.png" alt="Hitesh" className="w-8 h-8 rounded-full border border-black/5 shadow-sm" />
                  <div>
                    <p className="text-xs font-bold text-[#111827]">Hitesh Choudhary</p>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#6D5DF6]">Hinglish Advice</span>
                  </div>
                </div>
                <div className="border-l-2 border-[#6D5DF6] pl-3 py-1">
                  <p className="text-xs font-medium text-[#4B5563] leading-relaxed">
                    "{INTERACTIVE_QA[activeQAIndex].hitesh.answer}"
                  </p>
                </div>
                <div className="pt-2 border-t border-black/5 space-y-1.5 text-[9px] font-bold text-[#4B5563]">
                  <p className="flex justify-between"><span>Response Score:</span> <span className="text-[#6D5DF6]">{INTERACTIVE_QA[activeQAIndex].hitesh.score}</span></p>
                  <p className="flex justify-between"><span>Analogy:</span> <span className="text-[#111827]">{INTERACTIVE_QA[activeQAIndex].hitesh.analogy}</span></p>
                  <p className="flex justify-between"><span>Teaching Style:</span> <span className="text-[#111827]">{INTERACTIVE_QA[activeQAIndex].hitesh.style}</span></p>
                </div>
              </div>

              {/* Piyush Column */}
              <div className="bento-card p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <img src="/piyushgarg.png" alt="Piyush" className="w-8 h-8 rounded-full border border-black/5 shadow-sm" />
                  <div>
                    <p className="text-xs font-bold text-[#111827]">Piyush Garg</p>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#06B6D4]">Systems Tech</span>
                  </div>
                </div>
                <div className="border-l-2 border-[#06B6D4] pl-3 py-1">
                  <p className="text-xs font-medium text-[#4B5563] leading-relaxed">
                    "{INTERACTIVE_QA[activeQAIndex].piyush.answer}"
                  </p>
                </div>
                <div className="pt-2 border-t border-black/5 space-y-1.5 text-[9px] font-bold text-[#4B5563]">
                  <p className="flex justify-between"><span>Response Score:</span> <span className="text-[#06B6D4]">{INTERACTIVE_QA[activeQAIndex].piyush.score}</span></p>
                  <p className="flex justify-between"><span>Analogy:</span> <span className="text-[#111827]">{INTERACTIVE_QA[activeQAIndex].piyush.analogy}</span></p>
                  <p className="flex justify-between"><span>Teaching Style:</span> <span className="text-[#111827]">{INTERACTIVE_QA[activeQAIndex].piyush.style}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Connected Timeline */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-block bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
              System Workflow Nodes
            </div>
            <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight">
              Process Workflow.
            </h2>

            {/* Timeline nodes */}
            <div className="relative pl-6 border-l border-black/5 space-y-6">
              {[
                { title: "Ask Question", desc: "User types complex programming query.", color: "#6D5DF6" },
                { title: "AI Routing", desc: "System dynamically evaluates optimal logic models.", color: "#3B82F6" },
                { title: "Mentor Style Routing", desc: "Formats Hinglish syntax patterns, tones, analogies.", color: "#8B5CF6" },
                { title: "Streaming Generation", desc: "Streams raw character strings back to browser.", color: "#06B6D4" },
              ].map((node, i) => (
                <div key={i} className="relative">
                  {/* Glowing node point */}
                  <span
                    className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
                    style={{ backgroundColor: node.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </span>
                  <h4 className="text-xs font-bold text-[#111827]">{node.title}</h4>
                  <p className="text-[11px] font-semibold text-[#4B5563] leading-relaxed mt-0.5">{node.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 5: TRUST, FEATURE BENTO & FINAL CTA ── */}
      <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto space-y-16">

        {/* Trust Badges */}
        <div>
          <p className="text-center text-[10px] font-bold text-[#4B5563] uppercase tracking-widest mb-6">
            Supported technologies & platform integrations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              "Powered by GPT & Gemini", "Low Latency Routing",
              "Streaming Responses", "Low latency inference",
              "Context state retention", "Open-source codebase",
              "Multi-model pipeline", "Prompt Engineering"
            ].map((item) => (
              <div key={item} className="flex items-center justify-center p-3.5 bg-white border border-black/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <span className="text-[10px] font-bold text-[#111827] text-center">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Bento Grid */}
        <div className="space-y-6">
          <h2 className="text-center text-xl font-bold text-[#111827] tracking-tight uppercase">Extended Features Grid</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bento-card p-6 rounded-2xl">
              <span className="text-[9px] font-bold text-[#6D5DF6] uppercase tracking-wider block mb-1">State persistence</span>
              <h4 className="font-bold text-[#111827] mb-2">Chat Memory Storage</h4>
              <p className="text-[11px] font-semibold text-[#4B5563] leading-relaxed">Saves conversation history to local storage for quick access later.</p>
            </div>

            {/* Card 2 */}
            <div className="bento-card p-6 rounded-2xl">
              <span className="text-[9px] font-bold text-[#06B6D4] uppercase tracking-wider block mb-1">Low latency</span>
              <h4 className="font-bold text-[#111827] mb-2">Live Model Infrastructure</h4>
              <p className="text-[11px] font-semibold text-[#4B5563] leading-relaxed">Direct connection to serverless AI APIs for high response speed.</p>
            </div>

            {/* Card 3 */}
            <div className="bento-card p-6 rounded-2xl">
              <span className="text-[9px] font-bold text-[#A855F7] uppercase tracking-wider block mb-1">Instruction base</span>
              <h4 className="font-bold text-[#111827] mb-2">Custom Prompt Engines</h4>
              <p className="text-[11px] font-semibold text-[#4B5563] leading-relaxed">Detailed persona prompts shape the dialog model with cohort traits.</p>
            </div>

            {/* Card 4: Streaming Demo Mockup (Col span 3) */}
            <div className="md:col-span-3 bento-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-black/5 pb-2">
                <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Live Streaming Terminal Code</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="font-mono text-[10px] bg-black/90 text-green-400 p-4 rounded-xl space-y-1 select-none overflow-x-auto">
                <p><span className="text-[#4B5563]"># Streaming Express route...</span></p>
                <p>app.post(<span className="text-yellow-300">"/api/chat"</span>, <span className="text-[#6D5DF6]">async</span> (req, res) =&gt; &#123;</p>
                <p className="pl-4">const stream = <span className="text-[#6D5DF6]">await</span> openai.chat.completions.create(&#123; ... &#125;);</p>
                <p className="pl-4">for <span className="text-[#6D5DF6]">await</span> (const chunk of stream) res.write(chunk);</p>
                <p>&#125;);</p>
              </div>
            </div>

          </div>
        </div>

        {/* Redesigned Final CTA Section */}
        <div className="relative rounded-[32px] overflow-hidden bg-white border border-black/5 p-8 md:p-12 text-center shadow-sm">
          <div className="max-w-2xl mx-auto relative z-10 space-y-6">
            <div className="inline-block bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 text-[#6D5DF6] font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
              Start Learning
            </div>
            <h2 className="editorial-title text-4xl md:text-5xl text-[#111827]">
              Start learning from engineers
              <br />
              <span className="premium-gradient-text">who think differently.</span>
            </h2>

            <div className="flex justify-center -space-x-3 my-4">
              <img src="/hiteshchoudhary.png" alt="Hitesh" className="w-10 h-10 object-cover border-2 border-white rounded-full shadow-md relative z-10" />
              <img src="/piyushgarg.png" alt="Piyush" className="w-10 h-10 object-cover border-2 border-white rounded-full shadow-md relative z-20" />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => router.push("/persona")}
                className="btn-primary text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 flex items-center justify-center"
              >
                Start Chat
              </button>
              <button
                onClick={() => router.push("/persona")}
                className="btn-secondary font-bold text-xs uppercase tracking-wider px-7 py-3.5"
              >
                Browse Mentors
              </button>
            </div>

            {/* Core checklist */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4 text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#6D5DF6]" /> No signup required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#6D5DF6]" /> Streaming responses</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#6D5DF6]" /> Free to use</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#6D5DF6]" /> Multi-model pipelines</span>
            </div>
          </div>
        </div>

      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/5 dark:border-white/[0.06] bg-white/40 dark:bg-[#0D1117]/80 backdrop-blur-md py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ThemeLogo className="h-6 w-auto object-contain opacity-70 dark:opacity-90" />
            <span className="text-[10px] text-[#4B5563] dark:text-[#64748B] font-semibold uppercase tracking-wider">Reason. Learn. Build.</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] text-[#4B5563] dark:text-[#64748B] font-bold uppercase tracking-wider">
            <a href="/privacy" className="hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors">Terms</a>
            <a
              href="https://github.com/heelpatel01"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
          <p className="text-[10px] text-[#4B5563] dark:text-[#64748B] font-medium text-center md:text-right">
            AI can make mistakes. Verify important info. Built with ❤️ by Heel Patel.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
