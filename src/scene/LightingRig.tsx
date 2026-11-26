import React from 'react';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { SPECIMENS } from '../data/pokemon';
import { useArchive } from '../store/archiveStore';

export const LightingRig: React.FC = () => {
  const { activeSpecimen, lightingMood, qualityTier, activeSection } = useArchive();
  const specimen = SPECIMENS[activeSpecimen];
  const isStudio = lightingMood === 'studio';
  const shadowsOn = qualityTier !== 'eco';

  return (
    <>
      <color attach="background" args={[isStudio ? '#0C0F14' : '#090B0E']} />
      <fog
        attach="fog"
        args={[isStudio ? '#0C0F14' : '#090B0E', isStudio ? 9 : 6.5, isStudio ? 22 : 16]}
      />

      {/* Ambient + Hemisphere Fill */}
      <ambientLight intensity={isStudio ? 0.55 : 0.25} />
      <hemisphereLight
        args={[
          isStudio ? '#E8E6E1' : specimen.accentSecondary,
          '#090B0E',
          isStudio ? 0.75 : 0.45,
        ]}
      />

      {/* Key Directional Light */}
      <directionalLight
        position={[4.2, 6.0, 4.5]}
        intensity={isStudio ? 2.4 : 1.75}
        color={isStudio ? '#FFFDF8' : '#E8E6E1'}
        castShadow={shadowsOn}
        shadow-mapSize-width={qualityTier === 'ultra' ? 2048 : 1024}
        shadow-mapSize-height={qualityTier === 'ultra' ? 2048 : 1024}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />

      {/* Rim Accent Light */}
      <directionalLight
        position={[-4.5, 2.2, -3.5]}
        intensity={isStudio ? 1.1 : 1.85}
        color={isStudio ? '#C7D2FE' : specimen.accentPrimary}
      />

      {/* Secondary Low Fill */}
      <pointLight
        position={[2.5, -1.2, 2.5]}
        intensity={isStudio ? 0.6 : 1.1}
        color={isStudio ? '#E8E6E1' : specimen.accentSecondary}
        distance={9}
      />

      {/* Local Procedural Softbox Environment (Zero external network fetches) */}
      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer
            form="circle"
            intensity={isStudio ? 2.6 : 1.5}
            color="#FFFFFF"
            scale={[6, 6, 1]}
            position={[0, 5, -4]}
          />
          <Lightformer
            form="circle"
            intensity={isStudio ? 1.5 : 1.6}
            color={isStudio ? '#E8E6E1' : specimen.accentSecondary}
            scale={[5, 5, 1]}
            position={[-5, 2, 2]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="ring"
            intensity={isStudio ? 1.1 : 1.8}
            color={isStudio ? '#DCE4F0' : specimen.accentPrimary}
            scale={4}
            position={[4, -2, -3]}
            target={[0, 0, 0]}
          />
        </group>
      </Environment>

      {/* Architectural Ground Grid & Contact Shadows */}
      {shadowsOn && (
        <ContactShadows
          position={[0.35, -1.15, 0]}
          opacity={isStudio ? 0.45 : 0.6}
          scale={8}
          blur={2.2}
          far={3.5}
        />
      )}

      {activeSection === 'hero' && (
        <gridHelper
          args={[18, 28, isStudio ? '#2C3442' : '#1E2530', '#13171E']}
          position={[0, -1.22, 0]}
        />
      )}
    </>
  );
};
