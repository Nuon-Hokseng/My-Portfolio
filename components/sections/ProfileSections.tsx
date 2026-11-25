import Image from "next/image";
import { ArrowDown, ArrowUpRight, Code2, Database, Cloud } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { PhotoViewer } from "@/components/PhotoViewer";
import { cvUrl, email, socials } from "@/lib/site";

export function AboutSection() {
  return (
    <section id="about" className="section tint">
      <div className="wrap">
        <SectionHeading number="01" label="About" title="A builder at heart.">
          Software engineering student at Kirirom Institute of Technology. I
          build full-stack products, connect APIs, and care about the details
          that make software useful.
        </SectionHeading>
        <dl className="stats" data-reveal>
          {[
            ["2.5", "years", "Development experience"],
            ["15", "+", "Projects built"],
            ["Full-stack", "", "Frontend to deployment"],
            ["Cambodia", "", "Open to opportunities"],
          ].map(([value, unit, caption]) => (
            <div key={caption}>
              <dt>
                <strong className={unit ? "" : "word-stat"}>
                  {value}
                  {unit && <span>{unit}</span>}
                </strong>
              </dt>
              <dd>{caption}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
export function SkillsSection() {
  const groups = [
    {
      title: "Frontend",
      icon: Code2,
      text: "Responsive, component-driven interfaces.",
      tags: ["JavaScript", "TypeScript", "HTML / CSS", "React", "Next.js"],
    },
    {
      title: "Backend & data",
      icon: Database,
      text: "APIs, authentication, and databases.",
      tags: ["NestJS", "Node.js", "PostgreSQL", "MongoDB", "Supabase"],
    },
    {
      title: "Tools & deployment",
      icon: Cloud,
      text: "From a local build to a hosted product.",
      tags: ["Docker", "AWS EC2 / S3", "Vercel", "GitHub", "Linux", "Plasmo"],
    },
  ];
  return (
    <section id="skills" className="section wrap">
      <SectionHeading
        number="02"
        label="Expertise"
        title="The tools behind the work."
      />
      <div className="skill-grid">
        {groups.map(({ title, icon: Icon, text, tags }, i) => (
          <article key={title} className="skill-card" data-reveal>
            <div className="card-top">
              <Icon size={26} className="line-icon" aria-hidden="true" />
              <span className="micro">0{i + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            <ul className="tags">
              {tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
export function ExperienceSection() {
  return (
    <section id="experience" className="section tint">
      <div className="wrap">
        <SectionHeading
          number="03"
          label="Experience"
          title="Technical skills. Human skills."
        />
        <article className="experience-card" data-reveal>
          <div className="experience-photos">
            <PhotoViewer
              ratio="4 / 3"
              photos={[
                {
                  src: "/job1.jpg",
                  alt: "A student programming and driving a robot in class",
                  caption: "Hands-on robotics lessons",
                  focus: "50% 55%",
                },
                {
                  src: "/physical-class.jpeg",
                  alt: "The tutor and students in class",
                  caption: "Learning together in class",
                },
                {
                  src: "/job-home.jpg",
                  alt: "The tutor with a student and family outdoors",
                  caption: "Home lessons with a student and family",
                },
                {
                  src: "/job-teacher-tutor.jpg",
                  alt: "Online Scratch and robotics teacher training",
                  caption: "Training teachers online",
                },
              ]}
            />
          </div>
          <div className="experience-copy">
            <div className="meta">
              <span className="badge">Current role</span>
              <span>May 2025 — Present</span>
            </div>
            <h3>Robotics Tutor</h3>
            <p className="employer">UOT AI and STEM</p>
            <p>
              I teach students and train teachers to program robots with Scratch
              and WhalesBot kits.
            </p>
            <ul className="clean-list">
              <li>
                Adapt lessons for classrooms, home learning, and online
                sessions.
              </li>
              <li>
                Break down coding concepts into practical, hands-on tasks.
              </li>
              <li>
                Train teachers to bring robotics into their own classrooms.
              </li>
            </ul>
            <div className="experience-foot">
              <span>Communication</span>
              <span>Problem-solving</span>
              <span>Mentoring</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
export function TimelineSection() {
  return (
    <section id="journey" className="section wrap">
      <SectionHeading
        number="04"
        label="Education"
        title="A foundation for what's next."
      />
      <div className="education-grid">
        <ol className="timeline">
          {[
            ["2011", "Primary school", "Kouk BanhChoin Primary School"],
            ["2018", "Secondary school", "Kouk BanhChoin Secondary School"],
            ["2021", "High school", "Hun Sen Chumpuvorn High School"],
            [
              "2024 —",
              "Bachelor of Software Engineering",
              "Kirirom Institute of Technology · In progress",
            ],
          ].map(([year, title, school], i) => (
            <li key={year} className={i === 3 ? "current" : ""} data-reveal>
              <span className="year">{year}</span>
              <div>
                <h3>{title}</h3>
                <p>{school}</p>
              </div>
            </li>
          ))}
        </ol>
        <figure className="education-photo" data-reveal>
          <Image
            src="/university.jpg"
            alt="Kirirom Institute of Technology students and staff together"
            width={600}
            height={338}
            sizes="(max-width: 760px) 90vw, 500px"
          />
          <figcaption>Learning by building, at KIT.</figcaption>
        </figure>
      </div>
    </section>
  );
}
export function CertificatesSection() {
  return (
    <section id="certificates" className="section wrap">
      <SectionHeading
        number="06"
        label="Achievement"
        title="Confidence beyond the code."
      />
      <article className="achievement-card" data-reveal>
        <PhotoViewer
          photos={[
            {
              src: "/debate1.jpg",
              alt: "The debate team with medals, trophy, and a certificate",
              caption: "Our winning team",
              focus: "50% 40%",
            },
            {
              src: "/debate3.jpg",
              alt: "Debate championship finalists holding certificates on stage",
              caption: "At the championship final",
            },
            {
              src: "/debate2.jpg",
              alt: "The debate team during a competition round",
              caption: "Preparing our arguments",
            },
          ]}
        />
        <div className="achievement-copy">
          <p className="eyebrow">1st place / 2019–2020</p>
          <h3>Debate Competition Champion</h3>
          <p className="employer">American Bridge International School</p>
          <p>Our team won the debate championship across 20 school branches.</p>
          <div className="achievement-skills">
            <span>Clear communication</span>
            <span>Critical thinking</span>
            <span>Teamwork</span>
          </div>
        </div>
      </article>
    </section>
  );
}
export function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow">08 / Contact</p>
          <h2>
            Let&apos;s build
            <br />
            something useful<span>.</span>
          </h2>
          <p>
            Looking for a web developer who learns fast and cares about the
            work? Let&apos;s talk.
          </p>
          <a className="button light-button" href={`mailto:${email}`}>
            Get in touch <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="contact-details">
          <div>
            <span className="micro">Email</span>
            <a className="email-link" href={`mailto:${email}`}>
              {email} <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </div>
          <div>
            <span className="micro">Find me online</span>
            <div className="contact-socials">
              {socials
                .filter((s) => s.label !== "Email")
                .map((s) => (
                  <a key={s.label} href={s.href} rel="me">
                    {s.label} ↗
                  </a>
                ))}
            </div>
          </div>
          <a className="contact-cv" href={cvUrl} download>
            Download my CV <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
      <footer className="wrap footer">
        <span>© {new Date().getFullYear()} Nuon Hokseng</span>
        <span>Built with care, in Cambodia.</span>
        <a href="#hero">Back to top ↑</a>
      </footer>
    </section>
  );
}
