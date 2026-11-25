"use client";

import { useTheme } from "hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
    >
      {theme === "dark" ? (
        <Sun size={20} aria-hidden="true" />
      ) : (
        <Moon size={20} aria-hidden="true" />
      )}
    </button>
  );
}
