"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Project } from "@/lib/projects";

function Screenshots({ shots, phone }: { shots: NonNullable<Project["screenshots"]>; phone: boolean }) {
  const [index, setIndex] = useState(0);
  const shot = shots[index];

  // app captures are portrait: show one phone beside its caption, with the rest as small phones
  if (phone) {
    return (
      <div className="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-7">
        <div className="relative aspect-1280/2772 w-56 shrink-0 overflow-hidden border-4 border-ink bg-muted shadow-[6px_6px_0_var(--hard)] md:w-60">
          <Image src={shot.src} alt={shot.alt} fill sizes="240px" className="object-cover" />
        </div>
        <div className="w-full min-w-0 space-y-4">
          <p className="font-semibold leading-snug text-foreground">{shot.caption}</p>
          <ul className="grid grid-cols-6 gap-2 md:grid-cols-3">
            {shots.map((s, i) => (
              <li key={s.src}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Screenshot ${i + 1} of ${shots.length}`}
                  aria-current={i === index}
                  className={`relative block aspect-1280/2772 w-full overflow-hidden border-[3px] transition-opacity aria-current:border-krama ${
                    i === index ? "" : "border-ink opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={s.src} alt="" fill sizes="100px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-1919/907 w-full overflow-hidden border-[3px] border-ink bg-muted">
        <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover object-top-left" />
      </div>
      <p className="text-sm font-semibold leading-snug text-foreground">{shot.caption}</p>
      <ul className={`grid grid-cols-4 gap-2 ${shots.length > 1 ? "" : "hidden"}`}>
        {shots.map((s, i) => (
          <li key={s.src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Screenshot ${i + 1} of ${shots.length}`}
              aria-current={i === index}
              className={`relative block aspect-1919/907 w-full overflow-hidden border-[3px] transition-opacity aria-current:border-krama ${
                i === index ? "" : "border-ink opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={s.src} alt="" fill sizes="160px" className="object-cover object-top-left" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Details of one project, opened from its tile on the portfolio wall.
export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  // close on Escape, and keep the page behind from scrolling
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
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className={`relative max-h-[88vh] w-full overflow-y-auto ${project.screenshots ? "max-w-3xl" : "max-w-lg"} border-4 border-ink bg-card shadow-[8px_8px_0_var(--hard)]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex h-28 items-center justify-center border-b-4 border-ink bg-linear-to-br ${project.gradient}`}>
          <span className="text-5xl">{project.icon}</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 border-[3px] border-[#14193f] bg-[#eef0f7] p-1 text-[#14193f] shadow-[3px_3px_0_#14193f]"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="space-y-5 p-7">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-2xl font-extrabold text-foreground [font-variation-settings:'wdth'_86]">
              {project.title}
            </h3>
            {project.private && (
              <span className="border-[3px] border-ink bg-saffron px-2.5 py-1 text-xs font-bold text-[#14193f]">
                🔒 Private · NDA
              </span>
            )}
          </div>

          {project.role && <p className="text-sm font-semibold text-krama">{project.role}</p>}

          <p className="leading-relaxed text-muted-foreground">{project.details || project.description}</p>

          {project.screenshots && <Screenshots shots={project.screenshots} phone={project.screenshotShape === "phone"} />}

          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold uppercase tracking-wide text-foreground">Highlights</h4>
              <ul className="space-y-1.5">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-muted-foreground">
                    <span className="mt-0.5 text-krama">▹</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wide text-foreground">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="border-2 border-ink bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {(project.demo || project.code) && (
            <div className="flex flex-wrap gap-3 pt-1">
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="comic-btn comic-btn-red text-sm">
                  Live demo
                </a>
              )}
              {project.code && (
                <a href={project.code} target="_blank" rel="noopener noreferrer" className="comic-btn text-sm">
                  Code
                </a>
              )}
            </div>
          )}

          {project.private && (
            <p className="border-t-2 border-ink pt-4 text-xs text-muted-foreground">
              Source code is private under NDA. Happy to walk through the architecture and my contributions in an
              interview.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
