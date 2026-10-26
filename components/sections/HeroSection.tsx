"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { typewriterWords } from "lib/animation";
import { SpiderWeb } from "@/components/comic/SpiderWeb";
import { Kaboom } from "@/components/comic/Kaboom";

const socials = [
  { label: "Email", href: "mailto:sengnoname168@gmail.com" },
  { label: "GitHub", href: "https://github.com/Nuon-Hokseng" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nuon-hokseng-b5b65b33b/" },
  { label: "Facebook", href: "https://web.facebook.com/Seng.kisuke/" },
  { label: "Telegram", href: "https://t.me/sengkennedy" },
];

export default function HeroSection() {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = typewriterWords[wordIndex];
    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentWord.length) {
            setDisplayText(currentWord.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 1000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % typewriterWords.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timer);
  }, [displayText, wordIndex, isDeleting]);

  return (
    <section
      id="hero"
      className="halftone-field relative overflow-hidden px-5 pt-28 pb-24 md:px-10 lg:pt-36 lg:pb-28"
    >
      <SpiderWeb className="right-0 top-0 -scale-x-100" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] items-center gap-16 lg:grid-cols-[7fr_5fr] lg:gap-14">
        {/* Left: name, role, intro, actions */}
        <div>
          <h1 className="display-tight print-offset text-[clamp(5.5rem,13vw,11.75rem)] font-extrabold leading-[0.86] tracking-[-0.018em] text-ink">
            Nuon
            <br />
            Hokseng
          </h1>

          <p lang="km" className="mt-6 font-khmer text-[clamp(2.25rem,4.2vw,3.25rem)] font-extrabold leading-normal text-cobalt">
            នួន ហុកសេង
          </p>

          {/* fixed line box so the intro below doesn't jump when the typewriter empties */}
          <p className="mt-1 flex h-[1.5em] items-center gap-2 font-display text-[clamp(1.4rem,2.2vw,1.9rem)] font-semibold leading-[1.5] [font-variation-settings:'wdth'_90]">
            <span className="sr-only">Software engineer</span>
            <span aria-hidden="true">{displayText}</span>
            <span aria-hidden="true" className="inline-block h-[1em] w-[0.45em] bg-krama" />
          </p>

          <p className="mt-6 max-w-[50ch] text-[1.05rem] leading-relaxed text-muted-foreground md:text-xl">
            A passionate software engineer crafting beautiful, scalable web
            applications. I specialize in modern JavaScript/TypeScript
            ecosystems and love solving complex problems.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#gallery" className="comic-btn comic-btn-red">
              View my work
            </a>
            <a href="#contact" className="comic-btn">
              Contact me
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
            {socials.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="font-semibold underline decoration-krama decoration-2 underline-offset-[6px] hover:text-krama"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: portrait on a krama block, with speed lines behind */}
        <div className="speed-lines relative mr-[26px] aspect-[4/5] w-[calc(100%-26px)] max-w-[420px] lg:ml-auto lg:mr-0 lg:w-full lg:max-w-[410px]">
          <div className="krama-check absolute inset-0 z-0 translate-x-[26px] translate-y-[26px]" />
          {/* hero.png is a transparent cutout, so it needs its own backdrop */}
          <div className="absolute inset-0 z-[1] border-4 border-ink bg-[#14193f]">
            <Image
              src="/hero.png"
              alt="Portrait of Nuon Hokseng"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 410px"
              className="object-cover object-[50%_18%]"
            />
          </div>

          {/* bubble and BOOM only break out of the frame once there is room beside it (xl) */}
          <p className="speech-bubble z-[3] left-[-4px] top-[-26px] w-[190px] -rotate-3 text-lg xl:left-[-128px] xl:top-[26px] xl:w-[218px] xl:text-[22px]">
            <span className="mr-2 inline-block size-[11px] rounded-full border-2 border-[#14193f] bg-saffron align-[-1px]" />
            Open to new opportunities
          </p>

          <Kaboom pop delay={0.9} rotate={-9} className="bottom-[-30px] right-[-8px] xl:left-[-40px] xl:right-auto" />
        </div>
      </div>
    </section>
  );
}
