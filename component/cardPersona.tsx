"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowRight, FiCheck, FiCpu, FiSettings, FiTarget, FiHelpCircle } from "react-icons/fi";

const MENTORS = [
  {
    key: "hiteshchoudhary",
    name: "Hitesh Choudhary",
    role: "Founder • Chai Code",
    avatar: "/hiteshchoudhary.png",
    accent: "#6D5DF6",
    quote: "Build projects, not tutorials.",
    bestFor: ["Beginners", "Full Stack", "Career Growth", "JavaScript"],
    style: ["Practical", "Hinglish", "Project-first"],
    whoShouldChoose: "If you learn best by building real projects and want simple explanations.",
    stats: ["Practical Learning", "Project-first", "Career Guidance"],
    buttonLabel: "Talk to Hitesh →",
  },
  {
    key: "piyushgarg",
    name: "Piyush Garg",
    role: "Founder • Teachyst",
    avatar: "/piyushgarg.png",
    accent: "#06B6D4",
    quote: "Understand systems before writing code.",
    bestFor: ["AI", "Backend", "Architecture", "System Design"],
    style: ["Analytical", "Architecture", "Modern AI"],
    whoShouldChoose: "If you enjoy understanding why things work before building them.",
    stats: ["AI Engineering", "Backend Systems", "Architecture"],
    buttonLabel: "Talk to Piyush →",
  },
];

const COMPARISON_ROWS = [
  { action: "Learn JavaScript", mentor: "Hitesh" },
  { action: "Build Full Stack apps", mentor: "Hitesh" },
  { action: "Crack interviews", mentor: "Hitesh" },
  { action: "Learn AI Agents", mentor: "Piyush" },
  { action: "Understand MCP", mentor: "Piyush" },
  { action: "System Design", mentor: "Piyush" },
  { action: "Backend Scaling", mentor: "Piyush" },
];

export default function PersonaCards() {
  const router = useRouter();

  const handleMentorSelect = (key: string, name: string, role: string, avatar: string, quote: string) => {
    const personaData = {
      key,
      name,
      role,
      personality: quote,
      image: avatar,
      communicationStyle: "Engaging and thoughtful",
      tone: "Professional yet approachable",
      expertise: "Software Engineering",
      additionalContext: "",
    };
    localStorage.setItem("selectedPersona", JSON.stringify(personaData));
    router.push("/chat");
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F5] flex flex-col font-sans pb-16">
      
      {/* SaaS background grid */}
      <div className="saas-grid" />

      {/* Hero Radial Glow */}
      <div className="hero-glow pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 md:px-8 max-w-4xl mx-auto text-center">
        <span className="inline-block bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 text-[#6D5DF6] font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm mb-4">
          AI Engineering Mentors
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] leading-[1.1] tracking-tight mb-4 max-w-2xl mx-auto">
          Choose the mentor
          <br />
          that matches your
          <br />
          <span className="text-[#6D5DF6]">thinking style.</span>
        </h1>
        <p className="text-sm md:text-base text-[#4B5563] font-semibold max-w-lg mx-auto leading-relaxed">
          Every mentor has a different way of explaining concepts.
          <br />
          Pick the one that matches how you like to learn.
        </p>
      </section>

      {/* Mentor Cards Side-by-Side */}
      <section className="px-4 md:px-8 max-w-5xl mx-auto w-full mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative">
          
          {MENTORS.map((mentor) => (
            <div
              key={mentor.key}
              className="bento-card p-8 rounded-[32px] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
            >
              {/* Top Section */}
              <div className="space-y-6">
                {/* Avatar & Header */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={mentor.avatar}
                      alt={mentor.name}
                      fill
                      sizes="64px"
                      className="object-cover rounded-full border border-white shadow-md"
                    />
                    <span
                      className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
                      style={{ backgroundColor: mentor.accent }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#111827]">{mentor.name}</h3>
                    <p className="text-xs text-[#4B5563] font-bold uppercase tracking-wider mt-0.5">{mentor.role}</p>
                  </div>
                </div>

                {/* One-Line Teaching Philosophy */}
                <div className="py-1">
                  <p className="text-lg font-bold text-[#111827] leading-snug">
                    "{mentor.quote}"
                  </p>
                </div>

                {/* Best For / Expertise Chips */}
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Best For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.bestFor.map((item) => (
                      <span
                        key={item}
                        className="bg-[#FAF9F5] border border-black/5 text-[#111827] text-xs font-bold px-3 py-1 rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Teaching Style Checkmarks */}
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Teaching Style</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.style.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#4B5563]"
                      >
                        <FiCheck className="text-green-600 w-3.5 h-3.5" strokeWidth={3} />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Who should choose Hitesh/Piyush */}
                <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-4.5 space-y-1">
                  <p className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Who should choose {mentor.name.split(" ")[0]}?</p>
                  <p className="text-xs font-semibold text-[#4B5563] leading-relaxed">
                    "{mentor.whoShouldChoose}"
                  </p>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-8">
                <button
                  onClick={() => handleMentorSelect(mentor.key, mentor.name, mentor.role, mentor.avatar, mentor.quote)}
                  className="w-full py-4 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${mentor.accent} 0%, ${mentor.accent}dd 100%)`,
                    boxShadow: `0 4px 14px 0 rgba(0, 0, 0, 0.05)`,
                  }}
                >
                  {mentor.buttonLabel}
                </button>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Visual Comparison Divider */}
      <section className="max-w-4xl mx-auto w-full px-4 text-center my-10 relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-black/5"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#FAF9F5] px-6 text-xs font-bold text-[#667085] uppercase tracking-widest leading-none">
            Different teaching styles. Same engineering quality.
          </span>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="px-4 md:px-8 max-w-3xl mx-auto w-full mb-16">
        <div className="bento-card p-6 md:p-8 rounded-[28px] space-y-6">
          <div className="text-center md:text-left">
            <span className="text-[9px] font-bold text-[#6D5DF6] uppercase tracking-widest">Decision Matrix</span>
            <h3 className="text-xl font-extrabold text-[#111827] mt-1">Which mentor fits you?</h3>
          </div>

          <div className="overflow-x-auto border border-black/5 rounded-2xl bg-[#FAF9F5]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 bg-black/[0.01]">
                  <th className="px-5 py-3.5 text-xs font-bold text-[#667085] uppercase tracking-wider">You want to...</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-[#667085] uppercase tracking-wider">Recommended Mentor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/40 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-semibold text-[#111827]">{row.action}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-[#6D5DF6]">{row.mentor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Teaching Response Preview Section */}
      <section className="px-4 md:px-8 max-w-3xl mx-auto w-full mb-16">
        <div className="bento-card p-6 md:p-8 rounded-[28px] space-y-6">
          <div className="text-center md:text-left">
            <span className="text-[9px] font-bold text-[#06B6D4] uppercase tracking-widest">Live Preview</span>
            <h3 className="text-xl font-extrabold text-[#111827] mt-1">Teaching Response Preview</h3>
            <p className="text-xs text-[#667085] font-semibold mt-1">See how each mentor responds to the same question.</p>
          </div>

          <div className="border border-black/5 rounded-2xl p-5 bg-[#FAF9F5] space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-black/5 text-[9px] font-bold text-[#667085] uppercase">Question</span>
              <p className="text-xs font-bold text-[#111827]">How should I learn backend development?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-black/5 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <img src="/hiteshchoudhary.png" alt="Hitesh" className="w-6 h-6 rounded-full object-cover border" />
                  <span className="text-xs font-bold text-[#111827]">Hitesh</span>
                </div>
                <p className="text-xs font-medium text-[#4B5563] leading-relaxed">
                  "Build APIs from day one. Theory alone won't make you an engineer."
                </p>
              </div>

              <div className="bg-white border border-black/5 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <img src="/piyushgarg.png" alt="Piyush" className="w-6 h-6 rounded-full object-cover border" />
                  <span className="text-xs font-bold text-[#111827]">Piyush</span>
                </div>
                <p className="text-xs font-medium text-[#4B5563] leading-relaxed">
                  "Before writing APIs, understand HTTP, databases, and architecture."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with icons and no percentages */}
      <section className="px-4 md:px-8 max-w-3xl mx-auto w-full mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MENTORS.map((mentor) => (
            <div key={mentor.key} className="bento-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5">
                <img src={mentor.avatar} alt={mentor.name} className="w-7 h-7 rounded-full object-cover" />
                <h4 className="text-xs font-bold text-[#111827]">{mentor.name.split(" ")[0]} Highlights</h4>
              </div>
              <ul className="space-y-2">
                {mentor.stats.map((stat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-semibold text-[#4B5563]">
                    <FiCheck className="text-green-600 flex-shrink-0" strokeWidth={3} />
                    <span>{stat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Subtle Node */}
      <section className="max-w-xl mx-auto text-center px-4 mb-16 space-y-1">
        <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">
          Thousands of engineering questions answered.
        </p>
        <p className="text-[9px] font-semibold text-[#667085] uppercase tracking-widest">
          Powered by GPT, Gemini & Claude. Built for developers.
        </p>
      </section>

      {/* Bottom CTA Card */}
      <section className="px-4 md:px-8 max-w-3xl mx-auto w-full mb-12">
        <div className="relative rounded-[32px] overflow-hidden bg-white border border-black/5 p-8 md:p-12 text-center shadow-sm">
          <div className="max-w-xl mx-auto space-y-5">
            <span className="inline-block bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 text-[#6D5DF6] font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
              Still not sure?
            </span>
            <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight">
              Try both mentors.
            </h2>
            <p className="text-xs font-semibold text-[#4B5563] leading-relaxed max-w-sm mx-auto">
              Every conversation is independent. Switch anytime and discover which teaching style helps you learn faster.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => handleMentorSelect("hiteshchoudhary", "Hitesh Choudhary", "Founder • Chai Code", "/hiteshchoudhary.png", "Build projects, not tutorials.")}
                className="px-6 py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all"
                style={{ background: "#6D5DF6" }}
              >
                Talk to Hitesh
              </button>
              <button
                onClick={() => handleMentorSelect("piyushgarg", "Piyush Garg", "Founder • Teachyst", "/piyushgarg.png", "Understand systems before writing code.")}
                className="px-6 py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all"
                style={{ background: "#06B6D4" }}
              >
                Talk to Piyush
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer disclaimer */}
      <footer className="mt-auto py-6 border-t border-black/5 text-center px-4 bg-white/40">
        <p className="text-[10px] text-[#667085] font-semibold tracking-wide">
          All conversations are AI-generated. Personas are simulated for educational purposes only.
        </p>
      </footer>

    </div>
  );
}
