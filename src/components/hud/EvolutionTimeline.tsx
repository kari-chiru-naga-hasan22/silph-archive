import React, { useEffect, useState } from 'react';
import { SPECIMENS } from '../../data/pokemon';
import { TYPE_META } from '../../data/typeChart';
import { useArchive } from '../../store/archiveStore';

export const EvolutionTimeline: React.FC = () => {
  const { activeSpecimen } = useArchive();
  const specimen = SPECIMENS[activeSpecimen];
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    setStageIdx(Math.min(specimen.evolutions.length - 1, specimen.id === 'rayquaza' ? 0 : 2));
  }, [specimen]);

  const safeIdx = Math.min(stageIdx, specimen.evolutions.length - 1);
  const stage = specimen.evolutions[safeIdx];
  const maxHeight = Math.max(2.0, ...specimen.evolutions.map((e) => e.heightMeters));
  const moveTypeMeta = TYPE_META[stage.signatureMove.type];

  return (
    <div className="hardware-panel-solid reticle-frame p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] text-[#8E96A3]">
            MORPHOGENETIC TIMELINE // HEIGHT &amp; SIGNATURE MOVE ANALYSIS
          </div>
          <h3 className="mt-0.5 font-heading text-lg font-bold text-[#E8E6E1]">
            EVOLUTION SCALE &amp; FIELD TELEMETRY
          </h3>
        </div>

        {/* Horizontal Timeline Scrubber */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[#8E96A3]">STAGE SCRUB</span>
          <input
            type="range"
            min={0}
            max={specimen.evolutions.length - 1}
            step={1}
            value={safeIdx}
            onChange={(e) => setStageIdx(Number(e.target.value))}
            aria-label="Evolution timeline stage scrubber"
            data-testid="evolution-scrubber"
            className="silph-slider w-36"
          />
          <span className="font-mono text-xs tabular-nums text-[#E8E6E1]">
            {safeIdx + 1}/{specimen.evolutions.length}
          </span>
        </div>
      </div>

      {/* Stage Stepper + Silhouettes */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-7">
          {specimen.evolutions.map((ev, idx) => {
            const active = idx === safeIdx;
            const heightPct = Math.max(26, Math.round((ev.heightMeters / maxHeight) * 100));
            return (
              <button
                key={ev.name}
                type="button"
                data-evo-stage={idx}
                onClick={() => setStageIdx(idx)}
                className={`flex flex-col justify-between rounded-[4px] border p-3 text-left transition-all ${
                  active
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)]'
                    : 'border-white/[0.07] bg-[#090B0E] hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[9px] text-[#8E96A3]">
                  <span className="shrink-0">{ev.dex}</span>
                  <span className="truncate">{ev.trigger}</span>
                </div>

                <div className="my-3 flex h-24 items-end justify-center border-b border-white/[0.08] pb-1">
                  <div
                    className="flex items-end justify-center"
                    style={{ height: `${heightPct}%`, width: `${heightPct}%` }}
                  >
                    <img
                      src={ev.imagePath}
                      alt={ev.name}
                      className="h-full w-full object-contain transition-all duration-300"
                      style={{
                        filter: active
                          ? `drop-shadow(0 0 12px ${specimen.accentPrimary}88)`
                          : 'drop-shadow(0 4px 10px rgba(0,0,0,0.75)) saturate(0.85) opacity(0.88)',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="font-heading text-xs font-semibold text-[#E8E6E1]">{ev.name}</div>
                  <div className="mt-0.5 font-mono text-[10px] tabular-nums text-[#8E96A3]">
                    {ev.heightMeters.toFixed(1)}m // {ev.weightKg.toFixed(1)}kg
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Signature Move & Scale Reference */}
        <div className="flex flex-col justify-between rounded-[4px] border border-white/[0.08] bg-[#090B0E] p-4 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-[#8E96A3]">
              <span>SELECTED STAGE // {stage.dex}</span>
              <span style={{ color: specimen.accentSecondary }}>{stage.trigger}</span>
            </div>

            <div className="mt-1.5 flex items-baseline justify-between">
              <h4 className="font-display text-2xl font-bold text-[#E8E6E1]">
                {stage.name.toUpperCase()}
              </h4>
              <span className="font-mono text-xs tabular-nums text-[#8E96A3]">
                1.8m HUMAN REF: {(stage.heightMeters / 1.8).toFixed(2)}×
              </span>
            </div>

            {/* Height comparison meter */}
            <div className="mt-3 space-y-1.5 font-mono text-[10px]">
              <div className="flex items-center justify-between text-[#8E96A3]">
                <span>PHYSICAL SCALE VS RESEARCHER (1.8m)</span>
                <span className="tabular-nums text-[#E8E6E1]">{stage.heightMeters}m</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-[2px] bg-white/10">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((stage.heightMeters / maxHeight) * 100))}%`,
                    backgroundColor: specimen.accentPrimary,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-white/[0.08] pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={moveTypeMeta.svgPath} alt={moveTypeMeta.label} className="h-4 w-4" />
                <span className="font-heading text-sm font-bold text-[#E8E6E1]">
                  {stage.signatureMove.name}
                </span>
              </div>
              <span className="rounded-[2px] border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[#8E96A3]">
                {stage.signatureMove.category.toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#A3ABB8]">{stage.signatureMove.note}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px]">
              <div className="rounded-[2px] bg-[#12161C] px-2 py-1">
                <span className="text-[#8E96A3]">PWR </span>
                <span className="tabular-nums text-[#E8E6E1]">{stage.signatureMove.power}</span>
              </div>
              <div className="rounded-[2px] bg-[#12161C] px-2 py-1">
                <span className="text-[#8E96A3]">ACC </span>
                <span className="tabular-nums text-[#E8E6E1]">{stage.signatureMove.accuracy}</span>
              </div>
              <div className="rounded-[2px] bg-[#12161C] px-2 py-1">
                <span className="text-[#8E96A3]">PP </span>
                <span className="tabular-nums text-[#E8E6E1]">{stage.signatureMove.pp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
