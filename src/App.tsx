import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, Stars } from '@react-three/drei';
import { gsap } from 'gsap';
import {
  CalendarDays,
  Camera,
  Clock,
  MapPin,
  MessageCircle,
  Music2,
  ShieldAlert,
  Sparkles,
  UserRoundCheck,
  Video,
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
    value: 'Cyan Lounge, Sion Spaces, within Black Kitchen, 426-428 Streatham High Road, London, SW16 3PX',
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

const experienceMoments = [
  {
    icon: Music2,
    title: 'DJ Pressure',
    copy: 'A high-energy midnight soundtrack built for the surprise reveal and the turn up after.',
  },
  {
    icon: Camera,
    title: 'Flash Evidence',
    copy: 'Photobooth and photographer moments framed like classified snapshots from the night.',
  },
  {
    icon: Video,
    title: 'Chloe Reel',
    copy: 'A cinematic hero sequence can drop in once we have 6-10 strong Chloe photos or a short video.',
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
          color="#ff8a2a"
          emissive="#ff5d0a"
          emissiveIntensity={0.68}
          opacity={0.78}
          transparent
          roughness={0.22}
          transmission={0.55}
          thickness={0.7}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.42, 1)]} />
        <lineBasicMaterial color="#ffb36d" transparent opacity={0.7} />
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
            color={index % 3 === 0 ? '#ff8a2a' : '#6bd7ff'}
            emissive={index % 3 === 0 ? '#ff5d0a' : '#005dff'}
            emissiveIntensity={1.1}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function CyanLoungeHologram({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.08;
    groupRef.current.position.y = -0.8 + Math.sin(state.clock.elapsedTime * 0.7) * 0.035;

    if (scanRef.current) {
      scanRef.current.position.z = ((state.clock.elapsedTime * 1.2) % 5.2) - 2.6;
    }

    if (active) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.94, -0.65]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]}>
        <planeGeometry args={[8.5, 7.2, 18, 18]} />
        <meshStandardMaterial
          color="#041016"
          emissive="#3a1606"
          emissiveIntensity={0.48}
          wireframe
          transparent
          opacity={0.34}
        />
      </mesh>
      <mesh position={[0, -0.25, -1.2]}>
        <boxGeometry args={[3.7, 0.55, 0.9]} />
        <meshStandardMaterial
          color="#06131a"
          emissive="#ff6d13"
          emissiveIntensity={0.52}
          roughness={0.34}
          metalness={0.68}
        />
      </mesh>
      <mesh position={[0, 0.16, -1.63]}>
        <boxGeometry args={[3.25, 0.11, 0.08]} />
        <meshStandardMaterial color="#ffb36d" emissive="#ff6d13" emissiveIntensity={2.8} />
      </mesh>
      {[-1.45, -0.72, 0, 0.72, 1.45].map((x) => (
        <mesh key={x} position={[x, 0.18, -1.22]}>
          <cylinderGeometry args={[0.08, 0.1, 0.56, 16]} />
          <meshStandardMaterial
            color={x === 0 ? '#f7c86d' : '#5feaff'}
            emissive={x === 0 ? '#ff6d13' : '#00d5ff'}
            emissiveIntensity={1.7}
            transparent
            opacity={0.86}
          />
        </mesh>
      ))}
      {[-2.8, 2.8].map((x) => (
        <group key={x} position={[x, -0.05, -0.35]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 1.92, 18]} />
          <meshStandardMaterial color="#0b2029" emissive="#ff6d13" emissiveIntensity={0.55} />
          </mesh>
          <mesh position={[0, 1.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 1.45, 18]} />
            <meshStandardMaterial color="#ffb36d" emissive="#ff6d13" emissiveIntensity={2.3} />
          </mesh>
        </group>
      ))}
      <mesh ref={scanRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, -2]}>
        <planeGeometry args={[7.2, 0.06]} />
        <meshBasicMaterial color="#ff9d42" transparent opacity={0.74} />
      </mesh>
    </group>
  );
}

function Scene({ decrypted }: VaultSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0.22, 4.4], fov: 46 }} dpr={[1, 1.8]}>
      <color attach="background" args={['#030508']} />
      <fog attach="fog" args={['#030508', 4.2, 9]} />
      <ambientLight intensity={0.42} />
      <pointLight position={[2.4, 2.8, 3.6]} intensity={2.2} color="#4ea7ff" />
      <pointLight position={[-3.2, -2.2, 2.4]} intensity={2.4} color="#ff7a18" />
      <Stars radius={32} depth={20} count={1200} factor={3.2} fade speed={0.45} />
      <VaultCore decrypted={decrypted} />
      <CyanLoungeHologram active={decrypted} />
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
      )
      .fromTo(
        '.scan-line',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.78, stagger: 0.12, ease: 'power3.out' },
        '-=0.42',
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
          <p className="eyebrow">DECRYPTED // CYAN LOUNGE ACCESS</p>
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

        <div className="venue-brief stagger-in">
          <div>
            <p className="eyebrow">VENUE SCAN // MIDNIGHT LUXURY</p>
            <h3>Cyan Lounge Mode</h3>
            <p>
              The invite now opens like a digital vault, then resolves into a cyan-lit lounge briefing:
              neon bar glow, gold security lines, glass panels, and a premium party dossier.
            </p>
          </div>
          <div className="scan-stack" aria-hidden="true">
            <span className="scan-line" />
            <span className="scan-line" />
            <span className="scan-line" />
            <span className="scan-line" />
          </div>
        </div>

        <div className="experience-grid">
          {experienceMoments.map((moment) => {
            const Icon = moment.icon;
            return (
              <article className="experience-card stagger-in" key={moment.title}>
                <Icon size={23} aria-hidden="true" />
                <h3>{moment.title}</h3>
                <p>{moment.copy}</p>
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
