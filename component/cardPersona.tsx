"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MessageCircle,
  ArrowRight,
  Layers,
  Terminal,
  Bot,
  CheckCircle2,
  GitBranch,
  Cpu,
} from "lucide-react";
import {
  PERSONAS_BY_CATEGORY,
  CATEGORY_NAMES,
  getCategoryKeys,
  PersonaInfo,
  PersonaCategory,
} from "@/type/personaInfo";

// Strength data per persona key
const PERSONA_STRENGTHS: Record<string, { label: string; value: number }[]> = {
  hiteshchoudhary: [
    { label: "Full Stack", value: 80 },
    { label: "Career Guidance", value: 92 },
    { label: "Backend", value: 85 },
  ],
  piyushgarg: [
    { label: "AI & LLMs", value: 95 },
    { label: "System Design", value: 88 },
    { label: "Backend", value: 90 },
  ],
};

const DEFAULT_STRENGTHS = [
  { label: "Teaching", value: 80 },
  { label: "Practical", value: 75 },
  { label: "Engineering", value: 82 },
];

// Style tags per persona
const PERSONA_STYLE_TAGS: Record<string, string[]> = {
  hiteshchoudhary: ["Hinglish", "Practical", "Encourager"],
  piyushgarg: ["Hinglish", "Systems", "Witty"],
};

// Topic tags per persona
const PERSONA_TOPICS: Record<string, string[]> = {
  hiteshchoudhary: ["JavaScript", "Node.js", "Startup", "DSA"],
  piyushgarg: ["AI Agents", "MCP", "TypeScript", "Docker"],
};

// Accent color per persona
const PERSONA_ACCENT: Record<string, string> = {
  hiteshchoudhary: "#6D5DF6",
  piyushgarg: "#06B6D4",
};

const DEFAULT_ACCENT = "#6D5DF6";

// Category colors
const CATEGORY_COLORS: Record<
  PersonaCategory,
  { bg: string; hover: string; border: string }
> = {
  "tech-educators": {
    bg: "bg-violet-100",
    hover: "hover:bg-violet-200",
    border: "border-violet-400",
  },
};

// Category icons
const CATEGORY_ICONS: Record<
  PersonaCategory,
  React.ComponentType<{ className?: string }>
> = {
  "tech-educators": Terminal,
};

export default function PersonaCards() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<PersonaCategory | "all">("all");
  const categories = getCategoryKeys();

  const handlePersonaSelect = (persona: PersonaInfo) => {
    const personaData = {
      key: persona.key,
      name: persona.name,
      role: persona.role,
      personality: persona.personality,
      image: persona.image || "",
      communicationStyle: "Engaging and thoughtful",
      tone: "Professional yet approachable",
      expertise: "Various fields of knowledge",
      additionalContext: "",
    };
    localStorage.setItem("selectedPersona", JSON.stringify(personaData));
    router.push("/chat");
  };

  const getDisplayedCategories = (): PersonaCategory[] => {
    if (activeCategory === "all") return categories;
    return [activeCategory];
  };

  return (
    <div className="relative min-h-screen flex flex-col px-4 md:px-8 py-8 md:py-12 neo-grid">

      {/* Subtle radial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 55% 35% at 15% 10%, rgba(109,93,246,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 45% 30% at 85% 85%, rgba(6,182,212,0.05) 0%, transparent 70%)
          `,
        }}
      />

      {/* Engineering decorations (subtle) */}
      <div aria-hidden className="absolute top-32 right-8 hidden lg:block font-mono text-xs font-bold text-black/[0.06] select-none rotate-[2deg]">
        → GET /api/personas
      </div>
      <div aria-hidden className="absolute bottom-64 left-8 hidden lg:block font-mono text-xs font-bold text-black/[0.06] select-none -rotate-[1deg]">
        {"const persona = await ai.load()"}
      </div>
      <div aria-hidden className="absolute top-[40%] right-12 hidden lg:block font-mono text-xs font-bold text-black/[0.05] select-none rotate-[1.5deg]">
        MCP → tool.execute()
      </div>

      {/* ── Page Header ── */}
      <div className="text-center mb-12 md:mb-16 relative z-10 animate-fade-up">
        <div className="inline-block bg-violet-600 text-white font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6 -rotate-1">
          AI Mentors
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tight uppercase leading-[0.9]">
          Meet the{" "}
          <span
            className="inline-block text-white px-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 mt-2"
            style={{ background: "linear-gradient(135deg, #6D5DF6 0%, #A855F7 60%, #06B6D4 100%)" }}
          >
            Personas
          </span>
        </h1>
        <div className="max-w-2xl mx-auto border-2 border-black bg-white/90 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] backdrop-blur-sm">
          <p className="text-sm md:text-base font-medium text-gray-600 leading-relaxed">
            All conversations are AI-generated. Personas are simulated for{" "}
            <span className="font-bold text-black">educational purposes</span> only.
          </p>
        </div>
      </div>

      {/* ── Category Filter Tabs ── */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16 relative z-10">
        {/* All Tab */}
        <button
          onClick={() => setActiveCategory("all")}
          className={`
            px-6 py-2.5 font-black text-xs uppercase tracking-wider
            border-2 border-black
            transition-all duration-200 flex items-center gap-2
            ${activeCategory === "all"
              ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[1px] translate-y-[1px]"
              : "bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
            }
          `}
        >
          <Layers className="w-3.5 h-3.5" /> All
        </button>

        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category];
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-6 py-2.5 font-black text-xs uppercase tracking-wider
                border-2 border-black
                transition-all duration-200 flex items-center gap-2
                ${activeCategory === category
                  ? "bg-violet-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[1px] translate-y-[1px]"
                  : "bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                }
              `}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {CATEGORY_NAMES[category]}
            </button>
          );
        })}
      </div>

      {/* ── Persona Cards ── */}
      <div className="space-y-14 max-w-7xl mx-auto w-full relative z-10">
        {getDisplayedCategories().map((category) => {
          const CategoryIcon = CATEGORY_ICONS[category];
          return (
            <div key={category} className="space-y-8">
              {/* Category Header */}
              {activeCategory === "all" && (
                <div className="flex items-center gap-4 mb-2">
                  <h2
                    className="inline-flex items-center gap-2 text-xl md:text-2xl font-black text-white uppercase px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    style={{ background: "linear-gradient(135deg, #6D5DF6, #06B6D4)" }}
                  >
                    {CategoryIcon && <CategoryIcon className="w-5 h-5" />}
                    {CATEGORY_NAMES[category]}
                  </h2>
                  <div className="flex-1 h-[2px] bg-black/10 hidden md:block" />
                </div>
              )}

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 max-w-4xl">
                {PERSONAS_BY_CATEGORY[category].map((persona, i) => {
                  const accent = PERSONA_ACCENT[persona.key] || DEFAULT_ACCENT;
                  const strengths = PERSONA_STRENGTHS[persona.key] || DEFAULT_STRENGTHS;
                  const styleTags = PERSONA_STYLE_TAGS[persona.key] || ["Practical", "AI", "Mentor"];
                  const topics = PERSONA_TOPICS[persona.key] || ["Engineering", "AI", "Projects"];

                  return (
                    <div
                      key={persona.key}
                      className="group bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mentor-card-hover flex flex-col overflow-hidden animate-fade-up"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    >
                      {/* Top accent stripe */}
                      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

                      {/* Image Section */}
                      {persona.image && (
                        <div className="relative h-56 border-b-4 border-black overflow-hidden">
                          <Image
                            src={persona.image}
                            alt={persona.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                          {/* AI Mentor badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/80 backdrop-blur-sm border border-white/20 px-2.5 py-1">
                            <Bot className="w-3 h-3 text-violet-400" />
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">AI Mentor</span>
                          </div>

                          {/* Category badge */}
                          <div
                            className="absolute top-3 right-3 flex items-center gap-1 border border-black/30 px-2 py-1"
                            style={{ background: `${accent}cc`, backdropFilter: "blur(4px)" }}
                          >
                            {CategoryIcon && <CategoryIcon className="w-3 h-3 text-white" />}
                            <span className="text-[9px] font-black text-white uppercase">
                              {CATEGORY_NAMES[category].split(" ")[0]}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex flex-col flex-grow p-6 bg-white">
                        {/* Name + Role */}
                        <h3 className="text-2xl font-black text-black uppercase leading-tight tracking-tight mb-1">
                          {persona.name}
                        </h3>
                        {persona.role && (
                          <p className="text-xs font-medium text-gray-400 mb-4 line-clamp-1">{persona.role}</p>
                        )}

                        {/* Personality quote */}
                        {persona.personality && (
                          <div className="border-l-4 pl-3 mb-5" style={{ borderColor: accent }}>
                            <p className="text-xs font-medium text-black/60 leading-relaxed line-clamp-2">
                              {persona.personality}
                            </p>
                          </div>
                        )}

                        {/* Strength meters */}
                        <div className="mb-5 space-y-2.5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Strengths</p>
                          {strengths.map(({ label, value }) => (
                            <div key={label}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-black">{label}</span>
                                <span className="text-[10px] font-black" style={{ color: accent }}>{value}%</span>
                              </div>
                              <div className="strength-bar">
                                <div
                                  className="strength-bar-fill"
                                  style={{
                                    "--target-width": `${value}%`,
                                    background: `linear-gradient(90deg, ${accent}, ${accent}99)`,
                                  } as React.CSSProperties}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Topics */}
                        <div className="mb-5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Topics</p>
                          <div className="flex flex-wrap gap-1.5">
                            {topics.map(t => (
                              <span
                                key={t}
                                className="text-[10px] font-bold border-2 border-black px-2 py-0.5"
                                style={{ background: `${accent}18`, color: accent }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Style tags */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {styleTags.map(s => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-1 text-[10px] font-bold bg-gray-50 border border-gray-200 px-2 py-0.5"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5" style={{ color: accent }} />
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="pt-4 mt-auto border-t-2 border-black/10">
                          <button
                            onClick={() => handlePersonaSelect(persona)}
                            className="
                              w-full group/btn relative overflow-hidden
                              text-white font-black text-sm uppercase tracking-wider
                              border-2 border-black
                              py-3.5 px-4
                              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                              hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                              hover:translate-x-[3px] hover:translate-y-[3px]
                              active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
                              transition-all duration-200
                              flex items-center justify-center gap-2
                            "
                            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-in-out"
                            />
                            <span className="relative flex items-center gap-2">
                              Begin Session
                              <ArrowRight className="w-4 h-4 stroke-[2.5px] relative transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
