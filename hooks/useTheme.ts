"use client";
import { useEffect, useState } from "react";

export function useTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Read initial theme
    const read = () => {
      try {
        const stored = localStorage.getItem("tarkai-theme");
        if (stored === "dark" || stored === "light") return stored;
        return document.documentElement.classList.contains("dark") ? "dark" : "light";
      } catch {
        return "light";
      }
    };

    setTheme(read());

    // Watch DOM class mutations on <html>
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}
