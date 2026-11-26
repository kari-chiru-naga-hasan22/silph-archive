import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { loadPbrTextureSet } from '../textures';
import { createCausticWaterMaterial } from '../shaders/causticWaterShader';
import { SpecimenRelief3D } from './SpecimenRelief3D';
import type { QualityTier } from '../../store/archiveStore';

export const AbyssalTide: React.FC<{ quality: QualityTier }> = ({ quality }) => {
  const slateMaps = useMemo(() => loadPbrTextureSet('wet_slate', 2), []);
  const waterMat = useMemo(() => createCausticWaterMaterial(), []);

  const totemRef = useRef<THREE.Group>(null);
  const shurikenRef = useRef<THREE.Group>(null);
  const orbitRingRef = useRef<THREE.Group>(null);
  const dropletsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const dropletCount = quality === 'ultra' ? 160 : quality === 'balanced' ? 90 : 35;

  useEffect(() => {
    return () => {
      waterMat.dispose();
    };
  }, [waterMat]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    waterMat.uniforms.uTime.value = t;

    if (totemRef.current) {
      totemRef.current.position.y = 0.08 + Math.sin(t * 1.6) * 0.05;
      totemRef.current.rotation.y = Math.sin(t * 0.42) * 0.16;
    }
    if (shurikenRef.current) {
      shurikenRef.current.rotation.z = t * 5.2;
    }
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.y = t * 1.15;
    }
    if (dropletsRef.current) {
      for (let i = 0; i < dropletCount; i++) {
        const a = (i / dropletCount) * Math.PI * 2 + t * 0.55;
        const r = 0.9 + (i % 7) * 0.18;
        const y = -0.35 + ((t * 0.7 + i * 0.21) % 1.85);
        dummy.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
        dummy.scale.setScalar(0.022 + (i % 3) * 0.008);
        dummy.updateMatrix();
        dropletsRef.current.setMatrixAt(i, dummy.matrix);
      }
      dropletsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* WET-SLATE TIDAL BASIN PLINTH */}
      <mesh position={[0, -0.82, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.4, 2.65, 0.46, 32]} />
        <meshStandardMaterial
          color="#111A26"
          map={slateMaps.map}
          normalMap={slateMaps.normalMap}
          roughnessMap={slateMaps.roughnessMap}
          roughness={0.22}
          metalness={0.25}
        />
      </mesh>

      {/* ANIMATED GLSL CAUSTIC WATER SURFACE */}
      <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]} material={waterMat}>
        <circleGeometry args={[2.32, 64]} />
      </mesh>

      {/* Stepped Slate Stepping Monoliths */}
      {[0.7, 2.8, 4.9].map((ang, i) => (
        <mesh
          key={i}
          position={[Math.cos(ang) * 1.5, -0.5, Math.sin(ang) * 1.5]}
          rotation={[0, ang, 0]}
          castShadow
        >
          <boxGeometry args={[0.55, 0.34, 0.42]} />
          <meshStandardMaterial color="#182534" roughness={0.24} metalness={0.3} />
        </mesh>
      ))}

      {/* GRENINJA 3D VOLUMETRIC SPECIMEN RELIEF + DORSAL WATER SHURIKEN */}
      <group ref={totemRef} position={[0, 0.08, 0]}>
        <SpecimenRelief3D
          specimenId="greninja"
          accent="#0EA5E9"
          size={2.18}
          displacementScale={0.34}
          position={[0, 0.42, 0]}
          quality={quality}
        />

        {/* DORSAL 4-BLADE TRANSLUCENT WATER SHURIKEN */}
        <group ref={shurikenRef} position={[0, 0.45, -0.46]}>
          {[0, 1, 2, 3].map((blade) => (
            <mesh
              key={blade}
              rotation={[0, 0, (blade * Math.PI) / 2]}
              position={[
                Math.cos((blade * Math.PI) / 2) * 0.48,
                Math.sin((blade * Math.PI) / 2) * 0.48,
                0,
              ]}
            >
              <coneGeometry args={[0.18, 0.85, 4]} />
              <meshPhysicalMaterial
                color="#38BDF8"
                emissive="#0EA5E9"
                emissiveIntensity={0.65}
                roughness={0.1}
                metalness={0.15}
                transmission={0.45}
                transparent
                opacity={0.88}
              />
            </mesh>
          ))}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.32, 0.035, 12, 32]} />
            <meshStandardMaterial color="#BAE6FD" emissive="#0EA5E9" emissiveIntensity={1.2} />
          </mesh>
        </group>
      </group>

      {/* FLOATING ORBITAL SHURIKEN HYDRO-RING */}
      <group ref={orbitRingRef} position={[0, -0.05, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.45, 0.018, 10, 64]} />
          <meshStandardMaterial color="#BAE6FD" emissive="#0EA5E9" emissiveIntensity={1.1} />
        </mesh>
      </group>

      {/* HYDRO DROPLET STREAM */}
      <instancedMesh ref={dropletsRef} args={[undefined, undefined, dropletCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#BAE6FD" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </instancedMesh>
      <pointLight color="#0EA5E9" intensity={2.0} distance={5} position={[0, 0.6, 0.6]} />
    </group>
  );
};
