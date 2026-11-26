import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useArchive } from '../store/archiveStore';
import { PokeballAssembly } from './PokeballAssembly';
import { BiomeStage } from './biomes/BiomeStage';
import { CameraRig } from './CameraRig';
import { LightingRig } from './LightingRig';

const FpsProbe: React.FC = () => {
  const { reportFps } = useArchive();
  const framesRef = useRef(0);
  const accTimeRef = useRef(0);

  useFrame((_, delta) => {
    framesRef.current += 1;
    accTimeRef.current += delta;
    if (accTimeRef.current >= 0.5) {
      const measured = Math.min(144, Math.max(15, Math.round(framesRef.current / accTimeRef.current)));
      reportFps(measured);
      framesRef.current = 0;
      accTimeRef.current = 0;
    }
  });

  return null;
};

export const StageCanvas: React.FC = () => {
  const { activeSection, qualityTier } = useArchive();

  const dpr: [number, number] | number =
    qualityTier === 'ultra' ? [1, 2] : qualityTier === 'balanced' ? [1, 1.5] : 1;

  const showPokeball = activeSection === 'hero';
  const showBiome = activeSection !== 'hero';
  const isStageDimmed = activeSection === 'telemetry' || activeSection === 'vault';

  return (
    <div
      className="fixed inset-0 z-0 transition-opacity duration-500"
      style={{ opacity: isStageDimmed ? 0.24 : 1 }}
      aria-hidden="true"
    >
      <Canvas
        shadows={qualityTier !== 'eco'}
        dpr={dpr}
        camera={{ position: [-0.25, 0.28, 3.9], fov: 40, near: 0.1, far: 60 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      >
        <LightingRig />
        <CameraRig />
        <PokeballAssembly visible={showPokeball} />
        <BiomeStage visible={showBiome} />
        <FpsProbe />

        {qualityTier !== 'eco' && (
          <EffectComposer multisampling={0}>
            <Bloom
              mipmapBlur
              luminanceThreshold={0.85}
              luminanceSmoothing={0.22}
              intensity={qualityTier === 'ultra' ? 0.65 : 0.38}
            />
            <Vignette eskil={false} offset={0.22} darkness={0.58} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};
