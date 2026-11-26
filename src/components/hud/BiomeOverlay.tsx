import React from 'react';
import { Camera, Compass, MapPin } from 'lucide-react';
import { SPECIMEN_ORDER, SPECIMENS } from '../../data/pokemon';
import { TYPE_META } from '../../data/typeChart';
import { type CameraPreset, useArchive } from '../../store/archiveStore';

const CAMERA_PRESETS: { id: CameraPreset; label: string }[] = [
  { id: 'hero', label: 'HERO' },
  { id: 'closeup', label: 'CLOSE-UP' },
  { id: 'aerial', label: 'BIOME AERIAL' },
  { id: 'orbit', label: 'FREE ORBIT' },
];

export const BiomeOverlay: React.FC = () => {
  const { activeSpecimen, setActiveSpecimen, cameraPreset, setCameraPreset, scrollToSection } =
    useArchive();
  const specimen = SPECIMENS[activeSpecimen];

  return (
    <section
      id="section-biomes"
      className="pointer-events-none relative z-10 flex min-h-screen flex-col justify-between px-4 py-24 sm:px-8"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-between gap-8">
        {/* Top Row: Specimen Identity + Camera Presets */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="pointer-events-auto hardware-panel reticle-frame max-w-md p-5">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[#8E96A3]">
              <span>CH-02 // BIOME TERRARIUM</span>
              <span className="tabular-nums" style={{ color: specimen.accentPrimary }}>
                {specimen.dexNumber}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-display text-[clamp(1.6rem,6.5vw,2.25rem)] font-extrabold tracking-tight text-[#E8E6E1]">
                {specimen.name.toUpperCase()}
              </h2>
              <span className="font-mono text-xs text-[#8E96A3]">{specimen.biomeName}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {specimen.types.map((t) => {
                const meta = TYPE_META[t];
                return (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-[3px] border border-white/10 bg-[#090B0E]/80 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-[#E8E6E1]"
                  >
                    <img src={meta.svgPath} alt={meta.label} className="h-3.5 w-3.5" />
                    {meta.label.toUpperCase()}
                  </span>
                );
              })}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-[#A3ABB8]">{specimen.lore}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-3 font-mono text-[10px]">
              <div>
                <div className="flex items-center gap-1 text-[#8E96A3]">
                  <MapPin className="h-3 w-3" />
                  COORDINATES
                </div>
                <div className="mt-0.5 tabular-nums text-[#E8E6E1]">{specimen.coordinates}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#8E96A3]">
                  <Compass className="h-3 w-3" />
                  FIELD READING
                </div>
                <div className="mt-0.5 tabular-nums" style={{ color: specimen.accentSecondary }}>
                  {specimen.ambientTemp}
                </div>
              </div>
            </div>
          </div>

          {/* Cinematic Camera Rig Controls */}
          <div className="pointer-events-auto hardware-panel flex flex-col gap-2 p-3 lg:items-end">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-[#8E96A3]">
              <Camera className="h-3.5 w-3.5" />
              <span>CAMERA RIG PRESETS</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CAMERA_PRESETS.map((p) => {
                const active = cameraPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    data-camera-preset={p.id}
                    onClick={() => setCameraPreset(p.id)}
                    className={`rounded-[3px] border px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] transition-all ${
                      active
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[#E8E6E1]'
                        : 'border-white/10 bg-[#090B0E]/75 text-[#8E96A3] hover:border-white/25 hover:text-[#E8E6E1]'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Specimen Selector Dock */}
        <div className="pointer-events-auto flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-end">
          <div className="hardware-panel flex-1 p-3 sm:max-w-2xl">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-[#8E96A3]">
              <span>SPECIMEN SELECTOR DOCK</span>
              <span>4 ARCHIVED APEX UNITS</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SPECIMEN_ORDER.map((id) => {
                const sp = SPECIMENS[id];
                const active = activeSpecimen === id;
                const leadType = TYPE_META[sp.types[0]];
                return (
                  <button
                    key={id}
                    type="button"
                    data-specimen-select={id}
                    onClick={() => setActiveSpecimen(id)}
                    className={`flex flex-col gap-1 rounded-[3px] border px-3 py-2 text-left transition-all ${
                      active
                        ? 'bg-white/[0.08]'
                        : 'border-white/[0.08] bg-[#090B0E]/70 hover:border-white/25'
                    }`}
                    style={
                      active
                        ? { borderColor: sp.accentPrimary, boxShadow: `0 0 18px ${sp.accentPrimary}22` }
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tabular-nums text-[#8E96A3]">
                        {sp.dexNumber}
                      </span>
                      <img src={leadType.svgPath} alt={leadType.label} className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-heading text-xs font-semibold text-[#E8E6E1]">
                      {sp.name}
                    </span>
                    <span className="truncate font-mono text-[9px] text-[#8E96A3]">
                      {sp.biomeName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection('telemetry')}
            className="hardware-panel px-4 py-3 font-mono text-[11px] tracking-[0.16em] text-[#E8E6E1] transition-colors hover:border-[var(--accent-primary)]"
          >
            OPEN POKÉDEX TELEMETRY →
          </button>
        </div>
      </div>
    </section>
  );
};
