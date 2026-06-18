"use client";

import { useEffect, useState } from "react";

// ↑ ↑ ↓ ↓ ← → ← → B A
const SEQ = [
  "arrowup", "arrowup", "arrowdown", "arrowdown",
  "arrowleft", "arrowright", "arrowleft", "arrowright",
  "b", "a",
];
const EMOJIS = ["🎮", "🚀", "⭐", "💜", "🕹️", "✨", "🏆", "👾"];

export function KonamiEasterEgg() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === SEQ[idx]) {
        idx++;
        if (idx === SEQ.length) {
          idx = 0;
          setActive(true);
          setTimeout(() => setActive(false), 5000);
        }
      } else {
        idx = key === SEQ[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 200 }}>
      {Array.from({ length: 44 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const dur = 2.5 + Math.random() * 2;
        const size = 20 + Math.random() * 28;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "-48px",
              fontSize: size,
              animation: `konamiFall ${dur}s linear ${delay}s forwards`,
            }}
          >
            {EMOJIS[i % EMOJIS.length]}
          </span>
        );
      })}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-bold shadow-xl animate-fade-in">
        🎮 Cheat code unlocked — you found the secret!
      </div>
    </div>
  );
}
