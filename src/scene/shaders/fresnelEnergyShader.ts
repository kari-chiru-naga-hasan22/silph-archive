import * as THREE from 'three';

export function createFresnelCoreMaterial(
  primaryHex = '#FF4D1A',
  secondaryHex = '#FFB347'
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uPrimary: { value: new THREE.Color(primaryHex) },
      uSecondary: { value: new THREE.Color(secondaryHex) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uPulse;

      void main() {
        vUv = uv;
        vec3 displaced = position * (1.0 + sin(uTime * 3.5 + position.y * 6.0) * 0.025 + uPulse * 0.14);
        vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
        vWorldPos = worldPos.xyz;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uPulse;
      uniform vec3 uPrimary;
      uniform vec3 uSecondary;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - max(0.0, dot(viewDir, normalize(vNormalWorld))), 2.4);
        float bands = 0.5 + 0.5 * sin(vUv.y * 18.0 - uTime * 3.2 + sin(vUv.x * 12.0 + uTime));
        vec3 col = mix(uPrimary, uSecondary, clamp(bands * 0.7 + fresnel * 0.6, 0.0, 1.0));
        float boost = 1.15 + uPulse * 1.45 + fresnel * 1.1;
        gl_FragColor = vec4(col * boost, 0.92);
      }
    `,
    transparent: true,
    depthWrite: true,
  });
}

export function createShockwaveMaterial(colorHex = '#FF4D1A'): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uProgress: { value: 0 },
      uColor: { value: new THREE.Color(colorHex) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      uniform float uProgress;
      uniform vec3 uColor;

      void main() {
        vec2 centered = (vUv - 0.5) * 2.0;
        float dist = length(centered);
        float ringRadius = mix(0.1, 0.95, uProgress);
        float ring = smoothstep(0.09, 0.0, abs(dist - ringRadius));
        float innerRing = smoothstep(0.04, 0.0, abs(dist - ringRadius * 0.68));
        float fade = (1.0 - uProgress) * step(0.001, uProgress) * step(uProgress, 0.999);
        float alpha = (ring + innerRing * 0.5) * fade * 0.9;
        gl_FragColor = vec4(uColor * 1.6, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}
