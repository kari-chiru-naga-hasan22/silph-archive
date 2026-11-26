import * as THREE from 'three';

export function createCausticWaterMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color('#071B2B') },
      uCerulean: { value: new THREE.Color('#0EA5E9') },
      uFoam: { value: new THREE.Color('#BAE6FD') },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vNormalWorld;
      uniform float uTime;

      void main() {
        vUv = uv;
        vec3 p = position;
        float dist = length(uv - 0.5);
        float ripple = sin(dist * 26.0 - uTime * 3.2) * 0.022 * (1.0 - smoothstep(0.2, 0.5, dist));
        p.z += ripple;
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vWorldPos = wp.xyz;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vNormalWorld;
      uniform float uTime;
      uniform vec3 uDeepColor;
      uniform vec3 uCerulean;
      uniform vec3 uFoam;

      vec2 hash22(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return fract(sin(p) * 43758.5453);
      }

      float voronoi(vec2 x, float t) {
        vec2 n = floor(x);
        vec2 f = fract(x);
        float md = 8.0;
        for (int j = -1; j <= 1; j++) {
          for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash22(n + g);
            o = 0.5 + 0.5 * sin(t + 6.2831 * o);
            vec2 r = g + o - f;
            float d = dot(r, r);
            if (d < md) md = d;
          }
        }
        return sqrt(md);
      }

      void main() {
        vec2 centered = vUv - 0.5;
        float radial = length(centered) * 2.0;
        float c1 = voronoi(vUv * 8.0, uTime * 1.15);
        float c2 = voronoi(vUv * 11.5 + vec2(2.3, -1.7), -uTime * 0.85);
        float caustic = pow(clamp(1.0 - min(c1, c2), 0.0, 1.0), 3.4);

        float rippleRing = smoothstep(0.035, 0.0, abs(fract(radial * 2.4 - uTime * 0.35) - 0.5)) * 0.35;
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - max(0.0, dot(viewDir, normalize(vNormalWorld))), 2.6);

        vec3 col = mix(uDeepColor, uCerulean, clamp(caustic * 0.85 + fresnel * 0.45, 0.0, 1.0));
        col += uFoam * (caustic * 0.75 + rippleRing * (1.0 - radial));
        float alpha = (1.0 - smoothstep(0.84, 0.99, radial)) * 0.92;
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
}
