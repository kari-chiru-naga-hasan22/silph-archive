import * as THREE from 'three';

export type MaterialCraftSetName =
  | 'titanium_brushed'
  | 'ceramic_gloss'
  | 'volcanic_basalt'
  | 'wet_slate'
  | 'copper_coil'
  | 'holo_foil';

export interface PbrTextureSet {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  metalnessMap: THREE.Texture;
}

const cache = new Map<string, PbrTextureSet>();

function createProceduralFallbackTexture(
  kind: 'albedo' | 'normal' | 'roughness' | 'metallic',
  name: MaterialCraftSetName
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    if (kind === 'normal') {
      ctx.fillStyle = '#8080ff';
      ctx.fillRect(0, 0, 256, 256);
    } else if (kind === 'albedo') {
      const baseMap: Record<MaterialCraftSetName, string> = {
        titanium_brushed: '#dcd9d2',
        ceramic_gloss: '#edeae4',
        volcanic_basalt: '#1b1f27',
        wet_slate: '#18222e',
        copper_coil: '#cf7438',
        holo_foil: '#4deeea',
      };
      ctx.fillStyle = baseMap[name];
      ctx.fillRect(0, 0, 256, 256);
    } else {
      ctx.fillStyle = kind === 'metallic' ? '#cccccc' : '#666666';
      ctx.fillRect(0, 0, 256, 256);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = kind === 'albedo' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  return tex;
}

export function loadPbrTextureSet(name: MaterialCraftSetName, repeat = 2): PbrTextureSet {
  const cacheKey = `${name}:${repeat}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const loader = new THREE.TextureLoader();

  const loadTex = (
    file: string,
    kind: 'albedo' | 'normal' | 'roughness' | 'metallic'
  ): THREE.Texture => {
    const fallback = createProceduralFallbackTexture(kind, name);
    const tex = loader.load(
      `/assets/textures/pbr/${name}/${file}`,
      (loaded) => {
        loaded.needsUpdate = true;
      },
      undefined,
      () => {
        tex.image = fallback.image;
        tex.needsUpdate = true;
      }
    );
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
    tex.anisotropy = 4;
    tex.colorSpace = kind === 'albedo' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    return tex;
  };

  const set: PbrTextureSet = {
    map: loadTex('baseColor.png', 'albedo'),
    normalMap: loadTex('normal.png', 'normal'),
    roughnessMap: loadTex('roughness.png', 'roughness'),
    metalnessMap: loadTex('metallic.png', 'metallic'),
  };

  cache.set(cacheKey, set);
  return set;
}
