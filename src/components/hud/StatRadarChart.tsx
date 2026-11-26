import React from 'react';
import { motion } from 'framer-motion';
import { SPECIMEN_ORDER, SPECIMENS, type BaseStats } from '../../data/pokemon';
import { useArchive } from '../../store/archiveStore';

const STAT_KEYS: { key: keyof BaseStats; label: string }[] = [
  { key: 'hp', label: 'HP' },
  { key: 'atk', label: 'ATK' },
  { key: 'def', label: 'DEF' },
  { key: 'spa', label: 'SP.A' },
  { key: 'spd', label: 'SP.D' },
  { key: 'spe', label: 'SPE' },
];

const MAX_STAT = 160;
const CX = 150;
const CY = 140;
const RADIUS = 96;

function polarPoint(index: number, value: number): [number, number] {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / 6;
  const r = (Math.min(MAX_STAT, value) / MAX_STAT) * RADIUS;
  return [CX + Math.cos(angle) * r, CY + Math.sin(angle) * r];
}

function statsToPoints(stats: BaseStats): string {
  return STAT_KEYS.map((s, i) => {
    const [x, y] = polarPoint(i, stats[s.key]);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

export const StatRadarChart: React.FC = () => {
  const { activeSpecimen, compareSpecimen, setCompareSpecimen } = useArchive();
  const primary = SPECIMENS[activeSpecimen];
  const secondary = compareSpecimen && compareSpecimen !== activeSpecimen ? SPECIMENS[compareSpecimen] : null;

  const primaryTotal = Object.values(primary.stats).reduce((a, b) => a + b, 0);
  const secondaryTotal = secondary ? Object.values(secondary.stats).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="hardware-panel-solid reticle-frame flex flex-col justify-between p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] text-[#8E96A3]">
            BASE STAT HEX RADAR
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="font-heading text-lg font-bold text-[#E8E6E1]">
              {primary.name.toUpperCase()}
            </span>
            <span className="font-mono text-xs tabular-nums" style={{ color: primary.accentPrimary }}>
              BST {primaryTotal}
            </span>
          </div>
        </div>

        {/* Comparison Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-[#8E96A3]">VS:</span>
          <select
            aria-label="Compare specimen stats"
            value={compareSpecimen ?? ''}
            onChange={(e) => setCompareSpecimen((e.target.value || null) as typeof activeSpecimen | null)}
            className="rounded-[3px] border border-white/15 bg-[#090B0E] px-2.5 py-1 font-mono text-[11px] text-[#E8E6E1] outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="">None</option>
            {SPECIMEN_ORDER.filter((id) => id !== activeSpecimen).map((id) => (
              <option key={id} value={id}>
                {SPECIMENS[id].name} ({Object.values(SPECIMENS[id].stats).reduce((a, b) => a + b, 0)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SVG Hex Radar */}
      <div className="my-3 flex items-center justify-center">
        <svg viewBox="0 0 300 280" className="w-full max-w-[300px]">
          {/* Concentric Reference Hexagons */}
          {[0.25, 0.5, 0.75, 1].map((tier) => (
            <polygon
              key={tier}
              points={STAT_KEYS.map((_, i) => {
                const [x, y] = polarPoint(i, MAX_STAT * tier);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              }).join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth={1}
            />
          ))}

          {/* Spokes & Labels */}
          {STAT_KEYS.map((stat, i) => {
            const [xEnd, yEnd] = polarPoint(i, MAX_STAT);
            const [xLbl, yLbl] = polarPoint(i, MAX_STAT + 26);
            return (
              <g key={stat.key}>
                <line
                  x1={CX}
                  y1={CY}
                  x2={xEnd}
                  y2={yEnd}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={1}
                />
                <text
                  x={xLbl}
                  y={yLbl + 3}
                  textAnchor="middle"
                  className="fill-[#8E96A3] font-mono text-[10px]"
                >
                  {stat.label}
                </text>
              </g>
            );
          })}

          {/* Secondary Compare Polygon */}
          {secondary && (
            <motion.polygon
              initial={false}
              animate={{ points: statsToPoints(secondary.stats) }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              fill={secondary.accentSecondary}
              fillOpacity={0.14}
              stroke={secondary.accentSecondary}
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          )}

          {/* Primary Specimen Polygon */}
          <motion.polygon
            initial={false}
            animate={{ points: statsToPoints(primary.stats) }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            fill={primary.accentPrimary}
            fillOpacity={0.28}
            stroke={primary.accentPrimary}
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* Stat Readout Table */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-3 sm:grid-cols-6">
        {STAT_KEYS.map((stat) => {
          const val = primary.stats[stat.key];
          const compVal = secondary ? secondary.stats[stat.key] : null;
          const diff = compVal !== null ? val - compVal : null;
          return (
            <div
              key={stat.key}
              className="rounded-[3px] border border-white/[0.06] bg-[#090B0E] px-2 py-1.5 text-center"
            >
              <div className="font-mono text-[9px] text-[#8E96A3]">{stat.label}</div>
              <div className="font-mono text-sm font-semibold tabular-nums text-[#E8E6E1]">
                {val}
              </div>
              {diff !== null && (
                <div
                  className={`font-mono text-[9px] tabular-nums ${
                    diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-rose-400' : 'text-[#8E96A3]'
                  }`}
                >
                  {diff > 0 ? `+${diff}` : diff}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {secondary && (
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[#8E96A3]">
          <span>
            DELTA VS {secondary.name.toUpperCase()}:{' '}
            <strong className="text-[#E8E6E1]">
              {primaryTotal - secondaryTotal >= 0
                ? `+${primaryTotal - secondaryTotal}`
                : primaryTotal - secondaryTotal}{' '}
              BST
            </strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: secondary.accentSecondary }}
            />
            {secondary.name.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};
