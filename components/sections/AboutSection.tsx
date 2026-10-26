"use client";

import { useScrollAnimation } from "hooks/useScrollAnimation";

const stats = [
  { value: "1+", label: "Years coding", small: false },
  { value: "15+", label: "Projects built", small: false },
  { value: "Full-Stack", label: "Focus", small: true },
  { value: "Open", label: "To work", small: true },
];

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 px-6 flex items-center justify-center"
    >
      <div
        className={`max-w-4xl w-full space-y-10 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="text-center space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-balance">
            A bit <span className="text-accent">about me</span>
          </h2>
        </div>

        <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
          I'm Nuon Hokseng, a software engineering student at Kirirom Institute
          of Technology in Cambodia who learns by{" "}
          <span className="text-foreground font-medium">building real things</span>,{" "}
          from point-of-sale systems and full-stack platforms to AI automation
          tools. I care about clean, scalable code and shipping products people
          actually use. Right now I'm looking for a team where I can grow fast
          and contribute from day one.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center min-h-28 rounded-2xl border border-muted bg-card/60 p-6 text-center hover:border-accent transition-colors"
              style={{ transitionDelay: isVisible ? `${i * 60}ms` : "0ms" }}
            >
              <div
                className={`font-bold text-accent leading-tight whitespace-nowrap ${
                  s.small ? "text-xl lg:text-2xl" : "text-3xl lg:text-4xl"
                }`}
              >
                {s.value}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
