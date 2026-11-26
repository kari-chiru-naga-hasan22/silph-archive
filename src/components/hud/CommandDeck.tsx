import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sun, Moon, Cpu } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import { type QualityTier, useArchive } from '../../store/archiveStore';

const QUALITY_TIERS: { id: QualityTier; label: string }[] = [
  { id: 'ultra', label: 'ULTRA' },
  { id: 'balanced', label: 'BALANCED' },
  { id: 'eco', label: 'ECO' },
];

export const CommandDeck: React.FC = () => {
  const { audioEnabled, toggleAudio, lightingMood, setLightingMood, qualityTier, setQualityTier, fps } =
    useArchive();
  const [bars, setBars] = useState<number[]>(() => new Array(16).fill(0.14));

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 55) {
        last = now;
        if (audioEnabled) {
          setBars(soundEngine.getSpectrumBars(16));
        } else {
          setBars(
            Array.from({ length: 16 }, (_, i) => 0.14 + Math.sin(now * 0.002 + i * 0.6) * 0.05)
          );
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [audioEnabled]);

  return (
    <div className="pointer-events-none fixed bottom-2 left-0 right-0 z-40 flex justify-center px-2 sm:bottom-3 sm:px-3">
      <div className="pointer-events-auto hardware-panel flex max-w-[calc(100vw-16px)] flex-wrap items-center justify-center gap-1.5 px-2.5 py-1.5 shadow-2xl sm:gap-4 sm:px-4 sm:py-2">
        {/* Audio Engine + Live Mini Waveform */}
        <button
          type="button"
          data-action="toggle-audio"
          onClick={toggleAudio}
          className={`flex items-center gap-2.5 rounded-[3px] border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] transition-all ${
            audioEnabled
              ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[#E8E6E1]'
              : 'border-white/10 bg-[#090B0E]/80 text-[#8E96A3] hover:text-[#E8E6E1]'
          }`}
        >
          {audioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          <span>{audioEnabled ? 'AUDIO LIVE' : 'AUDIO MUTE'}</span>
          <div className="flex h-3.5 items-end gap-[2px]" aria-hidden="true">
            {bars.map((v, idx) => (
              <span
                key={idx}
                className="w-[2px] rounded-full transition-all duration-75"
                style={{
                  height: `${Math.round(v * 100)}%`,
                  backgroundColor: audioEnabled ? 'var(--accent-primary)' : '#5D6675',
                }}
              />
            ))}
          </div>
        </button>

        <div className="hidden h-5 w-px bg-white/10 sm:block" />

        {/* Lighting Mood Toggle */}
        <div className="flex items-center gap-1 rounded-[3px] border border-white/10 bg-[#090B0E]/80 p-0.5">
          <button
            type="button"
            data-lighting="studio"
            onClick={() => setLightingMood('studio')}
            className={`flex items-center gap-1.5 rounded-[2px] px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] transition-all ${
              lightingMood === 'studio'
                ? 'bg-[#E8E6E1] text-[#090B0E] font-semibold'
                : 'text-[#8E96A3] hover:text-[#E8E6E1]'
            }`}
          >
            <Sun className="h-3 w-3" />
            <span className="hidden sm:inline">STUDIO SHOWROOM</span>
            <span className="sm:hidden">STUDIO</span>
          </button>
          <button
            type="button"
            data-lighting="atmospheric"
            onClick={() => setLightingMood('atmospheric')}
            className={`flex items-center gap-1.5 rounded-[2px] px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] transition-all ${
              lightingMood === 'atmospheric'
                ? 'bg-[var(--accent-primary)] text-[#090B0E] font-semibold'
                : 'text-[#8E96A3] hover:text-[#E8E6E1]'
            }`}
          >
            <Moon className="h-3 w-3" />
            <span className="hidden sm:inline">ATMOSPHERIC BIOME</span>
            <span className="sm:hidden">BIOME</span>
          </button>
        </div>

        <div className="hidden h-5 w-px bg-white/10 sm:block" />

        {/* Live FPS & Quality Tier Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] tabular-nums text-[#E8E6E1]">
            <Cpu className="h-3 w-3 text-[#8E96A3]" />
            <span data-testid="fps-counter">{fps} FPS</span>
          </div>
          <div className="flex items-center gap-1 rounded-[3px] border border-white/10 bg-[#090B0E]/80 p-0.5">
            {QUALITY_TIERS.map((tier) => {
              const active = qualityTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  data-quality={tier.id}
                  onClick={() => setQualityTier(tier.id)}
                  className={`rounded-[2px] px-2 py-1 font-mono text-[10px] tracking-[0.1em] transition-all ${
                    active
                      ? 'bg-white/15 text-[#E8E6E1]'
                      : 'text-[#8E96A3] hover:text-[#E8E6E1]'
                  }`}
                >
                  {tier.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
