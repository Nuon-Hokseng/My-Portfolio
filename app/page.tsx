'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import SkillsSection from '@/components/sections/SkillsSection';
import TimelineSection from '@/components/sections/TimelineSection';
import CertificatesSection from '@/components/sections/CertificatesSection';
import ProjectsSection from 'components/sections/ProjectsSection';
import PersonalLifeSection from '@/components/sections/PersonalLifeSection';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedGradient } from '@/components/AnimatedGradient';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <AnimatedGradient />
      <ThemeToggle />
      <HeroSection />
      <SkillsSection />
      <TimelineSection />
      <CertificatesSection />
      <ProjectsSection />
      <PersonalLifeSection />
    </main>
  );
}
