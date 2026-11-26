import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RotateCw, X } from 'lucide-react';
import { SPECIMENS, type SpecimenProfile } from '../../data/pokemon';
import { type CardRarity, useArchive } from '../../store/archiveStore';
import { createHoloFoilMaterial } from '../../scene/shaders/holoFoilShader';
import { loadPbrTextureSet } from '../../scene/textures';

function buildCardFaceTexture(
  specimen: SpecimenProfile,
  rarity: CardRarity
): { tex: THREE.CanvasTexture; cancel: () => void } {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const paintCard = (artworkImg: HTMLImageElement | null) => {
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 768, 1080);
    grad.addColorStop(0, '#090B0E');
    grad.addColorStop(0.5, '#121822');
    grad.addColorStop(1, '#090B0E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 768, 1080);

    // Subtle radial specimen glow
    const rad = ctx.createRadialGradient(384, 420, 30, 384, 420, 340);
    rad.addColorStop(0, specimen.accentPrimary + '66');
    rad.addColorStop(0.55, specimen.accentSecondary + '22');
    rad.addColorStop(1, 'transparent');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 768, 1080);

    // Outer rarity border
    const borderCol =
      rarity === 'hypergold' ? '#FACC15' : rarity === 'secretprism' ? '#4DEEEA' : '#E8E6E1';
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 10;
    ctx.strokeRect(24, 24, 720, 1032);

    // Technical reticle ring behind specimen artwork
    ctx.save();
    ctx.translate(384, 425);
    ctx.strokeStyle = specimen.accentSecondary + '66';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 210, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Official high-res specimen illustration
    if (artworkImg) {
      const box = 490;
      const scale = Math.min(box / artworkImg.width, box / artworkImg.height);
      const dw = artworkImg.width * scale;
      const dh = artworkImg.height * scale;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 12;
      ctx.drawImage(artworkImg, 384 - dw / 2, 425 - dh / 2, dw, dh);
      ctx.restore();
    }

    // Header text
    ctx.fillStyle = '#8E96A3';
    ctx.font = '600 22px monospace';
    ctx.fillText(`${specimen.card.setCode} // ${specimen.card.cardNumber}`, 56, 82);

    ctx.fillStyle = '#E8E6E1';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText(specimen.name.toUpperCase(), 56, 146);

    ctx.fillStyle = specimen.accentPrimary;
    ctx.font = 'bold 42px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${specimen.card.hp} HP`, 710, 142);
    ctx.textAlign = 'left';

    // Footer attack block
    ctx.fillStyle = 'rgba(9,11,14,0.90)';
    ctx.fillRect(50, 710, 668, 300);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 710, 668, 300);

    ctx.fillStyle = '#E8E6E1';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(specimen.card.attackOne.name, 78, 770);
    ctx.fillStyle = specimen.accentSecondary;
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(specimen.card.attackOne.damage, 690, 770);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#A3ABB8';
    ctx.font = '20px sans-serif';
    ctx.fillText(specimen.card.attackOne.desc, 78, 805);

    ctx.fillStyle = '#E8E6E1';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(specimen.card.attackTwo.name, 78, 885);
    ctx.fillStyle = specimen.accentPrimary;
    ctx.font = 'bold 34px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(specimen.card.attackTwo.damage, 690, 885);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#A3ABB8';
    ctx.font = '20px sans-serif';
    ctx.fillText(specimen.card.attackTwo.desc, 78, 920);

    ctx.fillStyle = borderCol;
    ctx.font = '600 18px monospace';
    ctx.fillText(`${rarity.toUpperCase()} // ${specimen.card.illustrator}`, 78, 982);
  };

  paintCard(null);

  let cancelled = false;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    if (cancelled) return;
    paintCard(img);
    tex.needsUpdate = true;
  };
  img.src = specimen.imagePath;

  return {
    tex,
    cancel: () => {
      cancelled = true;
    },
  };
}

function buildCardBackTexture(specimen: SpecimenProfile): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#090B0E';
    ctx.fillRect(0, 0, 768, 1080);
    ctx.strokeStyle = 'rgba(232,230,225,0.28)';
    ctx.lineWidth = 8;
    ctx.strokeRect(32, 32, 704, 1016);

    ctx.strokeStyle = specimen.accentPrimary;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(384, 540, 170, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#E8E6E1';
    ctx.font = 'bold 34px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SILPH ARCHIVE', 384, 520);
    ctx.fillStyle = '#8E96A3';
    ctx.font = '20px monospace';
    ctx.fillText(`ENCRYPTED VAULT // ${specimen.dexNumber}`, 384, 565);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const HoloCardMesh: React.FC<{
  specimen: SpecimenProfile;
  rarity: CardRarity;
  flipped: boolean;
}> = ({ specimen, rarity, flipped }) => {
  const groupRef = useRef<THREE.Group>(null);
  const holoMaps = useMemo(() => loadPbrTextureSet('holo_foil', 2), []);
  const frontFace = useMemo(() => buildCardFaceTexture(specimen, rarity), [specimen, rarity]);
  const frontTex = frontFace.tex;
  const backTex = useMemo(() => buildCardBackTexture(specimen), [specimen]);

  const rarityIdx = rarity === 'hypergold' ? 1 : rarity === 'secretprism' ? 2 : 0;

  const frontMat = useMemo(
    () => createHoloFoilMaterial(frontTex, holoMaps.normalMap, specimen.accentPrimary, rarityIdx),
    [frontTex, holoMaps.normalMap, specimen.accentPrimary, rarityIdx]
  );

  useEffect(() => {
    return () => {
      frontFace.cancel();
      frontTex.dispose();
      backTex.dispose();
      frontMat.dispose();
    };
  }, [frontFace, frontTex, backTex, frontMat]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    frontMat.uniforms.uTime.value = state.clock.elapsedTime;
    if (groupRef.current) {
      const targetRotY = flipped ? Math.PI : Math.sin(state.clock.elapsedTime * 0.55) * 0.22;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        1 - Math.exp(-5.5 * dt)
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Card Slab Body */}
      <mesh>
        <boxGeometry args={[2.5, 3.5, 0.04]} />
        <meshStandardMaterial color="#181E27" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Front Face with Custom GLSL Iridescent Foil Shader */}
      <mesh position={[0, 0, 0.022]} material={frontMat}>
        <planeGeometry args={[2.46, 3.46]} />
      </mesh>
      {/* Back Face */}
      <mesh position={[0, 0, -0.022]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.46, 3.46]} />
        <meshStandardMaterial map={backTex} metalness={0.5} roughness={0.32} />
      </mesh>
    </group>
  );
};

export const CardInspectorModal: React.FC = () => {
  const { inspectedCardId, setInspectedCardId, cardRarity, setCardRarity } = useArchive();
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [inspectedCardId]);

  if (!inspectedCardId) return null;
  const specimen = SPECIMENS[inspectedCardId];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#090B0E]/92 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`Inspect ${specimen.name} 3D Holographic Card`}
    >
      <div className="hardware-panel relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden">
        {/* Top Modal Controls */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3">
          <div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-[#8E96A3]">
              WEBGL HOLOGRAPHIC DIFFRACTION INSPECTOR
            </div>
            <div className="font-display text-lg font-bold text-[#E8E6E1]">
              {specimen.dexNumber} {specimen.name.toUpperCase()} // {specimen.card.cardNumber}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(['illustration', 'hypergold', 'secretprism'] as CardRarity[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setCardRarity(r)}
                className={`hidden rounded-[3px] border px-2.5 py-1 font-mono text-[10px] sm:inline-block ${
                  cardRarity === r
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[#E8E6E1]'
                    : 'border-white/10 text-[#8E96A3]'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}

            <button
              type="button"
              data-action="flip-card"
              onClick={() => setFlipped((f) => !f)}
              className="flex items-center gap-1.5 rounded-[3px] border border-white/15 bg-[#090B0E] px-3 py-1.5 font-mono text-[10px] text-[#E8E6E1] hover:border-white/35"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>FLIP</span>
            </button>

            <button
              type="button"
              data-action="close-inspector"
              onClick={() => setInspectedCardId(null)}
              aria-label="Close card inspector"
              className="rounded-[3px] border border-white/15 bg-[#090B0E] p-1.5 text-[#E8E6E1] hover:border-rose-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dedicated 3D Card WebGL Canvas */}
        <div className="relative flex-1">
          <Canvas camera={{ position: [0, 0, 5.1], fov: 38 }} dpr={[1, 2]}>
            <color attach="background" args={['#090B0E']} />
            <ambientLight intensity={0.85} />
            <directionalLight position={[4, 5, 5]} intensity={1.8} />
            <directionalLight position={[-4, -2, 3]} intensity={0.9} color={specimen.accentPrimary} />
            <HoloCardMesh specimen={specimen} rarity={cardRarity} flipped={flipped} />
            <OrbitControls enablePan={false} enableZoom={true} minDistance={3.2} maxDistance={7.5} />
          </Canvas>
          <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.16em] text-[#8E96A3]">
            DRAG TO INSPECT IRIDESCENT DIFFRACTION GRATING // SCROLL TO ZOOM
          </div>
        </div>
      </div>
    </div>
  );
};
