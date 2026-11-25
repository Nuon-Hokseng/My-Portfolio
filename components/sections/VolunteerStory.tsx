"use client";
import { PhotoViewer } from "@/components/PhotoViewer";
import { volunteerProjects, type ProjectId } from "@/lib/volunteering";
export type { ProjectId } from "@/lib/volunteering";

export default function VolunteerStory({
  project: id,
  onProject,
  showTabs = true,
}: {
  project: ProjectId;
  onProject: (id: ProjectId) => void;
  showTabs?: boolean;
}) {
  const project =
    volunteerProjects.find((p) => p.id === id) ?? volunteerProjects[0];
  const summary =
    project.id === "saladong"
      ? "Community service at Sala Dong: recycled-material crafts, time with students, and a survey of the school’s local impact."
      : project.id === "cff"
        ? "Joined a Japanese-led volunteer camp in Takeo as a Cambodian buddy, connecting with students and local families."
        : project.intro;
  return (
    <div className="volunteer-story" id="volunteer-experience">
      {showTabs && (
        <div
          className="volunteer-tabs"
          role="group"
          aria-label="Choose a volunteer experience"
        >
          {volunteerProjects.map((p) => (
            <button
              type="button"
              key={p.id}
              aria-pressed={p.id === id}
              onClick={() => onProject(p.id)}
            >
              {p.tab}
            </button>
          ))}
        </div>
      )}
      <article className="volunteer-layout" key={id}>
        <PhotoViewer
          ratio="4 / 3"
          photos={project.slides.map((s) => ({
            src: s.image,
            alt: s.alt,
            caption: s.title,
          }))}
        />
        <div className="volunteer-copy">
          <p className="eyebrow">{project.kicker}</p>
          <h3>{project.title}</h3>
          {project.id === "cambodia40" && (
            <p className="employer">Cambodia 4.0 · Volunteer educator</p>
          )}
          <p>{summary}</p>
          <ul className="clean-list">
            {project.did.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <details className="story-details">
            <summary>
              More about this experience <span aria-hidden="true">+</span>
            </summary>
            <p>{project.intro}</p>
            {project.slides.map((s) => (
              <p key={s.image}>
                <strong>{s.title}.</strong> {s.story}
              </p>
            ))}
          </details>
        </div>
      </article>
    </div>
  );
}
