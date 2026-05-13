import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, Stars } from '@react-three/drei';
import { gsap } from 'gsap';
import {
  CalendarDays,
  Clock,
  MapPin,
  MessageCircle,
  ShieldAlert,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react';
import * as THREE from 'three';

const eventDetails = [
  {
    icon: CalendarDays,
    label: 'DATE',
    value: 'Saturday, 4th July 2026',
  },
  {
    icon: Clock,
    label: 'ENTRY WINDOW',
    value: 'Doors 21:00. Lockout from 21:45 until arrival.',
  },
  {
    icon: MapPin,
    label: 'LOCATION',
    value: 'Sion Spaces, within Black Kitchen, 426-428 Streatham High Road, London, SW16 3PX',
  },
  {
    icon: UserRoundCheck,
    label: 'DRESS CODE',
    value: 'Smart Casual. Dressed to impress. No dusty clothes.',
  },
  {
    icon: Sparkles,
    label: 'VIBE',
    value: 'Midnight Luxury. High Energy.',
  },
];

const whatsappLink =
  'https://wa.me/447944545322?text=Hi%20Hannah%2C%20please%20add%20me%20to%20Chloe%27s%20birthday%20guestlist.';

type VaultSceneProps = {
  decrypted: boolean;
};

function VaultCore({ decrypted }: VaultSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shardRefs = useRef<THREE.Mesh[]>([]);
  const { camera } = useThree();

  const shards = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => {
        const angle = (index / 36) * Math.PI * 2;
        const radius = 0.82 + (index % 5) * 0.08;
        return {
          start: [Math.cos(angle) * radius, Math.sin(angle * 1.7) * 0.32, Math.sin(angle) * radius],
          end: [
            Math.cos(angle) * (3.2 + (index % 4) * 0.35),
            Math.sin(angle * 1.3) * 2.2,
            Math.sin(angle) * (2.8 + (index % 6) * 0.22),
          ],
          rotation: [angle * 1.8, angle * 0.7, angle * 1.2],
          scale: 0.08 + (index % 4) * 0.015,
        };
      }),
    [],
  );

  useFrame((_, delta) => {
    if (!groupRef.current || decrypted) {
      return;
    }

    groupRef.current.rotation.y += delta * 0.42;
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.00045) * 0.16;
  });

  useEffect(() => {
    if (!decrypted || !groupRef.current || !coreRef.current) {
      return;
    }

    const timeline = gsap.timeline();
    timeline
      .to(camera.position, {
        z: 0.82,
        y: 0.18,
        duration: 1.2,
        ease: 'power4.in',
      })
      .to(
        coreRef.current.scale,
        {
          x: 7.5,
          y: 7.5,
          z: 7.5,
          duration: 1.1,
          ease: 'expo.in',
        },
        '<',
      )
      .to(
        coreRef.current.material,
        {
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
        },
        '-=0.36',
      );

    shardRefs.current.forEach((mesh, index) => {
      const shard = shards[index];
      if (!mesh || !shard) {
        return;
      }

      gsap.to(mesh.material, {
        opacity: 0.82,
        duration: 0.18,
        delay: 0.08 + index * 0.005,
      });
      gsap.to(mesh.position, {
        x: shard.end[0],
        y: shard.end[1],
        z: shard.end[2],
        duration: 1.35,
        delay: 0.05,
        ease: 'power4.out',
      });
      gsap.to(mesh.rotation, {
        x: shard.rotation[0] + 6,
        y: shard.rotation[1] + 8,
        z: shard.rotation[2] + 5,
        duration: 1.45,
        ease: 'power3.out',
      });
      gsap.to(mesh.material, {
        opacity: 0,
        duration: 0.65,
        delay: 0.8,
      });
    });

    gsap.to(groupRef.current.rotation, {
      z: Math.PI * 2,
      duration: 1.15,
      ease: 'power4.inOut',
    });
  }, [camera, decrypted, shards]);

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <MeshTransmissionMaterial
          color="#74c7ff"
          emissive="#0f6fff"
          emissiveIntensity={0.52}
          opacity={0.78}
          transparent
          roughness={0.22}
          transmission={0.55}
          thickness={0.7}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.42, 1)]} />
        <lineBasicMaterial color="#f6c76b" transparent opacity={0.62} />
      </lineSegments>
      {shards.map((shard, index) => (
        <mesh
          key={index}
          ref={(node) => {
            if (node) {
              shardRefs.current[index] = node;
            }
          }}
          position={shard.start as [number, number, number]}
          rotation={shard.rotation as [number, number, number]}
          scale={shard.scale}
        >
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={index % 3 === 0 ? '#f8c76d' : '#6bd7ff'}
            emissive={index % 3 === 0 ? '#b87513' : '#005dff'}
            emissiveIntensity={1.1}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ decrypted }: VaultSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0.22, 4.4], fov: 46 }} dpr={[1, 1.8]}>
      <color attach="background" args={['#030508']} />
      <fog attach="fog" args={['#030508', 4.2, 9]} />
      <ambientLight intensity={0.42} />
      <pointLight position={[2.4, 2.8, 3.6]} intensity={2.4} color="#4ea7ff" />
      <pointLight position={[-3.2, -2.2, 2.4]} intensity={2} color="#d9a441" />
      <Stars radius={32} depth={20} count={1200} factor={3.2} fade speed={0.45} />
      <VaultCore decrypted={decrypted} />
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
        y: -28,
        duration: 0.42,
        ease: 'power2.in',
      })
      .fromTo(
        revealRef.current,
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 0.62, ease: 'power3.out' },
        '+=0.68',
      )
      .fromTo(
        details,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.52, ease: 'power3.out' },
        '-=0.2',
      );
  }, [decrypted]);

  return (
    <main className="app-shell">
      <div className="scene-wrap" aria-hidden="true">
        <Scene decrypted={decrypted} />
      </div>
      <div className="screen-vignette" />

      <section ref={introRef} className="intro-panel" aria-label="Encrypted invitation">
        <p className="eyebrow">CLASSIFIED DOSSIER // ACCESS LEVEL MIDNIGHT</p>
        <h1>Chloe</h1>
        <p className="intro-copy">Surprise birthday transmission sealed in the digital vault.</p>
        <button className="decrypt-button" type="button" onClick={() => setDecrypted(true)}>
          <ShieldAlert size={20} aria-hidden="true" />
          <span>DECRYPT INVITATION</span>
        </button>
      </section>

      <section ref={revealRef} className="dossier" aria-label="Decrypted event invitation">
        <div className="dossier-header stagger-in">
          <p className="eyebrow">DECRYPTED // STRICTLY CONFIDENTIAL</p>
          <h2>Chloe&apos;s Surprise Birthday Party</h2>
          <p>Do not tell Chloe. If you see her beforehand, keep this locked down.</p>
        </div>

        <div className="warning-strip stagger-in">
          <ShieldAlert size={20} aria-hidden="true" />
          <span>STRICTLY CONFIDENTIAL. DO NOT TELL CHLOE.</span>
        </div>

        <div className="detail-grid">
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

        <div className="action-row stagger-in">
          <a className="rsvp-button" href={whatsappLink} target="_blank" rel="noreferrer">
            <MessageCircle size={21} aria-hidden="true" />
            <span>Tap to RSVP via WhatsApp</span>
          </a>
          <p>Hannah: 07944 545322</p>
        </div>
      </section>
    </main>
  );
}

export default App;
