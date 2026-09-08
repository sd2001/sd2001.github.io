import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Theme } from '../theme';

/* ------------------------------------------------------------------ *
 * Guitar on a stand — kept, but at a fraction of the mesh count
 * ------------------------------------------------------------------ */

export function Guitar({ theme, onStrum }: { theme: Theme; onStrum?: () => void }) {
  const [hovered, setHovered] = useState(false);

  /** Strat-ish body outline. The bass horn reaches higher than the treble horn. */
  const bodyGeom = useMemo(() => {
    const b = new THREE.Shape();
    b.moveTo(0.030, 0.150);
    b.bezierCurveTo(0.095, 0.190, 0.150, 0.155, 0.152, 0.085);
    b.bezierCurveTo(0.154, 0.030, 0.108, 0.012, 0.120, -0.045);
    b.bezierCurveTo(0.140, -0.150, 0.095, -0.238, 0.000, -0.240);
    b.bezierCurveTo(-0.095, -0.238, -0.140, -0.150, -0.120, -0.045);
    b.bezierCurveTo(-0.108, 0.012, -0.158, 0.030, -0.162, 0.090);
    b.bezierCurveTo(-0.166, 0.175, -0.100, 0.215, -0.030, 0.175);
    b.closePath();
    return new THREE.ExtrudeGeometry(b, {
      depth: 0.046,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 3,
      curveSegments: 20,
    });
  }, []);

  /** Pickguard — the cream shape is what makes the silhouette read as a Strat. */
  const guardGeom = useMemo(() => {
    const g = new THREE.Shape();
    g.moveTo(0.020, 0.145);
    g.bezierCurveTo(0.080, 0.170, 0.125, 0.140, 0.128, 0.075);
    g.bezierCurveTo(0.130, 0.020, 0.090, 0.000, 0.100, -0.050);
    g.bezierCurveTo(0.110, -0.120, 0.060, -0.160, -0.010, -0.155);
    g.bezierCurveTo(-0.090, -0.150, -0.115, -0.090, -0.100, -0.030);
    g.bezierCurveTo(-0.090, 0.020, -0.125, 0.040, -0.130, 0.085);
    g.bezierCurveTo(-0.134, 0.145, -0.070, 0.175, -0.020, 0.150);
    g.closePath();
    return new THREE.ExtrudeGeometry(g, { depth: 0.004, bevelEnabled: false, curveSegments: 16 });
  }, []);

  /** Headstock — a Strat paddle, wider at the top than at the nut. */
  const headGeom = useMemo(() => {
    const h = new THREE.Shape();
    h.moveTo(-0.021, 0);
    h.lineTo(0.021, 0);
    h.bezierCurveTo(0.026, 0.055, 0.040, 0.085, 0.036, 0.128);
    h.bezierCurveTo(0.032, 0.166, -0.004, 0.180, -0.030, 0.166);
    h.bezierCurveTo(-0.052, 0.152, -0.050, 0.110, -0.040, 0.070);
    h.bezierCurveTo(-0.034, 0.044, -0.024, 0.024, -0.021, 0);
    h.closePath();
    return new THREE.ExtrudeGeometry(h, { depth: 0.014, bevelEnabled: false, curveSegments: 14 });
  }, []);

  const bodyColor = theme.name === 'arsenal' ? '#c8101a' : '#a3121b';
  const cream = '#efe6cf';
  const maple = '#c99a5b';
  const rosewood = '#33190e';

  return (
    <group
      rotation={[0.1, 0, 0.045]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onStrum?.(); }}
    >
      {/* Key light. Brightens on hover so it is obvious the guitar is interactive. */}
      <pointLight
        position={[0.5, 1.5, 0.75]}
        color={theme.name === 'arsenal' ? '#fff2e6' : '#ffd8b0'}
        intensity={hovered ? 9 : 5}
        distance={3.4}
        decay={2}
      />

      {/*
        Generous invisible hit target covering body, neck and headstock. The guitar is a
        slim object and the establishing shot has a little pointer parallax, so aiming at
        the visible geometry alone is fiddly. Events bubble to the group's onClick.
        opacity 0 rather than visible={false} — three.js skips invisible objects when
        raycasting, so an invisible mesh would not be clickable at all.
      */}
      <mesh position={[0, 1.15, 0.04]}>
        <boxGeometry args={[0.42, 1.28, 0.24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* ---------------- stand ---------------- */}
      <mesh position={[0, 0.02, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.028, 0.34]} />
        <meshStandardMaterial color="#15161a" roughness={0.75} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.27, 0.015]} castShadow>
        <cylinderGeometry args={[0.014, 0.019, 0.5, 8]} />
        <meshStandardMaterial color="#15161a" roughness={0.7} metalness={0.5} />
      </mesh>
      {/* yoke arms cradling the lower bout */}
      {[-1, 1].map((sgn) => (
        <mesh key={sgn} position={[sgn * 0.085, 0.5, 0.02]} rotation={[0, 0, sgn * 0.55]} castShadow>
          <cylinderGeometry args={[0.011, 0.011, 0.15, 6]} />
          <meshStandardMaterial color="#15161a" roughness={0.8} />
        </mesh>
      ))}

      {/* ---------------- the guitar ---------------- */}
      <group position={[0, 0.80, 0.02]} rotation={[-0.09, 0, 0]}>
        {/* body */}
        <mesh geometry={bodyGeom} position={[0, 0, -0.023]} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={bodyColor}
            roughness={0.14}
            metalness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.06}
          />
        </mesh>

        {/* pickguard */}
        <mesh geometry={guardGeom} position={[0, 0, 0.0235]}>
          <meshStandardMaterial color={cream} roughness={0.34} metalness={0.05} />
        </mesh>

        {/* three single-coil pickups, angled like the real thing */}
        {([[0.095, 0], [-0.005, 0], [-0.098, -0.13]] as const).map(([y, rot], i) => (
          <mesh key={i} position={[0.004, y, 0.03]} rotation={[0, 0, rot]} castShadow>
            <boxGeometry args={[0.088, 0.021, 0.013]} />
            <meshStandardMaterial color="#e8e1cc" roughness={0.42} metalness={0.1} />
          </mesh>
        ))}

        {/* bridge + saddles + tremolo arm */}
        <mesh position={[0, -0.148, 0.029]} castShadow>
          <boxGeometry args={[0.072, 0.034, 0.014]} />
          <meshStandardMaterial color="#cfd4da" roughness={0.24} metalness={0.95} />
        </mesh>
        <mesh position={[0.052, -0.152, 0.031]} rotation={[0, 0, -0.5]} castShadow>
          <cylinderGeometry args={[0.0045, 0.0045, 0.085, 6]} />
          <meshStandardMaterial color="#cfd4da" roughness={0.25} metalness={0.95} />
        </mesh>

        {/* volume + tone knobs and the pickup selector */}
        {([[0.072, -0.098], [0.052, -0.132], [0.030, -0.166]] as const).map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.032]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.0115, 0.0115, 0.014, 10]} />
            <meshStandardMaterial color={cream} roughness={0.3} metalness={0.1} />
          </mesh>
        ))}
        <mesh position={[-0.030, -0.070, 0.030]} rotation={[0, 0, 0.5]} castShadow>
          <boxGeometry args={[0.008, 0.05, 0.008]} />
          <meshStandardMaterial color={cream} roughness={0.3} />
        </mesh>

        {/* ---------------- neck ---------------- */}
        <mesh position={[0, 0.455, 0.006]} castShadow>
          <boxGeometry args={[0.046, 0.60, 0.024]} />
          <meshStandardMaterial color={maple} roughness={0.42} />
        </mesh>
        {/* fretboard */}
        <mesh position={[0, 0.455, 0.0195]}>
          <boxGeometry args={[0.0435, 0.60, 0.005]} />
          <meshStandardMaterial color={rosewood} roughness={0.55} />
        </mesh>
        {/* frets */}
        {Array.from({ length: 20 }, (_, i) => (
          <mesh key={i} position={[0, 0.175 + i * 0.0295, 0.0225]}>
            <boxGeometry args={[0.0435, 0.0016, 0.0012]} />
            <meshStandardMaterial color="#d2d7de" roughness={0.22} metalness={0.95} />
          </mesh>
        ))}
        {/* inlay dots */}
        {[0.263, 0.351, 0.44, 0.586].map((y) => (
          <mesh key={y} position={[0, y, 0.0231]}>
            <circleGeometry args={[0.0042, 8]} />
            <meshStandardMaterial color={cream} roughness={0.35} />
          </mesh>
        ))}
        {/* nut */}
        <mesh position={[0, 0.757, 0.021]}>
          <boxGeometry args={[0.0425, 0.006, 0.008]} />
          <meshStandardMaterial color="#f2ece0" roughness={0.4} />
        </mesh>

        {/* six strings, bridge to nut */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[-0.0175 + i * 0.007, 0.30, 0.0265]}>
            <boxGeometry args={[0.0009 + i * 0.00016, 0.92, 0.0009 + i * 0.00016]} />
            <meshStandardMaterial color="#dfe3e9" roughness={0.2} metalness={1} />
          </mesh>
        ))}

        {/* ---------------- headstock ---------------- */}
        <group position={[0, 0.758, -0.004]} rotation={[-0.14, 0, 0]}>
          <mesh geometry={headGeom} castShadow>
            <meshPhysicalMaterial color={bodyColor} roughness={0.16} metalness={0.2} clearcoat={0.9} />
          </mesh>
          {/* six tuners down one side, as on a Strat */}
          {Array.from({ length: 6 }, (_, i) => (
            <group key={i} position={[-0.026 - (i > 2 ? 0.006 : 0), 0.030 + i * 0.024, 0.014]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.0055, 0.0055, 0.016, 8]} />
                <meshStandardMaterial color="#cfd4da" roughness={0.28} metalness={0.95} />
              </mesh>
              <mesh position={[-0.011, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <boxGeometry args={[0.006, 0.017, 0.011]} />
                <meshStandardMaterial color="#cfd4da" roughness={0.3} metalness={0.9} />
              </mesh>
            </group>
          ))}
        </group>

        {/* hover ring so it is clear the guitar can be clicked */}
        {hovered && (
          <mesh position={[0, -0.03, 0.05]}>
            <ringGeometry args={[0.20, 0.215, 32]} />
            <meshBasicMaterial color={theme.accent} transparent opacity={0.85} toneMapped={false} />
          </mesh>
        )}
      </group>

      {/* practice amp */}
      <group position={[0.56, 0, 0.06]} rotation={[0, -0.38, 0]}>
        <RoundedBox args={[0.36, 0.32, 0.22]} radius={0.012} smoothness={2} position={[0, 0.16, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#141416" roughness={0.9} />
        </RoundedBox>
        <mesh position={[0, 0.14, 0.112]}>
          <circleGeometry args={[0.1, 18]} />
          <meshStandardMaterial color="#0a0a0b" roughness={1} />
        </mesh>
        <mesh position={[0, 0.14, 0.114]}>
          <ringGeometry args={[0.094, 0.1, 20]} />
          <meshStandardMaterial color="#8a8577" roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.29, 0.112]}>
          <planeGeometry args={[0.3, 0.042]} />
          <meshStandardMaterial color="#2a2a2d" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0.115, 0.29, 0.115]}>
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
