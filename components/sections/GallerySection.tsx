"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Kaboom } from "@/components/comic/Kaboom";
import { ProjectModal } from "@/components/ProjectModal";
import VolunteerStory, { type ProjectId as StoryId } from "@/components/sections/VolunteerStory";
import { projects, type Project } from "@/lib/projects";

type Kind = "project" | "work" | "volunteer";

type Item = {
  kind: Kind;
  caption: string;
  // A photo or screenshot. Put project screenshots in /public/gallery, e.g. "/gallery/tech-store.png".
  // Project tiles without one are drawn from their project data instead.
  image?: string;
  alt?: string;
  // CSS object-position, to keep the subject in frame when the tile crops the photo
  focus?: string;
  // project tiles open this project's details
  work?: Project;
  // volunteer tiles open this story in the Volunteer filter
  story?: StoryId;
  // tile size in the comic-page grid (mobile 2 columns, desktop 12)
  span: string;
  // backdrop of a project tile that has no screenshot
  tint?: string;
};

const work = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<string, Project>;

// Desktop rows are 12 columns wide and every row adds up to 12, so the wall has no gaps:
// POS 7 + Tilomnov 5, the teaching tiles 6 + 6, the volunteer photos 6 + 6 twice, then the NDA tile 12.
const items: Item[] = [
  {
    kind: "project",
    caption: "Premier Optic POS",
    work: work["optical-pos"],
    image: "/optical-pos/frames.png",
    alt: "The Premier Optic POS frame entry form and frame catalogue",
    focus: "35% 0%",
    span: "col-span-2 row-span-3 lg:col-span-7 lg:row-span-4",
  },
  {
    kind: "project",
    caption: "Tilomnov, property marketplace",
    work: work["tilomnov"],
    image: "/homescreen.jpg",
    alt: "The Tilomnov welcome screen with its logo and the tagline: find and share properties with exact map location",
    focus: "50% 32%",
    span: "col-span-2 row-span-3 lg:col-span-5 lg:row-span-4",
  },
  {
    kind: "work",
    caption: "Robotics tutor, in class",
    image: "/job1.jpg",
    alt: "A student standing in a robotics class with a game controller, a robot on the desk in front of a laptop",
    focus: "50% 58%",
    span: "col-span-1 row-span-3 lg:col-span-6 lg:row-span-3",
  },
  {
    kind: "work",
    caption: "Training teachers online",
    image: "/job-teacher-tutor.jpg",
    alt: "A laptop showing a video call where Scratch block code for a robot is being shared",
    focus: "50% 50%",
    span: "col-span-1 row-span-3 lg:col-span-6 lg:row-span-3",
  },
  {
    kind: "volunteer",
    caption: "Sala Dong, the whole crew",
    image: "/saladuong5.jpg",
    alt: "The volunteer group in front of Rubbish Cafe with a KIT logo made of bottle caps",
    focus: "50% 60%",
    story: "saladong",
    span: "col-span-1 row-span-2 lg:col-span-6 lg:row-span-2",
  },
  {
    kind: "volunteer",
    caption: "Building souvenirs",
    image: "/saladuong2.jpg",
    alt: "A volunteer threading bottle caps and straws into a souvenir",
    focus: "65% 50%",
    story: "saladong",
    span: "col-span-1 row-span-2 lg:col-span-6 lg:row-span-2",
  },
  {
    kind: "volunteer",
    caption: "CFF Camp, village kids",
    image: "/camp2.jpg",
    alt: "Volunteers and village children in front of a blue schoolhouse",
    focus: "50% 60%",
    story: "cff",
    span: "col-span-1 row-span-2 lg:col-span-6 lg:row-span-2",
  },
  {
    kind: "volunteer",
    caption: "CFF Camp, hearts",
    image: "/camp4.jpg",
    alt: "Children, staff and volunteers making heart shapes with their hands",
    focus: "50% 55%",
    story: "cff",
    span: "col-span-1 row-span-2 lg:col-span-6 lg:row-span-2",
  },
];

// The NDA tile is a full-width strip in "All"; the Private filter pairs it with the POS tile instead.
const PRIVATE_SPAN = "col-span-2 row-span-3 lg:col-span-12 lg:row-span-2";
const PRIVATE_FILTER_SPAN = "col-span-2 row-span-3 lg:col-span-4 lg:row-span-4";
const PRIVATE_FILTER_TILE_SPAN = "col-span-2 row-span-3 lg:col-span-8 lg:row-span-4";

// short names for the private-project buttons
const privateWork: { label: string; project: Project }[] = [
  { label: "Optical POS", project: work["optical-pos"] },
  { label: "Compara", project: work["compara"] },
  { label: "AI lead-gen", project: work["lead-gen"] },
  { label: "Meal Tracker", project: work["meal-tracker"] },
  { label: "SME Valuation", project: work["sme-valuation"] },
];

const filters = [
  { id: "all", label: "All" },
  { id: "project", label: "Projects" },
  { id: "work", label: "Teaching" },
  { id: "volunteer", label: "Volunteer" },
  { id: "private", label: "Private" },
] as const;

type Filter = (typeof filters)[number]["id"];

function Tile({ item, span, onOpen }: { item: Item; span: string; onOpen: () => void }) {
  const label =
    item.kind === "project"
      ? `${item.caption}: view project details`
      : item.kind === "work"
        ? `${item.caption}: see my teaching experience`
        : `${item.caption}: open the ${item.story === "cff" ? "CFF Camp" : "Sala Dong"} story`;

  const media = item.image ? (
    <Image
      src={item.image}
      alt={item.alt ?? item.caption}
      fill
      sizes="(max-width: 1024px) 100vw, 700px"
      className="gal-media object-cover"
      style={item.focus ? { objectPosition: item.focus } : undefined}
    />
  ) : (
    // no screenshot yet: browser frame drawn from the project's own data
    <div className="gal-media gal-frame" style={{ "--tint": item.tint } as CSSProperties}>
      <div className="gal-frame-bar">
        <i />
        <i />
        <i />
        <span>{item.caption}</span>
      </div>
      <div className="gal-frame-body flex-col gap-3 px-4 pt-6">
        <span className="text-4xl lg:text-5xl" aria-hidden="true">
          {item.work?.icon}
        </span>
        <p className="hidden max-w-[36ch] border-[3px] border-[#14193f] bg-white px-3 py-2 text-[13px] font-semibold leading-snug text-[#14193f] shadow-[3px_3px_0_#14193f] text-shadow-none lg:line-clamp-3 lg:block">
          {item.work?.description}
        </p>
      </div>
    </div>
  );

  return (
    <figure className={`gal-panel ${span}`}>
      {media}
      <button
        type="button"
        onClick={onOpen}
        aria-label={label}
        className="absolute inset-0 z-4 cursor-pointer focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-saffron"
      />
      <figcaption className="gal-cap">{item.caption}</figcaption>
      <span className={`gal-tag ${item.kind === "volunteer" ? "gal-tag-red" : ""}`}>
        {item.kind === "volunteer" ? "Volunteer" : item.kind === "work" ? "Teaching" : item.work?.private ? "Private" : "Project"}
      </span>
    </figure>
  );
}

function PrivateTile({ span, wide, onOpen }: { span: string; wide: boolean; onOpen: (project: Project) => void }) {
  return (
    <figure className={`gal-panel gal-private ${span}`}>
      <Kaboom text="NDA" rotate={9} className="right-3 top-2" />
      <div
        className={`relative z-3 flex h-full flex-col justify-end gap-3 p-5 text-[#eef0f7] ${wide ? "lg:flex-row lg:items-center lg:justify-between lg:gap-8" : ""}`}
      >
        <div className={`border-[3px] border-[#eef0f7] bg-[#14193f] px-3 py-2.5 ${wide ? "lg:max-w-[38%]" : ""}`}>
          <b className="block font-display text-lg font-extrabold leading-tight [font-variation-settings:'wdth'_86]">
            {privateWork.length} private projects
          </b>
          <span className="mt-1 block text-sm leading-snug opacity-85">
            Under NDA. Pick one for the write-up, or ask for a walkthrough.
          </span>
        </div>
        <ul className={`grid grid-cols-2 gap-2 ${wide ? "lg:flex-1 lg:grid-cols-5" : ""}`}>
          {privateWork.map(({ label, project }) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => onOpen(project)}
                className="w-full border-[3px] border-[#eef0f7] bg-[#14193f] px-2 py-1.5 text-sm font-bold text-[#eef0f7] shadow-[3px_3px_0_#03051a] transition-colors hover:bg-[#d63a2f] focus-visible:bg-[#d63a2f]"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

export default function GallerySection() {
  const [filter, setFilter] = useState<Filter>("all");
  const [story, setStory] = useState<StoryId>("saladong");
  const [selected, setSelected] = useState<Project | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // the Private filter re-flows: the POS tile gets a wider slot so the NDA tile fits beside it
  const tiles =
    filter === "private"
      ? items.filter((i) => i.work?.private).map((item) => ({ item, span: PRIVATE_FILTER_TILE_SPAN }))
      : items.filter((i) => filter === "all" || i.kind === filter).map((item) => ({ item, span: item.span }));
  const showPrivate = filter === "all" || filter === "private";
  // the Volunteer filter swaps the tile grid for the full volunteering stories
  const showStory = filter === "volunteer";

  const open = (item: Item) => {
    if (item.kind === "project") {
      setSelected(item.work ?? null);
    } else if (item.kind === "work") {
      // the full write-up lives in the Experience section
      document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setStory(item.story ?? "saladong");
      setFilter("volunteer");
      // the story is shorter and taller than the tile grid, so glide up to the filter bar
      // instead of leaving the reader mid-page while the content swaps under them
      requestAnimationFrame(() => headerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  return (
    <section id="gallery" className="relative overflow-hidden border-t border-ink px-5 py-16 md:px-10 lg:py-28">
      <div className="relative z-10 mx-auto w-full max-w-300">
        <div ref={headerRef} className="mb-10 grid scroll-mt-24 items-end gap-4 lg:grid-cols-[auto_1fr_auto] lg:gap-9">
          <h2 className="comic-caption">Portfolio wall</h2>
          <p className="max-w-[34ch] text-muted-foreground lg:text-[17px]">
            Every project, the volunteering and the moments in between, all on one page.
          </p>
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter the gallery">
            {filters.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
                className="comic-btn rounded-none! px-4! py-2.5! text-[15px] aria-pressed:bg-ink aria-pressed:text-background"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* keyed by filter so every tab change fades the new content in */}
        {showStory ? (
          <div key="story" className="gal-enter">
            <VolunteerStory project={story} onProject={setStory} />
          </div>
        ) : (
          <div key={filter} className="gal-enter grid auto-rows-[92px] grid-cols-2 gap-2.5 grid-flow-dense lg:auto-rows-[118px] lg:grid-cols-12 lg:gap-3.5">
            {tiles.map(({ item, span }) => (
              <Tile key={item.caption} item={item} span={span} onOpen={() => open(item)} />
            ))}
            {showPrivate && (
              <PrivateTile
                span={filter === "private" ? PRIVATE_FILTER_SPAN : PRIVATE_SPAN}
                wide={filter === "all"}
                onOpen={setSelected}
              />
            )}
          </div>
        )}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
