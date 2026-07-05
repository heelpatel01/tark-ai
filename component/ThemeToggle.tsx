"use client";
import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tarkai-theme");
      const initial = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setTheme(initial as "light" | "dark");
      if (initial === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (_) {}
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("tarkai-theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (_) {}
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      type="button"
      className="
        relative flex-shrink-0 w-[72px] h-10 p-1 rounded-full
        border border-black/10 dark:border-white/10
        bg-white/60 dark:bg-white/5 backdrop-blur-md shadow-sm
        transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DF6]/40
        overflow-hidden cursor-pointer
      "
    >
      {/* Sliding thumb */}
      <span
        className={`
          absolute w-8 h-8 rounded-full bg-white dark:bg-[#1D2430]
          border border-black/5 dark:border-white/10 shadow-sm
          transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          top-[3px] left-[3px]
          ${theme === "dark" ? "translate-x-[32px]" : "translate-x-0"}
        `}
      />

      {/* Sun slot */}
      <span className="absolute left-[3px] top-[3px] w-8 h-8 flex items-center justify-center z-10 pointer-events-none">
        <FiSun
          size={13}
          strokeWidth={3}
          className={`transition-all duration-300 ${
            theme === "light"
              ? "text-amber-500 opacity-100 scale-100"
              : "text-[#94A3B8] opacity-40 scale-90"
          }`}
        />
      </span>

      {/* Moon slot */}
      <span className="absolute right-[3px] top-[3px] w-8 h-8 flex items-center justify-center z-10 pointer-events-none">
        <FiMoon
          size={13}
          strokeWidth={3}
          className={`transition-all duration-300 ${
            theme === "dark"
              ? "text-[#818CF8] opacity-100 scale-100"
              : "text-[#94A3B8] opacity-40 scale-90"
          }`}
        />
      </span>
    </button>
  );
};

export default ThemeToggle;
