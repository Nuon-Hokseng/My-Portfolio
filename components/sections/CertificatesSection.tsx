"use client";

import { useScrollAnimation } from "hooks/useScrollAnimation";
import { PhotoViewer, type Photo } from "@/components/PhotoViewer";

type Achievement = {
  title: string;
  place: string;
  where: string;
  when: string;
  description: string;
  facts: string[];
  photos: Photo[];
};

const achievements: Achievement[] = [
  {
    title: "Debate Competition Champion",
    place: "1st place",
    where: "American Bridge International School",
    when: "2019 – 2020",
    description:
      "Took first place at the school's debate championship, competing across its 20 branches. The final round was held on stage at the 2nd Annual Debate Championships, where our team went home with the medals, the trophy and the certificates.",
    facts: ["20 branches competed", "Final round on stage", "Team of debaters"],
    photos: [
      {
        src: "/debate1.jpg",
        alt: "The winning team holding medals, a trophy and a framed certificate with their coaches",
        caption: "First-place medals, trophy and certificate",
        focus: "50% 40%",
      },
      {
        src: "/debate3.jpg",
        alt: "Debaters holding framed certificates on stage in front of the championship banner",
        caption: "On stage at the final round with our certificates",
        focus: "50% 55%",
      },
      {
        src: "/debate2.jpg",
        alt: "Three debaters on the government side seated behind name cards during a round",
        caption: "On the government side during a round",
        focus: "50% 70%",
      },
    ],
  },
];

export default function CertificatesSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="certificates"
      ref={ref}
      className="flex items-center justify-center px-6 py-20 bg-linear-to-b from-background to-card/20"
    >
      <div className="max-w-6xl w-full space-y-16">
        <div
          className={`text-center space-y-4 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-balance">
            Certifications & <span className="text-accent">Achievements</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognition earned along the way
          </p>
        </div>

        <div className="space-y-8">
          {achievements.map((a, index) => (
            <article
              key={a.title}
              className={`grid gap-8 rounded-xl border border-muted bg-card p-6 transition-all duration-700 hover:border-accent lg:grid-cols-[7fr_5fr] lg:gap-10 lg:p-8 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
            >
              <PhotoViewer photos={a.photos} />

              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">
                    {a.place}
                  </span>
                  <span className="text-sm font-semibold text-accent">{a.when}</span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground lg:text-3xl">{a.title}</h3>
                  <p className="mt-1 font-semibold text-muted-foreground">{a.where}</p>
                </div>

                <p className="leading-relaxed text-foreground">{a.description}</p>

                <ul className="flex flex-wrap gap-2">
                  {a.facts.map((fact) => (
                    <li
                      key={fact}
                      className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
                    >
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
