import React from 'react';
import { Crosshair, Layers, Radio } from 'lucide-react';
import { BALL_VARIANT_ORDER, BALL_VARIANTS } from '../../data/pokeballs';
import { useArchive } from '../../store/archiveStore';

export const HeroOverlay: React.FC = () => {
  const {
    activeBall,
    setActiveBall,
    explodeProgress,
    setExplodeProgress,
    toggleExploded,
    triggerCapturePulse,
    scrollToSection,
  } = useArchive();

  const ball = BALL_VARIANTS[activeBall];

  return (
    <section
      id="section-hero"
      className="pointer-events-none relative z-10 flex min-h-screen items-center px-4 pb-24 pt-20 sm:px-8"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Editorial & Hardware Control Column */}
        <div className="pointer-events-auto flex flex-col gap-5 lg:col-span-5">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-[#8E96A3]">
            <img src="/assets/svg/hud-reticle.svg" alt="" className="h-4 w-4 opacity-80" />
            <span>CH-01 // CONTAINMENT HARDWARE</span>
          </div>

          <h1 className="font-display text-[clamp(1.45rem,6.1vw,3.75rem)] font-extrabold leading-[0.98] tracking-tight text-[#E8E6E1]">
            CAPTURE
            <br />
            <span style={{ color: ball.accentColor }} className="transition-colors duration-300">
              ARCHITECTURE
            </span>
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-[#A3ABB8]">
            Precision-lathed containment sphere engineered with anodized titanium chassis rings,
            dual copper-coil induction stators, and a resonant prismatic core. Drag anywhere on the
            stage to inspect surface reflections, or click the center latch directly.
          </p>

          {/* Ball Variant Switcher */}
          <div className="hardware-panel reticle-frame p-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-[#8E96A3]">
              <span>VARIANT SELECTOR</span>
              <span className="tabular-nums text-[#E8E6E1]">{ball.serial}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {BALL_VARIANT_ORDER.map((id) => {
                const v = BALL_VARIANTS[id];
                const isActive = activeBall === id;
                return (
                  <button
                    key={id}
                    type="button"
                    data-ball-variant={id}
                    onClick={() => setActiveBall(id)}
                    className={`flex flex-col items-start gap-1.5 rounded-[3px] border px-3 py-2 text-left transition-all ${
                      isActive
                        ? 'border-white/30 bg-white/[0.08]'
                        : 'border-white/[0.07] bg-[#090B0E]/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span
                        className="h-3 w-3 rounded-full border border-white/25"
                        style={{
                          background: `linear-gradient(180deg, ${v.upperColor} 50%, ${v.lowerColor} 50%)`,
                        }}
                      />
                      {isActive && (
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: v.accentColor }}
                        />
                      )}
                    </div>
                    <span className="font-heading text-xs font-semibold text-[#E8E6E1]">
                      {v.name.replace('Classic ', '')}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] pt-3 font-mono text-[10px] text-[#8E96A3]">
              <span>{ball.materialNote}</span>
              <span className="tabular-nums text-[#E8E6E1]">{ball.catchRate}</span>
            </div>
          </div>

          {/* Exploded-View Inspection & Capture Pulse Controls */}
          <div className="hardware-panel p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                data-action="toggle-exploded"
                onClick={toggleExploded}
                className={`flex items-center gap-2 rounded-[3px] border px-3.5 py-2 font-mono text-xs tracking-[0.12em] transition-all ${
                  explodeProgress > 0.25
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[#E8E6E1]'
                    : 'border-white/15 bg-[#090B0E]/80 text-[#E8E6E1] hover:border-white/35'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>{explodeProgress > 0.25 ? 'COLLAPSE ASSEMBLY' : 'EXPLODED VIEW'}</span>
              </button>

              <button
                type="button"
                data-action="capture-pulse"
                onClick={triggerCapturePulse}
                className="flex items-center gap-2 rounded-[3px] border px-3.5 py-2 font-mono text-xs tracking-[0.12em] text-[#090B0E] transition-transform active:scale-95"
                style={{
                  backgroundColor: ball.accentColor,
                  borderColor: ball.accentColor,
                }}
              >
                <Radio className="h-3.5 w-3.5" />
                <span>CAPTURE PULSE</span>
              </button>
            </div>

            {/* Precision Disassembly Scrubber */}
            <div className="mt-4 flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.16em] text-[#8E96A3]">
                DISASSEMBLY
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(explodeProgress * 100)}
                onChange={(e) => setExplodeProgress(Number(e.target.value) / 100)}
                aria-label="Pokeball disassembly progress"
                className="silph-slider flex-1"
              />
              <span className="w-10 text-right font-mono text-[11px] tabular-nums text-[#E8E6E1]">
                {Math.round(explodeProgress * 100)}%
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-3 font-mono text-[10px]">
              <div>
                <div className="text-[#8E96A3]">SEAM SEAL</div>
                <div className="mt-0.5 tabular-nums text-[#E8E6E1]">{ball.seamPressure}</div>
              </div>
              <div>
                <div className="text-[#8E96A3]">COIL STATOR</div>
                <div className="mt-0.5 text-[#E8E6E1]">CU-99.9%</div>
              </div>
              <div>
                <div className="text-[#8E96A3]">CORE STATE</div>
                <div className="mt-0.5 text-[#E8E6E1]">
                  {explodeProgress > 0.25 ? 'EXPOSED' : 'SEALED'}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection('biomes')}
            className="flex w-fit items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[#8E96A3] transition-colors hover:text-[#E8E6E1]"
          >
            <Crosshair className="h-3.5 w-3.5" style={{ color: 'var(--accent-primary)' }} />
            <span>ENTER BIOME SPECIMEN VAULT →</span>
          </button>
        </div>

        {/* Right Stage Spacer (Leaves 3D Pokeball unobstructed) */}
        <div className="pointer-events-none hidden items-end justify-end lg:col-span-7 lg:flex">
          <div className="hardware-panel px-3.5 py-2 font-mono text-[10px] tracking-[0.16em] text-[#8E96A3]">
            INTERACTIVE 3D STAGE // CLICK CENTER LATCH OR DRAG TO ORBIT
          </div>
        </div>
      </div>
    </section>
  );
};
