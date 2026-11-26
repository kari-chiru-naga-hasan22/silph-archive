import * as THREE from 'three';

export function createHoloFoilMaterial(
  frontTex: THREE.Texture,
  foilNormal: THREE.Texture,
  accentHex = '#FF4D1A',
  rarityMode = 0
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: frontTex },
      uFoilNormal: { value: foilNormal },
      uTime: { value: 0 },
      uRarity: { value: rarityMode },
      uAccent: { value: new THREE.Color(accentHex) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;

      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;
      uniform sampler2D uMap;
      uniform sampler2D uFoilNormal;
      uniform float uTime;
      uniform float uRarity;
      uniform vec3 uAccent;

      vec3 rainbow(float t) {
        vec3 a = vec3(0.5);
        vec3 b = vec3(0.5);
        vec3 c = vec3(1.0);
        vec3 d = vec3(0.0, 0.33, 0.67);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec4 tex = texture2D(uMap, vUv);
        vec3 foilN = texture2D(uFoilNormal, vUv * 3.5).rgb * 2.0 - 1.0;
        vec3 N = normalize(vNormalWorld + foilN * 0.22);
        vec3 V = normalize(cameraPosition - vWorldPos);
        float ndotv = max(0.0, dot(N, V));
        float fresnel = pow(1.0 - ndotv, 2.2);

        float phase = (vUv.x * 1.4 + vUv.y * 0.9) + (1.0 - ndotv) * 2.4 + uTime * 0.12;
        vec3 prism = rainbow(phase);

        // Micro-glitter grid
        vec2 cell = floor(vUv * 90.0);
        float spark = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
        float glitter = smoothstep(0.92, 0.995, spark) * pow(1.0 - abs(ndotv - 0.65), 4.0);

        float borderDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
        float frameMask = 1.0 - smoothstep(0.03, 0.06, borderDist);

        // Rarity modes: 0 = Illustration Rare, 1 = Hyper Gold, 2 = Secret Prism
        vec3 goldTint = vec3(1.0, 0.84, 0.36);
        vec3 foilColor = mix(prism, goldTint, step(0.5, uRarity) * (1.0 - step(1.5, uRarity)) * 0.72);
        float foilStrength = mix(0.28, 0.55, clamp(uRarity * 0.5, 0.0, 1.0));

        vec3 finalCol = tex.rgb + foilColor * (fresnel * 0.6 + 0.14) * foilStrength;
        finalCol += prism * glitter * 0.95;
        finalCol += mix(uAccent, goldTint, step(0.5, uRarity)) * frameMask * 0.38;

        gl_FragColor = vec4(finalCol, 1.0);
      }
    `,
  });
}
