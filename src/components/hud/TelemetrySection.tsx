import React from 'react';
import { SPECIMEN_ORDER, SPECIMENS } from '../../data/pokemon';
import { useArchive } from '../../store/archiveStore';
import { StatRadarChart } from './StatRadarChart';
import { TypeEffectivenessMatrix } from './TypeEffectivenessMatrix';
import { EvolutionTimeline } from './EvolutionTimeline';

export const TelemetrySection: React.FC = () => {
  const { activeSpecimen, setActiveSpecimen } = useArchive();

  return (
    <section
      id="section-telemetry"
      className="pointer-events-auto relative z-10 border-t border-white/[0.08] bg-[#090B0E]/92 px-4 pb-28 pt-24 sm:px-8"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8">
        {/* Section Header + Quick Specimen Selector */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-[11px] tracking-[0.22em] text-[#8E96A3]">
              CH-03 // TACTICAL POKÉDEX TELEMETRY
            </div>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#E8E6E1] sm:text-4xl">
              BIOLOGICAL ANALYTICS &amp; COMBAT MATRIX
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SPECIMEN_ORDER.map((id) => {
              const s = SPECIMENS[id];
              const active = activeSpecimen === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSpecimen(id)}
                  className={`rounded-[3px] border px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] transition-all ${
                    active
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[#E8E6E1]'
                      : 'border-white/10 bg-[#12161C] text-[#8E96A3] hover:text-[#E8E6E1]'
                  }`}
                >
                  {s.dexNumber} {s.name.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Analytics Bento Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <StatRadarChart />
          </div>
          <div className="xl:col-span-7">
            <TypeEffectivenessMatrix />
          </div>
        </div>

        <EvolutionTimeline />
      </div>
    </section>
  );
};
