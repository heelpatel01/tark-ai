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
      className="relative flex items-center justify-between p-1 w-14 h-8 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full transition-all duration-300 focus:outline-none overflow-hidden"
      aria-label="Toggle Theme"
      type="button"
    >
      {/* Sliding Thumb background */}
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-[#161B22] border border-black/5 dark:border-white/10 shadow-sm transition-transform duration-300 ease-in-out ${
          theme === "dark" ? "translate-x-6" : ""
        }`}
      />

      {/* Sun Icon */}
      <span className="flex items-center justify-center w-6 h-6 z-10 text-[#4B5563] dark:text-[#9CA3AF] transition-colors duration-300">
        <FiSun size={13} className={`transition-opacity duration-300 ${theme === "light" ? "opacity-100" : "opacity-40"}`} />
      </span>

      {/* Moon Icon */}
      <span className="flex items-center justify-center w-6 h-6 z-10 text-[#4B5563] dark:text-[#9CA3AF] transition-colors duration-300">
        <FiMoon size={13} className={`transition-opacity duration-300 ${theme === "dark" ? "opacity-100" : "opacity-40"}`} />
      </span>
    </button>
  );
};
export default ThemeToggle;
