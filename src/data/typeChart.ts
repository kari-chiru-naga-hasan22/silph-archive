export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export const ALL_TYPES: PokemonType[] = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

export const TYPE_META: Record<PokemonType, { label: string; color: string; svgPath: string }> = {
  normal: { label: 'Normal', color: '#E8E6E1', svgPath: '/assets/svg/type-normal.svg' },
  fire: { label: 'Fire', color: '#FF4D1A', svgPath: '/assets/svg/type-fire.svg' },
  water: { label: 'Water', color: '#0EA5E9', svgPath: '/assets/svg/type-water.svg' },
  electric: { label: 'Electric', color: '#F5C400', svgPath: '/assets/svg/type-electric.svg' },
  grass: { label: 'Grass', color: '#22C55E', svgPath: '/assets/svg/type-grass.svg' },
  ice: { label: 'Ice', color: '#67E8F9', svgPath: '/assets/svg/type-ice.svg' },
  fighting: { label: 'Fighting', color: '#F87171', svgPath: '/assets/svg/type-fighting.svg' },
  poison: { label: 'Poison', color: '#A855F7', svgPath: '/assets/svg/type-poison.svg' },
  ground: { label: 'Ground', color: '#EA580C', svgPath: '/assets/svg/type-ground.svg' },
  flying: { label: 'Flying', color: '#93C5FD', svgPath: '/assets/svg/type-flying.svg' },
  psychic: { label: 'Psychic', color: '#F472B6', svgPath: '/assets/svg/type-psychic.svg' },
  bug: { label: 'Bug', color: '#84CC16', svgPath: '/assets/svg/type-bug.svg' },
  rock: { label: 'Rock', color: '#D97706', svgPath: '/assets/svg/type-rock.svg' },
  ghost: { label: 'Ghost', color: '#818CF8', svgPath: '/assets/svg/type-ghost.svg' },
  dragon: { label: 'Dragon', color: '#10B981', svgPath: '/assets/svg/type-dragon.svg' },
  dark: { label: 'Dark', color: '#94A3B8', svgPath: '/assets/svg/type-dark.svg' },
  steel: { label: 'Steel', color: '#CBD5E1', svgPath: '/assets/svg/type-steel.svg' },
  fairy: { label: 'Fairy', color: '#F9A8D4', svgPath: '/assets/svg/type-fairy.svg' },
};

// Standard Gen VI+ type chart: ATTACKER -> DEFENDER -> multiplier
const CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export function getTypeMultiplier(
  attacker: PokemonType,
  defenderPrimary: PokemonType,
  defenderSecondary: PokemonType | null = null
): number {
  const m1 = CHART[attacker]?.[defenderPrimary] ?? 1;
  const m2 =
    defenderSecondary && defenderSecondary !== defenderPrimary
      ? CHART[attacker]?.[defenderSecondary] ?? 1
      : 1;
  return m1 * m2;
}

export function formatMultiplier(mult: number): string {
  if (mult === 0) return '0x';
  if (mult === 0.25) return '0.25x';
  if (mult === 0.5) return '0.5x';
  if (mult === 1) return '1x';
  if (mult === 2) return '2x';
  if (mult === 4) return '4x';
  return `${mult}x`;
}
