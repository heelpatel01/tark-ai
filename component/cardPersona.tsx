"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageCircle, Sparkles, ArrowRight, Layers, Terminal, Bot } from "lucide-react";
import {
  PERSONAS_BY_CATEGORY,
  CATEGORY_NAMES,
  getCategoryKeys,
  PersonaInfo,
  PersonaCategory,
} from "@/type/personaInfo";

// Category colors for visual distinction
const CATEGORY_COLORS: Record<
  PersonaCategory,
  { bg: string; hover: string; border: string; pill: string }
> = {
  "tech-educators": {
    bg: "bg-violet-100",
    hover: "hover:bg-violet-200",
    border: "border-violet-400",
    pill: "bg-violet-600",
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
    <div className="relative min-h-screen flex flex-col px-4 md:px-8 py-8 md:py-12">

      {/* Subtle background radial for persona page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 55% 35% at 15% 10%, rgba(109,93,246,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 45% 30% at 85% 85%, rgba(168,85,247,0.04) 0%, transparent 70%)
          `,
        }}
      />

      {/* ── Page Header ── */}
      <div className="text-center mb-10 md:mb-14 relative z-10 animate-fade-up">
        <h1 className="text-4xl md:text-7xl font-black text-black mb-6 tracking-tight uppercase">
          Meet the <br />
          <span
            className="inline-block text-white px-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 mt-2"
            style={{
              background: "linear-gradient(135deg, #6D5DF6 0%, #A855F7 60%, #3B82F6 100%)",
            }}
          >
            AI Personalities
          </span>
        </h1>
        <div className="max-w-2xl mx-auto border-2 border-black/70 bg-white/90 p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)] backdrop-blur-sm">
          <p className="text-sm md:text-base font-medium text-gray-600 leading-relaxed">
            All conversations are AI-generated. Personas are simulated for{" "}
            <span className="font-bold text-black">educational purposes</span> only.
          </p>
        </div>
      </div>

      {/* ── Category Filter Tabs ── */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14 relative z-10">
        {/* All Tab */}
        <button
          onClick={() => setActiveCategory("all")}
          className={`
            px-5 py-2 md:px-7 md:py-2.5 font-bold text-xs md:text-sm uppercase tracking-wider
            border-2 border-black rounded-full
            transition-all duration-200 flex items-center gap-2
            ${activeCategory === "all"
              ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[1px] translate-y-[1px]"
              : "bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
            }
          `}
        >
          <Layers className="w-3.5 h-3.5" /> All
        </button>

        {/* Category Tabs */}
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category];
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-5 py-2 md:px-7 md:py-2.5 font-bold text-xs md:text-sm uppercase tracking-wider
                border-2 border-black rounded-full
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
                    className="inline-flex items-center gap-2 text-xl md:text-2xl font-black text-white uppercase px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
                    style={{ background: "linear-gradient(135deg, #6D5DF6, #A855F7)" }}
                  >
                    {CategoryIcon && <CategoryIcon className="w-5 h-5" />}
                    {CATEGORY_NAMES[category]}
                  </h2>
                  <div className="flex-1 h-[2px] bg-black/10 hidden md:block" />
                </div>
              )}

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {PERSONAS_BY_CATEGORY[category].map((persona) => (
                  <div
                    key={persona.key}
                    className="
                      group relative bg-white
                      border-[3px] border-black rounded-2xl
                      overflow-hidden
                      shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                      card-hover
                      flex flex-col
                    "
                  >
                    {/* Image Section */}
                    {persona.image && (
                      <div className="relative h-60 md:h-64 overflow-hidden rounded-t-xl border-b-[3px] border-black">
                        <Image
                          src={persona.image}
                          alt={persona.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        {/* Gradient overlay at bottom of image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                        {/* AI Mentor Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/80 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-full shadow-sm">
                          <Bot className="w-3 h-3 text-violet-400" />
                          <span className="text-[10px] font-black text-white uppercase tracking-wider">
                            AI Mentor
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div
                          className="absolute top-3 right-3 flex items-center gap-1 border border-black/30 px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.7)]"
                          style={{ background: "rgba(109,93,246,0.85)", backdropFilter: "blur(4px)" }}
                        >
                          {CategoryIcon && <CategoryIcon className="w-3 h-3 text-white" />}
                          <span className="text-[9px] font-black text-white uppercase">
                            {CATEGORY_NAMES[category].split(" ")[0]}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col flex-grow p-5 bg-white rounded-b-2xl">
                      <div className="space-y-3 flex-grow">
                        {/* Name */}
                        <h3 className="text-xl md:text-2xl font-black text-black uppercase leading-tight tracking-tight">
                          {persona.name}
                        </h3>

                        {/* Role pill — purple */}
                        {persona.role && (
                          <div className="inline-flex items-center gap-1 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full">
                            <p className="text-[10px] md:text-xs font-bold text-violet-700 uppercase tracking-wide line-clamp-1">
                              {persona.role}
                            </p>
                          </div>
                        )}

                        {/* Personality */}
                        {persona.personality && (
                          <p className="text-xs md:text-sm font-medium text-gray-600 leading-snug border-l-4 border-violet-400 pl-3 my-3 line-clamp-2">
                            {persona.personality}
                          </p>
                        )}

                        {/* Tags */}
                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-500 pt-1">
                          <div className="flex items-center gap-1 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
                            <MessageCircle className="w-3 h-3" />
                            <span>AI Chat</span>
                          </div>
                          <div className="flex items-center gap-1 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
                            <Sparkles className="w-3 h-3" />
                            <span>Interactive</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="pt-4 mt-3 border-t border-gray-100">
                        <button
                          onClick={() => handlePersonaSelect(persona)}
                          className="
                            w-full group/btn relative overflow-hidden
                            text-white font-black text-sm md:text-base
                            border-2 border-black rounded-none
                            py-3 px-4
                            shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                            hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            active:shadow-none active:translate-x-[3px] active:translate-y-[3px]
                            transition-all duration-200
                            flex items-center justify-center gap-2
                          "
                          style={{
                            background: "linear-gradient(135deg, #6D5DF6 0%, #A855F7 100%)",
                          }}
                        >
                          {/* Shimmer on hover */}
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-in-out"
                          />
                          <span className="relative">START CHAT</span>
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5px] relative transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Decorative Shapes */}
      <div className="absolute top-40 left-6 w-20 h-20 bg-blue-400 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hidden lg:block animate-float-slow" />
      <div
        className="absolute top-24 right-16 hidden lg:block animate-float-fast"
        style={{
          width: 0, height: 0,
          borderLeft: "26px solid transparent",
          borderRight: "26px solid transparent",
          borderBottom: "46px solid #EF4444",
          filter: "drop-shadow(4px 4px 0px rgba(0,0,0,0.9))",
        }}
      />
      <div className="absolute bottom-56 left-16 w-16 h-16 rounded-full bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden lg:block animate-float-circle" />
      <div className="absolute bottom-36 right-8 w-18 h-18 bg-orange-400 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hidden lg:block animate-float-medium" style={{ width: 72, height: 72 }} />
    </div>
  );
}
