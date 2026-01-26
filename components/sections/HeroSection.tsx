"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { typewriterWords } from "lib/animation";

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
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-linear-to-b from-accent to-transparent" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto w-full">
        {/* Left side - Text */}
        <div className="space-y-8 animate-fade-in">
          <div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-4 text-balance">
              Hi, I'm <span className="text-accent">Nuon Hokseng</span>
            </h1>
            <div className="text-2xl lg:text-3xl font-semibold text-muted-foreground h-16 flex items-center">
              <span className="border-r-4 border-accent pr-3">
                {displayText}
              </span>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            A passionate software engineer crafting beautiful, scalable web
            applications. I specialize in modern JavaScript/TypeScript
            ecosystems and love solving complex problems.
          </p>

          <div className="flex gap-4 pt-4">
            <a href="https://github.com/Nuon-Hokseng?tab=repositories" className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity transform hover:scale-105 duration-300">
              View My Work
            </a>
            <button className="px-8 py-3 border border-muted-foreground text-foreground rounded-lg font-semibold hover:border-accent hover:text-accent transition-colors transform hover:scale-105 duration-300">
              Contact Me
            </button>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 pt-4">
            <a
              href="https://github.com/Nuon-Hokseng"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/nuon-hokseng-b5b65b33b/"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://web.facebook.com/Seng.kisuke/"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Facebook
            </a>
             <a
              href="https://t.me/sengkennedy"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Telegram
            </a>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="flex justify-center items-center overflow-visible">
          <div className="relative w-80 h-80 lg:w-96 lg:h-96 overflow-visible">
            {/* Animated background circles */}
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-accent to-transparent opacity-20 blur-3xl animate-pulse" />
            <div
              className="absolute inset-0 rounded-full border-2 border-accent opacity-20 animate-spin-slow"
              style={{ animationDuration: "8s" }}
            />

            <div className="absolute -inset-0.5 rounded-full overflow-visible border-2 border-accent shadow-lg shadow-accent/20 transform hover:scale-105 transition-transform duration-300 z-10">
              <Image
                src="/hero.png"
                alt="Profile"
                fill
                className="object-cover rounded-full"
                priority
                quality={100}
                sizes="(max-width: 1024px) 320px, 384px"
                style={{ imageRendering: "crisp-edges" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-accent"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
