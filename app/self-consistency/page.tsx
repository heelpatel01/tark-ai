import type { Metadata } from "next";
import { BrainCircuit } from "lucide-react";
import Navbar from "@/component/navbar";
import { ConsensusPlayground } from "@/components/consensus/ConsensusPlayground";

export const metadata: Metadata = {
  title: "Self-Consistency Answer Engine",
  description:
    "Ask multiple AI models the same question in parallel, then let an evaluator model synthesize their strongest ideas into one polished consensus answer.",
};

export default function SelfConsistencyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      <div className="saas-grid" />
      <div className="hero-glow pointer-events-none" />
      <Navbar />

      <main className="relative z-10 pt-32 sm:pt-36 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#6D5DF6]/20 bg-[#6D5DF6]/5 text-[#6D5DF6] text-[10px] font-bold uppercase tracking-widest mb-6">
              <BrainCircuit size={11} strokeWidth={2.5} />
              AI Consensus Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-[#F8FAFC]">
              Self-Consistency Answer Engine
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#667085] dark:text-[#94A3B8] font-medium max-w-2xl mx-auto">
              One question, asked to multiple models in parallel. An evaluator
              compares their accuracy, reasoning and clarity — then merges the
              strongest ideas into a single polished answer.
            </p>
          </header>

          <ConsensusPlayground />
        </div>
      </main>
    </div>
  );
}
