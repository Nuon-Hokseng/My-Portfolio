"use client";

import { useScrollAnimation } from "hooks/useScrollAnimation";
import Image from "next/image";

const projects: any[] = [
  // {
  //   title: 'E-Commerce Platform',
  //   description: 'A full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
  //   tags: ['Next.js', 'TypeScript', 'MongoDB', 'Stripe'],
  //   icon: '🛒',
  //   image: '',
  //   link: '#',
  // },
];

export default function ProjectsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
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
            Showcasing my best work and technical achievements
          </p>
        </div>

        {projects.length === 0 ? (
          <div
            className={`text-center py-16 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p className="text-xl text-muted-foreground">Coming soon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={`group relative overflow-hidden rounded-xl border border-muted hover:border-accent bg-card hover:bg-card/80 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-accent/20 hover:translate-y-1 cursor-pointer flex flex-col ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 60}ms` : "0ms",
                }}
              >
                {/* Project image */}
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content section */}
                <div className="relative z-10 space-y-4 p-8 flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="text-5xl group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300">
                      {project.icon}
                    </div>
                    <a
                      href={project.link}
                      className="text-muted-foreground hover:text-accent transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 duration-300"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {/* {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm bg-muted/50 text-muted-foreground rounded-full group-hover:bg-accent/20 group-hover:text-accent transition-colors"
                      >
                        {tag}
                      </span>
                    ))} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
