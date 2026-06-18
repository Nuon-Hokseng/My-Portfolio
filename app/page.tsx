import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import TimelineSection from '@/components/sections/TimelineSection';
import CertificatesSection from '@/components/sections/CertificatesSection';
import ProjectsSection from 'components/sections/ProjectsSection';
import PersonalLifeSection from '@/components/sections/PersonalLifeSection';
import QuizSection from '@/components/sections/QuizSection';
import GameSection from '@/components/sections/GameSection';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedGradient } from '@/components/AnimatedGradient';
import { Navbar } from '@/components/Navbar';
import { KonamiEasterEgg } from '@/components/KonamiEasterEgg';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <AnimatedGradient />
      <Navbar />
      <ThemeToggle />
      <KonamiEasterEgg />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <TimelineSection />
      <ProjectsSection />
      <CertificatesSection />
      <QuizSection />
      <GameSection />
      <PersonalLifeSection />
    </main>
  );
}
