"use client";

import Image from "next/image";
import { useScrollAnimation } from "hooks/useScrollAnimation";

const timelineEvents = [
  {
    year: "2011",
    title: "Primary School",
    school: "Kouk BanhChoin Primary School",
    description: "Laid the foundation for lifelong learning and curiosity.",
    image: "/primary.jpg",
    alt: "Nuon Hokseng in primary school uniform",
    // CSS object-position: keeps the face in frame when the photo is cropped to 16:9
    focus: "50% 35%",
  },
  {
    year: "2018",
    title: "Secondary School",
    school: "Kouk BanhChoin Secondary School",
    description:
      "Discovered a love for problem-solving and built the discipline that carried into my studies.",
    image: "/secondaryschool.jpg",
    alt: "Nuon Hokseng speaking into a microphone at a school open day",
    focus: "50% 30%",
  },
  {
    year: "2021",
    title: "High School",
    school: "Hun Sen Chumpuvorn High School",
    description:
      "Focused on math and science, and wrote my first lines of code — the spark that set my direction.",
    image: "/highschool.jpg",
    alt: "A group of high school classmates and a teacher outside their classroom",
    focus: "50% 40%",
  },
  {
    year: "2024",
    title: "Bachelor of Software Engineering",
    school: "Kirirom Institute of Technology",
    description:
      "Studying software engineering with a focus on full-stack web development, databases, and building real-world projects.",
    image: "/university.jpg",
    alt: "Students and staff of Kirirom Institute of Technology posing together on a stage",
    focus: "50% 85%",
  },
];

export default function TimelineSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="journey"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20"
    >
      <div className="max-w-4xl w-full space-y-16">
        <div
          className={`text-center space-y-4 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-balance">
            My <span className="text-accent">Educational</span> Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From primary school to university, a timeline of growth and learning
          </p>
        </div>

        <div className="relative space-y-12">
          {/* Vertical line */}
          {/* sits under the year dots: 22px = half the 48px mobile dot minus half the line */}
          <div className="absolute left-[22px] lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-accent via-accent to-transparent" />

          {timelineEvents.map((event, index) => (
            <div
              key={event.year}
              className={`relative transform transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : index % 2 === 0
                    ? "opacity-0 -translate-x-8"
                    : "opacity-0 translate-x-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              <div
                className={`relative flex gap-4 lg:gap-0 ${index % 2 === 0 ? "lg:justify-start" : "lg:justify-end"}`}
              >
                {/* Timeline dot: pinned to the centre line on large screens */}
                <div className="shrink-0 lg:absolute lg:left-1/2 lg:top-0 lg:-translate-x-1/2">
                  <div className="relative z-10">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-accent rounded-full flex items-center justify-center border-4 border-background shadow-lg shadow-accent/50 group hover:scale-110 transition-transform duration-300">
                      <span className="text-sm lg:text-xl font-bold text-accent-foreground">
                        {event.year}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content card */}
                {/* Content card: alternates left/right of the line on large screens */}
                <div className={`pb-8 flex-1 lg:w-1/2 lg:flex-none ${index % 2 === 0 ? "lg:pr-14" : "lg:pl-14"}`}>
                  <div className="group bg-card border border-muted hover:border-accent rounded-xl p-6 lg:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:bg-card/80">
                    <div className="relative mb-5 aspect-video overflow-hidden rounded-lg border border-muted">
                      <Image
                        src={event.image}
                        alt={event.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 400px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ objectPosition: event.focus }}
                      />
                    </div>
                    <h3 className="mb-3 text-xl lg:text-2xl font-bold text-accent">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground font-semibold mb-2">
                      {event.school}
                    </p>
                    <p className="text-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
