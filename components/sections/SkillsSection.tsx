"use client";

import { useScrollAnimation } from "hooks/useScrollAnimation";

type Skill = { name: string; src: string; size: string; border: string };

const groups: { title: string; skills: Skill[] }[] = [
  {
    title: "Languages & Frontend",
    skills: [
      { name: "JavaScript", src: "/skills/js.png", size: "w-16 h-16", border: "" },
      { name: "TypeScript", src: "/skills/ts.png", size: "w-16 h-16", border: "" },
      { name: "HTML / CSS", src: "/skills/trio.png", size: "w-16 h-16", border: "" },
      { name: "Next.js", src: "/skills/nexts.png", size: "w-16 h-16", border: "border border-white rounded-full p-1 bg-white" },
    ],
  },
  {
    title: "Backend & Databases",
    skills: [
      { name: "NestJS", src: "/skills/nestjs.svg", size: "w-16 h-16", border: "" },
      { name: "Node.js", src: "/skills/nodejs.svg", size: "w-16 h-16", border: "" },
      { name: "PostgreSQL", src: "/skills/postgre.png", size: "w-24 h-16", border: "" },
      { name: "MongoDB", src: "/skills/mongodb.png", size: "w-16 h-16", border: "" },
      { name: "Supabase", src: "/skills/supabase.png", size: "w-16 h-16", border: "" },
    ],
  },
  {
    title: "Tools & Platform",
    skills: [
      { name: "Docker", src: "/skills/docker.svg", size: "w-16 h-16", border: "" },
      { name: "AWS EC2", src: "/skills/aws-ec2.svg", size: "w-16 h-16", border: "" },
      { name: "AWS S3", src: "/skills/aws-s3.svg", size: "w-16 h-16", border: "" },
      { name: "Vercel", src: "/skills/vercel.svg", size: "w-16 h-16", border: "border border-white rounded-full p-3 bg-white" },
      { name: "GitHub", src: "/skills/github.svg", size: "w-16 h-16", border: "border border-white rounded-full p-2 bg-white" },
      { name: "Linux", src: "/skills/linux.png", size: "w-16 h-16", border: "border border-white rounded-full p-1 bg-white" },
      { name: "Plasmo", src: "/skills/plasmo.png", size: "w-16 h-16", border: "border border-white rounded-full p-1 bg-white" },
    ],
  },
];

export default function SkillsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      id="skills"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 bg-linear-to-b from-background to-card/20"
    >
      <div className="max-w-6xl w-full">
        <div
          className={`space-y-14 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center space-y-4">
            <h2 className="text-5xl lg:text-6xl font-bold text-balance">
              Skills & <span className="text-accent">Technologies</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The stack I reach for to design, build, and ship products
            </p>
          </div>

          <div className="space-y-12">
            {groups.map((group, gi) => (
              <div key={group.title} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-accent whitespace-nowrap">
                    {group.title}
                  </h3>
                  <div className="h-px flex-1 bg-linear-to-r from-accent/40 to-transparent" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {group.skills.map((skill, index) => (
                    <div
                      key={skill.name}
                      className={`group flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-4 p-4 sm:p-5 bg-card border border-muted rounded-xl hover:border-accent hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10 cursor-default ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: isVisible ? `${gi * 100 + index * 50}ms` : "0ms" }}
                    >
                      <img
                        src={skill.src}
                        alt={skill.name}
                        className={`${skill.size} ${skill.border} shrink-0 object-contain group-hover:scale-110 transition-transform duration-300`}
                      />
                      <h4 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                        {skill.name}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
