import React from 'react';
import { useArchive } from '../../store/archiveStore';
import { VolcanicCaldera } from './VolcanicCaldera';
import { IonStormSpire } from './IonStormSpire';
import { AbyssalTide } from './AbyssalTide';
import { OrbitalStratosphere } from './OrbitalStratosphere';

export const BiomeStage: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { activeSpecimen, qualityTier } = useArchive();

  if (!visible) return null;

  return (
    <group position={[0.35, -0.15, 0]}>
      {activeSpecimen === 'charizard' && <VolcanicCaldera quality={qualityTier} />}
      {activeSpecimen === 'pikachu' && <IonStormSpire quality={qualityTier} />}
      {activeSpecimen === 'greninja' && <AbyssalTide quality={qualityTier} />}
      {activeSpecimen === 'rayquaza' && <OrbitalStratosphere quality={qualityTier} />}
    </group>
  );
};
