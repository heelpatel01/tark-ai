"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, Users, Rocket } from "lucide-react";

const HeroSection: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative flex flex-col">
      {/* Main Hero Content */}
      <main className="flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto z-10 mt-12 mb-12">
        {/* Badge */}
        <div className="mb-8 inline-block bg-green-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 transform -rotate-2">
          <span className="font-black text-sm uppercase tracking-wider text-black flex items-center gap-1.5 justify-center">
            Powered by Modern LLMs <Sparkles className="w-4 h-4 text-black inline-block animate-pulse" />
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-black mb-6 md:mb-8 leading-tight tracking-tight">
          CHAT WITH <br />
          YOUR FAVORITE <br />
          <span className="relative inline-block bg-purple-500 text-white px-2 md:px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 mt-2 md:mt-0 mx-0 md:mx-2">
            MENTORS
          </span>
        </h1>

        <div className="max-w-3xl border-2 border-black bg-white p-4 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 md:mb-12 transform rotate-1">
          <p className="text-lg md:text-2xl font-bold text-black leading-relaxed">
            Tark AI lets you chat with AI personas inspired by Hitesh Choudhary and Piyush Garg. Learn programming, backend development, AI, and problem-solving through conversations that reflect their unique teaching styles.
          </p>
        </div>

        <button
          onClick={() => router.push("/persona")}
          className="group relative inline-flex items-center justify-center"
        >
          <div className="relative bg-yellow-400 hover:bg-yellow-300 text-black border-4 border-black px-6 py-4 md:px-10 md:py-5 font-black text-lg md:text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group-hover:translate-x-[2px] group-hover:translate-y-[2px] md:group-hover:translate-x-[4px] md:group-hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] md:active:translate-x-[8px] md:active:translate-y-[8px] active:shadow-none">
            Choose a Persona →
          </div>
        </button>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 max-w-2xl">
          <div className="bg-white border-2 border-black px-3 py-1.5 font-bold text-xs md:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Powered by AI
          </div>
          <div className="bg-white border-2 border-black px-3 py-1.5 font-bold text-xs md:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-500" /> 2 Expert Personas
          </div>
          <div className="bg-white border-2 border-black px-3 py-1.5 font-bold text-xs md:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-red-500 fill-red-500" /> Fast Responses
          </div>
        </div>
      </main>

      {/* Decorative Geometric Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-blue-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce hidden md:block"></div>
      <div className="absolute bottom-40 right-20 w-20 h-20 bg-green-400 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden md:block"></div>
      <div className="absolute top-40 right-32 w-0 h-0 border-l-[30px] border-l-transparent border-t-[50px] border-t-red-500 border-r-[30px] border-r-transparent filter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-12 hidden md:block"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-orange-400 rotate-45 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden md:block"></div>
    </div>
  );
};
export default HeroSection;
