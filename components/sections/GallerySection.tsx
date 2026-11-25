"use client";
import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { projects, type Project } from "@/lib/projects";
import { SectionHeading } from "@/components/SectionHeading";
import VolunteerStory, { type ProjectId } from "./VolunteerStory";

const ProjectModal = dynamic(() =>
  import("@/components/ProjectModal").then((module) => module.ProjectModal),
);
const filters = [
  "All work",
  "Projects",
  "Teaching",
  "Volunteer",
  "Private",
] as const;
type Filter = (typeof filters)[number];
const privateWork = projects.filter(
  (p) => p.private && p.slug !== "optical-pos",
);

export default function GallerySection() {
  const [filter, setFilter] = useState<Filter>("All work");
  const [selected, setSelected] = useState<Project | null>(null);
  const [story, setStory] = useState<ProjectId>("cambodia40");
  const openStory = (id: ProjectId) => {
    setStory(id);
    setFilter("Volunteer");
    requestAnimationFrame(() =>
      document.getElementById("gallery")?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      }),
    );
  };
  return (
    <section id="gallery" className="section tint">
      <div className="wrap">
        <div className="gallery-heading">
          <SectionHeading
            number="05"
            label="Portfolio"
            title="Real projects. Clear purpose."
          >
            A closer look at what I build and how I contribute.
          </SectionHeading>
        </div>
        <div className="filter-bar" role="group" aria-label="Filter portfolio">
          {filters.map((label) => (
            <button
              type="button"
              key={label}
              aria-pressed={filter === label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
        {filter === "Volunteer" ? (
          <VolunteerStory project={story} onProject={setStory} />
        ) : (
          <div className="work-grid">
            {["All work", "Projects", "Private"].includes(filter) &&
              projects
                .filter(
                  (p) =>
                    ["optical-pos", "tilomnov"].includes(p.slug) &&
                    (filter !== "Private" || p.private),
                )
                .sort((a) => (a.slug === "optical-pos" ? -1 : 1))
                .map((project) => (
                  <article
                    key={project.slug}
                    className={`project-card ${project.slug === "tilomnov" ? "tilomnov" : "pos"}`}
                  >
                    <button
                      type="button"
                      className={`project-visual ${project.slug === "tilomnov" ? "mobile-visual" : "pos-visual"}`}
                      aria-label={`${project.slug === "optical-pos" ? "Premier Optic / Workspace" : "Tilomnov / Property marketplace"}: view project`}
                      onClick={() => setSelected(project)}
                    >
                      {project.slug === "optical-pos" ? (
                        <>
                          <span className="browser-bar" aria-hidden="true">
                            <span>● ● ●</span>
                            <span>Premier Optic / Workspace</span>
                          </span>
                          <span className="project-screen">
                            <Image
                              src="/optical-pos/frames.png"
                              alt="Premier Optic frame catalogue and point-of-sale workspace"
                              fill
                              sizes="(max-width: 760px) 90vw, 660px"
                            />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="visual-label">
                            Tilomnov / Property marketplace
                          </span>
                          <span className="phones">
                            <Image
                              src="/tilomnov/map.jpg"
                              alt="Tilomnov property map"
                              width={148}
                              height={320}
                              sizes="130px"
                            />
                            <Image
                              src="/tilomnov/listings.jpg"
                              alt="Tilomnov property listings"
                              width={148}
                              height={320}
                              sizes="130px"
                            />
                          </span>
                        </>
                      )}
                    </button>
                    <div className="project-copy">
                      <div className="meta">
                        <span className="micro">
                          {project.private
                            ? "Business software"
                            : "Web APIs & mobile"}
                        </span>
                        <span className="badge neutral">
                          {project.private
                            ? "Private project"
                            : "Personal project"}
                        </span>
                      </div>
                      <h3>
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => setSelected(project)}
                        >
                          {project.slug === "tilomnov"
                            ? "Tilomnov"
                            : project.title}
                          <ArrowUpRight size={22} aria-hidden="true" />
                        </button>
                      </h3>
                      <p>
                        {project.slug === "tilomnov"
                          ? "A map-first property marketplace with listings, messaging, and voice calls."
                          : "Sales, inventory, prescriptions, and KHQR payments in one optical-shop workspace."}
                      </p>
                      <p className="contribution">
                        <strong>My role:</strong>{" "}
                        {project.slug === "tilomnov"
                          ? "Full-stack development · AI-assisted"
                          : "Full-stack development & self-hosting"}
                      </p>
                      <ul className="tags">
                        {(project.slug === "tilomnov"
                          ? ["Flutter", "NestJS", "PostgreSQL", "Redis"]
                          : ["Next.js", "TypeScript", "Supabase", "AWS"]
                        ).map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
            {filter === "All work" && (
              <div className="volunteer-feature">
                <VolunteerStory
                  project="cambodia40"
                  onProject={setStory}
                  showTabs={false}
                />
              </div>
            )}
            {["All work", "Teaching"].includes(filter) &&
              [
                {
                  src: "/job1.jpg",
                  title: "Hands-on robotics",
                  alt: "A student learning robotics in class",
                },
                {
                  src: "/job-teacher-tutor.jpg",
                  title: "Training other teachers",
                  alt: "Online teacher training with Scratch and a robot",
                },
              ].map((photo) => (
                <figure className="work-photo teaching" key={photo.src}>
                  <div className="work-photo-image">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 760px) 45vw, 570px"
                    />
                  </div>
                  <figcaption>
                    <div>
                      <small>Teaching</small>
                      <h3>{photo.title}</h3>
                    </div>
                    <a
                      href="#experience"
                      aria-label={`Read about ${photo.title}`}
                    >
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  </figcaption>
                </figure>
              ))}
            {filter === "All work" &&
              [
                {
                  src: "/saladuong5.jpg",
                  title: "Sala Dong",
                  id: "saladong" as const,
                },
                {
                  src: "/saladuong2.jpg",
                  title: "Recycled-material crafts",
                  id: "saladong" as const,
                },
                { src: "/camp2.jpg", title: "CFF Camp", id: "cff" as const },
                {
                  src: "/camp4.jpg",
                  title: "Learning together",
                  id: "cff" as const,
                },
              ].map((photo) => (
                <article className="work-photo volunteer" key={photo.src}>
                  <button
                    type="button"
                    className="volunteer-tile"
                    onClick={() => openStory(photo.id)}
                  >
                    <span className="work-photo-image">
                      <Image
                        src={photo.src}
                        alt={photo.title}
                        fill
                        sizes="(max-width: 760px) 45vw, 280px"
                      />
                    </span>
                    <span className="volunteer-caption">
                      <small>Community</small>
                      <span>{photo.title}</span>
                    </span>
                  </button>
                </article>
              ))}
            {["All work", "Private"].includes(filter) && (
              <aside className="private-work">
                <div className="private-heading">
                  <span className="lock-icon">
                    <LockKeyhole size={21} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>More work, kept private.</h3>
                    <p>
                      Project summaries and my contributions, without the
                      private source code.
                    </p>
                  </div>
                </div>
                <div className="private-links">
                  {privateWork.map((p) => (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => setSelected(p)}
                    >
                      {p.slug === "compara"
                        ? "Compara"
                        : p.slug === "lead-gen"
                          ? "AI lead-gen"
                          : p.slug === "meal-tracker"
                            ? "Meal Tracker"
                            : "SME Valuation"}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </aside>
            )}
          </div>
        )}
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </section>
  );
}
