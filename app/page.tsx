import HeroSection from "@/components/sections/HeroSection";
import {
  AboutSection,
  SkillsSection,
  ExperienceSection,
  TimelineSection,
  CertificatesSection,
  ContactSection,
} from "@/components/sections/ProfileSections";
import GallerySection from "@/components/sections/GallerySection";
import ExtrasSection from "@/components/sections/ExtrasSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navbar } from "@/components/Navbar";
import { ScrollMotion } from "@/components/ScrollMotion";
export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <TimelineSection />
        <GallerySection />
        <CertificatesSection />
        <ExtrasSection />
        <ContactSection />
      </main>
      <ThemeToggle />
      <ScrollMotion />
    </>
  );
}
