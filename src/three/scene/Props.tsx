import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Theme } from '../theme';

/* ------------------------------------------------------------------ *
 * Guitar on a stand
 * ------------------------------------------------------------------ */

export function Guitar({ theme }: { theme: Theme }) {
  const bodyShape = useMemo(() => {
    // Double-cutaway outline, Strat-ish proportions: widest across the lower bout,
    // pinched at the waist, two horns at the top with the bass horn reaching further.
    // The previous outline was too tall and narrow and read as a paddle.
    const s = new THREE.Shape();
    s.moveTo(0.035, 0.195);
    // treble horn, then down the upper bout
    s.bezierCurveTo(0.105, 0.225, 0.158, 0.192, 0.156, 0.112);
    // waist
    s.bezierCurveTo(0.152, 0.052, 0.104, 0.030, 0.116, -0.030);
    // lower bout, right side into the bottom
    s.bezierCurveTo(0.132, -0.132, 0.100, -0.243, 0.0, -0.248);
    // mirror back up the left
    s.bezierCurveTo(-0.100, -0.243, -0.132, -0.132, -0.116, -0.030);
    s.bezierCurveTo(-0.104, 0.030, -0.152, 0.052, -0.156, 0.112);
    // bass horn — longer, as on a real double cutaway
    s.bezierCurveTo(-0.160, 0.200, -0.098, 0.248, -0.035, 0.212);
    s.lineTo(0.035, 0.195);
    return s;
  }, []);

  const bodyGeom = useMemo(
    () =>
      new THREE.ExtrudeGeometry(bodyShape, {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.012,
        bevelSegments: 4,
        curveSegments: 24,
      }),
    [bodyShape],
  );

  return (
    // leaned back on its stand
    <group rotation={[0.12, 0, 0.06]}>
      {/* A dedicated key so the guitar reads in the dark warehouse theme —
          without it the body just disappears into the floor. */}
      <spotLight
        position={[0.9, 3.0, 1.5]}
        target-position={[0, 0.9, 0]}
        color={theme.name === 'arsenal' ? '#fff2e6' : '#ffd8b0'}
        intensity={22}
        angle={0.42}
        penumbra={0.85}
        distance={7}
        decay={2}
      />
      {/* ---- stand ---- */}
      <group>
        {[-0.42, 0.42].map((r) => (
          <mesh key={r} position={[Math.sin(r) * 0.26, 0.02, Math.cos(r) * 0.26]} rotation={[0, -r, 0]} castShadow>
            <boxGeometry args={[0.035, 0.035, 0.5]} />
            <meshStandardMaterial color="#17181b" roughness={0.75} metalness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 0.24, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.022, 0.48, 10]} />
          <meshStandardMaterial color="#17181b" roughness={0.7} metalness={0.5} />
        </mesh>
        {/* yoke arms that cradle the lower bout */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.075, 0.47, 0.02]} rotation={[0, 0, s * 0.5]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
            <meshStandardMaterial color="#17181b" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ---- guitar, standing in the yoke ---- */}
      <group position={[0, 0.86, 0.02]} rotation={[-0.1, 0, 0]}>
        {/* body */}
        <mesh geometry={bodyGeom} position={[0, 0, -0.025]} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={theme.name === 'arsenal' ? '#c8101a' : '#3b0d12'}
            roughness={0.18}
            metalness={0.35}
            clearcoat={0.9}
            clearcoatRoughness={0.1}
          />
        </mesh>
        {/* scratchplate */}
        <mesh position={[0.008, -0.035, 0.028]} scale={[1, 1.15, 1]}>
          <circleGeometry args={[0.088, 20]} />
          <meshStandardMaterial color="#0f1013" roughness={0.35} metalness={0.2} />
        </mesh>
        {/* pickups */}
        {[-0.005, -0.105].map((y, i) => (
          <mesh key={i} position={[0, y, 0.03]} castShadow>
            <boxGeometry args={[0.11, 0.026, 0.012]} />
            <meshStandardMaterial color="#c8c2b0" roughness={0.4} metalness={0.7} />
          </mesh>
        ))}
        {/* bridge */}
        <mesh position={[0, -0.17, 0.03]} castShadow>
          <boxGeometry args={[0.085, 0.03, 0.016]} />
          <meshStandardMaterial color="#cfd3d8" roughness={0.25} metalness={0.95} />
        </mesh>
        {/* control knobs */}
        {[[-0.072, -0.212], [-0.042, -0.242], [0.072, -0.212]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.034]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.014, 12]} />
            <meshStandardMaterial color="#dcd6c4" roughness={0.35} metalness={0.5} />
          </mesh>
        ))}

        {/* neck */}
        <mesh position={[0, 0.47, 0.005]} castShadow>
          <boxGeometry args={[0.05, 0.64, 0.022]} />
          <meshStandardMaterial color="#7a4a24" roughness={0.5} />
        </mesh>
        {/* fretboard */}
        <mesh position={[0, 0.47, 0.018]}>
          <boxGeometry args={[0.048, 0.64, 0.006]} />
          <meshStandardMaterial color="#241309" roughness={0.55} />
        </mesh>
        {/* frets */}
        {Array.from({ length: 16 }, (_, i) => (
          <mesh key={i} position={[0, 0.20 + i * 0.037, 0.0215]}>
            <boxGeometry args={[0.048, 0.0018, 0.001]} />
            <meshStandardMaterial color="#c9ced6" roughness={0.25} metalness={0.95} />
          </mesh>
        ))}
        {/* strings */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[-0.020 + i * 0.008, 0.30, 0.026]}>
            <boxGeometry args={[0.0009, 1.05, 0.0009]} />
            <meshStandardMaterial color="#d8dce2" roughness={0.2} metalness={1} />
          </mesh>
        ))}
        {/* headstock */}
        <mesh position={[0.008, 0.845, 0.004]} rotation={[0, 0, 0.06]} castShadow>
          <boxGeometry args={[0.07, 0.165, 0.02]} />
          <meshStandardMaterial color="#3b0d12" roughness={0.25} metalness={0.3} />
        </mesh>
        {/* tuners */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[(i % 2 ? 0.043 : -0.028), 0.795 + Math.floor(i / 2) * 0.042, 0.018]} castShadow>
            <cylinderGeometry args={[0.007, 0.007, 0.012, 8]} />
            <meshStandardMaterial color="#cfd3d8" roughness={0.3} metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* small practice amp beside the stand */}
      <group position={[0.55, 0, 0.02]} rotation={[0, -0.35, 0]}>
        <RoundedBox args={[0.36, 0.32, 0.22]} radius={0.014} smoothness={3} position={[0, 0.16, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#141416" roughness={0.9} />
        </RoundedBox>
        {/* speaker grille */}
        <mesh position={[0, 0.13, 0.112]}>
          <circleGeometry args={[0.1, 24]} />
          <meshStandardMaterial color="#0a0a0b" roughness={1} />
        </mesh>
        <mesh position={[0, 0.13, 0.114]}>
          <ringGeometry args={[0.094, 0.1, 24]} />
          <meshStandardMaterial color="#8a8577" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* control strip + power LED */}
        <mesh position={[0, 0.29, 0.112]}>
          <planeGeometry args={[0.3, 0.045]} />
          <meshStandardMaterial color="#2a2a2d" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0.12, 0.29, 0.115]}>
          <circleGeometry args={[0.006, 10]} />
          <meshBasicMaterial color="#ff3b30" toneMapped={false} />
        </mesh>
        <pointLight position={[0.12, 0.29, 0.16]} color="#ff3b30" intensity={0.35} distance={0.6} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * The dog — curled up asleep on a bed, breathing
 * ------------------------------------------------------------------ */

export function Dog({ theme }: { theme: Theme }) {
  const chest = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!chest.current) return;
    // slow sleeping breath
    const s = 1 + Math.sin(clock.elapsedTime * 1.15) * 0.022;
    chest.current.scale.set(s, s, s);
  });

  const fur = '#8a6a45';
  const furDark = '#5f472c';

  return (
    <group>
      {/* A soft key on the bed — without it the dog reads as a dark lump on a dark floor. */}
      <spotLight
        position={[0.6, 2.6, 1.2]}
        target-position={[0, 0.2, 0]}
        color={theme.name === 'arsenal' ? '#fff4e8' : '#ffd9b4'}
        intensity={16}
        angle={0.5}
        penumbra={0.9}
        distance={6}
        decay={2}
      />
      {/* bed */}
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.52, 0.5, 0.09, 28]} />
        <meshStandardMaterial color={theme.name === 'arsenal' ? '#9d0a10' : '#2a2c33'} roughness={0.95} />
      </mesh>
      {/* raised rim */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.47, 0.075, 12, 32]} />
        <meshStandardMaterial color={theme.name === 'arsenal' ? '#b81118' : '#33363e'} roughness={0.95} />
      </mesh>
      {/* cushion */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.05, 24]} />
        <meshStandardMaterial color={theme.name === 'arsenal' ? '#f0ece4' : '#4a4e58'} roughness={1} />
      </mesh>

      {/* dog, curled */}
      <group position={[0, 0.16, 0]} rotation={[0, 0.6, 0]}>
        <group ref={chest}>
          {/* body */}
          <mesh position={[0, 0.09, 0]} scale={[1.25, 0.82, 1]} castShadow receiveShadow>
            <sphereGeometry args={[0.2, 24, 18]} />
            <meshStandardMaterial color={fur} roughness={0.95} />
          </mesh>
        </group>
        {/* head resting on the body */}
        <group position={[0.2, 0.11, 0.13]} rotation={[0.3, -0.5, 0.15]}>
          <mesh castShadow>
            <sphereGeometry args={[0.105, 20, 16]} />
            <meshStandardMaterial color={fur} roughness={0.95} />
          </mesh>
          {/* snout */}
          <mesh position={[0, -0.022, 0.09]} scale={[0.75, 0.62, 1]} castShadow>
            <sphereGeometry args={[0.062, 16, 12]} />
            <meshStandardMaterial color={furDark} roughness={0.95} />
          </mesh>
          {/* nose */}
          <mesh position={[0, -0.026, 0.145]}>
            <sphereGeometry args={[0.019, 12, 10]} />
            <meshStandardMaterial color="#171316" roughness={0.35} />
          </mesh>
          {/* closed eyes */}
          {[-0.045, 0.045].map((x) => (
            <mesh key={x} position={[x, 0.022, 0.083]} rotation={[0, 0, x > 0 ? -0.25 : 0.25]}>
              <boxGeometry args={[0.026, 0.004, 0.004]} />
              <meshStandardMaterial color="#171316" roughness={0.4} />
            </mesh>
          ))}
          {/* floppy ears */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.08, 0.02, -0.02]} rotation={[0.2, 0, s * 0.35]} scale={[0.45, 1.25, 0.35]} castShadow>
              <sphereGeometry args={[0.07, 14, 12]} />
              <meshStandardMaterial color={furDark} roughness={0.95} />
            </mesh>
          ))}
        </group>
        {/* tail wrapped round */}
        <mesh position={[-0.17, 0.05, 0.14]} rotation={[Math.PI / 2, 0, 0.7]} castShadow>
          <torusGeometry args={[0.11, 0.028, 10, 24, Math.PI * 1.15]} />
          <meshStandardMaterial color={fur} roughness={0.95} />
        </mesh>
        {/* a paw poking out */}
        <mesh position={[0.16, 0.005, -0.08]} scale={[0.8, 0.6, 1.3]} castShadow>
          <sphereGeometry args={[0.05, 14, 12]} />
          <meshStandardMaterial color={furDark} roughness={0.95} />
        </mesh>
      </group>

      {/* tennis ball, abandoned */}
      <mesh position={[0.72, 0.035, 0.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.036, 16, 14]} />
        <meshStandardMaterial color="#cddc39" roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Neon sign — canvas-drawn glyphs on an emissive plane, lit by bloom
 * ------------------------------------------------------------------ */

export function NeonSign({ theme, text = 'ONE MORE REP' }: { theme: Theme; text?: string }) {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 1024; cv.height = 256;
    const ctx = cv.getContext('2d')!;
    ctx.clearRect(0, 0, 1024, 256);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 108px "JetBrains Mono", monospace';

    // outer halo, then progressively tighter/brighter passes — reads as glass tube glow
    ctx.shadowColor = theme.neon;
    ctx.shadowBlur = 60;
    ctx.strokeStyle = theme.neon;
    ctx.lineWidth = 13;
    ctx.strokeText(text, 512, 132);
    ctx.shadowBlur = 26;
    ctx.strokeStyle = '#ff8880';
    ctx.lineWidth = 7;
    ctx.strokeText(text, 512, 132);
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.strokeText(text, 512, 132);

    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [text, theme.neon]);

  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (!light.current) return;
    // neon tubes are never quite steady
    const t = clock.elapsedTime;
    light.current.intensity = 5.5 + Math.sin(t * 13.1) * 0.35 + Math.sin(t * 3.7) * 0.5;
  });

  return (
    <group>
      {/* Backer panel — without it the tube washes out against a pale wall. */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.78, 0.82]} />
        <meshStandardMaterial color="#121215" roughness={0.85} metalness={0.2} />
      </mesh>
      <mesh>
        <planeGeometry args={[2.6, 0.65]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <pointLight ref={light} position={[0, 0, 0.5]} color={theme.neon} intensity={5.5} distance={6} decay={2} />
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Wall clock — hands driven by the visitor's actual local time
 * ------------------------------------------------------------------ */

export function WallClock({ theme }: { theme: Theme }) {
  const hour = useRef<THREE.Group>(null);
  const minute = useRef<THREE.Group>(null);
  const second = useRef<THREE.Group>(null);

  useFrame(() => {
    const d = new Date();
    const s = d.getSeconds() + d.getMilliseconds() / 1000;
    const m = d.getMinutes() + s / 60;
    const h = (d.getHours() % 12) + m / 60;
    if (second.current) second.current.rotation.z = -(s / 60) * Math.PI * 2;
    if (minute.current) minute.current.rotation.z = -(m / 60) * Math.PI * 2;
    if (hour.current) hour.current.rotation.z = -(h / 12) * Math.PI * 2;
  });

  return (
    <group>
      {/* case */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.05, 32]} />
        <meshStandardMaterial color={theme.metalDark} roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.027]}>
        <circleGeometry args={[0.215, 32]} />
        <meshStandardMaterial color={theme.name === 'arsenal' ? '#f7f5f1' : '#e8e6e1'} roughness={0.85} />
      </mesh>
      {/* hour ticks */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[Math.sin((i / 12) * Math.PI * 2) * 0.18, Math.cos((i / 12) * Math.PI * 2) * 0.18, 0.03]}
          rotation={[0, 0, -(i / 12) * Math.PI * 2]}
        >
          <boxGeometry args={[i % 3 === 0 ? 0.016 : 0.008, i % 3 === 0 ? 0.042 : 0.026, 0.002]} />
          <meshStandardMaterial color="#1a1a1c" roughness={0.6} />
        </mesh>
      ))}
      {/* hands */}
      <group ref={hour} position={[0, 0, 0.033]}>
        <mesh position={[0, 0.055, 0]}>
          <boxGeometry args={[0.014, 0.11, 0.003]} />
          <meshStandardMaterial color="#1a1a1c" roughness={0.5} />
        </mesh>
      </group>
      <group ref={minute} position={[0, 0, 0.036]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.01, 0.16, 0.003]} />
          <meshStandardMaterial color="#1a1a1c" roughness={0.5} />
        </mesh>
      </group>
      <group ref={second} position={[0, 0, 0.039]}>
        <mesh position={[0, 0.075, 0]}>
          <boxGeometry args={[0.004, 0.175, 0.002]} />
          <meshBasicMaterial color={theme.accent} toneMapped={false} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.042]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.006, 12]} />
        <meshStandardMaterial color={theme.accent} roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Whiteboard with the training split chalked on it
 * ------------------------------------------------------------------ */

export function SplitBoard({ theme }: { theme: Theme }) {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 768; cv.height = 512;
    const ctx = cv.getContext('2d')!;
    ctx.fillStyle = theme.name === 'arsenal' ? '#f6f5f1' : '#15181c';
    ctx.fillRect(0, 0, 768, 512);
    const ink = theme.name === 'arsenal' ? '#1a1a1c' : '#e6e8ec';

    ctx.fillStyle = theme.accent;
    ctx.fillRect(0, 0, 768, 8);

    ctx.fillStyle = ink;
    ctx.font = '700 44px "JetBrains Mono", monospace';
    ctx.fillText('THE SPLIT', 48, 88);
    ctx.font = '400 22px "JetBrains Mono", monospace';
    ctx.fillStyle = theme.accent;
    ctx.fillText('6 days / week. no negotiation.', 48, 126);

    const rows = [
      ['MON', 'PUSH', 'chest · shoulders · tri'],
      ['TUE', 'PULL', 'back · biceps · rear delt'],
      ['WED', 'LEGS', 'quads · hams · calves'],
      ['THU', 'PUSH', 'volume day'],
      ['FRI', 'PULL', 'heavy rows · deadlift'],
      ['SAT', 'LEGS', 'squat focus'],
      ['SUN', 'REST', 'guitar · football · the dog'],
    ];
    rows.forEach(([d, f, note], i) => {
      const y = 186 + i * 42;
      ctx.fillStyle = theme.accent;
      ctx.font = '700 26px "JetBrains Mono", monospace';
      ctx.fillText(d, 48, y);
      ctx.fillStyle = ink;
      ctx.font = '700 26px "JetBrains Mono", monospace';
      ctx.fillText(f, 150, y);
      ctx.globalAlpha = 0.6;
      ctx.font = '400 21px "JetBrains Mono", monospace';
      ctx.fillText(note, 268, y);
      ctx.globalAlpha = 1;
    });

    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [theme]);

  return (
    <group>
      <mesh castShadow receiveShadow>
        <planeGeometry args={[1.5, 1.0]} />
        <meshStandardMaterial map={tex} roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.56, 1.06, 0.035]} />
        <meshStandardMaterial color={theme.metalDark} roughness={0.5} metalness={0.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Misc set dressing
 * ------------------------------------------------------------------ */

/** Wall-mounted fan, slowly turning. */
export function WallFan({ theme }: { theme: Theme }) {
  const blades = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (blades.current) blades.current.rotation.z -= dt * 3.4;
  });
  return (
    <group>
      <mesh position={[0, 0, -0.09]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.18, 12]} />
        <meshStandardMaterial color={theme.metalDark} roughness={0.6} metalness={0.7} />
      </mesh>
      <group ref={blades}>
        {Array.from({ length: 3 }, (_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 3) * Math.PI * 2]} position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.34, 0.11, 0.006]} />
            <meshStandardMaterial color={theme.metal} roughness={0.45} metalness={0.8} />
          </mesh>
        ))}
      </group>
      {/* cage */}
      {[0.13, 0.2, 0.26].map((r) => (
        <mesh key={r} position={[0, 0, 0.03]}>
          <torusGeometry args={[r, 0.004, 6, 28]} />
          <meshStandardMaterial color={theme.metalDark} roughness={0.7} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/** A gym bag slumped on the floor. */
export function GymBag({ theme }: { theme: Theme }) {
  return (
    <group>
      <mesh position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1.5, 1]} castShadow receiveShadow>
        <capsuleGeometry args={[0.14, 0.26, 8, 16]} />
        <meshStandardMaterial color={theme.name === 'arsenal' ? '#1c1c20' : '#22242a'} roughness={0.92} />
      </mesh>
      {/* strap */}
      <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.014, 8, 20, Math.PI]} />
        <meshStandardMaterial color={theme.accentDim} roughness={0.85} />
      </mesh>
      {/* logo flash */}
      <mesh position={[0, 0.16, 0.135]}>
        <planeGeometry args={[0.16, 0.035]} />
        <meshBasicMaterial color={theme.accent} toneMapped={false} />
      </mesh>
    </group>
  );
}
