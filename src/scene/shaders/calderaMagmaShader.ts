import * as THREE from 'three';

export function createCalderaMagmaMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMoltenColor: { value: new THREE.Color('#FF4D1A') },
      uEmberColor: { value: new THREE.Color('#FFB347') },
      uBasaltColor: { value: new THREE.Color('#0E1117') },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      uniform float uTime;
      uniform vec3 uMoltenColor;
      uniform vec3 uEmberColor;
      uniform vec3 uBasaltColor;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 4; i++) {
          v += amp * noise(p);
          p *= 2.04;
          amp *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 centered = vUv - 0.5;
        float radial = length(centered) * 2.0;
        vec2 q = centered * 7.5 + vec2(uTime * 0.06, -uTime * 0.04);
        float n1 = fbm(q);
        float n2 = fbm(q * 1.8 - vec2(uTime * 0.08, n1 * 1.5));
        float fissure = abs(n1 - n2);
        float crack = smoothstep(0.11, 0.015, fissure);
        float pulse = 0.78 + 0.22 * sin(uTime * 2.3 + radial * 5.0);
        vec3 lava = mix(uMoltenColor, uEmberColor, clamp(crack * 1.25, 0.0, 1.0)) * (1.35 * pulse);
        float edgeMask = 1.0 - smoothstep(0.75, 0.98, radial);
        vec3 finalCol = mix(uBasaltColor, lava, crack * edgeMask);
        gl_FragColor = vec4(finalCol, 1.0);
      }
    `,
  });
}

export function createHeatHazeMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#FF6A2B') },
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
      uniform float uTime;
      uniform vec3 uColor;

      void main() {
        float wave = sin(vUv.y * 18.0 - uTime * 4.5 + sin(vUv.x * 9.0 + uTime * 2.0));
        float fadeY = smoothstep(0.0, 0.25, vUv.y) * (1.0 - smoothstep(0.55, 1.0, vUv.y));
        float fadeX = 1.0 - abs(vUv.x - 0.5) * 2.0;
        fadeX = smoothstep(0.0, 0.5, fadeX);
        float alpha = clamp((0.5 + 0.5 * wave) * fadeY * fadeX * 0.16, 0.0, 0.22);
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}
