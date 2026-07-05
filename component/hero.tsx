"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Code2,
  Target,
  ChevronDown,
  Users,
  Cpu,
  Clock,
} from "lucide-react";

// ── Static mock conversation ─────────────────────────────────────────
const MOCK_CONVERSATION = [
  { id: 1, role: "assistant", name: "Hitesh", avatar: "/hiteshchoudhary.png", text: "Haanji! Kya seekhna hai aaj? 👋" },
  { id: 2, role: "user", text: "How do I start backend development?" },
  { id: 3, role: "assistant", name: "Hitesh", avatar: "/hiteshchoudhary.png", text: "Bilkul sahi question! Start with HTTP fundamentals, then Node.js. Real projects se seekho — theory se nahi." },
  { id: 4, role: "user", text: "Which database should I learn first?" },
  { id: 5, role: "assistant", name: "Piyush", avatar: "/piyushgarg.png", text: "PostgreSQL for production apps. MongoDB for quick prototypes. But always understand your data model first. 🔥" },
];

// ── Section: Hero ────────────────────────────────────────────────────
const HeroSection: React.FC<{ router: ReturnType<typeof useRouter> }> = ({ router }) => {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);


  useEffect(() => {
    let idx = 0;
    let timer: ReturnType<typeof setInterval>;
    let timeoutId: ReturnType<typeof setTimeout>;

    const startInterval = () => {
      timer = setInterval(() => {
        if (idx < MOCK_CONVERSATION.length) {
          const msg = MOCK_CONVERSATION[idx];
          if (msg) {
            setVisibleMessages(prev => [...prev, msg.id]);
          }
          idx++;
        } else {
          clearInterval(timer);
          timeoutId = setTimeout(() => {
            setVisibleMessages([]);
            idx = 0;
            startInterval();
          }, 3000);
        }
      }, 900);
    };

    startInterval();

    return () => {
      clearInterval(timer);
      clearTimeout(timeoutId);
    };
  }, []);


  return (
    <section className="relative min-h-[calc(100vh-6rem)] flex items-center overflow-hidden px-4 md:px-8">

      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 55% 50% at 15% 40%, rgba(109,93,246,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 45% 40% at 85% 20%, rgba(59,130,246,0.05) 0%, transparent 70%)
          `,
        }}
      />

      {/* Floating code decorations */}
      <div className="absolute top-16 left-4 hidden lg:block animate-drift-slow opacity-40" style={{ animationDelay: "0s" }}>
        <div className="bg-black text-green-400 font-mono text-xs px-3 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[-3deg]">
          {"</ >"}
        </div>
      </div>
      <div className="absolute top-32 right-8 hidden lg:block animate-drift-medium opacity-35" style={{ animationDelay: "2s" }}>
        <div className="bg-yellow-300 font-mono text-sm font-black px-3 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[4deg]">
          {"{ }"}
        </div>
      </div>
      <div className="absolute bottom-32 left-12 hidden lg:block animate-drift-slow opacity-30" style={{ animationDelay: "3.5s" }}>
        <div className="bg-cyan-300 font-mono text-xs font-black px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-[2deg]">
          npm run dev
        </div>
      </div>
      <div className="absolute bottom-20 right-16 hidden lg:block animate-drift-medium opacity-30" style={{ animationDelay: "1s" }}>
        <div className="bg-pink-300 font-mono text-xs font-black px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
          git push origin
        </div>
      </div>

      {/* ── Two-column grid ── */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center py-12">

        {/* LEFT: Text content */}
        <div className="flex flex-col items-start animate-slide-left">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-2 border-2 border-purple-400/60 shimmer-badge shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)] transform -rotate-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
            <span className="font-bold text-xs uppercase tracking-widest text-purple-700">
              Powered by GPT · Gemini · Claude · Groq
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black leading-[0.95] tracking-tight mb-5">
            Reason.
            <br />
            Learn.
            <br />
            <span
              className="relative inline-block border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] px-3 mt-1 overflow-hidden"
              style={{ background: "linear-gradient(135deg, #6D5DF6, #A855F7, #3B82F6)", backgroundSize: "200%" }}
            >
              <span
                aria-hidden
                className="absolute inset-0 -skew-x-12 -translate-x-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)", animation: "shimmer 3.5s linear infinite" }}
              />
              <span className="relative text-white">Build.</span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed mb-8 max-w-md">
            Meet AI versions of the developers who taught{" "}
            <span className="font-black text-black">thousands of engineers</span>.
            Ask questions. Get real answers.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Primary CTA */}
            <button
              onClick={() => router.push("/persona")}
              className="group relative overflow-hidden bg-yellow-400 text-black font-black text-base border-4 border-black px-7 py-3.5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
            >
              <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500" />
              <span className="relative flex items-center gap-2">
                Start Chatting
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => document.getElementById("meet-mentors")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 bg-white text-black font-bold text-base border-4 border-black px-6 py-3.5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
            >
              Explore Personas
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <Target className="w-3 h-3" />, label: "Practical Teaching Style" },
              { icon: <MessageSquare className="w-3 h-3" />, label: "Authentic Conversations" },
              { icon: <Code2 className="w-3 h-3" />, label: "Project-first Learning" },
              { icon: <Cpu className="w-3 h-3" />, label: "AI Powered" },
            ].map(({ icon, label }) => (
              <div key={label} className="glass border border-black/20 px-3 py-1.5 text-xs font-bold text-gray-600 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-transform duration-150">
                {icon} {label}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Mock conversation preview */}
        <div className="flex justify-center lg:justify-end animate-slide-right">
          <div className="relative w-full max-w-sm">

            {/* Floating persona chips around the card */}
            <div className="absolute -top-6 -left-6 z-10 animate-float-slow hidden md:block">
              <div className="bg-yellow-300 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-3 py-2 rotate-[-4deg]" style={{ borderWidth: 3 }}>
                <div className="flex items-center gap-2">
                  <img src="/hiteshchoudhary.png" alt="Hitesh" className="w-7 h-7 object-cover border-2 border-black rounded-full" />
                  <div>
                    <p className="text-[10px] font-black text-black uppercase">Hitesh</p>
                    <p className="text-[9px] text-gray-600 font-bold">☕ Chai Code</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-4 z-10 animate-float-medium hidden md:block">
              <div className="bg-cyan-300 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-3 py-2 rotate-[3deg]" style={{ borderWidth: 3 }}>
                <div className="flex items-center gap-2">
                  <img src="/piyushgarg.png" alt="Piyush" className="w-7 h-7 object-cover border-2 border-black rounded-full" />
                  <div>
                    <p className="text-[10px] font-black text-black uppercase">Piyush</p>
                    <p className="text-[9px] text-gray-600 font-bold">⚡ GenAI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main conversation card */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {/* Card header */}
              <div className="bg-black px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-white font-bold text-xs uppercase tracking-widest ml-2 opacity-70">
                  tark-ai · live preview
                </span>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 min-h-[280px]">
                {MOCK_CONVERSATION.map((msg, i) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 animate-message-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    style={{
                      opacity: visibleMessages.includes(msg.id) ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    {msg.role === "assistant" && (
                      <img src={msg.avatar} alt={msg.name} className="w-7 h-7 object-cover border-2 border-black rounded-full flex-shrink-0 mt-0.5" />
                    )}
                    <div
                      className={`max-w-[75%] px-3 py-2 text-xs font-medium border-2 border-black leading-relaxed shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] ${
                        msg.role === "user"
                          ? "text-white"
                          : "bg-white text-black"
                      }`}
                      style={msg.role === "user" ? { background: "linear-gradient(135deg, #6D5DF6, #9333EA)" } : {}}
                    >
                      {msg.role === "assistant" && (
                        <p className="text-[9px] font-black text-purple-600 uppercase mb-1">{msg.name}</p>
                      )}
                      {msg.text}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 bg-violet-600 border-2 border-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-[10px] font-black">U</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing cursor if all shown */}
                {visibleMessages.length === MOCK_CONVERSATION.length && (
                  <div className="flex items-center gap-2 pl-9">
                    <div className="flex gap-1 py-1">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.18}s` }} />
                      ))}
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium">AI is thinking...</span>
                  </div>
                )}
              </div>

              {/* Input mock */}
              <div className="border-t-2 border-black px-4 py-3 flex items-center gap-2 bg-gray-50">
                <div className="flex-1 border-2 border-black bg-white px-3 py-2 text-xs text-gray-400 font-medium">
                  Haanji... kya banana hai aaj?
                </div>
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6D5DF6, #A855F7)" }}>
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Section: Stats ───────────────────────────────────────────────────
const StatsSection: React.FC = () => {
  const stats = [
    { value: "2+", label: "Expert Personas", icon: <Users className="w-5 h-5" /> },
    { value: "∞", label: "Conversations", icon: <MessageSquare className="w-5 h-5" /> },
    { value: "AI", label: "Powered Backend", icon: <Cpu className="w-5 h-5" /> },
    { value: "Live", label: "Real-time Streams", icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <section className="border-y-4 border-black bg-black py-6 md:py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x-0 md:divide-x-4 divide-white/20">
          {stats.map(({ value, label, icon }, i) => (
            <div
              key={label}
              className="flex flex-col items-center text-center py-4 px-6 animate-count-up"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="text-white/40 mb-2">{icon}</div>
              <div className="text-4xl md:text-5xl font-black text-white leading-none mb-1">{value}</div>
              <div className="text-[11px] font-bold text-white/50 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Section: Why Tark AI ─────────────────────────────────────────────
const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Target className="w-7 h-7" />,
      bg: "bg-yellow-300",
      title: "Practical Learning",
      description: "No theory dumps. Get real-world answers inspired by developers who built and shipped actual products.",
      tag: "Project-first",
    },
    {
      icon: <MessageSquare className="w-7 h-7" />,
      bg: "bg-green-400",
      title: "Authentic Conversations",
      description: "Teaching style, Hinglish, analogies, and thought process — faithfully modeled from real videos and talks.",
      tag: "Authentic Style",
    },
    {
      icon: <Code2 className="w-7 h-7" />,
      bg: "bg-cyan-400",
      title: "Built for Developers",
      description: "Ask about system design, DSA, backend, AI integration, career advice, or just \"where do I start?\".",
      tag: "Dev-focused",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-14">
        <div className="inline-block bg-violet-600 text-white font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-5 rotate-[-1deg]">
          Why Tark AI
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-black leading-tight tracking-tight">
          Not just another
          <br />
          <span
            className="inline-block border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-3 mt-2"
            style={{ background: "linear-gradient(135deg, #6D5DF6, #A855F7)" }}
          >
            <span className="text-white">chatbot.</span>
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {features.map(({ icon, bg, title, description, tag }, i) => (
          <div
            key={title}
            className={`group relative border-4 border-black ${bg} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 p-6 md:p-8 animate-fade-up`}
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            {/* Tag */}
            <div className="absolute top-4 right-4 bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-1">
              {tag}
            </div>
            {/* Icon box */}
            <div className="w-14 h-14 bg-black flex items-center justify-center text-white border-4 border-black mb-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
              {icon}
            </div>
            <h3 className="text-2xl font-black text-black uppercase mb-3">{title}</h3>
            <p className="text-sm font-medium text-black/70 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── Section: Meet Mentors ────────────────────────────────────────────
const MeetMentorsSection: React.FC<{ router: ReturnType<typeof useRouter> }> = ({ router }) => {
  const mentors = [
    {
      key: "hiteshchoudhary",
      name: "Hitesh Choudhary",
      image: "/hiteshchoudhary.png",
      role: "Founder of Chai Code",
      traits: ["☕ Chai Code", "🎯 Practical", "🚀 Founder"],
      quote: "Haanji! Kya seekhna hai?",
      tagBg: "bg-yellow-300",
    },
    {
      key: "piyushgarg",
      name: "Piyush Garg",
      image: "/piyushgarg.png",
      role: "Building Teachyst",
      traits: ["⚡ GenAI", "🏗️ System Design", "🔥 Practical"],
      quote: "Let's build something real.",
      tagBg: "bg-cyan-300",
    },
  ];

  return (
    <section id="meet-mentors" className="py-20 md:py-28 border-t-4 border-black bg-yellow-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="inline-block bg-black text-white font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              Meet the Mentors
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-black leading-tight tracking-tight">
              People who actually
              <br />
              <span className="relative inline-block">
                build products.
                <span className="absolute -bottom-1 left-0 w-full h-3 bg-yellow-300 -z-10" />
              </span>
            </h2>
          </div>
          <button
            onClick={() => router.push("/persona")}
            className="self-start md:self-end flex items-center gap-2 bg-black text-white font-bold text-sm border-4 border-black px-5 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            See All Personas <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Persona cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
          {mentors.map((mentor, i) => (
            <div
              key={mentor.key}
              onClick={() => router.push("/persona")}
              className="group bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 cursor-pointer animate-fade-up overflow-hidden"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {/* Image */}
              <div className="relative h-48 border-b-4 border-black overflow-hidden">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Quote chip */}
                <div className={`absolute bottom-3 left-3 ${mentor.tagBg} border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-w-[80%]`}>
                  <p className="text-[11px] font-bold text-black italic">&ldquo;{mentor.quote}&rdquo;</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-xl font-black text-black uppercase leading-tight mb-1">{mentor.name}</h3>
                <p className="text-xs text-gray-500 font-medium mb-4">{mentor.role}</p>
                {/* Trait pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mentor.traits.map(t => (
                    <span key={t} className="text-[10px] font-bold bg-violet-50 border border-violet-200 text-violet-700 px-2.5 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-black text-white font-black text-xs uppercase py-2.5 border-2 border-black flex items-center justify-center gap-2 group-hover:bg-violet-600 transition-colors duration-200">
                  Chat Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Section: How It Works ────────────────────────────────────────────
const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Choose a Persona",
      description: "Pick Hitesh or Piyush. Each has a distinct teaching style, vocabulary, and expertise.",
      bg: "bg-yellow-300",
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: "02",
      title: "Ask Anything",
      description: "Type your question. Get an authentic, thoughtful response that sounds like them, not a generic AI.",
      bg: "bg-green-400",
      icon: <MessageSquare className="w-6 h-6" />,
    },
    {
      step: "03",
      title: "Learn Naturally",
      description: "Follow up, go deeper, switch topics. Each conversation adapts to where you are in your journey.",
      bg: "bg-violet-400",
      icon: <BookOpen className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-20 md:py-28 border-t-4 border-black px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block bg-green-400 text-black font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-5 rotate-[1deg]">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black leading-tight tracking-tight">
            Three steps to your
            <br />
            next breakthrough.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          {/* Connector line (desktop) */}
          <div className="absolute top-[52px] left-[17%] right-[17%] h-[3px] bg-black hidden md:block" />

          {steps.map(({ step, title, description, bg, icon }, i) => (
            <div key={step} className="flex flex-col items-center text-center px-4 md:px-8 pb-8 animate-fade-up" style={{ animationDelay: `${i * 0.18}s` }}>
              {/* Step badge */}
              <div className={`relative z-10 w-16 h-16 ${bg} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center mb-6`}>
                <span className="font-black text-black text-[9px] uppercase">{step}</span>
                <div className="text-black">{icon}</div>
              </div>
              <h3 className="text-xl font-black text-black uppercase mb-3">{title}</h3>
              <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-xs">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Section: Final CTA ───────────────────────────────────────────────
const FinalCTASection: React.FC<{ router: ReturnType<typeof useRouter> }> = ({ router }) => (
  <section className="border-t-4 border-black bg-black py-24 md:py-32 px-4 relative overflow-hidden">
    {/* Decorative corner elements */}
    <div className="absolute top-6 left-6 font-mono text-white/10 text-5xl font-black select-none">{"{ }"}</div>
    <div className="absolute bottom-6 right-6 font-mono text-white/10 text-5xl font-black select-none">{"</>"}</div>

    <div className="max-w-3xl mx-auto text-center">
      <div className="inline-block bg-yellow-300 text-black font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-yellow-300 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] mb-8 rotate-[-1deg]">
        Reason. Learn. Build.
      </div>
      <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6">
        Start your first
        <br />
        conversation.
      </h2>
      <p className="text-gray-400 font-medium text-lg mb-10 max-w-lg mx-auto leading-relaxed">
        No signup. No setup. Just pick a mentor and ask your question.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => router.push("/persona")}
          className="group relative overflow-hidden bg-yellow-400 text-black font-black text-lg border-4 border-yellow-400 px-10 py-4 shadow-[5px_5px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
        >
          <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500" />
          <span className="relative flex items-center gap-2">
            Start Chatting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </span>
        </button>
        <button
          onClick={() => router.push("/persona")}
          className="bg-transparent text-white font-bold text-lg border-4 border-white/30 px-8 py-4 hover:border-white/60 hover:bg-white/5 transition-all duration-200"
        >
          View Personas
        </button>
      </div>
    </div>
  </section>
);

// ── Footer ───────────────────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer className="border-t-2 border-black/10 bg-white py-6 px-4">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <img src="/tarkai-logo-navbar.png" alt="Tark AI" className="h-7 w-auto object-contain opacity-80" />
        <span className="text-xs text-gray-400 font-medium">Reason. Learn. Build.</span>
      </div>
      <p className="text-[11px] text-gray-300 font-medium">
        AI can make mistakes. Verify important information. Built with ❤️ by Heel Patel.
      </p>
    </div>
  </footer>
);

// ── Root Export ──────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <HeroSection router={router} />
      <StatsSection />
      <FeaturesSection />
      <MeetMentorsSection router={router} />
      <HowItWorksSection />
      <FinalCTASection router={router} />
      <Footer />
    </>
  );
};

export default LandingPage;
