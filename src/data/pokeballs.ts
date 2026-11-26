export type BallVariantId = 'pokeball' | 'ultraball' | 'premierball' | 'masterball';

export interface BallVariantSpec {
  id: BallVariantId;
  name: string;
  serial: string;
  catchRate: string;
  upperColor: string;
  lowerColor: string;
  bandColor: string;
  accentColor: string;
  coreColor: string;
  shellMetalness: number;
  shellRoughness: number;
  clearcoat: number;
  materialNote: string;
  seamPressure: string;
  hasUltraHStripe?: boolean;
  hasMasterCrest?: boolean;
}

export const BALL_VARIANTS: Record<BallVariantId, BallVariantSpec> = {
  pokeball: {
    id: 'pokeball',
    name: 'Classic Poké Ball',
    serial: 'SLPH-MK1 // 001',
    catchRate: '1.0x BASELINE',
    upperColor: '#D62B24',
    lowerColor: '#E8E6E1',
    bandColor: '#161A20',
    accentColor: '#FF4D1A',
    coreColor: '#FF6B3D',
    shellMetalness: 0.12,
    shellRoughness: 0.14,
    clearcoat: 1.0,
    materialNote: 'Ceramic Crimson Lacquer + Anodized Titanium Lower',
    seamPressure: '14.2 MPa',
  },
  ultraball: {
    id: 'ultraball',
    name: 'Ultra Ball',
    serial: 'SLPH-MK3 // 003',
    catchRate: '2.0x HIGH-TORQUE',
    upperColor: '#171A21',
    lowerColor: '#E8E6E1',
    bandColor: '#101318',
    accentColor: '#F5C400',
    coreColor: '#FFD13B',
    shellMetalness: 0.45,
    shellRoughness: 0.22,
    clearcoat: 0.85,
    materialNote: 'Carbon-Graphite Shell + Electroplated Gold H-Rails',
    seamPressure: '22.8 MPa',
    hasUltraHStripe: true,
  },
  premierball: {
    id: 'premierball',
    name: 'Premier Ball',
    serial: 'SLPH-LTD // 012',
    catchRate: '1.0x COMMEMORATIVE',
    upperColor: '#F1EFEA',
    lowerColor: '#EAE7E0',
    bandColor: '#C82222',
    accentColor: '#EF4444',
    coreColor: '#FF6B6B',
    shellMetalness: 0.08,
    shellRoughness: 0.11,
    clearcoat: 1.0,
    materialNote: 'Pure Alumina Ceramic Monocoque + Crimson Gasket',
    seamPressure: '16.0 MPa',
  },
  masterball: {
    id: 'masterball',
    name: 'Master Ball',
    serial: 'SLPH-PROTO // 000',
    catchRate: '255x ABSOLUTE LOCK',
    upperColor: '#3B1F5C',
    lowerColor: '#DFE3EC',
    bandColor: '#13161F',
    accentColor: '#E879F9',
    coreColor: '#38BDF8',
    shellMetalness: 0.62,
    shellRoughness: 0.18,
    clearcoat: 0.95,
    materialNote: 'Dual-Boss Titanium Alloy + M-Crest Containment Lock',
    seamPressure: '99.9 MPa',
    hasMasterCrest: true,
  },
};

export const BALL_VARIANT_ORDER: BallVariantId[] = [
  'pokeball',
  'ultraball',
  'premierball',
  'masterball',
];
