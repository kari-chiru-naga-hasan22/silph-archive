import React from 'react';
import type { EvolutionStage, SpecimenId } from '../../data/pokemon';

export const StageSilhouette: React.FC<{
  variant: EvolutionStage['silhouetteVariant'];
  accent: string;
  active?: boolean;
}> = ({ variant, accent, active = false }) => {
  const fill = active ? accent : '#E8E6E1';
  const stroke = active ? '#E8E6E1' : 'rgba(232,230,225,0.45)';

  const paths: Record<EvolutionStage['silhouetteVariant'], string> = {
    quadruped: 'M20 68 L28 42 L48 36 L68 42 L76 68 L64 68 L60 54 L36 54 L32 68 Z',
    'biped-mid': 'M36 22 C44 16 56 18 58 28 L62 46 L78 58 L70 64 L56 54 L54 78 L34 78 L36 52 L24 44 Z',
    'winged-apex':
      'M50 18 L58 10 L62 24 L88 12 L84 44 L62 48 L58 76 L42 76 L38 48 L16 44 L12 12 L38 24 L42 10 Z',
    'rodent-small': 'M38 30 L32 14 L44 26 L56 26 L68 14 L62 30 L64 62 L36 62 Z',
    'rodent-mid': 'M36 28 L24 8 L42 22 L58 22 L76 8 L64 28 L68 68 L54 68 L52 54 L48 54 L46 68 L32 68 Z',
    'rodent-tall':
      'M34 26 L20 12 L42 20 L58 20 L80 12 L66 26 L68 72 L32 72 Z M68 56 L86 36 L88 22',
    'amphibian-small': 'M30 42 C30 28 70 28 70 42 L74 68 L26 68 Z',
    'amphibian-mid': 'M34 30 L44 20 L56 20 L66 30 L72 68 L28 68 Z',
    'shinobi-apex':
      'M50 14 L74 28 L62 38 L78 62 L58 74 L50 58 L42 74 L22 62 L38 38 L26 28 Z',
    'serpent-apex':
      'M26 22 L46 14 L62 26 L44 38 L74 52 L54 72 L24 68 L44 52 L22 38 Z',
    'serpent-mega':
      'M22 14 L52 10 L76 26 L48 40 L84 54 L60 78 L18 72 L46 52 L16 36 Z',
  };

  return (
    <svg viewBox="0 0 100 88" className="h-full w-full overflow-visible">
      <path
        d={paths[variant]}
        fill={fill}
        fillOpacity={active ? 0.28 : 0.14}
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SpecimenCardIllustration: React.FC<{
  id: SpecimenId;
  primary: string;
  secondary: string;
}> = ({ id, primary, secondary }) => {
  if (id === 'charizard') {
    return (
      <svg viewBox="0 0 260 200" className="h-full w-full">
        <defs>
          <linearGradient id="cz-wing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={primary} stopOpacity="0.88" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <circle cx="130" cy="96" r="64" fill="none" stroke={secondary} strokeOpacity="0.28" strokeDasharray="3 5" />
        <path
          d="M130 34 L144 16 L148 44 L226 18 L208 98 L158 106 L150 166 L110 166 L102 106 L52 98 L34 18 L112 44 L116 16 Z"
          fill="url(#cz-wing)"
          stroke="#E8E6E1"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M130 62 L144 114 L130 156 L116 114 Z" fill="#090B0E" fillOpacity="0.7" stroke={secondary} strokeWidth="1.2" />
        <circle cx="130" cy="48" r="5" fill={secondary} />
      </svg>
    );
  }
  if (id === 'pikachu') {
    return (
      <svg viewBox="0 0 260 200" className="h-full w-full">
        <circle cx="130" cy="100" r="66" fill="none" stroke={secondary} strokeOpacity="0.35" strokeDasharray="4 4" />
        <path
          d="M96 66 L66 18 L110 50 L150 50 L194 18 L164 66 L176 138 L148 138 L138 168 L122 168 L112 138 L84 138 Z"
          fill={primary}
          fillOpacity="0.28"
          stroke="#E8E6E1"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M148 118 L194 74 L174 74 L208 38" fill="none" stroke={secondary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="96" cy="98" r="8" fill="#EF4444" fillOpacity="0.85" />
        <circle cx="164" cy="98" r="8" fill="#EF4444" fillOpacity="0.85" />
      </svg>
    );
  }
  if (id === 'greninja') {
    return (
      <svg viewBox="0 0 260 200" className="h-full w-full">
        <circle cx="130" cy="100" r="68" fill="none" stroke={secondary} strokeOpacity="0.32" strokeWidth="1.2" />
        <path
          d="M130 16 L152 78 L214 100 L152 122 L130 184 L108 122 L46 100 L108 78 Z"
          fill={primary}
          fillOpacity="0.32"
          stroke={secondary}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="130" cy="100" r="24" fill="#090B0E" fillOpacity="0.78" stroke="#E8E6E1" strokeWidth="1.5" />
        <path d="M84 134 C112 114 148 114 188 144" fill="none" stroke="#DF4A6E" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 260 200" className="h-full w-full">
      <circle cx="130" cy="100" r="72" fill="none" stroke={secondary} strokeOpacity="0.35" strokeDasharray="6 4" />
      <path
        d="M52 144 C76 112 98 128 118 96 C138 64 104 42 136 22 C164 36 184 68 158 106 C132 144 176 154 206 116"
        fill="none"
        stroke={primary}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M52 144 C76 112 98 128 118 96 C138 64 104 42 136 22 C164 36 184 68 158 106 C132 144 176 154 206 116"
        fill="none"
        stroke={secondary}
        strokeWidth="2"
        strokeDasharray="4 10"
        strokeLinecap="round"
      />
      <polygon points="136,12 152,28 136,36 120,28" fill={secondary} />
    </svg>
  );
};
