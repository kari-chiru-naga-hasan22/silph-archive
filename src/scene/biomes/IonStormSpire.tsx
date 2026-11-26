import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { loadPbrTextureSet } from '../textures';
import { SpecimenRelief3D } from './SpecimenRelief3D';
import type { QualityTier } from '../../store/archiveStore';

function buildLightningPoints(start: THREE.Vector3, end: THREE.Vector3, segments = 9): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3().lerpVectors(start, end, t);
    if (i > 0 && i < segments) {
      const jitter = 0.24 * Math.sin(t * Math.PI);
      p.x += (Math.random() - 0.5) * jitter;
      p.y += (Math.random() - 0.5) * jitter;
      p.z += (Math.random() - 0.5) * jitter;
    }
    pts.push(p);
  }
  return pts;
}

export const IonStormSpire: React.FC<{ quality: QualityTier }> = ({ quality }) => {
  const slateMaps = useMemo(() => loadPbrTextureSet('wet_slate', 2), []);
  const copperMaps = useMemo(() => loadPbrTextureSet('copper_coil', 2), []);

  const totemRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const [boltTick, setBoltTick] = useState(0);
  const lastBoltTimeRef = useRef(0);

  // Lightning bolt spline geometries refreshed periodically
  const pylonTops = useMemo(
    () => [
      new THREE.Vector3(1.55, 0.35, 0),
      new THREE.Vector3(-0.8, 0.35, 1.35),
      new THREE.Vector3(-0.8, 0.35, -1.35),
    ],
    []
  );

  const boltGeos = useMemo(() => {
    const core = new THREE.Vector3(0, 0.45, 0);
    return pylonTops.map((top) => {
      const curve = new THREE.CatmullRomCurve3(buildLightningPoints(top, core, 8));
      return new THREE.TubeGeometry(curve, 16, 0.022, 6, false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boltTick, pylonTops]);

  useEffect(() => {
    return () => {
      boltGeos.forEach((g) => g.dispose());
    };
  }, [boltGeos]);

  const sparkInterval = quality === 'eco' ? 0.25 : 0.11;

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (t - lastBoltTimeRef.current > sparkInterval) {
      lastBoltTimeRef.current = t;
      setBoltTick((v) => v + 1);
    }

    if (totemRef.current) {
      totemRef.current.position.y = 0.08 + Math.sin(t * 2.2) * 0.06;
      totemRef.current.rotation.y = Math.sin(t * 0.48) * 0.16;
    }
    if (ring1Ref.current && ring2Ref.current) {
      ring1Ref.current.rotation.z = t * 0.9;
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 1.1) * 0.22;
      ring2Ref.current.rotation.z = -t * 1.25;
      ring2Ref.current.rotation.y = Math.cos(t * 0.9) * 0.28;
    }
  });

  return (
    <group>
      {/* CONDUCTIVE WET-SLATE & COPPER INDUCTION PLINTH */}
      <mesh position={[0, -0.78, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.3, 2.58, 0.5, 12]} />
        <meshStandardMaterial
          color="#161D28"
          map={slateMaps.map}
          normalMap={slateMaps.normalMap}
          roughnessMap={slateMaps.roughnessMap}
          roughness={0.34}
          metalness={0.35}
        />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1.95, 48]} />
        <meshStandardMaterial
          map={copperMaps.map}
          normalMap={copperMaps.normalMap}
          metalness={0.94}
          roughness={0.26}
        />
      </mesh>

      {/* THREE TESLA STATOR PYLONS */}
      {pylonTops.map((pos, i) => (
        <group key={i} position={[pos.x, -0.2, pos.z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.15, 0.85, 16]} />
            <meshStandardMaterial
              map={copperMaps.map}
              normalMap={copperMaps.normalMap}
              metalness={0.92}
              roughness={0.25}
            />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#4DEEEA" emissive="#4DEEEA" emissiveIntensity={2.2} />
          </mesh>
        </group>
      ))}

      {/* CHARGED ORBITAL RINGS */}
      <mesh ref={ring1Ref} position={[0, 0.35, 0]}>
        <torusGeometry args={[1.38, 0.025, 12, 64]} />
        <meshStandardMaterial color="#4DEEEA" emissive="#4DEEEA" emissiveIntensity={1.9} />
      </mesh>
      <mesh ref={ring2Ref} position={[0, 0.45, 0]} rotation={[0.6, 0.3, 0]}>
        <torusGeometry args={[1.08, 0.02, 12, 64]} />
        <meshStandardMaterial color="#F5C400" emissive="#F5C400" emissiveIntensity={1.6} />
      </mesh>

      {/* PIKACHU 3D VOLUMETRIC SPECIMEN RELIEF */}
      <group ref={totemRef} position={[0, 0.08, 0]}>
        <SpecimenRelief3D
          specimenId="pikachu"
          accent="#F5C400"
          size={1.98}
          displacementScale={0.34}
          position={[0, 0.36, 0]}
          quality={quality}
        />
      </group>

      {/* PROCEDURAL BRANCHING 3D LIGHTNING ARCS */}
      {boltGeos.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshBasicMaterial color="#4DEEEA" transparent opacity={0.92} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      <pointLight color="#4DEEEA" intensity={2.2} distance={5} position={[0, 0.5, 0]} />
    </group>
  );
};
