'use client';

import { useTheme } from 'hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-card border border-muted hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 group"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun
          size={20}
          className="text-yellow-400 group-hover:rotate-90 transition-transform duration-300"
        />
      ) : (
        <Moon
          size={20}
          className="text-blue-400 group-hover:rotate-90 transition-transform duration-300"
        />
      )}
    </button>
  );
}
