import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { loadPbrTextureSet } from '../textures';
import { createCalderaMagmaMaterial, createHeatHazeMaterial } from '../shaders/calderaMagmaShader';
import { SpecimenRelief3D } from './SpecimenRelief3D';
import type { QualityTier } from '../../store/archiveStore';

export const VolcanicCaldera: React.FC<{ quality: QualityTier }> = ({ quality }) => {
  const basaltMaps = useMemo(() => loadPbrTextureSet('volcanic_basalt', 2), []);
  const magmaMat = useMemo(() => createCalderaMagmaMaterial(), []);
  const hazeMat = useMemo(() => createHeatHazeMaterial(), []);

  const totemRef = useRef<THREE.Group>(null);
  const tailLightRef = useRef<THREE.PointLight>(null);
  const embersRef = useRef<THREE.InstancedMesh>(null);

  const particleCount = quality === 'ultra' ? 220 : quality === 'balanced' ? 110 : 40;

  const emberSeeds = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 220; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.35 + Math.random() * 1.9;
      arr.push({
        angle: a,
        radius: r,
        speed: 0.45 + Math.random() * 0.9,
        phase: Math.random() * 10,
        scale: 0.018 + Math.random() * 0.028,
      });
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    return () => {
      magmaMat.dispose();
      hazeMat.dispose();
    };
  }, [magmaMat, hazeMat]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    magmaMat.uniforms.uTime.value = t;
    hazeMat.uniforms.uTime.value = t;

    if (totemRef.current) {
      totemRef.current.position.y = 0.06 + Math.sin(t * 1.4) * 0.05;
      totemRef.current.rotation.y = Math.sin(t * 0.35) * 0.14;
    }
    if (tailLightRef.current) {
      tailLightRef.current.intensity = 2.4 + Math.sin(t * 7.5) * 0.45;
    }
    if (embersRef.current) {
      for (let i = 0; i < particleCount; i++) {
        const p = emberSeeds[i];
        const y = ((t * p.speed + p.phase) % 3.2) - 0.3;
        const swirl = p.angle + t * 0.4 + y * 0.5;
        dummy.position.set(
          Math.cos(swirl) * (p.radius * (1 - y * 0.08)),
          y,
          Math.sin(swirl) * (p.radius * (1 - y * 0.08))
        );
        const fade = Math.sin(Math.min(1, Math.max(0, (y + 0.3) / 3.2)) * Math.PI);
        const s = p.scale * (0.35 + fade * 0.7);
        dummy.scale.set(s * 0.65, s * 1.45, s * 0.65);
        dummy.updateMatrix();
        embersRef.current.setMatrixAt(i, dummy.matrix);
      }
      embersRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* OCTAGONAL BASALT CALDERA TERRARIUM */}
      <mesh position={[0, -0.78, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.35, 2.65, 0.52, 8]} />
        <meshStandardMaterial
          color="#1D2129"
          map={basaltMaps.map}
          normalMap={basaltMaps.normalMap}
          normalScale={new THREE.Vector2(0.45, 0.45)}
          roughnessMap={basaltMaps.roughnessMap}
          roughness={0.85}
          metalness={0.18}
        />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} material={magmaMat}>
        <circleGeometry args={[2.18, 48]} />
      </mesh>

      {/* Stepped basalt spires around caldera rim */}
      {[0, 1.1, 2.3, 3.6, 4.9].map((ang, i) => (
        <mesh
          key={i}
          position={[Math.cos(ang) * 1.85, -0.24 + (i % 2) * 0.14, Math.sin(ang) * 1.85]}
          rotation={[0.1 * (i % 3 - 1), ang, 0.08]}
          castShadow
        >
          <cylinderGeometry args={[0.16, 0.28, 0.68 + (i % 3) * 0.22, 6]} />
          <meshStandardMaterial color="#181C23" roughness={0.88} metalness={0.15} />
        </mesh>
      ))}

      {/* RISING HEAT DISTORTION SHIMMER PLANES */}
      {[0, Math.PI / 3, (Math.PI * 2) / 3].map((rot, idx) => (
        <mesh key={idx} position={[0, 0.55, 0]} rotation={[0, rot, 0]} material={hazeMat}>
          <planeGeometry args={[2.9, 2.2]} />
        </mesh>
      ))}

      {/* CHARIZARD 3D VOLUMETRIC SPECIMEN RELIEF */}
      <group ref={totemRef} position={[0, 0.06, 0]}>
        <SpecimenRelief3D
          specimenId="charizard"
          accent="#FF4D1A"
          size={2.45}
          displacementScale={0.34}
          position={[0, 0.56, 0]}
          quality={quality}
        />
        <pointLight ref={tailLightRef} color="#FF6B2B" intensity={2.6} distance={5} position={[0.78, 0.38, 0.35]} />
      </group>

      {/* GPU INSTANCED RISING EMBERS */}
      <instancedMesh ref={embersRef} args={[undefined, undefined, particleCount]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#FF9E3D" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
      </instancedMesh>
    </group>
  );
};
