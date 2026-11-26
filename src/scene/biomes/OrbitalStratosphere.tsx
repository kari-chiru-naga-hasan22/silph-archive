import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { loadPbrTextureSet } from '../textures';
import { createOrbitalVortexMaterial } from '../shaders/orbitalVortexShader';
import { SpecimenRelief3D } from './SpecimenRelief3D';
import type { QualityTier } from '../../store/archiveStore';

export const OrbitalStratosphere: React.FC<{ quality: QualityTier }> = ({ quality }) => {
  const titaniumMaps = useMemo(() => loadPbrTextureSet('titanium_brushed', 2), []);
  const vortexMat = useMemo(() => createOrbitalVortexMaterial(), []);

  const serpentGroupRef = useRef<THREE.Group>(null);
  const ribbonRef = useRef<THREE.Mesh>(null);
  const orbitalRingRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const dustCount = quality === 'ultra' ? 200 : quality === 'balanced' ? 100 : 35;

  // Emerald plasma trailing helix wrapping the diorama
  const ribbonGeo = useMemo(() => {
    const ribbonPts: THREE.Vector3[] = [];
    const total = 60;
    for (let i = 0; i <= total; i++) {
      const u = i / total;
      const angle = u * Math.PI * 3.1;
      const radius = 1.28 - u * 0.26;
      const y = -0.35 + u * 1.75;
      ribbonPts.push(
        new THREE.Vector3(
          Math.cos(angle + 0.5) * radius,
          y,
          Math.sin(angle + 0.5) * radius
        )
      );
    }
    const rCurve = new THREE.CatmullRomCurve3(ribbonPts);
    return new THREE.TubeGeometry(rCurve, 64, 0.024, 8, false);
  }, []);

  useEffect(() => {
    return () => {
      vortexMat.dispose();
      ribbonGeo.dispose();
    };
  }, [vortexMat, ribbonGeo]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    vortexMat.uniforms.uTime.value = t;

    if (serpentGroupRef.current) {
      serpentGroupRef.current.rotation.y = Math.sin(t * 0.42) * 0.24;
      serpentGroupRef.current.position.y = Math.sin(t * 1.3) * 0.06;
    }
    if (ribbonRef.current) {
      ribbonRef.current.rotation.y = t * 0.55;
    }
    if (orbitalRingRef.current) {
      orbitalRingRef.current.rotation.z = -t * 0.35;
    }
    if (dustRef.current) {
      for (let i = 0; i < dustCount; i++) {
        const angle = (i / dustCount) * Math.PI * 2 + t * 0.45;
        const r = 1.0 + (i % 9) * 0.19;
        const y = -0.5 + ((t * 0.5 + i * 0.19) % 2.5);
        dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
        dummy.scale.setScalar(0.018 + (i % 4) * 0.006);
        dummy.updateMatrix();
        dustRef.current.setMatrixAt(i, dummy.matrix);
      }
      dustRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* SUSPENDED TITANIUM ORBITAL MONOLITH & RING */}
      <mesh position={[0, -0.82, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.15, 2.45, 0.34, 32]} />
        <meshStandardMaterial
          color="#171E26"
          map={titaniumMaps.map}
          normalMap={titaniumMaps.normalMap}
          normalScale={new THREE.Vector2(0.1, 0.1)}
          roughnessMap={titaniumMaps.roughnessMap}
          roughness={0.38}
          metalness={0.78}
        />
      </mesh>
      <mesh ref={orbitalRingRef} position={[0, -0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.42, 0.055, 14, 72]} />
        <meshStandardMaterial color="#FACC15" metalness={0.94} roughness={0.22} />
      </mesh>

      {/* STRATOSPHERIC CLOUD VORTEX GLSL DISK */}
      <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]} material={vortexMat}>
        <circleGeometry args={[2.8, 64]} />
      </mesh>

      {/* RAYQUAZA 3D VOLUMETRIC SPECIMEN RELIEF & ORBITAL RIBBON */}
      <group ref={serpentGroupRef}>
        <SpecimenRelief3D
          specimenId="rayquaza"
          accent="#10B981"
          size={2.5}
          displacementScale={0.34}
          position={[0, 0.62, 0]}
          quality={quality}
        />

        {/* EMERALD PLASMA TRAILING RIBBON */}
        <mesh ref={ribbonRef} geometry={ribbonGeo}>
          <meshBasicMaterial color="#10B981" transparent opacity={0.72} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* SOLAR GOLD STRATOSPHERIC DUST */}
      <instancedMesh ref={dustRef} args={[undefined, undefined, dustCount]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#FACC15" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </instancedMesh>
      <pointLight color="#10B981" intensity={2.4} distance={6} position={[0, 0.8, 0]} />
    </group>
  );
};
