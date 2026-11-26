import React from 'react';
import { SPECIMENS } from '../../data/pokemon';
import { type ArchiveSection, useArchive } from '../../store/archiveStore';

const NAV_ITEMS: { id: ArchiveSection; code: string; label: string }[] = [
  { id: 'hero', code: '01', label: 'HARDWARE' },
  { id: 'biomes', code: '02', label: 'BIOMES' },
  { id: 'telemetry', code: '03', label: 'TELEMETRY' },
  { id: 'vault', code: '04', label: 'CARD VAULT' },
];

export const TopNav: React.FC = () => {
  const { activeSection, activeSpecimen, scrollToSection } = useArchive();
  const specimen = SPECIMENS[activeSpecimen];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/[0.08] bg-[#090B0E]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-8">
        {/* Brand Lockup */}
        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          className="flex shrink-0 items-center gap-2 text-left transition-opacity hover:opacity-85 sm:gap-3"
        >
          <img
            src="/assets/svg/silph-wordmark.svg"
            alt="Silph Archive Mark"
            className="h-5 w-5 shrink-0 sm:h-6 sm:w-6"
          />
          <div className="flex flex-col">
            <span className="font-display text-xs font-bold tracking-[0.14em] text-[#E8E6E1] sm:text-sm sm:tracking-[0.16em]">
              SILPH ARCHIVE
            </span>
            <span className="hidden font-mono text-[10px] tracking-[0.2em] text-[#8E96A3] sm:block">
              KANTO-TO-PALDEA // VAULT v4.2
            </span>
          </div>
        </button>

        {/* Precision Section Nav */}
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary sections">
          {NAV_ITEMS.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                data-nav={item.id}
                className={`rounded-[3px] px-1.5 py-1 font-mono text-[10px] tracking-[0.08em] transition-all sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.12em] ${
                  active
                    ? 'border border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[#E8E6E1]'
                    : 'border border-transparent text-[#8E96A3] hover:border-white/10 hover:text-[#E8E6E1]'
                }`}
              >
                <span className="mr-1 hidden opacity-60 sm:inline">{item.code}</span>
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.label.slice(0, 4)}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Specimen Telemetry Tag */}
        <div className="hidden items-center gap-2.5 rounded-[3px] border border-white/[0.08] bg-[#12161C] px-3 py-1.5 lg:flex">
          <span
            className="h-2 w-2 rounded-full transition-colors duration-300"
            style={{ backgroundColor: specimen.accentPrimary, boxShadow: `0 0 8px ${specimen.accentPrimary}` }}
          />
          <span className="font-mono text-[11px] tracking-[0.14em] text-[#E8E6E1] tabular-nums">
            {specimen.dexNumber} {specimen.name.toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
};
