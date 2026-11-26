import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { ArchiveProvider, type ArchiveSection, useArchive } from './store/archiveStore';
import { StageCanvas } from './scene/StageCanvas';
import { TopNav } from './components/hud/TopNav';
import { HeroOverlay } from './components/hud/HeroOverlay';
import { BiomeOverlay } from './components/hud/BiomeOverlay';
import { TelemetrySection } from './components/hud/TelemetrySection';
import { CardVaultSection } from './components/vault/CardVaultSection';
import { CardInspectorModal } from './components/vault/CardInspectorModal';
import { CommandDeck } from './components/hud/CommandDeck';

const ArchiveExperience: React.FC = () => {
  const { setActiveSection, inspectedCardId, setScrollExplodeProgress } = useArchive();

  // Initialize Lenis smooth scroll + scroll-scrubbed Pokeball disassembly
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      const heroEl = document.getElementById('section-hero');
      const heroH = heroEl?.offsetHeight || 900;
      const start = heroH * 0.08;
      const end = heroH * 0.62;
      const t = Math.min(1, Math.max(0, (scroll - start) / (end - start)));
      setScrollExplodeProgress(t);
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [setScrollExplodeProgress]);

  // Sync activeSection cleanly via IntersectionObserver as user scrolls
  useEffect(() => {
    const sections: ArchiveSection[] = ['hero', 'biomes', 'telemetry', 'vault'];
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { id: ArchiveSection; ratio: number } | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('section-', '') as ArchiveSection;
            if (!best || entry.intersectionRatio > best.ratio) {
              best = { id, ratio: entry.intersectionRatio };
            }
          }
        }
        if (best) setActiveSection(best.id);
      },
      { threshold: [0.35, 0.55] }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(`section-${sec}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveSection]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#090B0E] text-[#E8E6E1]">
      {/* Persistent 60 FPS WebGL Stage */}
      <StageCanvas />

      {/* Subtle architectural film grain */}
      <div className="film-grain pointer-events-none fixed inset-0 z-30 opacity-60" />

      {/* Top Navigation */}
      <TopNav />

      {/* Main Continuous Scroll Experience */}
      <main className="pointer-events-none relative z-10">
        <HeroOverlay />
        <BiomeOverlay />
        <TelemetrySection />
        <CardVaultSection />
      </main>

      {/* Bottom Sound, Lighting & Quality Deck */}
      <CommandDeck />

      {/* Full-Screen WebGL Card Inspector */}
      {inspectedCardId && <CardInspectorModal />}
    </div>
  );
};

export function App() {
  return (
    <ArchiveProvider>
      <ArchiveExperience />
    </ArchiveProvider>
  );
}

export default App;
