"use client";

import { useScrollAnimation } from "hooks/useScrollAnimation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function PersonalLifeSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const photos = [
    { src: "/couple1.jpg" },
    { src: "/couple2.jpg" },
    { src: "/couple3.jpg" },
    { src: "/couple4.jpg" },
    { src: "/couple5.jpg" },
  ];

  const calculateTimeElapsed = () => {
    const firstAnniversary = new Date(2025, 1, 17); // February 17, 2025
    const now = new Date();

    // Track total time together (years/months) since first anniversary
    let years = now.getFullYear() - firstAnniversary.getFullYear();
    let months = now.getMonth() - firstAnniversary.getMonth();
    if (now.getDate() < firstAnniversary.getDate()) {
      months--;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Countdown to the next anniversary (February 17 every year)
    const currentYearAnniversary = new Date(now.getFullYear(), 1, 17);
    const nextAnniversary =
      now > currentYearAnniversary
        ? new Date(now.getFullYear() + 1, 1, 17)
        : currentYearAnniversary;

    const diffMs = nextAnniversary.getTime() - now.getTime();
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    return { years, months, days, hours, minutes, seconds };
  };

  useEffect(() => {
    setTimeElapsed(calculateTimeElapsed());
    const interval = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 bg-linear-to-b from-background to-card/20"
    >
      <div className="max-w-6xl w-full space-y-16">
        <div
          className={`text-center space-y-4 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-balance">
            Beyond <span className="text-accent">Code</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A glimpse into my personal life and what matters most to me
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div
            className={`space-y-8 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">My Love Story</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Beyond the code and algorithms, there's a part of my life that
                brings me the most joy. I'm blessed to share my life with an
                amazing partner who supports my dreams and ambitions.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We enjoy traveling, exploring new technologies together, and
                simply enjoying the moments that matter. She's my inspiration,
                my support system, and my greatest achievement.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Interests & Hobbies</h4>
              <div className="grid grid-cols-2 gap-3">
                {["🏃‍♂️ Running", "🎮 Gaming", "😴 Sleeping", "🎬 Movies"].map(
                  (hobby) => (
                    <div
                      key={hobby}
                      className="p-3 bg-muted/50 border border-muted rounded-lg hover:border-accent hover:bg-accent/10 transition-all duration-300 text-foreground"
                    >
                      {hobby}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Image carousel */}
          <div
            className={`space-y-6 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <div className="group relative xl:h-130 md:h-200 h-120 rounded-xl overflow-hidden border-2 border-accent shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-shadow duration-300">
              {/* Carousel images with fade transition */}
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentPhotoIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={photo.src || "/placeholder.svg"}
                    alt={"photo"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6"></div>
              {/* Navigation arrows */}
              <button
                onClick={handlePrevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentPhotoIndex
                        ? "w-8 bg-accent"
                        : "w-2 bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to photo ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Stats or quote */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-muted rounded-xl p-6 hover:border-accent hover:bg-card/80 transition-all duration-300 text-center group cursor-pointer">
                <div className="text-3xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">
                  {timeElapsed.years}y {timeElapsed.months}m
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Time Together
                </p>
              </div>
              <div className="bg-card border border-muted rounded-xl p-6 hover:border-accent hover:bg-card/80 transition-all duration-300 text-center group cursor-pointer">
                <div className="text-3xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">
                  ∞
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Love & Support
                </p>
              </div>
            </div>

            {/* Anniversary Clock */}
            <div className="bg-linear-to-br from-accent/20 to-accent/5 border-2 border-accent rounded-xl p-8 text-center space-y-4">
              <h4 className="text-lg font-semibold text-accent">
                Anniversary Counter
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground">
                    {String(timeElapsed.days).padStart(2, "0")}
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Days
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground">
                    {String(timeElapsed.hours).padStart(2, "0")}
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Hours
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground">
                    {String(timeElapsed.minutes).padStart(2, "0")}
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Minutes
                  </p>
                </div>
              </div>
              {/* <div className="pt-4 border-t border-accent/30">
                <div className="text-5xl font-bold text-accent tabular-nums">
                  {String(timeElapsed.seconds).padStart(2, "0")}
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-2">
                  Seconds
                </p>
              </div> */}
              <p className="text-sm text-muted-foreground pt-2">
                Until next February 17
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div
          className={`text-center space-y-6 pt-8 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="text-lg text-muted-foreground">Let's stay connected</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://t.me/sengkennedy"
              className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-accent/30"
            >
              Contact Me
            </a>
            <a
              href="/Nuon_HokSeng_CV.pdf"
              download="Nuon_HokSeng_CV.pdf"
              className="px-8 py-3 border border-muted-foreground text-foreground rounded-lg font-semibold hover:border-accent hover:text-accent transition-all duration-300 transform hover:scale-105"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
