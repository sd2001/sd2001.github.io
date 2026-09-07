import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Theme } from '../theme';

/* ------------------------------------------------------------------ *
 * Guitar on a stand — kept, but at a fraction of the mesh count
 * ------------------------------------------------------------------ */

export function Guitar({ theme }: { theme: Theme }) {
  const bodyGeom = useMemo(() => {
    // Double-cutaway outline: widest across the lower bout, pinched at the waist,
    // two horns at the top with the bass horn reaching further.
    const s = new THREE.Shape();
    s.moveTo(0.035, 0.195);
    s.bezierCurveTo(0.105, 0.225, 0.158, 0.192, 0.156, 0.112);
    s.bezierCurveTo(0.152, 0.052, 0.104, 0.03, 0.116, -0.03);
    s.bezierCurveTo(0.132, -0.132, 0.1, -0.243, 0.0, -0.248);
    s.bezierCurveTo(-0.1, -0.243, -0.132, -0.132, -0.116, -0.03);
    s.bezierCurveTo(-0.104, 0.03, -0.152, 0.052, -0.156, 0.112);
    s.bezierCurveTo(-0.16, 0.2, -0.098, 0.248, -0.035, 0.212);
    s.lineTo(0.035, 0.195);
    return new THREE.ExtrudeGeometry(s, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2,
      curveSegments: 14,
    });
  }, []);

  return (
    <group rotation={[0.12, 0, 0.05]}>
      {/* a small key so the guitar does not vanish into the floor */}
      <pointLight
        position={[0.5, 1.5, 0.7]}
        color={theme.name === 'arsenal' ? '#fff2e6' : '#ffd8b0'}
        intensity={4.2}
        distance={3}
        decay={2}
      />

      {/* stand */}
      <mesh position={[0, 0.22, 0.02]} castShadow>
        <cylinderGeometry args={[0.016, 0.02, 0.44, 8]} />
        <meshStandardMaterial color="#17181b" roughness={0.7} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0.06]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.03, 0.34]} />
        <meshStandardMaterial color="#17181b" roughness={0.75} metalness={0.4} />
      </mesh>

      <group position={[0, 0.82, 0.02]} rotation={[-0.1, 0, 0]}>
        <mesh geometry={bodyGeom} position={[0, 0, -0.025]} castShadow receiveShadow>
          <meshStandardMaterial
            color={theme.name === 'arsenal' ? '#c8101a' : '#5c1218'}
            roughness={0.22}
            metalness={0.35}
          />
        </mesh>
        {/* scratchplate */}
        <mesh position={[0.008, -0.035, 0.028]} scale={[1, 1.15, 1]}>
          <circleGeometry args={[0.088, 16]} />
          <meshStandardMaterial color="#0f1013" roughness={0.35} metalness={0.2} />
        </mesh>
        {/* pickups */}
        <mesh position={[0, -0.055, 0.031]} castShadow>
          <boxGeometry args={[0.11, 0.075, 0.012]} />
          <meshStandardMaterial color="#c8c2b0" roughness={0.4} metalness={0.65} />
        </mesh>
        {/* bridge */}
        <mesh position={[0, -0.185, 0.03]} castShadow>
          <boxGeometry args={[0.085, 0.03, 0.016]} />
          <meshStandardMaterial color={theme.chrome} roughness={0.25} metalness={0.9} />
        </mesh>
        {/* neck + fretboard */}
        <mesh position={[0, 0.47, 0.005]} castShadow>
          <boxGeometry args={[0.05, 0.64, 0.022]} />
          <meshStandardMaterial color="#7a4a24" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.47, 0.018]}>
          <boxGeometry args={[0.048, 0.64, 0.006]} />
          <meshStandardMaterial color="#241309" roughness={0.55} />
        </mesh>
        {/* strings as one thin slab — six cylinders were invisible at this scale */}
        <mesh position={[0, 0.3, 0.026]}>
          <boxGeometry args={[0.034, 1.05, 0.001]} />
          <meshStandardMaterial color="#d8dce2" roughness={0.2} metalness={1} />
        </mesh>
        {/* headstock */}
        <mesh position={[0.008, 0.845, 0.004]} rotation={[0, 0, 0.06]} castShadow>
          <boxGeometry args={[0.07, 0.165, 0.02]} />
          <meshStandardMaterial color="#3b0d12" roughness={0.25} metalness={0.3} />
        </mesh>
      </group>

      {/* practice amp */}
      <group position={[0.52, 0, 0.04]} rotation={[0, -0.35, 0]}>
        <RoundedBox args={[0.34, 0.3, 0.21]} radius={0.012} smoothness={2} position={[0, 0.15, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#141416" roughness={0.9} />
        </RoundedBox>
        <mesh position={[0, 0.13, 0.107]}>
          <circleGeometry args={[0.095, 18]} />
          <meshStandardMaterial color="#0a0a0b" roughness={1} />
        </mesh>
        <mesh position={[0.11, 0.27, 0.107]}>
          <circleGeometry args={[0.006, 8]} />
          <meshBasicMaterial color="#ff3b30" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * The dog — simplified, still breathing
 * ------------------------------------------------------------------ */

export function Dog({ theme }: { theme: Theme }) {
  const chest = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (chest.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 1.15) * 0.022;
      chest.current.scale.set(s, s, s);
    }
  });

  const fur = '#8a6a45';
  const furDark = '#5f472c';

  return (
    <group>
      <pointLight
        position={[0.3, 1.0, 0.5]}
        color={theme.name === 'arsenal' ? '#fff4e8' : '#ffd9b4'}
        intensity={2.6}
        distance={2.2}
        decay={2}
      />
      {/* bed */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.46, 0.44, 0.1, 20]} />
        <meshStandardMaterial color={theme.name === 'arsenal' ? '#9d0a10' : '#2a2c33'} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.41, 0.07, 8, 20]} />
        <meshStandardMaterial color={theme.name === 'arsenal' ? '#b81118' : '#33363e'} roughness={0.95} />
      </mesh>

      <group position={[0, 0.15, 0]} rotation={[0, 0.6, 0]}>
        <group ref={chest}>
          <mesh position={[0, 0.08, 0]} scale={[1.25, 0.82, 1]} castShadow receiveShadow>
            <sphereGeometry args={[0.18, 16, 12]} />
            <meshStandardMaterial color={fur} roughness={0.95} />
          </mesh>
        </group>
        <group position={[0.18, 0.1, 0.12]} rotation={[0.3, -0.5, 0.15]}>
          <mesh castShadow>
            <sphereGeometry args={[0.095, 14, 12]} />
            <meshStandardMaterial color={fur} roughness={0.95} />
          </mesh>
          <mesh position={[0, -0.02, 0.08]} scale={[0.75, 0.62, 1]} castShadow>
            <sphereGeometry args={[0.056, 12, 10]} />
            <meshStandardMaterial color={furDark} roughness={0.95} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.072, 0.018, -0.018]} rotation={[0.2, 0, s * 0.35]} scale={[0.45, 1.25, 0.35]} castShadow>
              <sphereGeometry args={[0.064, 10, 8]} />
              <meshStandardMaterial color={furDark} roughness={0.95} />
            </mesh>
          ))}
        </group>
        <mesh position={[-0.15, 0.045, 0.13]} rotation={[Math.PI / 2, 0, 0.7]} castShadow>
          <torusGeometry args={[0.1, 0.026, 8, 16, Math.PI * 1.15]} />
          <meshStandardMaterial color={fur} roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Neon sign
 * ------------------------------------------------------------------ */

export function NeonSign({ theme, text = 'ONE MORE REP' }: { theme: Theme; text?: string }) {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 1024; cv.height = 256;
    const ctx = cv.getContext('2d')!;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 108px "JetBrains Mono", monospace';
    ctx.shadowColor = theme.neon;
    ctx.shadowBlur = 60;
    ctx.strokeStyle = theme.neon;
    ctx.lineWidth = 13;
    ctx.strokeText(text, 512, 132);
    ctx.shadowBlur = 24;
    ctx.strokeStyle = '#ff8880';
    ctx.lineWidth = 7;
    ctx.strokeText(text, 512, 132);
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.strokeText(text, 512, 132);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [text, theme.neon]);

  return (
    <group>
      {/* backer panel — a bare tube washes out against a pale wall */}
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[2.0, 0.6]} />
        <meshStandardMaterial color="#121215" roughness={0.85} metalness={0.2} />
      </mesh>
      <mesh>
        <planeGeometry args={[1.86, 0.47]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 0, 0.4]} color={theme.neon} intensity={3.2} distance={3.4} decay={2} />
    </group>
  );
}
