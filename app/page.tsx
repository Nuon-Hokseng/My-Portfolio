import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import TimelineSection from '@/components/sections/TimelineSection';
import CertificatesSection from '@/components/sections/CertificatesSection';
import ContactSection from '@/components/sections/ContactSection';
import GallerySection from '@/components/sections/GallerySection';
import QuizSection from '@/components/sections/QuizSection';
import GameSection from '@/components/sections/GameSection';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Navbar } from '@/components/Navbar';
import { KonamiEasterEgg } from '@/components/KonamiEasterEgg';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <Navbar />
      <ThemeToggle />
      <KonamiEasterEgg />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <TimelineSection />
      <GallerySection />
      <CertificatesSection />
      <QuizSection />
      <GameSection />
      <ContactSection />
    </main>
  );
}
