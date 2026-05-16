import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, Stars, useTexture } from '@react-three/drei';
import { gsap } from 'gsap';
import { clsx, type ClassValue } from 'clsx';
import {
  CalendarDays,
  Clock,
  LockKeyhole,
  MapPin,
  MessageCircle,
  ShieldAlert,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react';
import * as THREE from 'three';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const imagePaths = Array.from({ length: 10 }, (_, index) => `/assets/chloe_${index + 1}.jpg`);

const eventDetails = [
  {
    icon: CalendarDays,
    label: 'DATE',
    value: 'Saturday, 4th July 2026',
  },
  {
    icon: Clock,
    label: 'TIME',
    value: 'Doors open: 21:00 | Guests arrive by: 21:45 (Strict)',
  },
  {
    icon: MapPin,
    label: 'LOCATION',
    value: 'Sion Spaces, 426-428 Streatham High Road, London, SW16 3PX (Inside Black Kitchen)',
  },
  {
    icon: UserRoundCheck,
    label: 'DRESS CODE',
    value: 'Smart Casual - Dressed to Impress. No basic/dusty clothes allowed.',
  },
];

const whatsappLink =
  'https://wa.me/447944545322?text=Hi%20Hannah%2C%20please%20add%20my%20guest%20names%20to%20Chloe%27s%20birthday%20guestlist.';

type SceneProps = {
  decrypted: boolean;
};

type ImageFacetProps = {
  decrypted: boolean;
  index: number;
  texture: THREE.Texture;
  total: number;
};

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(210 * 3);
    for (let index = 0; index < 210; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 9;
      values[index * 3 + 1] = (Math.random() - 0.5) * 5.4;
      values[index * 3 + 2] = (Math.random() - 0.5) * 5.8;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.y += delta * 0.025;
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.32) * 0.06;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ff8a3d" size={0.018} transparent opacity={0.72} sizeAttenuation />
    </points>
  );
}

function ImageFacet({ decrypted, index, texture, total }: ImageFacetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const angle = (index / total) * Math.PI * 2;
  const isPortrait = index !== 3 && index !== 7;
  const width = isPortrait ? 0.56 : 0.68;
  const height = isPortrait ? 0.78 : 0.62;
  const initialPosition = useMemo<[number, number, number]>(
    () => [
      Math.cos(angle) * 1.45,
      ((index % 5) - 2) * 0.27,
      Math.sin(angle) * 0.72,
    ],
    [angle, index],
  );
  const shatterPosition = useMemo<[number, number, number]>(
    () => [
      Math.cos(angle) * (3.3 + (index % 3) * 0.42),
      ((index % 5) - 2) * 0.62 + (index % 2 === 0 ? 0.75 : -0.52),
      Math.sin(angle) * (2.1 + (index % 4) * 0.26),
    ],
    [angle, index],
  );

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  }, [texture]);

  useFrame((state) => {
    if (!meshRef.current || decrypted) {
      return;
    }

    meshRef.current.position.y = initialPosition[1] + Math.sin(state.clock.elapsedTime * 0.9 + index) * 0.035;
  });

  useEffect(() => {
    if (!decrypted || !meshRef.current || !materialRef.current) {
      return;
    }

    gsap.to(meshRef.current.position, {
      x: shatterPosition[0],
      y: shatterPosition[1],
      z: shatterPosition[2],
      duration: 1.25,
      delay: index * 0.025,
      ease: 'power4.out',
    });
    gsap.to(meshRef.current.rotation, {
      x: meshRef.current.rotation.x + 3.5 + index * 0.28,
      y: meshRef.current.rotation.y + 4.2,
      z: meshRef.current.rotation.z + 2.4,
      duration: 1.35,
      delay: index * 0.02,
      ease: 'power3.out',
    });
    gsap.to(materialRef.current, {
      opacity: 0,
      duration: 0.68,
      delay: 0.72 + index * 0.02,
      ease: 'power2.out',
    });
  }, [decrypted, index, shatterPosition]);

  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      rotation={[0.1, -angle + Math.PI / 2, index % 2 === 0 ? 0.1 : -0.1]}
    >
      <planeGeometry args={[width, height, 1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
        roughness={0.34}
        metalness={0.12}
        emissive="#ff6b35"
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

function GlassVault({ decrypted }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const textures = useTexture(imagePaths);
  const { camera, size } = useThree();
  const isMobile = size.width < 720;

  useFrame((state, delta) => {
    if (!groupRef.current || decrypted) {
      return;
    }

    groupRef.current.rotation.y += delta * (isMobile ? 0.18 : 0.28);
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.42) * 0.08;
  });

  useEffect(() => {
    if (!decrypted || !groupRef.current || !coreRef.current || !glassRef.current) {
      return;
    }

    const coreMaterial = coreRef.current.material as THREE.MeshStandardMaterial;
    const glassMaterial = glassRef.current.material as THREE.Material;

    gsap
      .timeline()
      .to(camera.position, {
        z: isMobile ? 1.55 : 1.05,
        y: 0.12,
        duration: 1.05,
        ease: 'power4.in',
        onUpdate: () => camera.lookAt(0, 0, 0),
      })
      .to(
        coreRef.current.scale,
        {
          x: 6.8,
          y: 6.8,
          z: 6.8,
          duration: 1,
          ease: 'expo.in',
        },
        '<',
      )
      .to(
        coreMaterial,
        {
          opacity: 0,
          duration: 0.62,
          ease: 'power2.out',
        },
        '-=0.3',
      )
      .to(
        glassMaterial,
        {
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
        },
        '<',
      );
  }, [camera, decrypted, isMobile]);

  return (
    <group ref={groupRef} position={isMobile ? [0, 1.18, 0] : [1.22, 0.2, 0]} scale={isMobile ? 0.72 : 1.12}>
      <mesh ref={glassRef}>
        <icosahedronGeometry args={[1.12, 1]} />
        <MeshTransmissionMaterial
          color="#141b33"
          emissive="#ff6b35"
          emissiveIntensity={0.22}
          opacity={0.28}
          transparent
          roughness={0.18}
          transmission={0.68}
          thickness={0.9}
        />
      </mesh>

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.36, 32, 32]} />
        <meshStandardMaterial color="#ff9a4a" emissive="#ff6b35" emissiveIntensity={3.2} transparent opacity={0.82} />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.16, 1)]} />
        <lineBasicMaterial color="#ffb088" transparent opacity={0.72} />
      </lineSegments>

      {textures.map((texture, index) => (
        <ImageFacet key={imagePaths[index]} decrypted={decrypted} index={index} texture={texture} total={textures.length} />
      ))}
    </group>
  );
}

function Scene({ decrypted }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.16, 4.5], fov: 44 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#050814']} />
      <fog attach="fog" args={['#050814', 4.4, 8.8]} />
      <ambientLight intensity={0.46} />
      <pointLight position={[2.4, 2.8, 3.4]} intensity={1.75} color="#7cecff" />
      <pointLight position={[-2.8, -1.8, 2.4]} intensity={3.1} color="#ff6b35" />
      <pointLight position={[0, 0, 1]} intensity={2.2} color="#ff9a4a" />
      <Stars radius={34} depth={20} count={900} factor={2.5} fade speed={0.35} />
      <FloatingParticles />
      <GlassVault decrypted={decrypted} />
      <Environment preset="night" />
    </Canvas>
  );
}

function App() {
  const [decrypted, setDecrypted] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!decrypted || !introRef.current || !revealRef.current) {
      return;
    }

    const details = revealRef.current.querySelectorAll('.stagger-in');
    gsap
      .timeline()
      .to(introRef.current, {
        autoAlpha: 0,
        y: -32,
        duration: 0.45,
        ease: 'power2.in',
      })
      .fromTo(
        revealRef.current,
        { autoAlpha: 0, y: 38 },
        { autoAlpha: 1, y: 0, duration: 0.72, ease: 'power3.out' },
        '+=0.7',
      )
      .fromTo(
        details,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, stagger: 0.075, duration: 0.5, ease: 'power3.out' },
        '-=0.3',
      )
      .fromTo(
        '.classified-rule',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.68, stagger: 0.08, ease: 'power3.out' },
        '-=0.45',
      );
  }, [decrypted]);

  return (
    <main className={cn('app-shell text-slate-50')}>
      <div className="scene-wrap" aria-hidden="true">
        <Scene decrypted={decrypted} />
      </div>
      <div className="screen-vignette" />

      <section ref={introRef} className="intro-panel" aria-label="Encrypted invitation">
        <p className="eyebrow">MIDNIGHT TANGERINE // CLASSIFIED VAULT</p>
        <h1>Chloe</h1>
        <p className="intro-copy">A photo-sealed birthday transmission. Access requires discretion.</p>
        <button className="decrypt-button" type="button" onClick={() => setDecrypted(true)}>
          <LockKeyhole size={20} aria-hidden="true" />
          <span>DECRYPT INVITATION</span>
        </button>
      </section>

      <section ref={revealRef} className="dossier px-3 sm:px-5" aria-label="Decrypted event invitation">
        <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="classified-panel stagger-in lg:col-span-2">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="eyebrow">TOP SECRET // SURPRISE DOSSIER</p>
                <h2>TOP SECRET: CHLOE&apos;S BIRTHDAY TURN UP</h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-orange-50/82 md:text-lg">
                  A strictly confidential birthday operation with midnight luxury energy, tangerine glow, and zero leaks.
                </p>
              </div>
              <div className="rounded-full border border-orange-300/35 bg-orange-500/15 px-4 py-2 text-sm font-black text-orange-100 shadow-[0_0_30px_rgba(255,107,53,0.22)]">
                ACCESS GRANTED
              </div>
            </div>
            <span className="classified-rule mt-5 block h-px w-full bg-gradient-to-r from-orange-300 via-cyan-200 to-transparent" />
          </div>

          <div className="grid gap-4">
            {eventDetails.map((detail) => {
              const Icon = detail.icon;
              return (
                <article className="detail-card stagger-in" key={detail.label}>
                  <Icon size={22} aria-hidden="true" />
                  <div>
                    <p>{detail.label}</p>
                    <strong>{detail.value}</strong>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="classified-panel stagger-in overflow-hidden">
            <p className="eyebrow">VISUAL FILE // CHLOE</p>
            <div className="photo-grid mt-4" aria-label="Chloe photo preview grid">
              {imagePaths.slice(0, 6).map((path, index) => (
                <img key={path} src={path} alt={`Chloe preview ${index + 1}`} loading="lazy" />
              ))}
            </div>
            <span className="classified-rule my-5 block h-px w-full bg-gradient-to-r from-orange-300 via-orange-500 to-transparent" />
            <p className="text-sm leading-6 text-slate-200/80">
              These files stay inside the invitation experience: vault facets, background echoes, and classified visual evidence.
            </p>
          </aside>

          <div className="warning-strip stagger-in lg:col-span-2">
            <ShieldAlert size={22} aria-hidden="true" />
            <span>
              WARNING: THIS IS A SURPRISE. DO NOT MENTION ANYTHING TO CHLOE. DOORS LOCKED 21:45 - ARRIVAL.
            </span>
          </div>

          <div className="classified-panel stagger-in lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="eyebrow">RSVP PROTOCOL</p>
                <p className="mt-2 text-xl font-black text-white">Text guest names to Hannah: 07944545322</p>
              </div>
              <a className="rsvp-button" href={whatsappLink} target="_blank" rel="noreferrer">
                <MessageCircle size={21} aria-hidden="true" />
                <span>Tap to RSVP via WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="image-ribbon stagger-in lg:col-span-2" aria-label="Chloe photo ribbon">
            {imagePaths.map((path, index) => (
              <img key={path} src={path} alt={`Chloe memory ${index + 1}`} loading="lazy" />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:col-span-2">
            {[
              ['Live DJ', 'High energy from doors to last tune.'],
              ['Photobooth', 'Instant keepsakes for the night.'],
              ['Photographer', 'Professional coverage of the surprise.'],
            ].map(([title, copy]) => (
              <article className="experience-card stagger-in" key={title}>
                <Sparkles size={23} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
