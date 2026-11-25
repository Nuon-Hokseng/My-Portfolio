"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Project } from "@/lib/projects";
import { PhotoViewer } from "./PhotoViewer";

/** Native modal preserves keyboard trapping, Escape, and return focus. */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const dialog = ref.current;
    const focused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      focused?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      aria-labelledby="project-title"
      onCancel={(event) => {
        event.preventDefault();
        close.current();
      }}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.target === event.currentTarget &&
          (event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom)
        )
          close.current();
      }}
    >
      <button
        className="dialog-close"
        type="button"
        aria-label="Close project details"
        onClick={() => close.current()}
      >
        <X size={22} aria-hidden="true" />
      </button>
      <p className="eyebrow">
        {project.private ? "Private project" : "Project overview"}
      </p>
      <h2 id="project-title">{project.title}</h2>
      <p className="employer">{project.role}</p>
      <p className="project-description">
        {project.details || project.description}
      </p>
      {project.screenshots && (
        <div
          className={
            project.screenshotShape === "phone" ? "modal-phone" : "modal-shots"
          }
        >
          <PhotoViewer
            ratio={
              project.screenshotShape === "phone" ? "739 / 1600" : "16 / 9"
            }
            photos={project.screenshots.map((s) => ({
              src: s.src,
              alt: s.alt,
              caption: s.caption,
            }))}
          />
        </div>
      )}
      {project.highlights && (
        <>
          <h3 className="modal-heading">My contributions</h3>
          <ul className="clean-list">
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
      <h3 className="modal-heading">Stack</h3>
      <ul className="tags">
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      {(project.demo || project.code) && (
        <div className="actions">
          {project.demo && (
            <a
              className="button primary"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo ↗
            </a>
          )}
          {project.code && (
            <a
              className="button"
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source ↗
            </a>
          )}
        </div>
      )}
      {project.private && (
        <p className="preview-note">
          Private source code. I can discuss my contributions and architecture
          in an interview.
        </p>
      )}
    </dialog>
  );
}
