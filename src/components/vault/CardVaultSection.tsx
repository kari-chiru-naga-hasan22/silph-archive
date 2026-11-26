import React, { useState } from 'react';
import { Maximize2, Sparkles } from 'lucide-react';
import { SPECIMEN_ORDER, SPECIMENS, type SpecimenProfile } from '../../data/pokemon';
import { TYPE_META } from '../../data/typeChart';
import { type CardRarity, useArchive } from '../../store/archiveStore';

const RARITY_OPTIONS: { id: CardRarity; label: string; code: string; border: string }[] = [
  { id: 'illustration', label: 'ILLUSTRATION RARE', code: 'SIR // 01', border: '#E8E6E1' },
  { id: 'hypergold', label: 'HYPER GOLD', code: 'UR // 02', border: '#FACC15' },
  { id: 'secretprism', label: 'SECRET PRISM', code: 'SPR // 03', border: '#4DEEEA' },
];

const CollectorCardItem: React.FC<{
  specimen: SpecimenProfile;
  rarity: CardRarity;
  onInspect: () => void;
}> = ({ specimen, rarity, onInspect }) => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 50, py: 50, hover: false });
  const leadType = TYPE_META[specimen.types[0]];

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - y) * 18,
      ry: (x - 0.5) * 20,
      px: Math.round(x * 100),
      py: Math.round(y * 100),
      hover: true,
    });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0, px: 50, py: 50, hover: false });
  };

  const frameBorder =
    rarity === 'hypergold'
      ? 'border-amber-400/75'
      : rarity === 'secretprism'
      ? 'border-cyan-300/75'
      : 'border-white/25';

  const foilOverlay =
    rarity === 'hypergold'
      ? `radial-gradient(circle at ${tilt.px}% ${tilt.py}%, rgba(250,204,21,0.42), transparent 55%), linear-gradient(125deg, rgba(250,204,21,0.18), rgba(255,179,71,0.06), rgba(250,204,21,0.22))`
      : rarity === 'secretprism'
      ? `radial-gradient(circle at ${tilt.px}% ${tilt.py}%, rgba(77,238,234,0.42), transparent 55%), conic-gradient(from ${(tilt.px + tilt.py) * 1.4}deg at ${tilt.px}% ${tilt.py}%, rgba(255,77,26,0.2), rgba(245,196,0,0.2), rgba(16,185,129,0.22), rgba(14,165,233,0.22), rgba(255,77,26,0.2))`
      : `radial-gradient(circle at ${tilt.px}% ${tilt.py}%, rgba(255,255,255,0.28), transparent 52%), linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%)`;

  return (
    <div
      className="group relative"
      style={{ perspective: '1100px' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div
        role="button"
        tabIndex={0}
        data-card-id={specimen.id}
        onClick={onInspect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onInspect();
          }
        }}
        className={`relative aspect-[5/7] w-full cursor-pointer overflow-hidden rounded-[10px] border ${frameBorder} bg-[#0E1218] p-4 shadow-2xl transition-transform duration-150 ease-out`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.hover ? 1.025 : 1})`,
        }}
      >
        {/* LAYER 0: PhotoCraft Habitat Plate + MaterialCraft Holo Foil */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: `url(${specimen.backdropPath})`,
            transform: 'translateZ(0px)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-cover opacity-20 mix-blend-screen"
          style={{
            backgroundImage: `url('/assets/textures/pbr/holo_foil/baseColor.png')`,
            transform: 'translateZ(4px)',
          }}
        />

        {/* LAYER 1: Official Specimen Illustration Plate */}
        <div
          className="pointer-events-none absolute inset-x-4 bottom-28 top-14 z-10 flex items-center justify-center p-2"
          style={{ transform: 'translateZ(20px)' }}
        >
          <img
            src={specimen.imagePath}
            alt={specimen.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            style={{
              filter: `drop-shadow(0 12px 24px rgba(0,0,0,0.85)) drop-shadow(0 0 18px ${specimen.accentPrimary}55)`,
            }}
          />
        </div>

        {/* LAYER 2: EffectCraft VFX Sprite + Cursor Specular Holo Sheen */}
        <div
          className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat opacity-35 mix-blend-screen"
          style={{
            backgroundImage: `url(${specimen.vfxPath})`,
            transform: 'translateZ(30px)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            background: foilOverlay,
            opacity: tilt.hover ? 0.95 : 0.45,
            mixBlendMode: 'screen',
            transform: 'translateZ(34px)',
          }}
        />

        {/* LAYER 3: Foil Typography & Telemetry Overlay */}
        <div
          className="relative z-20 flex h-full flex-col justify-between"
          style={{ transform: 'translateZ(46px)' }}
        >
          {/* Top Card Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-[9px] tracking-[0.16em] text-[#A3ABB8]">
                {specimen.card.setCode} // {specimen.card.cardNumber}
              </div>
              <div className="font-display text-xl font-bold text-[#E8E6E1]">{specimen.name}</div>
            </div>
            <div className="flex items-center gap-1.5 rounded-[3px] border border-white/15 bg-[#090B0E]/85 px-2 py-1">
              <span className="font-mono text-xs font-bold tabular-nums text-[#E8E6E1]">
                {specimen.card.hp} HP
              </span>
              <img src={leadType.svgPath} alt={leadType.label} className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Bottom Attack & Inspection Block */}
          <div className="space-y-2 rounded-[4px] border border-white/15 bg-[#090B0E]/88 p-2.5 backdrop-blur-sm">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="font-semibold text-[#E8E6E1]">{specimen.card.attackOne.name}</span>
              <span className="tabular-nums" style={{ color: specimen.accentSecondary }}>
                {specimen.card.attackOne.damage}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.08] pt-1.5 font-mono text-[10px]">
              <span className="font-semibold text-[#E8E6E1]">{specimen.card.attackTwo.name}</span>
              <span className="tabular-nums font-bold" style={{ color: specimen.accentPrimary }}>
                {specimen.card.attackTwo.damage}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.08] pt-1.5 font-mono text-[9px] text-[#8E96A3]">
              <span>{rarity.toUpperCase()}</span>
              <span className="inline-flex items-center gap-1 text-[#E8E6E1]">
                <Maximize2 className="h-2.5 w-2.5" /> INSPECT 3D
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardVaultSection: React.FC = () => {
  const { cardRarity, setCardRarity, setInspectedCardId } = useArchive();

  return (
    <section
      id="section-vault"
      className="pointer-events-auto relative z-10 border-t border-white/[0.08] bg-[#090B0E]/96 px-4 pb-32 pt-24 sm:px-8"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-[#8E96A3]">
              <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--accent-primary)' }} />
              <span>CH-04 // HOLOGRAPHIC COLLECTOR CARD VAULT</span>
            </div>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#E8E6E1] sm:text-4xl">
              SPECIMEN PARALLAX FOIL EDITIONS
            </h2>
          </div>

          {/* Rarity Badge Switcher */}
          <div className="flex flex-wrap gap-1.5">
            {RARITY_OPTIONS.map((opt) => {
              const active = cardRarity === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  data-rarity={opt.id}
                  onClick={() => setCardRarity(opt.id)}
                  className={`rounded-[3px] border px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] transition-all ${
                    active
                      ? 'bg-white/10 text-[#E8E6E1]'
                      : 'border-white/10 bg-[#12161C] text-[#8E96A3] hover:text-[#E8E6E1]'
                  }`}
                  style={active ? { borderColor: opt.border } : undefined}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Tilt-Reactive Collector Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {SPECIMEN_ORDER.map((id) => (
            <CollectorCardItem
              key={id}
              specimen={SPECIMENS[id]}
              rarity={cardRarity}
              onInspect={() => setInspectedCardId(id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
