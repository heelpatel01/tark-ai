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
} from "lucide-react";

// ── Conversation data ───────────────────────────────────────────────
const CONV_CARDS = [
  {
    id: 1, role: "user",
    text: "How do I start backend development?",
  },
  {
    id: 2, role: "assistant", name: "Hitesh", avatar: "/hiteshchoudhary.png",
    text: "Haanji! HTTP fundamentals pehle. Phir Node.js lo aur ek project banao — theory se nahi, real software banane se seekhoge.",
    accent: "#6D5DF6",
  },
  {
    id: 3, role: "user",
    text: "Which database should I learn first?",
  },
  {
    id: 4, role: "assistant", name: "Piyush", avatar: "/piyushgarg.png",
    text: "Dekho — PostgreSQL for production, MongoDB for prototypes. But samjho apna data model pehle. Database tool hai, not religion. 🔥",
    accent: "#06B6D4",
  },
];

// ── Comparison data ─────────────────────────────────────────────────
const COMPARISON = {
  question: "Should I learn React or Vue?",
  hitesh: {
    avatar: "/hiteshchoudhary.png",
    name: "Hitesh Choudhary",
    accent: "#6D5DF6",
    answer: "Haanji! React ka ecosystem bahut bada hai. Real projects mein zyada demand hai. Fundamentals strong rakh aur ek project ship kar — framework decide ho jaayega.",
    tags: ["Practical", "Project-first", "Ecosystem"],
  },
  piyush: {
    avatar: "/piyushgarg.png",
    name: "Piyush Garg",
    accent: "#06B6D4",
    answer: "Dekho — pehle ye socho kya build kar rahe ho. React large teams ke liye better hai, Vue simpler aur lighter. Trade-offs samjho, fanboy mat bano.",
    tags: ["Systems", "Trade-offs", "Nuanced"],
  },
};

// ── Mentor profile data ─────────────────────────────────────────────
const MENTORS = [
  {
    key: "hiteshchoudhary",
    name: "Hitesh Choudhary",
    role: "Founder, Chai Code",
    avatar: "/hiteshchoudhary.png",
    accent: "#6D5DF6",
    quote: "Haanji! Kya seekhna hai aaj?",
    philosophy: "Build projects, not tutorials. Real software teaches what theory never will.",
    strengths: [
      { label: "Backend", value: 85 },
      { label: "Career", value: 90 },
      { label: "Full Stack", value: 80 },
    ],
    topics: ["JavaScript", "Node.js", "Startup", "DSA", "DevOps"],
    style: ["Hinglish", "Practical", "Encourager"],
  },
  {
    key: "piyushgarg",
    name: "Piyush Garg",
    role: "Founder, Teachyst",
    avatar: "/piyushgarg.png",
    accent: "#06B6D4",
    quote: "Let's build something real.",
    philosophy: "Curiosity first, intuition second, implementation last. That's the only way to truly understand.",
    strengths: [
      { label: "AI & LLMs", value: 95 },
      { label: "System Design", value: 88 },
      { label: "Backend", value: 92 },
    ],
    topics: ["AI Agents", "MCP", "Node.js", "TypeScript", "Docker"],
    style: ["Hinglish", "Systems", "Witty"],
  },
];



// ── Animated conversation strip ─────────────────────────────────────
const ConversationStrip: React.FC = () => {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    let idx = 0;
    let timer: ReturnType<typeof setInterval>;
    let resetTimer: ReturnType<typeof setTimeout>;

    const run = () => {
      timer = setInterval(() => {
        if (idx < CONV_CARDS.length) {
          const card = CONV_CARDS[idx];
          if (card) setVisible(prev => [...prev, card.id]);
          idx++;
        } else {
          clearInterval(timer);
          resetTimer = setTimeout(() => {
            setVisible([]);
            idx = 0;
            run();
          }, 3500);
        }
      }, 950);
    };

    run();
    return () => { clearInterval(timer); clearTimeout(resetTimer); };
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      {CONV_CARDS.map((card, i) => {
        const isVisible = visible.includes(card.id);
        return (
          <div
            key={card.id}
            className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: `${i * 0.05}s` }}
          >
            {card.role === "user" ? (
              /* User bubble */
              <div className="flex justify-end">
                <div className="max-w-[70%] bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-3 text-sm font-medium leading-relaxed">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">You</p>
                  {card.text}
                </div>
              </div>
            ) : (
              /* Assistant bubble */
              <div className="flex justify-start gap-3">
                <img
                  src={card.avatar}
                  alt={card.name}
                  className="w-10 h-10 object-cover border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1 rounded-full"
                />
                <div className="max-w-[75%]">
                  <p
                    className="text-[10px] font-black uppercase tracking-widest mb-1.5"
                    style={{ color: card.accent }}
                  >
                    {card.name}
                  </p>
                  <div
                    className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-3 text-sm font-medium text-black leading-relaxed bg-white"
                    style={{ borderLeft: `4px solid ${card.accent}` }}
                  >
                    {card.text}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Typing indicator */}
      {visible.length === CONV_CARDS.length && (
        <div className="flex items-center gap-2 pl-[52px] animate-fade-up">
          <div className="flex gap-1 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] px-3 py-2">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ backgroundColor: "#6D5DF6", animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Thinking...</span>
        </div>
      )}
    </div>
  );
};

// ── Section: Hero ────────────────────────────────────────────────────
const HeroSection: React.FC<{ router: ReturnType<typeof useRouter> }> = ({ router }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden neo-grid px-4">

      {/* Purple radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 15% 20%, rgba(109,93,246,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 50% 45% at 85% 75%, rgba(6,182,212,0.05) 0%, transparent 65%)
          `,
        }}
      />

      {/* Subtle edge decorations — only on very wide screens, far left/right */}
      <div aria-hidden className="eng-decoration hidden 2xl:block" style={{ top: "42%", left: "1.5%", transform: "rotate(-1.5deg)", opacity: 0.07 }}>$ npm run dev</div>
      <div aria-hidden className="eng-decoration hidden 2xl:block" style={{ top: "55%", right: "1.5%", transform: "rotate(1deg)", opacity: 0.07 }}>{"→ POST /api/chat"}</div>
      <div aria-hidden className="eng-decoration hidden 2xl:block" style={{ top: "66%", left: "1.5%", transform: "rotate(0.5deg)", opacity: 0.06 }}>{"const ai = new AI(persona)"}</div>
      <div aria-hidden className="eng-decoration hidden 2xl:block" style={{ top: "75%", right: "1.5%", transform: "rotate(-1deg)", opacity: 0.06 }}>git commit -m "ship it"</div>

      <div className="w-full max-w-4xl mx-auto text-center pt-28 pb-16">

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 border-2 border-purple-400/50 shimmer-badge shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] transform -rotate-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
          <span className="font-black text-xs uppercase tracking-widest text-purple-700">
            Powered by GPT · Gemini · Claude · Groq
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-black leading-[0.9] tracking-tight mb-6 animate-slide-left">
          Reason.
          <br />
          Learn.
          <br />
          <span
            className="relative inline-block border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-4 mt-2 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #6D5DF6, #A855F7, #06B6D4)", backgroundSize: "200%" }}
          >
            <span
              aria-hidden
              className="absolute inset-0 -skew-x-12 -translate-x-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)", animation: "shimmer 3.5s linear infinite" }}
            />
            <span className="relative text-white">Build.</span>
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl font-medium text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.15s" }}>
          AI mentors trained on the teaching style of engineers who{" "}
          <span className="font-black text-black">actually shipped products.</span>
          {" "}Not a chatbot — a mentoring platform.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <button
            onClick={() => router.push("/persona")}
            className="group relative overflow-hidden bg-yellow-400 text-black font-black text-base border-4 border-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] neo-btn flex items-center gap-2"
          >
            <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500" />
            <span className="relative flex items-center gap-2">
              Pick Your Mentor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            onClick={() => document.getElementById("meet-mentors")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 bg-white text-black font-bold text-base border-4 border-black px-7 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] neo-btn"
          >
            Meet the Mentors
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Persona chips */}
        <div className="flex justify-center gap-3 flex-wrap animate-fade-up" style={{ animationDelay: "0.35s" }}>
          {[
            { img: "/hiteshchoudhary.png", name: "Hitesh", label: "☕ Chai Code", color: "#6D5DF6" },
            { img: "/piyushgarg.png", name: "Piyush", label: "⚡ GenAI", color: "#06B6D4" },
          ].map(p => (
            <button
              key={p.name}
              onClick={() => router.push("/persona")}
              className="flex items-center gap-2.5 bg-white border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-4 py-2 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
              style={{ borderWidth: 2.5 }}
            >
              <img src={p.img} alt={p.name} className="w-6 h-6 object-cover border-2 border-black rounded-full" />
              <span className="font-black text-xs uppercase text-black">{p.name}</span>
              <span className="text-xs font-bold text-gray-500">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-black/30" strokeWidth={3} />
      </div>
    </section>
  );
};

// ── Conversation Preview Strip ────────────────────────────────────────
const ConversationPreviewSection: React.FC = () => (
  <section className="py-20 px-4 border-t-4 border-black bg-gray-50">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-block bg-black text-white font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] mb-4 rotate-1">
          Live Preview
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">
          See how a conversation feels
        </h2>
      </div>

      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Terminal-style header */}
        <div className="bg-black px-5 py-3 flex items-center gap-3 border-b-2 border-black">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-white/40" />
            <span className="text-white/60 font-mono text-xs font-bold uppercase tracking-widest">
              tark-ai — mentor session
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 font-mono text-[10px] font-bold">LIVE</span>
          </div>
        </div>

        <div className="p-6 md:p-8 min-h-[320px]">
          <ConversationStrip />
        </div>
      </div>
    </div>
  </section>
);

// ── Stats Bar ────────────────────────────────────────────────────────
const StatsSection: React.FC = () => {
  const stats = [
    { value: "2+", label: "Expert Personas", icon: <Terminal className="w-5 h-5" /> },
    { value: "∞", label: "Conversations", icon: <GitBranch className="w-5 h-5" /> },
    { value: "4×", label: "AI Backends", icon: <Cpu className="w-5 h-5" /> },
    { value: "Live", label: "Real-time Streams", icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <section className="border-y-4 border-black bg-black py-6 md:py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x-0 md:divide-x-4 divide-white/10">
          {stats.map(({ value, label, icon }, i) => (
            <div
              key={label}
              className="flex flex-col items-center text-center py-5 px-6 animate-count-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-white/30 mb-2">{icon}</div>
              <div className="text-5xl md:text-6xl font-black text-white leading-none mb-1.5">{value}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Features Section ────────────────────────────────────────────────
const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      bg: "bg-violet-100",
      accent: "#6D5DF6",
      title: "Authentic Personas",
      description:
        "Trained on teaching style, Hinglish patterns, analogies, and reasoning of real engineers — not generic AI.",
      bullet: "Real teaching philosophy",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      bg: "bg-cyan-50",
      accent: "#06B6D4",
      title: "Context Aware",
      description:
        "Maintains full conversation memory. Follows up, goes deeper, remembers what you asked 10 messages ago.",
      bullet: "Maintains conversation depth",
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      bg: "bg-yellow-50",
      accent: "#CA8A04",
      title: "Project-First",
      description:
        "No theory dumps. Ask about system design, backend, DSA, or career — get real engineering answers.",
      bullet: "Dev-focused learning",
    },
    {
      icon: <Server className="w-8 h-8" />,
      bg: "bg-gray-50",
      accent: "#374151",
      title: "Multi-Model",
      description:
        "Powered by GPT-4o, Gemini Pro, Claude, and Groq. Best model for each persona and query type.",
      bullet: "GPT · Gemini · Claude · Groq",
    },
  ];

  return (
    <section id="features" className="py-24 md:py-32 px-4 md:px-8 border-t-4 border-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-block bg-violet-600 text-white font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-5 -rotate-1">
            Why Tark AI
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-black leading-tight tracking-tight max-w-2xl">
            Not just another
            <br />
            <span
              className="inline-block border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] px-3 mt-2"
              style={{ background: "linear-gradient(135deg, #6D5DF6, #A855F7)" }}
            >
              <span className="text-white">chatbot.</span>
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map(({ icon, bg, accent, title, description, bullet }, i) => (
            <div
              key={title}
              className={`group relative ${bg} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10 animate-fade-up cursor-default
                hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Corner tag */}
              <div className="absolute top-5 right-5 bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-1">
                {bullet}
              </div>

              {/* Icon */}
              <div
                className="w-16 h-16 flex items-center justify-center text-white border-4 border-black mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)]"
                style={{ background: accent }}
              >
                {icon}
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-black uppercase mb-4">{title}</h3>
              <p className="text-base font-medium text-black/65 leading-relaxed max-w-sm">{description}</p>

              {/* Bottom accent bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── NEW: Conversation Comparison ────────────────────────────────────
const ComparisonSection: React.FC<{ router: ReturnType<typeof useRouter> }> = ({ router }) => (
  <section className="py-24 md:py-32 px-4 md:px-8 border-t-4 border-black bg-black">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-block bg-yellow-400 text-black font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] mb-5 rotate-1">
          Two Minds, One Question
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
          Same question.
          <br />
          <span className="gradient-text">Different perspectives.</span>
        </h2>
      </div>

      {/* Question */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-3 bg-white/10 border-2 border-white/20 px-6 py-4 text-white font-bold text-lg md:text-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
          <span className="text-yellow-400 font-black">"</span>
          {COMPARISON.question}
          <span className="text-yellow-400 font-black">"</span>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-10">
        <div className="flex flex-col items-center gap-1">
          <div className="w-0.5 h-8 bg-white/20" />
          <ChevronDown className="w-5 h-5 text-white/40" />
        </div>
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {[COMPARISON.hitesh, COMPARISON.piyush].map((mentor) => (
          <div
            key={mentor.name}
            className="group bg-white border-4 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] p-6 md:p-8 hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
          >
            {/* Persona header */}
            <div className="flex items-center gap-3 mb-5">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-12 h-12 object-cover border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full"
              />
              <div>
                <p className="font-black text-black text-sm uppercase tracking-wide">{mentor.name}</p>
                <div
                  className="h-0.5 w-full mt-1 rounded-full"
                  style={{ background: mentor.accent }}
                />
              </div>
            </div>

            {/* Answer */}
            <div
              className="border-l-4 pl-4 mb-5"
              style={{ borderColor: mentor.accent }}
            >
              <p className="text-sm font-medium text-black/80 leading-relaxed italic">
                "{mentor.answer}"
              </p>
            </div>

            {/* Style tags */}
            <div className="flex flex-wrap gap-2">
              {mentor.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 border-2 border-black"
                  style={{ background: mentor.accent, color: "#fff" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <button
          onClick={() => router.push("/persona")}
          className="group relative overflow-hidden bg-yellow-400 text-black font-black text-sm border-4 border-yellow-400 px-8 py-4 shadow-[5px_5px_0px_0px_rgba(255,255,255,0.2)] neo-btn inline-flex items-center gap-2"
        >
          <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500" />
          <span className="relative flex items-center gap-2">
            Try it yourself <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </div>
  </section>
);

// ── Meet Mentors Section ────────────────────────────────────────────
const MeetMentorsSection: React.FC<{ router: ReturnType<typeof useRouter> }> = ({ router }) => {
  const handleMentor = (key: string, name: string, role: string, image: string, personality: string) => {
    const data = { key, name, role, personality, image, communicationStyle: "Engaging and thoughtful", tone: "Professional yet approachable", expertise: "Various fields", additionalContext: "" };
    localStorage.setItem("selectedPersona", JSON.stringify(data));
    router.push("/chat");
  };

  return (
    <section id="meet-mentors" className="py-24 md:py-32 border-t-4 border-black px-4 md:px-8 bg-yellow-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="inline-block bg-black text-white font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-5">
              Meet the Mentors
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-black leading-tight tracking-tight">
              Engineers who actually
              <br />
              <span className="relative inline-block">
                built products.
                <span className="absolute -bottom-1 left-0 w-full h-3 bg-yellow-300 -z-10" />
              </span>
            </h2>
          </div>
          <button
            onClick={() => router.push("/persona")}
            className="self-start md:self-end neo-btn flex items-center gap-2 bg-black text-white font-bold text-sm border-4 border-black px-5 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            See All Personas <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mentor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {MENTORS.map((mentor, i) => (
            <div
              key={mentor.key}
              className="group bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mentor-card-hover animate-fade-up overflow-hidden"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Top accent stripe */}
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${mentor.accent}, transparent)` }} />

              <div className="p-6 md:p-8">
                {/* Avatar + name */}
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative flex-shrink-0">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-20 h-20 object-cover border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-5 h-5 border-2 border-black rounded-full"
                      style={{ background: mentor.accent }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-black uppercase tracking-tight">{mentor.name}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{mentor.role}</p>
                    {/* Quote */}
                    <p
                      className="text-xs font-bold mt-2 italic"
                      style={{ color: mentor.accent }}
                    >
                      "{mentor.quote}"
                    </p>
                  </div>
                </div>

                {/* Philosophy */}
                <div className="mb-6 border-l-4 pl-4" style={{ borderColor: mentor.accent }}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Teaching Philosophy</p>
                  <p className="text-sm font-medium text-black/70 leading-relaxed">{mentor.philosophy}</p>
                </div>

                {/* Strength meters */}
                <div className="mb-6 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Strengths</p>
                  {mentor.strengths.map(({ label, value }) => (
                    <div key={label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-black">{label}</span>
                        <span className="text-[10px] font-black" style={{ color: mentor.accent }}>{value}%</span>
                      </div>
                      <div className="strength-bar">
                        <div
                          className="strength-bar-fill"
                          style={{
                            "--target-width": `${value}%`,
                            background: `linear-gradient(90deg, ${mentor.accent}, ${mentor.accent}aa)`,
                          } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Topic tags */}
                <div className="mb-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Signature Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.topics.map(t => (
                      <span
                        key={t}
                        className="text-[10px] font-bold border-2 border-black px-2.5 py-1"
                        style={{ background: `${mentor.accent}18`, color: mentor.accent }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Response style */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-full mb-1">Response Style</p>
                  {mentor.style.map(s => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 text-[10px] font-bold bg-gray-100 border border-gray-200 px-2.5 py-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" style={{ color: mentor.accent }} />
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleMentor(mentor.key, mentor.name, mentor.role, mentor.avatar, mentor.philosophy)}
                  className="w-full relative overflow-hidden text-white font-black text-xs uppercase tracking-widest py-3.5 border-2 border-black flex items-center justify-center gap-2 group-hover:opacity-90 transition-all duration-200 neo-btn"
                  style={{ background: `linear-gradient(135deg, ${mentor.accent}, ${mentor.accent}cc)` }}
                >
                  <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500" />
                  <span className="relative flex items-center gap-2">
                    Talk to {mentor.name.split(" ")[0]} <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── How It Works ────────────────────────────────────────────────────
const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Pick Your Mentor",
      description: "Hitesh or Piyush — two engineers with completely different styles. One chai, one startup energy. Your call.",
      icon: <Users className="w-7 h-7" />,
      accent: "#6D5DF6",
    },
    {
      step: "02",
      title: "Ask Like a Dev",
      description: "No textbook questions needed. Ask about your actual bug, your career confusion, or that system design you can't crack.",
      icon: <MessageSquare className="w-7 h-7" />,
      accent: "#06B6D4",
    },
    {
      step: "03",
      title: "Build the Insight",
      description: "Every response is grounded in how these engineers actually think. Follow up, push deeper, apply it to your project.",
      icon: <Brain className="w-7 h-7" />,
      accent: "#CA8A04",
    },
  ];

  return (
    <section className="py-24 md:py-32 border-t-4 border-black px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-cyan-400 text-black font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-5 rotate-1">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black leading-tight tracking-tight">
            From question
            <br />
            to clarity. In minutes.
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[23%] right-[23%] h-[3px] bg-black/10" />

          {steps.map(({ step, title, description, icon, accent }, i) => (
            <div
              key={step}
              className="flex flex-col items-center text-center animate-fade-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Step badge */}
              <div
                className="relative z-10 w-24 h-24 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center mb-6 group-hover:shadow-none transition-all"
                style={{ background: accent }}
              >
                <span className="font-black text-white/80 text-[10px] uppercase mb-1">{step}</span>
                <div className="text-white">{icon}</div>
              </div>
              <h3 className="text-xl font-black text-black uppercase mb-3 tracking-tight">{title}</h3>
              <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-xs">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Built With ──────────────────────────────────────────────────────
const BuiltWithSection: React.FC = () => {
  const techs = [
    { name: "GPT-4o", category: "AI" },
    { name: "Gemini", category: "AI" },
    { name: "Claude", category: "AI" },
    { name: "Groq", category: "AI" },
    { name: "Next.js", category: "Web" },
    { name: "TypeScript", category: "Web" },
    { name: "Vercel", category: "Infra" },
    { name: "MCP", category: "Protocol" },
  ];

  return (
    <section id="about" className="py-20 border-t-4 border-black px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Built on the best AI infrastructure</p>
          <div className="h-0.5 w-24 bg-black/10 mx-auto" />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {techs.map(({ name, category }) => (
            <div
              key={name}
              className="flex items-center gap-2 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-5 py-3 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-default"
            >
              <span className="font-black text-sm text-black">{name}</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider border border-gray-200 px-1.5 py-0.5">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Final CTA ───────────────────────────────────────────────────────
const FinalCTASection: React.FC<{ router: ReturnType<typeof useRouter> }> = ({ router }) => (
  <section className="border-t-4 border-black bg-black py-28 md:py-36 px-4 relative overflow-hidden">
    {/* Decorative code fragments */}
    <div className="absolute top-8 left-8 font-mono text-white/5 text-7xl font-black select-none pointer-events-none">{"{ }"}</div>
    <div className="absolute bottom-8 right-8 font-mono text-white/5 text-7xl font-black select-none pointer-events-none">{"</>"}</div>
    <div className="absolute top-1/2 left-4 -translate-y-1/2 font-mono text-white/[0.03] text-4xl font-black select-none pointer-events-none rotate-90 hidden lg:block">
      npm run mentor
    </div>

    {/* Cyan glow */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(6,182,212,0.06) 0%, transparent 70%)",
      }}
    />

    <div className="max-w-3xl mx-auto text-center relative z-10">
      <div className="inline-block bg-yellow-400 text-black font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-yellow-400 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] mb-8 -rotate-1">
        Reason. Learn. Build.
      </div>
      <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6">
        Your mentor is
        <br />
        waiting.
      </h2>
      <p className="text-gray-400 font-medium text-lg mb-10 max-w-lg mx-auto leading-relaxed">
        No signup required. No API key. Just pick a mentor and ask your question.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => router.push("/persona")}
          className="group relative overflow-hidden bg-yellow-400 text-black font-black text-lg border-4 border-yellow-400 px-10 py-4 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] neo-btn"
        >
          <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500" />
          <span className="relative flex items-center gap-2">
            Start Chatting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
        <button
          onClick={() => router.push("/persona")}
          className="bg-transparent text-white font-bold text-lg border-4 border-white/20 px-8 py-4 hover:border-white/50 hover:bg-white/5 transition-all duration-200"
        >
          View Personas
        </button>
      </div>
    </div>
  </section>
);

// ── Footer ──────────────────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer className="border-t-2 border-black/10 bg-white py-8 px-4">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img src="/tarkai-logo-navbar.png" alt="Tark AI" className="h-7 w-auto object-contain opacity-80" />
        <span className="text-xs text-gray-400 font-medium">Reason. Learn. Build.</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
        <a href="/privacy" className="hover:text-black transition-colors">Privacy</a>
        <a href="/terms" className="hover:text-black transition-colors">Terms</a>
        <a
          href="https://github.com/heelpatel01"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-black transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
          GitHub
        </a>
      </div>
      <p className="text-[11px] text-gray-300 font-medium text-center md:text-right">
        AI can make mistakes. Verify important info. Built with ❤️ by Heel Patel.
      </p>
    </div>
  </footer>
);

// ── Root Export ─────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <HeroSection router={router} />
      <ConversationPreviewSection />
      <StatsSection />
      <FeaturesSection />
      <ComparisonSection router={router} />
      <MeetMentorsSection router={router} />
      <HowItWorksSection />
      <BuiltWithSection />
      <FinalCTASection router={router} />
      <Footer />
    </>
  );
};

export default LandingPage;
