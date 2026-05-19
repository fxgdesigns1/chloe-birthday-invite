export const hologramVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  uniform float uTime;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec3 transformed = position;
    float horizontalWave = sin((position.y * 22.0) + (uTime * 4.2)) * 0.018;
    float verticalWave = sin((position.x * 16.0) - (uTime * 3.4)) * 0.012;
    float glitchStep = step(0.965, fract(position.y * 18.0 + uTime * 1.7));

    transformed.x += horizontalWave + glitchStep * sin(uTime * 26.0) * 0.045;
    transformed.z += verticalWave + glitchStep * 0.018;

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const hologramFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  uniform sampler2D uVideo;
  uniform float uTime;
  uniform vec3 uOrange;
  uniform float uHasVideo;

  float videoLuma(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
  }

  void main() {
    vec2 glitchUv = vUv;
    float band = step(0.975, fract(vUv.y * 38.0 + uTime * 1.8));
    glitchUv.x += band * sin(uTime * 22.0 + vUv.y * 18.0) * 0.018;

    vec4 videoColor = texture2D(uVideo, glitchUv);
    float centerLum = videoLuma(videoColor.rgb);
    float rightLum = videoLuma(texture2D(uVideo, glitchUv + vec2(0.0035, 0.0)).rgb);
    float upLum = videoLuma(texture2D(uVideo, glitchUv + vec2(0.0, 0.005)).rgb);
    float alphaMask = smoothstep(0.16, 0.46, centerLum);
    float edge = smoothstep(0.055, 0.22, abs(centerLum - rightLum) + abs(centerLum - upLum));

    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), viewDirection)), 2.2);
    float scanline = step(0.5, fract(vUv.y * 96.0 - uTime * 8.0)) * 0.16;
    float pulse = 0.78 + sin(uTime * 3.0 + vUv.y * 10.0) * 0.08;
    float fallbackMask = smoothstep(0.42, 0.4, abs(vUv.x - 0.5)) * smoothstep(0.5, 0.18, abs(vUv.y - 0.52));

    float shapeMask = mix(fallbackMask, alphaMask, uHasVideo);
    float finalAlpha = max(edge * 1.4, shapeMask * 0.72 + fresnel * 0.5 + scanline * shapeMask);

    if (finalAlpha < 0.065) {
      discard;
    }

    vec3 color = uOrange * (pulse + edge * 1.35 + fresnel * 0.9 + scanline);
    color += vec3(0.18, 0.95, 1.0) * edge * 0.18;

    gl_FragColor = vec4(color, clamp(finalAlpha, 0.0, 0.94));
  }
`;
