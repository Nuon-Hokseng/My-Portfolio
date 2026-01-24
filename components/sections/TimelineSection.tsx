'use client';

import { useScrollAnimation } from 'hooks/useScrollAnimation';

const timelineEvents = [
  {
    year: '2010',
    title: 'Primary School',
    school: 'ABC Primary School',
    description: 'Began my educational journey with a passion for learning and discovery.',
  },
  {
    year: '2013',
    title: 'Secondary School',
    school: 'XYZ Secondary School',
    description: 'Developed strong fundamentals and began exploring technology.',
  },
  {
    year: '2016',
    title: 'High School',
    school: 'Tech High School',
    description: 'Started coding and participating in programming competitions.',
  },
  {
    year: '2020',
    title: 'University - Bachelor of Science',
    school: 'State University',
    description: 'Graduated with honors in Computer Science. Focused on web development and software engineering.',
  },
];

export default function TimelineSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full space-y-16">
        <div className={`text-center space-y-4 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-5xl lg:text-6xl font-bold text-balance">
            My <span className="text-accent">Educational</span> Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From primary school to university, a timeline of growth and learning
          </p>
        </div>

        <div className="relative space-y-12">
          {/* Vertical line */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-accent via-accent to-transparent" />

          {timelineEvents.map((event, index) => (
            <div
              key={event.year}
              className={`relative transform transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : index % 2 === 0 ? 'opacity-0 -translate-x-8' : 'opacity-0 translate-x-8'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
              }}
            >
              <div className={`flex gap-8 lg:gap-0 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                {/* Timeline dot */}
                <div className="flex justify-center lg:w-1/2">
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center border-4 border-background shadow-lg shadow-accent/50 group hover:scale-110 transition-transform duration-300">
                      <span className="text-xl font-bold text-accent-foreground">{event.year.slice(-2)}</span>
                    </div>
                  </div>
                </div>

                {/* Content card */}
                <div className="pb-8 lg:w-1/2 lg:pr-12">
                  <div className="group bg-card border border-muted hover:border-accent rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:bg-card/80 ml-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-300">📚</span>
                      <h3 className="text-2xl font-bold text-accent">{event.title}</h3>
                    </div>
                    <p className="text-muted-foreground font-semibold mb-2">{event.school}</p>
                    <p className="text-foreground leading-relaxed">{event.description}</p>
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
