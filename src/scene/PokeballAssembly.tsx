import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { BALL_VARIANTS } from '../data/pokeballs';
import { useArchive } from '../store/archiveStore';
import { loadPbrTextureSet } from './textures';
import { createFresnelCoreMaterial, createShockwaveMaterial } from './shaders/fresnelEnergyShader';

export const PokeballAssembly: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { activeBall, explodeProgress, capturePulseNonce, triggerCapturePulse } = useArchive();
  const spec = BALL_VARIANTS[activeBall];
  const { size } = useThree();
  const isMobile = size.width < 768;

  const rootRef = useRef<THREE.Group>(null);
  const upperGroupRef = useRef<THREE.Group>(null);
  const lowerGroupRef = useRef<THREE.Group>(null);
  const equatorRef = useRef<THREE.Group>(null);
  const upperCoilRef = useRef<THREE.Mesh>(null);
  const lowerCoilRef = useRef<THREE.Mesh>(null);
  const hingeRef = useRef<THREE.Group>(null);
  const buttonGroupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const coreCageRef = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const ledMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const [hoveredBtn, setHoveredBtn] = useState(false);
  const pulseTimerRef = useRef(-1);
  const smoothExplodeRef = useRef(0);

  const titaniumMaps = useMemo(() => loadPbrTextureSet('titanium_brushed', 4), []);
  const ceramicMaps = useMemo(() => loadPbrTextureSet('ceramic_gloss', 3), []);
  const copperMaps = useMemo(() => loadPbrTextureSet('copper_coil', 4), []);

  const coreShaderMat = useMemo(
    () => createFresnelCoreMaterial(spec.coreColor, spec.accentColor),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const shockwaveMat = useMemo(() => createShockwaveMaterial(spec.accentColor), []);

  useEffect(() => {
    coreShaderMat.uniforms.uPrimary.value.set(spec.coreColor);
    coreShaderMat.uniforms.uSecondary.value.set(spec.accentColor);
    shockwaveMat.uniforms.uColor.value.set(spec.accentColor);
  }, [spec, coreShaderMat, shockwaveMat]);

  useEffect(() => {
    if (capturePulseNonce > 0) {
      pulseTimerRef.current = 0;
    }
  }, [capturePulseNonce]);

  useEffect(() => {
    document.body.style.cursor = hoveredBtn ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hoveredBtn]);

  // Master Ball sculpted "M" crest extruded shape
  const masterMGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.24, -0.14);
    s.lineTo(-0.19, 0.21);
    s.lineTo(-0.08, 0.21);
    s.lineTo(0, 0.01);
    s.lineTo(0.08, 0.21);
    s.lineTo(0.19, 0.21);
    s.lineTo(0.24, -0.14);
    s.lineTo(0.15, -0.14);
    s.lineTo(0.11, 0.08);
    s.lineTo(0.03, -0.09);
    s.lineTo(-0.03, -0.09);
    s.lineTo(-0.11, 0.08);
    s.lineTo(-0.15, -0.14);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.01,
      bevelSegments: 2,
    });
  }, []);

  useEffect(() => {
    return () => {
      masterMGeo.dispose();
      coreShaderMat.dispose();
      shockwaveMat.dispose();
    };
  }, [masterMGeo, coreShaderMat, shockwaveMat]);

  useFrame((state, delta) => {
    if (!visible || !rootRef.current) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    smoothExplodeRef.current = THREE.MathUtils.lerp(
      smoothExplodeRef.current,
      explodeProgress,
      1 - Math.exp(-7.5 * dt)
    );
    const e = smoothExplodeRef.current;

    if (upperGroupRef.current) {
      upperGroupRef.current.position.y = e * 0.78;
      upperGroupRef.current.rotation.x = -e * 0.14;
    }
    if (lowerGroupRef.current) {
      lowerGroupRef.current.position.y = -e * 0.72;
    }
    if (equatorRef.current) {
      equatorRef.current.position.z = -e * 0.1;
      equatorRef.current.scale.setScalar(1 + e * 0.04);
    }
    if (upperCoilRef.current) {
      upperCoilRef.current.position.y = 0.09 + e * 0.44;
    }
    if (lowerCoilRef.current) {
      lowerCoilRef.current.position.y = -0.09 - e * 0.42;
    }
    if (hingeRef.current) {
      hingeRef.current.position.z = -0.98 - e * 0.6;
    }
    if (buttonGroupRef.current) {
      buttonGroupRef.current.position.z = 0.99 + e * 0.68;
    }

    if (coreMeshRef.current && coreCageRef.current) {
      coreMeshRef.current.rotation.y = t * 0.9;
      coreMeshRef.current.rotation.x = Math.sin(t * 0.7) * 0.35;
      coreCageRef.current.rotation.y = -t * 0.55;
      coreCageRef.current.rotation.z = t * 0.32;
      const coreScale = 0.42 + e * 0.24;
      coreMeshRef.current.scale.setScalar(coreScale);
      coreCageRef.current.scale.setScalar(coreScale * 1.26);
    }

    let pulseIntensity = e * 0.35;
    if (pulseTimerRef.current >= 0) {
      pulseTimerRef.current += dt;
      const p = pulseTimerRef.current;
      const duration = 1.45;
      if (p <= duration) {
        const norm = p / duration;
        const decay = Math.exp(-norm * 2.1);
        rootRef.current.rotation.z = Math.sin(p * 14.5) * 0.24 * decay;
        rootRef.current.rotation.x = Math.cos(p * 10.0) * 0.08 * decay;
        rootRef.current.position.y =
          Math.abs(Math.sin(p * 9.5)) * 0.08 * decay + Math.sin(t * 1.5) * 0.03;
        pulseIntensity = Math.max(pulseIntensity, Math.abs(Math.sin(p * 11.0)) * decay * 1.4);
        shockwaveMat.uniforms.uProgress.value = Math.min(1, norm * 1.15);
        if (shockwaveRef.current) {
          shockwaveRef.current.scale.setScalar(1 + norm * 3.4);
        }
      } else {
        pulseTimerRef.current = -1;
        shockwaveMat.uniforms.uProgress.value = 0;
        rootRef.current.rotation.z = 0;
      }
    } else {
      rootRef.current.position.y = Math.sin(t * 1.4) * 0.04;
      rootRef.current.rotation.y = Math.sin(t * 0.42) * 0.16;
      rootRef.current.rotation.z = THREE.MathUtils.lerp(
        rootRef.current.rotation.z,
        0,
        1 - Math.exp(-6 * dt)
      );
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        0.06,
        1 - Math.exp(-6 * dt)
      );
      shockwaveMat.uniforms.uProgress.value = 0;
    }

    coreShaderMat.uniforms.uTime.value = t;
    coreShaderMat.uniforms.uPulse.value = pulseIntensity;

    if (ledMatRef.current) {
      const hoverBoost = hoveredBtn ? 0.85 : 0;
      ledMatRef.current.emissiveIntensity = 0.75 + pulseIntensity * 2.2 + hoverBoost;
    }
  });

  const showCallouts = visible && explodeProgress > 0.25;

  return (
    <group
      ref={rootRef}
      visible={visible}
      position={[isMobile ? 0.0 : 0.45, isMobile ? 0.28 : 0.05, 0]}
      scale={isMobile ? 0.76 : 1}
    >
      {/* UPPER HEMISPHERE SHELL (Outward normals via SphereGeometry + BackSide inner liner) */}
      <group ref={upperGroupRef}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.02, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.468]} />
          <meshPhysicalMaterial
            color={spec.upperColor}
            normalMap={ceramicMaps.normalMap}
            normalScale={new THREE.Vector2(0.04, 0.04)}
            roughness={spec.shellRoughness}
            metalness={spec.shellMetalness}
            clearcoat={spec.clearcoat}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Inner dark titanium wall */}
        <mesh>
          <sphereGeometry args={[0.91, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.468]} />
          <meshStandardMaterial color="#181D25" metalness={0.85} roughness={0.35} side={THREE.BackSide} />
        </mesh>

        {/* Rim bevel ring at upper lip */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <torusGeometry args={[0.96, 0.055, 14, 64]} />
          <meshStandardMaterial color="#2A303B" metalness={0.88} roughness={0.28} />
        </mesh>

        {/* ULTRA BALL GOLD H-STRIPES */}
        {spec.hasUltraHStripe && (
          <group>
            {[-0.36, 0.36].map((xPos, idx) => (
              <mesh
                key={idx}
                position={[xPos, 0.56, 0.14]}
                rotation={[0.25, 0, idx === 0 ? 0.38 : -0.38]}
                castShadow
              >
                <torusGeometry args={[0.62, 0.044, 14, 42, Math.PI * 0.72]} />
                <meshStandardMaterial color="#F5C400" metalness={0.92} roughness={0.18} />
              </mesh>
            ))}
            <mesh position={[0, 0.82, 0.56]} rotation={[0.92, 0, 0]}>
              <boxGeometry args={[0.68, 0.08, 0.06]} />
              <meshStandardMaterial color="#F5C400" metalness={0.92} roughness={0.18} />
            </mesh>
          </group>
        )}

        {/* MASTER BALL TWIN DOME BOSSES & M CREST */}
        {spec.hasMasterCrest && (
          <group>
            {[-0.64, 0.64].map((xPos, idx) => (
              <mesh
                key={idx}
                position={[xPos, 0.56, 0.25]}
                rotation={[0.3, idx === 0 ? -0.52 : 0.52, idx === 0 ? 0.55 : -0.55]}
                castShadow
              >
                <cylinderGeometry args={[0.2, 0.24, 0.12, 24]} />
                <meshPhysicalMaterial
                  color="#D946EF"
                  metalness={0.55}
                  roughness={0.2}
                  clearcoat={0.9}
                />
              </mesh>
            ))}
            <mesh
              geometry={masterMGeo}
              position={[0, 0.53, 0.84]}
              rotation={[-0.48, 0, 0]}
              scale={0.78}
              castShadow
            >
              <meshStandardMaterial color="#F1EFEA" metalness={0.9} roughness={0.18} />
            </mesh>
          </group>
        )}

        {showCallouts && (
          <group position={[0.92, 0.55, 0]}>
            <Line
              points={[
                [-0.18, -0.04, 0],
                [0.44, 0.22, 0],
              ]}
              color="#E8E6E1"
              lineWidth={1}
              transparent
              opacity={0.55}
            />
            <Html position={[0.56, 0.24, 0]} center distanceFactor={6}>
              <div className="pointer-events-none whitespace-nowrap rounded-[3px] border border-white/15 bg-[#12161C]/90 px-2 py-1 font-mono text-[10px] tracking-widest text-[#E8E6E1] shadow-lg">
                01 // CERAMIC DOME
              </div>
            </Html>
          </group>
        )}
      </group>

      {/* LOWER HEMISPHERE SHELL */}
      <group ref={lowerGroupRef}>
        <mesh castShadow receiveShadow>
          <sphereGeometry
            args={[1.02, 64, 32, 0, Math.PI * 2, Math.PI * 0.532, Math.PI * 0.468]}
          />
          <meshPhysicalMaterial
            color={spec.lowerColor}
            map={titaniumMaps.map}
            normalMap={titaniumMaps.normalMap}
            normalScale={new THREE.Vector2(0.06, 0.06)}
            roughness={0.22}
            metalness={0.44}
            clearcoat={0.72}
            clearcoatRoughness={0.12}
          />
        </mesh>

        {/* Inner brushed shell cavity */}
        <mesh>
          <sphereGeometry
            args={[0.91, 48, 24, 0, Math.PI * 2, Math.PI * 0.532, Math.PI * 0.468]}
          />
          <meshStandardMaterial color="#181D25" metalness={0.85} roughness={0.35} side={THREE.BackSide} />
        </mesh>

        {/* Lower rim lip */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <torusGeometry args={[0.96, 0.055, 14, 64]} />
          <meshStandardMaterial color="#2A303B" metalness={0.88} roughness={0.28} />
        </mesh>

        {/* Lower base titanium foot ring */}
        <mesh position={[0, -1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.24, 0.024, 12, 36]} />
          <meshStandardMaterial color="#232934" metalness={0.9} roughness={0.3} />
        </mesh>

        {showCallouts && (
          <group position={[0.88, -0.22, 0.1]}>
            <Line
              points={[
                [-0.18, 0.02, 0],
                [0.34, 0.02, 0],
              ]}
              color="#E8E6E1"
              lineWidth={1}
              transparent
              opacity={0.55}
            />
            <Html position={[0.56, 0.02, 0]} center distanceFactor={6}>
              <div className="pointer-events-none whitespace-nowrap rounded-[3px] border border-white/15 bg-[#12161C]/90 px-2 py-1 font-mono text-[10px] tracking-widest text-[#E8E6E1]">
                04 // ANODIZED BASE
              </div>
            </Html>
          </group>
        )}
      </group>

      {/* RECESSED EQUATOR CHASSIS RING */}
      <group ref={equatorRef}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.97, 0.97, 0.16, 64, 1, true]} />
          <meshStandardMaterial
            color={spec.bandColor}
            normalMap={titaniumMaps.normalMap}
            normalScale={new THREE.Vector2(0.06, 0.06)}
            metalness={0.78}
            roughness={0.32}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.078, 0]}>
          <torusGeometry args={[0.985, 0.022, 12, 64]} />
          <meshStandardMaterial color={spec.bandColor} metalness={0.85} roughness={0.28} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.078, 0]}>
          <torusGeometry args={[0.985, 0.022, 12, 64]} />
          <meshStandardMaterial color={spec.bandColor} metalness={0.85} roughness={0.28} />
        </mesh>
      </group>

      {/* INTERNAL COPPER INDUCTION CONTAINMENT RINGS */}
      <mesh ref={upperCoilRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.09, 0]}>
        <torusGeometry args={[0.72, 0.055, 16, 48]} />
        <meshStandardMaterial
          map={copperMaps.map}
          normalMap={copperMaps.normalMap}
          normalScale={new THREE.Vector2(0.25, 0.25)}
          roughnessMap={copperMaps.roughnessMap}
          metalnessMap={copperMaps.metalnessMap}
          metalness={0.92}
          roughness={0.28}
        />
      </mesh>
      <mesh ref={lowerCoilRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.09, 0]}>
        <torusGeometry args={[0.64, 0.045, 16, 48]} />
        <meshStandardMaterial
          map={copperMaps.map}
          normalMap={copperMaps.normalMap}
          normalScale={new THREE.Vector2(0.25, 0.25)}
          roughnessMap={copperMaps.roughnessMap}
          metalness={0.88}
          roughness={0.3}
        />
      </mesh>

      {showCallouts && (
        <group position={[0.74, 0.48, 0.15]}>
          <Line
            points={[
              [-0.1, 0, 0],
              [0.52, 0.05, 0],
            ]}
            color={spec.accentColor}
            lineWidth={1}
            transparent
            opacity={0.75}
          />
          <Html position={[0.6, 0.05, 0]} center distanceFactor={6}>
            <div className="pointer-events-none whitespace-nowrap rounded-[3px] border border-white/15 bg-[#12161C]/90 px-2 py-1 font-mono text-[10px] tracking-widest text-[#FFB347]">
              02 // COPPER INDUCTION COIL
            </div>
          </Html>
        </group>
      )}

      {/* REAR PRECISION HINGE ACTUATOR */}
      <group ref={hingeRef} position={[0, 0, -0.98]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.4, 20]} />
          <meshStandardMaterial color="#8E96A3" metalness={0.95} roughness={0.22} />
        </mesh>
        {[-0.15, 0.15].map((xOff, i) => (
          <mesh key={i} position={[xOff, 0, -0.02]}>
            <boxGeometry args={[0.075, 0.2, 0.14]} />
            <meshStandardMaterial color="#1F252F" metalness={0.82} roughness={0.36} />
          </mesh>
        ))}

        {showCallouts && (
          <Html position={[1.55, -0.35, 0.35]} center distanceFactor={6}>
            <div className="pointer-events-none whitespace-nowrap rounded-[3px] border border-white/15 bg-[#12161C]/90 px-2 py-1 font-mono text-[10px] tracking-widest text-[#E8E6E1]">
              05 // HINGE ACTUATOR
            </div>
          </Html>
        )}
      </group>

      {/* CENTRAL PUSH-BUTTON COLLAR & INTERACTIVE TRIGGER */}
      <group ref={buttonGroupRef} position={[0, 0, 0.99]}>
        {/* Outer bezel collar */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.31, 0.1, 36]} />
          <meshStandardMaterial color="#151921" metalness={0.85} roughness={0.28} />
        </mesh>
        {/* Brushed titanium ring (XY plane aligned facing +Z) */}
        <mesh position={[0, 0, 0.052]}>
          <torusGeometry args={[0.215, 0.022, 14, 36]} />
          <meshStandardMaterial color="#E8E6E1" metalness={0.92} roughness={0.22} />
        </mesh>
        {/* Interactive clickable inner button */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, 0.065]}
          onClick={(e) => {
            e.stopPropagation();
            triggerCapturePulse();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredBtn(true);
          }}
          onPointerOut={() => setHoveredBtn(false)}
        >
          <cylinderGeometry args={[0.165, 0.165, 0.06, 32]} />
          <meshStandardMaterial
            ref={ledMatRef}
            color={hoveredBtn ? '#FFFFFF' : '#E8E6E1'}
            emissive={spec.accentColor}
            emissiveIntensity={0.65}
            roughness={0.18}
            metalness={0.2}
          />
        </mesh>
      </group>

      {/* INTERNAL PRISMATIC ENERGY CORE */}
      <group>
        <mesh ref={coreMeshRef} material={coreShaderMat}>
          <octahedronGeometry args={[1, 2]} />
        </mesh>
        <mesh ref={coreCageRef}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#E8E6E1"
            wireframe
            metalness={0.95}
            roughness={0.2}
            transparent
            opacity={0.5}
          />
        </mesh>
        <pointLight color={spec.coreColor} intensity={1.8 + explodeProgress * 2.4} distance={4.5} />

        {showCallouts && (
          <Html position={[1.22, 0.16, 0.25]} center distanceFactor={6}>
            <div className="pointer-events-none whitespace-nowrap rounded-[3px] border border-white/15 bg-[#12161C]/90 px-2 py-1 font-mono text-[10px] tracking-widest text-[#4DEEEA]">
              03 // PRISMATIC CORE
            </div>
          </Html>
        )}
      </group>

      {/* CAPTURE PULSE SHOCKWAVE RING */}
      <mesh
        ref={shockwaveRef}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        material={shockwaveMat}
      >
        <planeGeometry args={[2.2, 2.2]} />
      </mesh>
    </group>
  );
};
