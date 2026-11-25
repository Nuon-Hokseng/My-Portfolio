"use client";
import { useSyncExternalStore } from "react";
type Theme = "light" | "dark";
function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}
function subscribe(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  const preference = matchMedia("(prefers-color-scheme: dark)");
  const systemChange = () => {
    try {
      if (localStorage.getItem("theme")) return;
    } catch {}
    applyTheme(preference.matches ? "dark" : "light");
  };
  const storageChange = (event: StorageEvent) => {
    if (event.key === "theme")
      applyTheme(
        event.newValue === "dark" || (!event.newValue && preference.matches)
          ? "dark"
          : "light",
      );
  };
  preference.addEventListener("change", systemChange);
  window.addEventListener("storage", storageChange);
  return () => {
    observer.disconnect();
    preference.removeEventListener("change", systemChange);
    window.removeEventListener("storage", storageChange);
  };
}
const serverSnapshot = () => "server" as const;
export function useTheme() {
  const snapshot = useSyncExternalStore(subscribe, readTheme, serverSnapshot);
  const theme: Theme = snapshot === "server" ? "light" : snapshot;
  return {
    theme,
    mounted: snapshot !== "server",
    toggleTheme: () => {
      const next = readTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* Theme still works when storage is unavailable. */
      }
    },
  };
}
