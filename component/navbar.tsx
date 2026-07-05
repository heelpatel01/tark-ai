"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();

  return (
    <header
      className="fixed top-0 right-4 left-4 md:right-20 md:left-20 lg:right-40 lg:left-40 w-auto z-50 mt-3 rounded-2xl border-2 border-black
                 glass shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-center justify-between px-5 py-2.5 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <img
            src="/tarkai-logo-navbar.png"
            alt="Tark AI Logo"
            className="h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col border-l border-black/20 pl-2.5 ml-0.5">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-tight">
              Reason. Learn. Build.
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/persona")}
            className="
              relative group overflow-hidden
              bg-gradient-to-r from-violet-600 to-purple-600
              text-white font-bold text-sm
              px-5 py-2 rounded-none
              border-2 border-black
              shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
              hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all duration-200
            "
          >
            {/* Shimmer overlay */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-in-out" />
            <span className="relative flex items-center gap-1.5">
              Start Chat
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
