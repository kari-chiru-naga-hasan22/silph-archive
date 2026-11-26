import React, { useEffect, useState } from 'react';
import { SPECIMENS } from '../../data/pokemon';
import {
  ALL_TYPES,
  TYPE_META,
  formatMultiplier,
  getTypeMultiplier,
  type PokemonType,
} from '../../data/typeChart';
import { useArchive } from '../../store/archiveStore';

export const TypeEffectivenessMatrix: React.FC = () => {
  const { activeSpecimen } = useArchive();
  const specimen = SPECIMENS[activeSpecimen];

  const [attacker, setAttacker] = useState<PokemonType>('electric');
  const [defender1, setDefender1] = useState<PokemonType>(specimen.types[0]);
  const [defender2, setDefender2] = useState<PokemonType | null>(specimen.types[1] ?? null);

  useEffect(() => {
    setDefender1(specimen.types[0]);
    setDefender2(specimen.types[1] ?? null);
  }, [specimen]);

  const multiplier = getTypeMultiplier(attacker, defender1, defender2);

  const badgeTone =
    multiplier >= 4
      ? 'border-amber-400 bg-amber-500/20 text-amber-300'
      : multiplier >= 2
      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
      : multiplier === 0
      ? 'border-rose-500/60 bg-rose-500/15 text-rose-300'
      : multiplier < 1
      ? 'border-sky-400/50 bg-sky-500/15 text-sky-300'
      : 'border-white/15 bg-white/5 text-[#E8E6E1]';

  const statusText =
    multiplier >= 4
      ? 'QUAD SUPER EFFECTIVE'
      : multiplier >= 2
      ? 'SUPER EFFECTIVE'
      : multiplier === 0
      ? 'COMPLETE IMMUNITY'
      : multiplier === 0.25
      ? 'QUAD RESISTED'
      : multiplier < 1
      ? 'RESISTED'
      : 'NEUTRAL STRIKE';

  // Full defensive matchup breakdown for the current defender typing
  const weaknesses = ALL_TYPES.filter((t) => getTypeMultiplier(t, defender1, defender2) > 1);
  const resistances = ALL_TYPES.filter((t) => {
    const m = getTypeMultiplier(t, defender1, defender2);
    return m > 0 && m < 1;
  });
  const immunities = ALL_TYPES.filter((t) => getTypeMultiplier(t, defender1, defender2) === 0);

  return (
    <div className="hardware-panel-solid reticle-frame flex flex-col justify-between gap-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] text-[#8E96A3]">
            TACTICAL MATCHUP SIMULATOR // 18-TYPE MATRIX
          </div>
          <h3 className="mt-0.5 font-heading text-lg font-bold text-[#E8E6E1]">
            TYPE EFFECTIVENESS ENGINE
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            setDefender1(specimen.types[0]);
            setDefender2(specimen.types[1] ?? null);
          }}
          className="rounded-[3px] border border-white/15 bg-[#090B0E] px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-[#E8E6E1] hover:border-[var(--accent-primary)]"
        >
          SYNC TO {specimen.name.toUpperCase()}
        </button>
      </div>

      {/* Live Multiplier Readout Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[4px] border border-white/[0.08] bg-[#090B0E] p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <img src={TYPE_META[attacker].svgPath} alt={attacker} className="h-5 w-5" />
            <span className="font-mono text-xs font-semibold text-[#E8E6E1]">
              {TYPE_META[attacker].label.toUpperCase()}
            </span>
          </div>
          <span className="font-mono text-xs text-[#8E96A3]">→</span>
          <div className="flex items-center gap-1.5">
            <img src={TYPE_META[defender1].svgPath} alt={defender1} className="h-5 w-5" />
            <span className="font-mono text-xs font-semibold text-[#E8E6E1]">
              {TYPE_META[defender1].label.toUpperCase()}
            </span>
            {defender2 && defender2 !== defender1 && (
              <>
                <span className="text-[#8E96A3]">/</span>
                <img src={TYPE_META[defender2].svgPath} alt={defender2} className="h-5 w-5" />
                <span className="font-mono text-xs font-semibold text-[#E8E6E1]">
                  {TYPE_META[defender2].label.toUpperCase()}
                </span>
              </>
            )}
          </div>
        </div>

        <div className={`flex items-center gap-2.5 rounded-[3px] border px-3 py-1.5 ${badgeTone}`}>
          <span data-testid="type-multiplier" className="font-mono text-lg font-bold tabular-nums">
            {formatMultiplier(multiplier)}
          </span>
          <span className="font-mono text-[10px] tracking-[0.14em]">{statusText}</span>
        </div>
      </div>

      {/* Attacking & Defending Selectors */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 font-mono text-[10px] tracking-[0.16em] text-[#8E96A3]">
            ATTACKING MOVE TYPE
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {ALL_TYPES.map((t) => {
              const meta = TYPE_META[t];
              const active = attacker === t;
              return (
                <button
                  key={t}
                  type="button"
                  data-attack-type={t}
                  onClick={() => setAttacker(t)}
                  className={`flex items-center gap-1 rounded-[3px] border px-1.5 py-1 text-left transition-all ${
                    active
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)]'
                      : 'border-white/[0.06] bg-[#090B0E] hover:border-white/25'
                  }`}
                >
                  <img src={meta.svgPath} alt={meta.label} className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate font-mono text-[9px] text-[#E8E6E1]">
                    {meta.label.slice(0, 4).toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <div className="mb-1.5 font-mono text-[10px] tracking-[0.16em] text-[#8E96A3]">
              DEFENDER TYPING (PRIMARY / SECONDARY)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                aria-label="Primary defending type"
                data-defender-primary="true"
                value={defender1}
                onChange={(e) => setDefender1(e.target.value as PokemonType)}
                className="rounded-[3px] border border-white/15 bg-[#090B0E] px-2.5 py-1.5 font-mono text-xs text-[#E8E6E1] outline-none"
              >
                {ALL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_META[t].label.toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                aria-label="Secondary defending type"
                data-defender-secondary="true"
                value={defender2 ?? ''}
                onChange={(e) => setDefender2((e.target.value || null) as PokemonType | null)}
                className="rounded-[3px] border border-white/15 bg-[#090B0E] px-2.5 py-1.5 font-mono text-xs text-[#E8E6E1] outline-none"
              >
                <option value="">MONO TYPE</option>
                {ALL_TYPES.filter((t) => t !== defender1).map((t) => (
                  <option key={t} value={t}>
                    {TYPE_META[t].label.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Vulnerability & Resistance Matrix Pills */}
          <div className="space-y-2 rounded-[3px] border border-white/[0.06] bg-[#090B0E] p-3 font-mono text-[10px]">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-16 text-[#8E96A3]">WEAK:</span>
              {weaknesses.map((t) => {
                const m = getTypeMultiplier(t, defender1, defender2);
                return (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-[2px] border border-amber-400/35 bg-amber-500/10 px-1.5 py-0.5 text-amber-200"
                  >
                    <img src={TYPE_META[t].svgPath} alt="" className="h-3 w-3" />
                    {TYPE_META[t].label.slice(0, 3).toUpperCase()} {formatMultiplier(m)}
                  </span>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-16 text-[#8E96A3]">RESIST:</span>
              {resistances.slice(0, 6).map((t) => {
                const m = getTypeMultiplier(t, defender1, defender2);
                return (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-[2px] border border-sky-400/30 bg-sky-500/10 px-1.5 py-0.5 text-sky-200"
                  >
                    <img src={TYPE_META[t].svgPath} alt="" className="h-3 w-3" />
                    {TYPE_META[t].label.slice(0, 3).toUpperCase()} {formatMultiplier(m)}
                  </span>
                );
              })}
            </div>
            {immunities.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="w-16 text-[#8E96A3]">IMMUNE:</span>
                {immunities.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-[2px] border border-rose-400/35 bg-rose-500/10 px-1.5 py-0.5 text-rose-200"
                  >
                    <img src={TYPE_META[t].svgPath} alt="" className="h-3 w-3" />
                    {TYPE_META[t].label.toUpperCase()} 0x
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
