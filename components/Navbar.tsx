"use client";

import { useEffect, useState } from "react";

const links = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "projects", label: "Projects" },
  { id: "play", label: "Quiz" },
  { id: "game", label: "Arcade" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [active, setActive] = useState("hero");
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // scroll progress bar
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setProgress(scrolled * 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // active section highlight
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* scroll progress */}
      <div
        className="h-0.5 bg-accent origin-left transition-transform duration-150"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
      <nav className="mx-auto max-w-6xl px-6">
        <div className="mt-3 flex items-center justify-between rounded-full border border-muted/60 bg-card/70 px-5 py-2.5 backdrop-blur-md shadow-sm">
          <a href="#hero" className="font-bold tracking-tight text-foreground">
            NH<span className="text-accent">.</span>
          </a>

          <ul className="hidden md:flex items-center gap-1">
            {links.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    active === id
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground hover:text-accent"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="/Nuon_HokSeng_CV.pdf"
            download
            className="hidden md:inline-block px-4 py-1.5 rounded-full border border-accent text-accent text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Resume
          </a>

          {/* mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-foreground p-1"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
            </svg>
          </button>
        </div>

        {/* mobile menu */}
        {open && (
          <ul className="md:hidden mt-2 flex flex-col rounded-2xl border border-muted/60 bg-card/90 p-2 backdrop-blur-md">
            {links.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active === id ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-accent"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/Nuon_HokSeng_CV.pdf"
                download
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-xl text-sm font-semibold text-accent"
              >
                Download Resume
              </a>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
