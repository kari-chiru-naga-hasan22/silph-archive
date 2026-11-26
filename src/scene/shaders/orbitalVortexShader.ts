import * as THREE from 'three';

export function createOrbitalVortexMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uEmerald: { value: new THREE.Color('#10B981') },
      uSolar: { value: new THREE.Color('#FACC15') },
      uVoid: { value: new THREE.Color('#090B0E') },
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
      uniform vec3 uEmerald;
      uniform vec3 uSolar;
      uniform vec3 uVoid;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float s = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          s += a * noise(p);
          p *= 2.02;
          a *= 0.5;
        }
        return s;
      }

      void main() {
        vec2 centered = (vUv - 0.5) * 2.0;
        float r = length(centered);
        float angle = atan(centered.y, centered.x);
        float swirl = angle + r * 3.6 - uTime * 0.65;
        vec2 polarUv = vec2(cos(swirl), sin(swirl)) * (r * 3.0);
        float cloud = fbm(polarUv + vec2(uTime * 0.14, -uTime * 0.1));
        float band = smoothstep(0.32, 0.85, cloud) * smoothstep(0.15, 0.55, r) * (1.0 - smoothstep(0.65, 1.0, r));
        vec3 col = mix(uVoid, uEmerald, band * 0.9);
        col += uSolar * pow(band, 2.8) * 0.55;
        float alpha = clamp(band * 0.88, 0.0, 0.92);
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}
