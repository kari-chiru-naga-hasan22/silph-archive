import type { PokemonType } from './typeChart';

export type SpecimenId = 'charizard' | 'pikachu' | 'greninja' | 'rayquaza';

export interface BaseStats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface EvolutionStage {
  name: string;
  dex: string;
  heightMeters: number;
  weightKg: number;
  trigger: string;
  imagePath: string;
  signatureMove: {
    name: string;
    type: PokemonType;
    category: 'Physical' | 'Special' | 'Status';
    power: number | string;
    accuracy: string;
    pp: number;
    note: string;
  };
  silhouetteVariant: 'quadruped' | 'biped-mid' | 'winged-apex' | 'rodent-small' | 'rodent-mid' | 'rodent-tall' | 'amphibian-small' | 'amphibian-mid' | 'shinobi-apex' | 'serpent-apex' | 'serpent-mega';
}

export interface SpecimenProfile {
  id: SpecimenId;
  dexNumber: string;
  name: string;
  classification: string;
  region: string;
  biomeName: string;
  coordinates: string;
  ambientTemp: string;
  accentPrimary: string;
  accentSecondary: string;
  types: [PokemonType] | [PokemonType, PokemonType];
  ability: string;
  hiddenAbility: string;
  stats: BaseStats;
  lore: string;
  imagePath: string;
  backdropPath: string;
  vfxPath: string;
  evolutions: EvolutionStage[];
  card: {
    setCode: string;
    cardNumber: string;
    hp: number;
    attackOne: { name: string; cost: string; damage: string; desc: string };
    attackTwo: { name: string; cost: string; damage: string; desc: string };
    weakness: PokemonType;
    resistance: PokemonType | null;
    retreatCost: number;
    illustrator: string;
  };
}

export const SPECIMENS: Record<SpecimenId, SpecimenProfile> = {
  charizard: {
    id: 'charizard',
    dexNumber: '#0006',
    name: 'Charizard',
    classification: 'Flame Specimen // Thermal Apex',
    region: 'Kanto — Mt. Ember Caldera',
    biomeName: 'Volcanic Caldera',
    coordinates: '21.408° N // 139.812° E',
    ambientTemp: '1,340 °C MAGMA VENT',
    accentPrimary: '#FF4D1A',
    accentSecondary: '#FFB347',
    types: ['fire', 'flying'],
    ability: 'Blaze',
    hiddenAbility: 'Solar Power',
    stats: { hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100 },
    lore: 'Core combustion sustains a perpetual tail-tip plasma plume exceeding 1,400 K. Wing membranes channel volcanic updrafts into rapid supersonic dive trajectories.',
    imagePath: '/assets/pokemon/charizard.png',
    backdropPath: '/assets/backdrops/bg-charizard.png',
    vfxPath: '/assets/vfx/vfx-ember.png',
    evolutions: [
      {
        name: 'Charmander',
        dex: '#0004',
        heightMeters: 0.6,
        weightKg: 8.5,
        trigger: 'BASE SPECIMEN',
        imagePath: '/assets/pokemon/charmander.png',
        silhouetteVariant: 'biped-mid',
        signatureMove: {
          name: 'Ember',
          type: 'fire',
          category: 'Special',
          power: 40,
          accuracy: '100%',
          pp: 25,
          note: 'Projects concentrated thermal sparks with 10% ignition risk.',
        },
      },
      {
        name: 'Charmeleon',
        dex: '#0005',
        heightMeters: 1.1,
        weightKg: 19.0,
        trigger: 'LEVEL 16',
        imagePath: '/assets/pokemon/charmeleon.png',
        silhouetteVariant: 'biped-mid',
        signatureMove: {
          name: 'Flame Burst',
          type: 'fire',
          category: 'Special',
          power: 70,
          accuracy: '100%',
          pp: 15,
          note: 'Ruptures a superheated fireball across adjacent targets.',
        },
      },
      {
        name: 'Charizard',
        dex: '#0006',
        heightMeters: 1.7,
        weightKg: 90.5,
        trigger: 'LEVEL 36',
        imagePath: '/assets/pokemon/charizard.png',
        silhouetteVariant: 'winged-apex',
        signatureMove: {
          name: 'Blast Burn',
          type: 'fire',
          category: 'Special',
          power: 150,
          accuracy: '90%',
          pp: 5,
          note: 'Detonates a caldera-grade thermal shockwave; requires 1 turn cooldown.',
        },
      },
      {
        name: 'Mega Charizard X',
        dex: '#0006-MX',
        heightMeters: 1.7,
        weightKg: 110.5,
        trigger: 'CHARIZARDITE X',
        imagePath: '/assets/pokemon/mega-charizard-x.png',
        silhouetteVariant: 'winged-apex',
        signatureMove: {
          name: 'Flare Blitz',
          type: 'fire',
          category: 'Physical',
          power: 120,
          accuracy: '100%',
          pp: 15,
          note: 'Blue-plasma kinetic cloak amplified by Tough Claws resonance.',
        },
      },
    ],
    card: {
      setCode: 'SLPH-SV01',
      cardNumber: '199/165',
      hp: 330,
      attackOne: {
        name: 'Caldera Ignition',
        cost: 'FIRE ×1',
        damage: '80+',
        desc: 'Accelerates 2 basic Fire energies from the specimen vault.',
      },
      attackTwo: {
        name: 'Obsidian Infernal',
        cost: 'FIRE ×2 // COLORLESS',
        damage: '240',
        desc: 'Deals 30 additional thermal damage per active containment tier.',
      },
      weakness: 'water',
      resistance: 'grass',
      retreatCost: 2,
      illustrator: 'SILPH LABS // BIO-RENDER',
    },
  },
  pikachu: {
    id: 'pikachu',
    dexNumber: '#0025',
    name: 'Pikachu',
    classification: 'Mouse Specimen // Bio-Capacitor',
    region: 'Kanto — Power Plant Spire',
    biomeName: 'Ion Storm Spire',
    coordinates: '35.676° N // 139.650° E',
    ambientTemp: '480 kV ARC FIELD',
    accentPrimary: '#F5C400',
    accentSecondary: '#4DEEEA',
    types: ['electric'],
    ability: 'Static',
    hiddenAbility: 'Lightning Rod',
    stats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
    lore: 'Subdermal cheek pouches store high-density bio-capacitance recharged during REM sleep. Ear-tips act as twin dipole lightning rods grounding ambient ion fronts.',
    imagePath: '/assets/pokemon/pikachu.png',
    backdropPath: '/assets/backdrops/bg-pikachu.png',
    vfxPath: '/assets/vfx/vfx-spark.png',
    evolutions: [
      {
        name: 'Pichu',
        dex: '#0172',
        heightMeters: 0.3,
        weightKg: 2.0,
        trigger: 'BASE SPECIMEN',
        imagePath: '/assets/pokemon/pichu.png',
        silhouetteVariant: 'rodent-small',
        signatureMove: {
          name: 'Thunder Shock',
          type: 'electric',
          category: 'Special',
          power: 40,
          accuracy: '100%',
          pp: 30,
          note: 'Discharges low-amperage static pulses from immature cheek sacs.',
        },
      },
      {
        name: 'Pikachu',
        dex: '#0025',
        heightMeters: 0.4,
        weightKg: 6.0,
        trigger: 'HIGH FRIENDSHIP',
        imagePath: '/assets/pokemon/pikachu.png',
        silhouetteVariant: 'rodent-mid',
        signatureMove: {
          name: 'Volt Tackle',
          type: 'electric',
          category: 'Physical',
          power: 120,
          accuracy: '100%',
          pp: 15,
          note: 'Wraps the body in a 100,000-volt plasma corona at extreme velocity.',
        },
      },
      {
        name: 'Raichu',
        dex: '#0026',
        heightMeters: 0.8,
        weightKg: 30.0,
        trigger: 'THUNDER STONE',
        imagePath: '/assets/pokemon/raichu.png',
        silhouetteVariant: 'rodent-tall',
        signatureMove: {
          name: 'Thunder',
          type: 'electric',
          category: 'Special',
          power: 110,
          accuracy: '70%',
          pp: 10,
          note: 'Uses coiled ground-wire tail to stabilize megavolt atmospheric strikes.',
        },
      },
    ],
    card: {
      setCode: 'SLPH-SV02',
      cardNumber: '238/191',
      hp: 200,
      attackOne: {
        name: 'Arc Resonance',
        cost: 'ELECTRIC ×1',
        damage: '60',
        desc: 'Induces static lock on defending hardware; draws 1 card.',
      },
      attackTwo: {
        name: 'Topaz Bolt',
        cost: 'ELECTRIC ×2 // COLORLESS',
        damage: '220',
        desc: 'Bypasses active deflection barriers via ion arc discharge.',
      },
      weakness: 'ground',
      resistance: 'steel',
      retreatCost: 1,
      illustrator: 'SILPH LABS // ION-RENDER',
    },
  },
  greninja: {
    id: 'greninja',
    dexNumber: '#0658',
    name: 'Greninja',
    classification: 'Ninja Specimen // Hydro-Acoustic',
    region: 'Kalos — Abyssal Tide Basin',
    biomeName: 'Abyssal Tide',
    coordinates: '48.856° N // 002.352° E',
    ambientTemp: '6.4 °C TIDAL SURGE',
    accentPrimary: '#0EA5E9',
    accentSecondary: '#BAE6FD',
    types: ['water', 'dark'],
    ability: 'Torrent',
    hiddenAbility: 'Protean',
    stats: { hp: 72, atk: 95, def: 67, spa: 103, spd: 71, spe: 122 },
    lore: 'Compresses pelagic water under extreme hydrodynamic pressure into crystalline four-blade throwing stars capable of shearing hardened basalt in silent strikes.',
    imagePath: '/assets/pokemon/greninja.png',
    backdropPath: '/assets/backdrops/bg-greninja.png',
    vfxPath: '/assets/vfx/vfx-mist.png',
    evolutions: [
      {
        name: 'Froakie',
        dex: '#0656',
        heightMeters: 0.3,
        weightKg: 7.0,
        trigger: 'BASE SPECIMEN',
        imagePath: '/assets/pokemon/froakie.png',
        silhouetteVariant: 'amphibian-small',
        signatureMove: {
          name: 'Water Pulse',
          type: 'water',
          category: 'Special',
          power: 60,
          accuracy: '100%',
          pp: 20,
          note: 'Emits ultrasonic shock rings encased in pressurized foam.',
        },
      },
      {
        name: 'Frogadier',
        dex: '#0657',
        heightMeters: 0.6,
        weightKg: 10.9,
        trigger: 'LEVEL 16',
        imagePath: '/assets/pokemon/frogadier.png',
        silhouetteVariant: 'amphibian-mid',
        signatureMove: {
          name: 'Liquidation',
          type: 'water',
          category: 'Physical',
          power: 85,
          accuracy: '100%',
          pp: 10,
          note: 'Channels vertical leap momentum into a high-pressure blade slash.',
        },
      },
      {
        name: 'Greninja',
        dex: '#0658',
        heightMeters: 1.5,
        weightKg: 40.0,
        trigger: 'LEVEL 36',
        imagePath: '/assets/pokemon/greninja.png',
        silhouetteVariant: 'shinobi-apex',
        signatureMove: {
          name: 'Water Shuriken',
          type: 'water',
          category: 'Special',
          power: '15×5',
          accuracy: '100%',
          pp: 20,
          note: 'Priority hydro-compressed vortex stars fired at 2–5 rapid bursts.',
        },
      },
      {
        name: 'Ash-Greninja',
        dex: '#0658-B',
        heightMeters: 1.5,
        weightKg: 40.0,
        trigger: 'BATTLE BOND',
        imagePath: '/assets/pokemon/ash-greninja.png',
        silhouetteVariant: 'shinobi-apex',
        signatureMove: {
          name: 'Synchronized Shuriken',
          type: 'water',
          category: 'Special',
          power: '20×3',
          accuracy: '100%',
          pp: 20,
          note: 'Resonance-coupled crimson hydro vortex with guaranteed 3-hit cadence.',
        },
      },
    ],
    card: {
      setCode: 'SLPH-SV03',
      cardNumber: '214/167',
      hp: 310,
      attackOne: {
        name: 'Shinobi Blade',
        cost: 'WATER ×1',
        damage: '170',
        desc: 'Search archive vault for any tactical specimen card.',
      },
      attackTwo: {
        name: 'Abyssal Mirage',
        cost: 'WATER ×1 // DARK ×2',
        damage: '120×2',
        desc: 'Splits hydro-pressure across 2 opposing field targets simultaneously.',
      },
      weakness: 'electric',
      resistance: 'psychic',
      retreatCost: 1,
      illustrator: 'SILPH LABS // HYDRO-RENDER',
    },
  },
  rayquaza: {
    id: 'rayquaza',
    dexNumber: '#0384',
    name: 'Rayquaza',
    classification: 'Sky High Specimen // Ozone Sovereign',
    region: 'Hoenn — Orbital Sky Pillar',
    biomeName: 'Orbital Stratosphere',
    coordinates: '31.988° N // 130.958° E',
    ambientTemp: '-56 °C MESOPAUSE',
    accentPrimary: '#10B981',
    accentSecondary: '#FACC15',
    types: ['dragon', 'flying'],
    ability: 'Air Lock',
    hiddenAbility: 'Delta Stream',
    stats: { hp: 105, atk: 150, def: 90, spa: 150, spd: 90, spe: 95 },
    lore: 'Lives indefinitely inside the upper ozone belt, metabolizing atmospheric moisture and meteoric dust inside its mikado-organ to unleash orbital plasma dives.',
    imagePath: '/assets/pokemon/rayquaza.png',
    backdropPath: '/assets/backdrops/bg-rayquaza.png',
    vfxPath: '/assets/vfx/vfx-plasma.png',
    evolutions: [
      {
        name: 'Rayquaza',
        dex: '#0384',
        heightMeters: 7.0,
        weightKg: 206.5,
        trigger: 'OZONE RESONANCE',
        imagePath: '/assets/pokemon/rayquaza.png',
        silhouetteVariant: 'serpent-apex',
        signatureMove: {
          name: 'Dragon Ascent',
          type: 'flying',
          category: 'Physical',
          power: 120,
          accuracy: '100%',
          pp: 5,
          note: 'Ascends into upper stratosphere before plunging as a hypersonic emerald lance.',
        },
      },
      {
        name: 'Mega Rayquaza',
        dex: '#0384-M',
        heightMeters: 10.8,
        weightKg: 392.0,
        trigger: 'MIKADO ORGAN // NO STONE',
        imagePath: '/assets/pokemon/mega-rayquaza.png',
        silhouetteVariant: 'serpent-mega',
        signatureMove: {
          name: 'Delta Emerald Dive',
          type: 'dragon',
          category: 'Special',
          power: 150,
          accuracy: '100%',
          pp: 5,
          note: 'Triggers Delta Stream turbulence, neutralizing all flying-type aerial hazards.',
        },
      },
    ],
    card: {
      setCode: 'SLPH-SV04',
      cardNumber: '218/203',
      hp: 340,
      attackOne: {
        name: 'Azure Stratosphere',
        cost: 'COLORLESS ×1',
        damage: '—',
        desc: 'Refreshes orbital telemetry cycle and charges 3 plasma energies.',
      },
      attackTwo: {
        name: 'Max Burst Ascent',
        cost: 'FIRE ×1 // ELECTRIC ×1',
        damage: '280+',
        desc: 'Ignites emerald meteor plasma scaling exponentially with charged orbitals.',
      },
      weakness: 'ice',
      resistance: 'fighting',
      retreatCost: 2,
      illustrator: 'SILPH LABS // ORBITAL-RENDER',
    },
  },
};

export const SPECIMEN_ORDER: SpecimenId[] = ['charizard', 'pikachu', 'greninja', 'rayquaza'];
