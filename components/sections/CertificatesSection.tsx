"use client";

import { useScrollAnimation } from "hooks/useScrollAnimation";

const certificates: any[] = [
  // {
  //   title: 'AWS Certified Solutions Architect',
  //   issuer: 'Amazon Web Services',
  //   date: '2023',
  //   badge: '☁️',
  // }
];

export default function CertificatesSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="certificates"
      ref={ref}
      className="h-150 flex items-center justify-center px-6 py-20 bg-linear-to-b from-background to-card/20"
    >
      <div className="max-w-6xl w-full space-y-16">
        <div
          className={`text-center space-y-4 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-balance">
            Certifications & <span className="text-accent">Achievements</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional certifications validating my expertise
          </p>
        </div>

        {certificates.length === 0 ? (
          <div
            className={`max-w-2xl mx-auto text-center transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="rounded-2xl border border-muted bg-card/60 p-10 space-y-5">
              <div className="text-5xl">🚀</div>
              <p className="text-xl font-semibold text-foreground">
                I learn by building.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                No framed certificates yet — every project above is hands-on
                proof of what I can ship. Right now I'm deepening my skills in
                cloud deployment, system design, and scalable backends, with
                certifications on the way.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {["Cloud & Deployment", "System Design", "Scalable Backends"].map(
                  (item) => (
                    <span
                      key={item}
                      className="px-4 py-1.5 text-sm font-medium rounded-full border border-accent/30 bg-accent/10 text-accent"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <div
                key={cert.title}
                className={`group relative overflow-hidden rounded-xl border border-muted hover:border-accent bg-card hover:bg-card/80 p-8 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-accent/20 cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
                }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-linear-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 space-y-4">
                  <div className="text-5xl group-hover:scale-125 transition-transform duration-300">
                    {cert.badge}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors mb-2">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-muted/50 flex items-center justify-between">
                    <span className="text-sm font-semibold text-accent">
                      {cert.date}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-accent group-hover:text-accent-foreground transition-colors"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
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
