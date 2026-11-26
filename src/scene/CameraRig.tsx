import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useArchive } from '../store/archiveStore';

export const CameraRig: React.FC = () => {
  const { activeSection, cameraPreset, explodeProgress } = useArchive();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();

  const targetPos = useRef(new THREE.Vector3(0.45, 0.25, 4.1));
  const targetLook = useRef(new THREE.Vector3(0.15, 0.0, 0));
  const isTransitioning = useRef(false);

  const isMobile = size.width < 768;

  useEffect(() => {
    isTransitioning.current = true;

    if (activeSection === 'hero') {
      const zDist = isMobile ? 4.9 : 3.9 + explodeProgress * 0.45;
      const xOffset = isMobile ? 0.0 : -0.25;
      targetPos.current.set(xOffset, 0.28 + explodeProgress * 0.15, zDist);
      targetLook.current.set(isMobile ? 0.35 : 0.15, 0.04, 0);
      return;
    }

    if (activeSection === 'biomes') {
      const xBase = isMobile ? 0.35 : 0.15;
      switch (cameraPreset) {
        case 'hero':
          targetPos.current.set(xBase + 1.8, 1.35, isMobile ? 6.0 : 4.85);
          targetLook.current.set(xBase, 0.08, 0);
          break;
        case 'closeup':
          targetPos.current.set(xBase + 0.65, 0.65, 2.75);
          targetLook.current.set(xBase + 0.1, 0.32, 0);
          break;
        case 'aerial':
          targetPos.current.set(xBase + 0.4, 4.4, 3.85);
          targetLook.current.set(xBase, -0.2, 0);
          break;
        case 'orbit':
          targetPos.current.set(xBase + 2.4, 1.8, 5.1);
          targetLook.current.set(xBase, 0.1, 0);
          break;
      }
      return;
    }

    // Telemetry / Card Vault sections: calm subtle wide backdrop framing
    targetPos.current.set(0.2, 1.1, 6.2);
    targetLook.current.set(0.2, 0.0, 0);
  }, [activeSection, cameraPreset, explodeProgress, isMobile]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (activeSection === 'biomes' && cameraPreset === 'orbit') {
      if (isTransitioning.current && controlsRef.current) {
        camera.position.lerp(targetPos.current, 1 - Math.exp(-3.5 * dt));
        controlsRef.current.target.lerp(targetLook.current, 1 - Math.exp(-4.0 * dt));
        if (camera.position.distanceTo(targetPos.current) < 0.08) {
          isTransitioning.current = false;
        }
      }
      controlsRef.current?.update();
      return;
    }

    camera.position.lerp(targetPos.current, 1 - Math.exp(-4.2 * dt));
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, 1 - Math.exp(-4.5 * dt));
      controlsRef.current.update();
    } else {
      camera.lookAt(targetLook.current);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      enablePan={false}
      enableZoom={activeSection === 'biomes' && cameraPreset === 'orbit'}
      minDistance={2.2}
      maxDistance={8.5}
      maxPolarAngle={Math.PI * 0.56}
      minPolarAngle={0.22}
    />
  );
};
