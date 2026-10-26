"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { Kaboom } from "@/components/comic/Kaboom";

type Slide = {
  image: string;
  alt: string;
  // short label on the photo
  title: string;
  // shown when the photo is clicked
  story: string;
};

type Fact = { big: string; small: string };

export type ProjectId = "saladong" | "cff";

type Project = {
  id: ProjectId;
  // label on the switcher
  tab: string;
  kicker: string;
  title: string;
  khmer?: string;
  intro: string;
  did: string[];
  facts: Fact[];
  slides: Slide[];
};

const projects: Project[] = [
  {
    id: "saladong",
    tab: "Sala Dong · May 2024",
    kicker: "May 2024 · first volunteering",
    title: "Sala Dong",
    khmer: "សាលាដូង",
    intro:
      "After the semester break we did community service at Sala Dong, a small school on top of Kirirom mountain. It lets children from grade 1 to 6 keep learning even though they live in a remote area. Its founder has kept it going for almost 10 years, and we went to see how, and to help.",
    did: [
      "Built souvenirs from recycled materials",
      "Taught and discussed with the students",
      "Learned the school's history from its team",
      "Ran a real-life survey on the school's impact",
    ],
    facts: [
      { big: "1–6", small: "grades taught" },
      { big: "~10", small: "years running" },
      { big: "Kirirom", small: "mountain top" },
    ],
    slides: [
      {
        image: "/saladuong1.jpg",
        alt: "The volunteer team standing together in front of a Cambodian flag made from bottle caps",
        title: "Meeting the school",
        story:
          "We started by meeting the people behind Sala Dong. The hall around us is decorated with recycled bottle caps, even the Cambodian flag on the wall, and it set the tone for the whole stay: nothing here is wasted, everything gets a second life.",
      },
      {
        image: "/saladuong2.jpg",
        alt: "A volunteer threading bottle caps and straws into a souvenir at a blue table",
        title: "Building souvenirs",
        story:
          "We sat down with bottle caps, straws and thread to build souvenirs by hand. Slow, careful work, one cap at a time, and a good way to see how the school turns recycled material into something people want to take home.",
      },
      {
        image: "/saladuong3.jpg",
        alt: "A volunteer speaking to a group in front of the bottle-cap flag wall",
        title: "Talking it through",
        story:
          "Some of the best learning happened in conversation. We discussed with the students and the people running the school, and learned its history: how the founder started it and has kept it going for almost 10 years.",
      },
      {
        image: "/saladuong4.jpg",
        alt: "Four volunteers resting on a log among pine trees on Kirirom mountain",
        title: "Kirirom, between sessions",
        story:
          "A break under the pine trees. The school sits on top of Kirirom mountain, far from town, and that distance is the whole point: for many of the children, this is the one place close enough to learn in.",
      },
      {
        image: "/saladuong5.jpg",
        alt: "The whole volunteer group posing in front of Rubbish Cafe with a KIT logo made of bottle caps",
        title: "The whole crew",
        story:
          "Everyone together, holding up the KIT logo made from bottle caps. We also ran a real-life survey on how much Sala Dong changes things for the children, and what it means that grades 1 to 6 can study here even in a remote area.",
      },
    ],
  },
  {
    id: "cff",
    tab: "CFF Camp · Feb 2025",
    kicker: "9th – 13th February 2025",
    title: "CFF Camp",
    intro:
      "A volunteer camp led by a Japanese team, in Takeo province. We joined as their Cambodian buddies: explaining our culture, visiting a school much like Sala Dong, staying with local homestay families and ending the trip at an orphanage before heading back to Kirirom.",
    did: [
      "Were the Cambodian buddies of the Japanese team",
      "Explained our culture along the way",
      "Visited a school in Takeo, much like Sala Dong",
      "Stayed in a local homestay and played with the students",
      "Visited the orphanage in Traeng Trayeng (ត្រែងត្រយឹង)",
      "Campfire nights, then back to Kirirom",
    ],
    facts: [
      { big: "Takeo", small: "province" },
      { big: "Feb 2025", small: "9th – 13th" },
      { big: "Buddies", small: "to a Japanese team" },
    ],
    slides: [
      {
        image: "/camp2.jpg",
        alt: "Volunteers and dozens of village children posing in front of a blue schoolhouse",
        title: "Playing with the kids",
        story:
          "A blue schoolhouse, a crowd of kids and the Japanese team all squeezed into one photo. We played with the students, paper planes included. Our job as buddies was to stay close to our Japanese friends and make the day easy for everyone.",
      },
      {
        image: "/camp1.jpg",
        alt: "The volunteers posing at night with a local family under a lit shelter",
        title: "A night at the homestay",
        story:
          "We stayed in local homes, not a hotel. Here the Japanese volunteers and our team pose with a local family under the porch light. It is the best way to see everyday Cambodian life, and to explain it at the same time.",
      },
      {
        image: "/camp4.jpg",
        alt: "Volunteers, children and staff making heart shapes with their hands inside a school hall",
        title: "Hearts all around",
        story:
          "Heart hands from the children, the staff and the volunteers. Visiting places like this, a school like Sala Dong in Takeo and the orphanage in Traeng Trayeng, is what the camp was about.",
      },
      {
        image: "/camp3.jpg",
        alt: "The camp group in matching blue shirts in front of Rubbish Cafe in Kirirom",
        title: "Back at Kirirom",
        story:
          "We finished the trip by coming back to Kirirom, with a stop at Rubbish Café. Between the campfire nights, the games and everything else, the group got close. This is the whole team in matching blue shirts at the end.",
      },
    ],
  },
];

const AUTOPLAY_MS = 6000;
const SWIPE_PX = 45;

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" aria-hidden="true">
      <path d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

function Carousel({ slides, label }: { slides: Slide[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);
  const swipe = useRef<{ x: number } | null>(null);
  const suppressClick = useRef(false);

  const go = useCallback(
    (next: number) => {
      setIndex((next + slides.length) % slides.length);
      setOpen(false);
    },
    [slides.length],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // advance on a timer, but never while someone is reading a story or pointing at the photo
  useEffect(() => {
    if (open || paused || reduceMotion) return;
    const id = window.setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, open, paused, reduceMotion, go]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "Escape") setOpen(false);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    suppressClick.current = false;
    swipe.current = { x: e.clientX };
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) >= SWIPE_PX) {
      // a swipe ends in a click on the photo button: don't read it as "open the story"
      suppressClick.current = true;
      go(index + (dx < 0 ? 1 : -1));
    }
  };

  const current = slides[index];

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${label} photos`}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="gal-panel aspect-4/3 shadow-[8px_8px_0_var(--hard)] touch-pan-y select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        {/* slide track */}
        <div
          className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={slide.image} className="relative h-full w-full shrink-0" aria-hidden={i !== index}>
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* the photo itself is the button that opens the story */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="volunteer-story"
          aria-label={`${open ? "Hide" : "Read"} the story: ${current.title}`}
          onClick={() => {
            if (suppressClick.current) {
              suppressClick.current = false;
              return;
            }
            setOpen((v) => !v);
          }}
          className="absolute inset-0 z-4 cursor-pointer focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-saffron"
        />

        <p className="gal-cap pointer-events-none" aria-hidden="true">
          {current.title}
        </p>

        {!open && (
          <span className="gal-tag gal-tag-red pointer-events-none" aria-hidden="true">
            Click for the story
          </span>
        )}

        {open && (
          <div
            id="volunteer-story"
            role="region"
            aria-label={current.title}
            className="animate-in fade-in slide-in-from-bottom-6 duration-300 pointer-events-none absolute inset-x-0 bottom-0 z-5 flex max-h-full items-end p-3 md:p-5"
          >
            <div className="pointer-events-auto max-h-full overflow-y-auto border-[3px] border-[#14193f] bg-white p-4 text-[#14193f] shadow-[5px_5px_0_#14193f] md:p-5">
              <b className="block font-display text-lg font-extrabold leading-tight [font-variation-settings:'wdth'_86] md:text-2xl">
                {current.title}
              </b>
              <p className="mt-2 text-sm leading-relaxed md:text-base">{current.story}</p>
              <p className="mt-3 text-xs font-semibold opacity-70">Click the photo again to close</p>
            </div>
          </div>
        )}

        <span className="pointer-events-none absolute right-3.5 top-3.5 z-3 border-[3px] border-[#14193f] bg-[#eef0f7] px-2.5 py-1 text-[13px] font-bold leading-none text-[#14193f] shadow-[3px_3px_0_#14193f] max-md:right-2 max-md:top-2 max-md:border-2 max-md:px-1.5 max-md:text-[11px]">
          {index + 1} / {slides.length}
        </span>
      </div>

      <div className="mt-6 flex items-center gap-3 md:gap-4">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous photo" className="comic-btn shrink-0 px-3! py-3!">
          <Arrow dir="prev" />
        </button>

        <ul className="flex min-w-0 flex-1 gap-2 md:gap-3">
          {slides.map((slide, i) => (
            <li key={slide.image} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Photo ${i + 1}: ${slide.title}`}
                aria-current={i === index}
                className={`relative block aspect-4/3 w-full overflow-hidden border-[3px] transition-[transform,opacity] aria-current:-translate-y-1 aria-current:border-krama aria-current:opacity-100 ${
                  i === index ? "" : "border-ink opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={slide.image} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>

        <button type="button" onClick={() => go(index + 1)} aria-label="Next photo" className="comic-btn shrink-0 px-3! py-3!">
          <Arrow dir="next" />
        </button>
      </div>
    </div>
  );
}

// The community-service stories, shown by the portfolio wall's Volunteer filter.
export default function VolunteerStory({
  project: projectId,
  onProject,
}: {
  project: ProjectId;
  onProject: (id: ProjectId) => void;
}) {
  const project = projects.find((p) => p.id === projectId) ?? projects[0];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2.5" role="group" aria-label="Choose a volunteering project">
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={p.id === project.id}
            onClick={() => onProject(p.id)}
            className="comic-btn rounded-none! px-4! py-2.5! text-[15px] aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-foreground"
          >
            {p.tab}
          </button>
        ))}
      </div>

      {/* keyed so each project starts on its first photo and fades in */}
      <div key={project.id} className="gal-enter grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-12">
        <Carousel slides={project.slides} label={project.title} />

        <div className="relative flex flex-col gap-6">
          <Kaboom text="WOW!" rotate={9} className="-top-3 right-0 max-lg:hidden" />

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-krama">{project.kicker}</p>
            <h3 className="mt-2 font-display text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold leading-none text-ink [font-variation-settings:'wdth'_80]">
              {project.title}
            </h3>
            {project.khmer && (
              <p lang="km" className="mt-1 font-khmer text-3xl font-extrabold leading-normal text-cobalt">
                {project.khmer}
              </p>
            )}
          </div>

          <p className="max-w-[48ch] leading-relaxed text-muted-foreground">{project.intro}</p>

          <ul className="flex flex-col gap-3">
            {project.did.map((line, i) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border-[3px] border-ink bg-saffron text-sm font-extrabold text-[#14193f]">
                  {i + 1}
                </span>
                <span className="font-semibold leading-snug">{line}</span>
              </li>
            ))}
          </ul>

          <dl className="grid grid-cols-3 gap-3">
            {project.facts.map(({ big, small }) => (
              <div key={small} className="border-[3px] border-ink bg-card px-2 py-3 text-center shadow-[4px_4px_0_var(--hard)]">
                <dt className="font-display text-xl font-extrabold leading-none text-ink [font-variation-settings:'wdth'_84] md:text-2xl">
                  {big}
                </dt>
                <dd className="mt-1.5 text-xs font-semibold text-muted-foreground">{small}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
