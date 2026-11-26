import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { SpecimenId } from '../../data/pokemon';
import type { QualityTier } from '../../store/archiveStore';

interface ReliefTextures {
  colorMap: THREE.Texture;
  heightMap: THREE.Texture;
  normalMap: THREE.Texture;
}

const reliefCache = new Map<SpecimenId, ReliefTextures>();
const loader = new THREE.TextureLoader();

function getSpecimenReliefTextures(id: SpecimenId): ReliefTextures {
  const existing = reliefCache.get(id);
  if (existing) return existing;

  const colorMap = loader.load(`/assets/pokemon/${id}_512.png`);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.anisotropy = 4;

  const heightMap = loader.load(`/assets/pokemon/${id}_height.png`);
  heightMap.colorSpace = THREE.NoColorSpace;

  const normalMap = loader.load(`/assets/pokemon/${id}_normal.png`);
  normalMap.colorSpace = THREE.NoColorSpace;
  normalMap.anisotropy = 4;

  const bundle = { colorMap, heightMap, normalMap };
  reliefCache.set(id, bundle);
  return bundle;
}

interface SpecimenRelief3DProps {
  specimenId: SpecimenId;
  accent: string;
  size?: number;
  displacementScale?: number;
  position?: [number, number, number];
  quality: QualityTier;
}

/**
 * Volumetric 3D specimen sculpture driven directly by official transparent artwork
 * paired with Euclidean-spherical displacement heightmaps and Sobel normal maps.
 * Renders a front + UV-mirrored back shell sealed at the alpha silhouette edge.
 */
export const SpecimenRelief3D: React.FC<SpecimenRelief3DProps> = ({
  specimenId,
  accent,
  size = 2.3,
  displacementScale = 0.34,
  position = [0, 0.45, 0],
  quality,
}) => {
  const textures = useMemo(() => getSpecimenReliefTextures(specimenId), [specimenId]);
  const segments = quality === 'eco' ? 96 : quality === 'balanced' ? 144 : 180;

  const { frontGeo, backGeo } = useMemo(() => {
    const front = new THREE.PlaneGeometry(size, size, segments, segments);
    const back = front.clone();
    const uv = back.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      uv.setX(i, 1 - uv.getX(i));
    }
    uv.needsUpdate = true;
    return { frontGeo: front, backGeo: back };
  }, [size, segments]);

  useEffect(() => {
    return () => {
      frontGeo.dispose();
      backGeo.dispose();
    };
  }, [frontGeo, backGeo]);

  const sharedMaterialProps = {
    map: textures.colorMap,
    displacementMap: textures.heightMap,
    displacementScale,
    normalMap: textures.normalMap,
    normalScale: new THREE.Vector2(0.78, 0.78),
    alphaTest: 0.42,
    transparent: false,
    roughness: 0.34,
    metalness: 0.08,
    emissive: new THREE.Color(accent),
    emissiveMap: textures.colorMap,
    emissiveIntensity: 0.09,
  };

  return (
    <group position={position}>
      {/* Front displaced shell (+Z relief) */}
      <mesh geometry={frontGeo} position={[0, 0, -0.01]} castShadow receiveShadow>
        <meshStandardMaterial {...sharedMaterialProps} />
      </mesh>
      {/* Mirrored back displaced shell (-Z relief) */}
      <mesh
        geometry={backGeo}
        position={[0, 0, 0.01]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...sharedMaterialProps} />
      </mesh>
    </group>
  );
};
