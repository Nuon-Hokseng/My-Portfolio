'use client';

import { useScrollAnimation } from 'hooks/useScrollAnimation';

const skills = [
  { name: 'JavaScript', icon: '⚡' },
  { name: 'TypeScript', icon: '🔷' },
  { name: 'HTML/CSS', icon: '🎨' },
  { name: 'PostgreSQL', icon: '🗄️' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'Next.js', icon: '▲' },
  { name: 'Supabase', icon: '🟢' },
  { name: 'PlasmoDB', icon: '⚙️' },
  { name: 'Linux', icon: '🐧' },
];

export default function SkillsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 bg-linear-to-b from-background to-card/20"
    >
      <div className="max-w-6xl w-full">
        <div className={`space-y-16 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center space-y-4">
            <h2 className="text-5xl lg:text-6xl font-bold text-balance">
              Skills & <span className="text-accent">Technologies</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools and technologies I've mastered throughout my development journey
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className={`group p-6 bg-card border border-muted rounded-xl hover:border-accent hover:bg-card/80 transition-all duration-500 transform hover:scale-110 hover:shadow-lg hover:shadow-accent/20 cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 50}ms` : '0ms',
                }}
              >
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  {skill.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                  {skill.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Decorative line */}
          <div className="h-1 bg-linear-to-r from-transparent via-accent to-transparent opacity-30" />
        </div>
      </div>
    </section>
  );
}
