"use client";

import { useScrollAnimation } from "hooks/useScrollAnimation";
import { useEffect, useState } from "react";

type Project = {
  title: string;
  description: string;
  // longer write-up shown in the details modal
  details?: string;
  role?: string;
  highlights?: string[];
  tags: string[];
  icon: string;
  gradient: string;
  private?: boolean;
  demo?: string;
  code?: string;
};

const projects: Project[] = [
  {
    title: "Tech Store — Microservices",
    description:
      "Full-stack laptop e-commerce platform built on a microservices architecture with a Next.js storefront.",
    details:
      "A laptop e-commerce platform split into independent backend services communicating over REST. Includes product catalog, cart, and checkout flows, with a separate Next.js storefront for the customer experience.",
    role: "Full-stack developer",
    highlights: [
      "Decomposed the backend into independent microservices",
      "Built the storefront with Next.js and a REST API layer",
      "Handled product catalog, cart, and checkout flows",
    ],
    tags: ["Microservices", "Node.js", "REST API", "Next.js"],
    icon: "💻",
    gradient: "from-blue-500/30 to-cyan-500/10",
    demo: "https://kalipto-tech-store.vercel.app",
    code: "https://github.com/Nuon-Hokseng/Laptop-Store-Microservices",
  },
  {
    title: "Santai Coffee",
    description:
      "A modern, responsive coffee-shop website with menu browsing and a clean, brand-driven UI.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    icon: "☕",
    gradient: "from-amber-500/30 to-orange-500/10",
    demo: "https://santaicoffee.vercel.app",
    code: "https://github.com/Nuon-Hokseng/coffee",
  },
  {
    title: "Weather App",
    description:
      "Real-time weather application that fetches and displays current conditions for any city.",
    tags: ["TypeScript", "API Integration", "React"],
    icon: "🌤️",
    gradient: "from-sky-500/30 to-indigo-500/10",
    demo: "https://weather-app-black-xi-44.vercel.app",
    code: "https://github.com/Nuon-Hokseng/weather-app",
  },
  {
    title: "Wedding Invitation Site",
    description:
      "An elegant digital wedding invitation built for a friend, with event details and a celebratory design.",
    tags: ["Next.js", "TypeScript", "Responsive"],
    icon: "💍",
    gradient: "from-pink-500/30 to-rose-500/10",
    demo: "https://phorn-mey.vercel.app",
    code: "https://github.com/Nuon-Hokseng/Wedding",
  },

  // ── Private / NDA projects ──────────────────────────────────────────────
  // Source stays private; "View Details" opens a modal with the write-up.
  {
    title: "Optical Retail POS & Inventory",
    description:
      "A point-of-sale and stock-management system for an optical retail business — sales, inventory, and analytics in one dashboard.",
    details:
      "A production point-of-sale and inventory platform built for an optical retail store. Staff can process sales, track eyewear stock levels, and monitor business performance through interactive dashboards. Authentication and data are powered by Supabase with server-side rendering.",
    role: "Full-stack developer",
    highlights: [
      "Built the POS checkout flow and real-time inventory tracking",
      "Supabase auth + PostgreSQL with Next.js server-side rendering",
      "Sales and stock analytics dashboards using Recharts",
    ],
    tags: ["Next.js 16", "React 19", "Supabase", "PostgreSQL", "Recharts", "TypeScript"],
    icon: "👓",
    gradient: "from-violet-500/30 to-purple-500/10",
    private: true,
  },
  {
    title: "Compara — Comparison Platform",
    description:
      "A full-stack platform for browsing and comparing products, with multi-language support, authentication, and a rich component-driven UI.",
    details:
      "A full-stack web platform (team project) for browsing and comparing products. The Next.js frontend features a polished Radix UI component system, internationalization, and data visualization, backed by an Express API with MongoDB and PostgreSQL, scheduled jobs, and Clerk authentication.",
    role: "Full-stack developer · team project",
    highlights: [
      "Next.js frontend with Radix UI, i18n (next-intl), and charts",
      "Express + MongoDB / PostgreSQL REST API with Clerk auth & JWT",
      "Hardened with rate limiting, Helmet, and scheduled cron jobs",
    ],
    tags: ["Next.js", "Clerk", "Express", "MongoDB", "PostgreSQL", "next-intl"],
    icon: "⚖️",
    gradient: "from-emerald-500/30 to-teal-500/10",
    private: true,
  },
  {
    title: "AI Lead-Gen Automation (RPA)",
    description:
      "An AI-powered automation tool that researches and identifies the right target audience on Instagram using LLMs and browser automation.",
    details:
      "A robotic process automation (RPA) tool that combines browser automation with a local LLM to research Instagram audiences and surface the most relevant target customers for a given market. A FastAPI backend hosts the automation as a service, with results persisted to Supabase.",
    role: "Developer",
    highlights: [
      "Browser automation with Playwright to gather public profile signals",
      "LLM-driven audience targeting via LangChain + Ollama (llama3)",
      "FastAPI service layer with Supabase storage",
    ],
    tags: ["Python", "Playwright", "LangChain", "Ollama", "FastAPI", "Supabase"],
    icon: "🤖",
    gradient: "from-fuchsia-500/30 to-pink-500/10",
    private: true,
  },
  {
    title: "KIT Meal Tracker",
    description:
      "A meal-management app that tracks daily meals and syncs data through the Google Sheets API.",
    details:
      "A meal-tracking application that records and manages daily meals, using Google Sheets as a lightweight backend through the Google APIs. Built with Next.js and SWR for fast, reactive data fetching and caching.",
    role: "Developer",
    highlights: [
      "Google Sheets API integration as a zero-cost data store",
      "Reactive data fetching and caching with SWR",
      "Clean, responsive Next.js + Tailwind UI",
    ],
    tags: ["Next.js", "Google Sheets API", "SWR", "TypeScript"],
    icon: "🍽️",
    gradient: "from-amber-500/30 to-yellow-500/10",
    private: true,
  },
];

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3M13 6l-2 12" />
    </svg>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-muted bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-28 bg-linear-to-br ${project.gradient} flex items-center justify-center`}>
          <span className="text-5xl">{project.icon}</span>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="p-7 space-y-5">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
            {project.private && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full border border-accent/40 bg-accent/10 text-accent">
                🔒 Private · NDA
              </span>
            )}
          </div>

          {project.role && (
            <p className="text-sm font-medium text-accent">{project.role}</p>
          )}

          <p className="text-muted-foreground leading-relaxed">
            {project.details || project.description}
          </p>

          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Highlights
              </h4>
              <ul className="space-y-1.5">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-muted-foreground">
                    <span className="text-accent mt-0.5">▹</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {project.private && (
            <p className="text-xs text-muted-foreground border-t border-muted pt-4">
              Source code is private under NDA. Happy to walk through the
              architecture and my contributions in an interview.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20"
    >
      <div className="max-w-6xl w-full space-y-16">
        <div
          className={`text-center space-y-4 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-balance">
            Featured <span className="text-accent">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real applications I've designed, built, and shipped — including
            private work I can walk you through
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`group relative overflow-hidden rounded-xl border border-muted hover:border-accent bg-card hover:bg-card/80 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10 flex flex-col ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${index * 80}ms` : "0ms" }}
            >
              {/* Gradient banner with icon */}
              <div className={`relative h-32 w-full bg-linear-to-br ${project.gradient} flex items-center justify-center`}>
                <span className="text-6xl group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                  {project.icon}
                </span>
                {project.private && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-black/40 text-white backdrop-blur-sm">
                    🔒 Private
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10 p-7 flex-1 flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-full group-hover:bg-accent/15 group-hover:text-accent transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {project.code && (
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-muted-foreground/40 text-foreground text-sm font-semibold hover:border-accent hover:text-accent transition-colors"
                    >
                      Code <CodeIcon />
                    </a>
                  )}
                  {(project.private || project.details) && (
                    <button
                      onClick={() => setSelected(project)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        project.private
                          ? "bg-accent text-accent-foreground hover:opacity-90"
                          : "border border-muted-foreground/40 text-foreground hover:border-accent hover:text-accent"
                      }`}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`text-center transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "300ms" }}
        >
          <a
            href="https://github.com/Nuon-Hokseng?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent font-semibold transition-colors"
          >
            View all public projects on GitHub <ArrowIcon />
          </a>
        </div>
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
