"use client";

import { useScrollAnimation } from "hooks/useScrollAnimation";
import { PhotoViewer, type Photo } from "@/components/PhotoViewer";

const photos: Photo[] = [
  {
    src: "/job1.jpg",
    alt: "A student standing in a robotics class with a game controller, a robot on the desk in front of a laptop",
    caption: "In class: students programming and driving their own robots",
    focus: "50% 55%",
  },
  {
    src: "/physical-class.jpeg",
    alt: "The tutor taking a selfie with a class of students and a birthday cake",
    caption: "With a class of students",
    focus: "50% 40%",
  },
  {
    src: "/job-home.jpg",
    alt: "The tutor with a home student and the student's family outdoors",
    caption: "Home lessons: with a student and their family",
    focus: "50% 45%",
  },
  {
    src: "/job-teacher-tutor.jpg",
    alt: "A laptop showing a video call where Scratch block code for a robot is being shared, next to a robot with an ultrasonic sensor",
    caption: "Online: training teachers from other schools with Scratch block code on a robot",
    focus: "50% 50%",
  },
];

// UOT AI and STEM's pages. Add { label: "Facebook", href: "https://..." } and it shows as a button on the card.
const employerLinks: { label: string; href: string }[] = [];

const audiences = [
  { title: "Students at school", text: "Classroom lessons where each student programs and drives a robot." },
  { title: "Students at home", text: "One-to-one and small-group lessons at the student's home." },
  { title: "Teachers from other schools", text: "Training teachers to pass robotics knowledge on to their own students." },
];

export default function ExperienceSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section id="experience" ref={ref} className="flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full space-y-16">
        <div
          className={`text-center space-y-4 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-balance">
            Work <span className="text-accent">Experience</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Teaching what I know, from kids&apos; first robots to other teachers&apos; classrooms
          </p>
        </div>

        <article
          className={`grid gap-8 rounded-xl border border-muted bg-card p-6 transition-all duration-700 hover:border-accent lg:grid-cols-[7fr_5fr] lg:gap-10 lg:p-8 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <PhotoViewer photos={photos} ratio="4 / 3" />

          <div className="flex flex-col gap-5">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">
                  Current role
                </span>
                <span className="text-sm font-semibold text-accent">May 2025 – Present</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground lg:text-3xl">Robotics Tutor</h3>
              <p className="mt-1 font-semibold text-muted-foreground">UOT AI and STEM · startup</p>
              <p className="mt-1 font-semibold text-accent">Scratch block coding with WhalesBot robots and drones</p>
            </div>

            <p className="leading-relaxed text-foreground">
              At UOT AI and STEM, a startup teaching AI and STEM, I teach students to program robots with
              Scratch block coding on WhalesBot kits such as Rocky and the Eagle drone, from the first
              block to robots that read sensors and respond. I teach in classrooms, at students&apos;
              homes and online, adapting each lesson to the learner in front of me.
            </p>

            <ul className="space-y-3">
              {audiences.map((a) => (
                <li key={a.title} className="rounded-lg border border-muted bg-background/40 px-4 py-3">
                  <p className="font-semibold text-foreground">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.text}</p>
                </li>
              ))}
            </ul>

            <div className="rounded-lg border-2 border-accent/40 bg-accent/10 px-4 py-3">
              <p className="text-sm font-bold uppercase tracking-wide text-accent">Proud moment</p>
              <p className="mt-1 text-foreground">
                I taught teachers from other schools how to share robotics knowledge with their own
                students, so what I teach reaches classrooms I never step into.
              </p>
            </div>

            <ul className="flex flex-wrap gap-2">
              {["Scratch", "WhalesBot", "Rocky", "Eagle drone", "Robotics", "Teaching", "Teacher training"].map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
                >
                  {tag}
                </li>
              ))}
            </ul>

            {employerLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {employerLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-muted-foreground/40 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
