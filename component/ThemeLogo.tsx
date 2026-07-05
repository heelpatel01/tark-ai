"use client";
import React from "react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeLogoProps {
  className?: string;
  alt?: string;
}

export const ThemeLogo: React.FC<ThemeLogoProps> = ({
  className = "",
  alt = "Tark AI",
}) => {
  const theme = useTheme();

  return (
    <img
      src={theme === "dark" ? "/tark-ai-darktheme-logo.png" : "/tarkai-logo-navbar.png"}
      alt={alt}
      className={className}
    />
  );
};

export default ThemeLogo;
