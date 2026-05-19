import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { hologramFragmentShader, hologramVertexShader } from './shaders';

type HologramMeshProps = {
  active: boolean;
  videoSource: string;
  onEnded: () => void;
  onVideoError: () => void;
};

const createFallbackTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const context = canvas.getContext('2d');

  if (context) {
    context.fillStyle = '#111111';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.ellipse(8, 7, 4, 5, 0, 0, Math.PI * 2);
    context.fill();
    context.fillRect(5, 11, 6, 5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
};

export function HologramMesh({ active, videoSource, onEnded, onVideoError }: HologramMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const fallbackTexture = useMemo(createFallbackTexture, []);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uVideo: { value: fallbackTexture },
          uOrange: { value: new THREE.Color('#ff6b35') },
          uHasVideo: { value: 0 },
        },
        vertexShader: hologramVertexShader,
        fragmentShader: hologramFragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    [fallbackTexture],
  );

  useEffect(() => {
    materialRef.current = material;
    return () => {
      material.dispose();
    };
  }, [material]);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const video = document.createElement('video');
    let texture: THREE.VideoTexture | null = null;
    let reportedError = false;

    const reportError = () => {
      if (reportedError) {
        return;
      }

      reportedError = true;
      material.uniforms.uVideo.value = fallbackTexture;
      material.uniforms.uHasVideo.value = 0;
      onVideoError();
    };

    const onCanPlay = () => {
      texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      material.uniforms.uVideo.value = texture;
      material.uniforms.uHasVideo.value = 1;
      setVideoTexture(texture);
      void video.play().catch(reportError);
    };

    video.src = videoSource;
    video.crossOrigin = 'anonymous';
    video.playsInline = true;
    video.preload = 'auto';
    video.loop = false;
    video.muted = false;
    video.addEventListener('canplay', onCanPlay, { once: true });
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', reportError, { once: true });
    video.load();

    return () => {
      video.pause();
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', reportError);
      video.removeAttribute('src');
      video.load();
      texture?.dispose();
      setVideoTexture(null);
    };
  }, [active, fallbackTexture, material, onEnded, onVideoError, videoSource]);

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uHasVideo.value = videoTexture ? 1 : material.uniforms.uHasVideo.value;

    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.72) * 0.08;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.44) * 0.018;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.045;
      meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, active ? 1 : 0.78, 5, delta);
      meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, active ? 1 : 0.78, 5, delta);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0.08, 0]}>
        <planeGeometry args={[2.6, 3.35, 96, 128]} />
        <primitive object={material} attach="material" />
      </mesh>
      <mesh position={[0, -1.72, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.52, 1.38, 96]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
