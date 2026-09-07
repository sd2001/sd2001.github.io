import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import type { Theme } from '../theme';
import { knurl } from '../textures';

/* ------------------------------------------------------------------ *
 * Shared material helpers
 * ------------------------------------------------------------------ */

function Frame({ theme, ...p }: { theme: Theme } & JSX.IntrinsicElements['meshStandardMaterial']) {
  return <meshStandardMaterial color={theme.metal} roughness={0.55} metalness={0.7} {...p} />;
}
function DarkFrame({ theme, ...p }: { theme: Theme } & JSX.IntrinsicElements['meshStandardMaterial']) {
  return <meshStandardMaterial color={theme.metalDark} roughness={0.62} metalness={0.68} {...p} />;
}
function Vinyl({ theme, ...p }: { theme: Theme } & JSX.IntrinsicElements['meshStandardMaterial']) {
  return <meshStandardMaterial color={theme.pad} roughness={0.62} metalness={0.06} {...p} />;
}

/** Rubber-coated weight plate lying on a bar or a tree peg. */
export function Plate({
  theme, radius, thickness, label,
}: { theme: Theme; radius: number; thickness: number; label?: string }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, thickness, 32]} />
        <meshStandardMaterial color={theme.rubber} roughness={0.88} metalness={0.05} />
      </mesh>
      {/* coloured hub ring */}
      <mesh>
        <cylinderGeometry args={[radius * 0.42, radius * 0.42, thickness * 1.02, 24]} />
        <meshStandardMaterial color={theme.accentDim} roughness={0.6} metalness={0.3} />
      </mesh>
      {/* steel collar */}
      <mesh>
        <cylinderGeometry args={[0.028, 0.028, thickness * 1.2, 16]} />
        <meshStandardMaterial color={theme.chrome} roughness={0.28} metalness={0.95} />
      </mesh>
      {label && (
        <mesh position={[0, thickness / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.5, radius * 0.72, 24]} />
          <meshStandardMaterial color={theme.padAccent} roughness={0.7} />
        </mesh>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * HERO: seated chest press machine — the laptop lives on its seat pad
 * ------------------------------------------------------------------ */

export function ChestPress({ theme }: { theme: Theme }) {
  const grip = useMemo(() => knurl(2), []);

  return (
    <group>
      {/* ---- base frame ---- */}
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.045, -0.15]} castShadow receiveShadow>
          <boxGeometry args={[0.09, 0.09, 1.85]} />
          <Frame theme={theme} />
        </mesh>
      ))}
      <mesh position={[0, 0.045, 0.72]} castShadow>
        <boxGeometry args={[0.78, 0.09, 0.09]} />
        <Frame theme={theme} />
      </mesh>
      <mesh position={[0, 0.045, -1.02]} castShadow>
        <boxGeometry args={[0.78, 0.09, 0.09]} />
        <Frame theme={theme} />
      </mesh>

      {/* ---- weight stack tower (behind the seat) ---- */}
      <group position={[0, 0, -0.95]}>
        {/* guide rods */}
        {[-0.15, 0.15].map((x) => (
          <mesh key={x} position={[x, 0.82, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 1.5, 12]} />
            <meshStandardMaterial color={theme.chrome} roughness={0.2} metalness={0.98} />
          </mesh>
        ))}
        {/* top and bottom yoke */}
        <mesh position={[0, 1.58, 0]} castShadow>
          <boxGeometry args={[0.46, 0.1, 0.34]} />
          <DarkFrame theme={theme} />
        </mesh>
        <mesh position={[0, 0.09, 0]} castShadow>
          <boxGeometry args={[0.46, 0.1, 0.34]} />
          <DarkFrame theme={theme} />
        </mesh>
        {/* uprights either side of the stack */}
        {[-0.28, 0.28].map((x) => (
          <mesh key={x} position={[x, 0.84, 0]} castShadow>
            <boxGeometry args={[0.08, 1.6, 0.1]} />
            <Frame theme={theme} />
          </mesh>
        ))}
        {/* the stack itself — lower plates racked, upper plates lifted away */}
        {Array.from({ length: 13 }, (_, i) => {
          const selected = i < 5;
          const y = 0.19 + i * 0.068 + (selected ? 0 : 0.16);
          return (
            <mesh key={i} position={[0, y, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.4, 0.058, 0.26]} />
              <meshStandardMaterial
                color={i === 4 ? theme.accentDim : theme.metalDark}
                roughness={0.5}
                metalness={0.72}
              />
            </mesh>
          );
        })}
        {/* selector pin */}
        <mesh position={[0.22, 0.19 + 4 * 0.068, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.16, 10]} />
          <meshStandardMaterial color={theme.accent} roughness={0.3} metalness={0.8} />
        </mesh>
        {/* cable up to the top pulley */}
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.9, 6]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>

      {/* ---- seat ---- */}
      <mesh position={[0, 0.27, 0.14]} castShadow>
        <boxGeometry args={[0.11, 0.44, 0.11]} />
        <Frame theme={theme} />
      </mesh>
      <RoundedBox args={[0.48, 0.09, 0.46]} radius={0.032} smoothness={4} position={[0, 0.52, 0.14]} castShadow receiveShadow>
        <Vinyl theme={theme} />
      </RoundedBox>
      {/* seat-pad stitch line */}
      <mesh position={[0, 0.567, 0.14]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 0.4]} />
        <meshStandardMaterial color={theme.padAccent} roughness={0.7} />
      </mesh>

      {/* ---- backrest ---- */}
      <mesh position={[0, 0.5, -0.26]} castShadow>
        <boxGeometry args={[0.11, 0.5, 0.11]} />
        <Frame theme={theme} />
      </mesh>
      <group position={[0, 0.9, -0.3]} rotation={[0.2, 0, 0]}>
        <RoundedBox args={[0.46, 0.76, 0.12]} radius={0.04} smoothness={4} castShadow receiveShadow>
          <Vinyl theme={theme} />
        </RoundedBox>
        {/* horizontal stitching */}
        {[-0.22, 0, 0.22].map((y) => (
          <mesh key={y} position={[0, y, 0.062]}>
            <planeGeometry args={[0.42, 0.012]} />
            <meshStandardMaterial color={theme.padAccent} roughness={0.75} />
          </mesh>
        ))}
      </group>

      {/* ---- press arms + handles ---- */}
      {[-0.46, 0.46].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          {/* pivot post */}
          <mesh position={[0, 0.72, -0.62]} castShadow>
            <boxGeometry args={[0.09, 1.44, 0.09]} />
            <Frame theme={theme} />
          </mesh>
          {/* pivot hub */}
          <mesh position={[0, 1.14, -0.62]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.13, 16]} />
            <DarkFrame theme={theme} />
          </mesh>
          {/* arm sweeping forward */}
          <mesh position={[0, 1.06, -0.18]} rotation={[0.14, 0, 0]} castShadow>
            <boxGeometry args={[0.07, 0.07, 0.92]} />
            <Frame theme={theme} />
          </mesh>
          {/* vertical grip */}
          <mesh position={[x > 0 ? -0.02 : 0.02, 0.94, 0.25]} castShadow>
            <cylinderGeometry args={[0.029, 0.029, 0.32, 16]} />
            <meshStandardMaterial map={grip} color={theme.chrome} roughness={0.55} metalness={0.6} />
          </mesh>
          {/* grip end caps */}
          {[0.78, 1.1].map((y) => (
            <mesh key={y} position={[x > 0 ? -0.02 : 0.02, y, 0.25]} castShadow>
              <cylinderGeometry args={[0.033, 0.033, 0.02, 16]} />
              <DarkFrame theme={theme} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ---- foot plate ---- */}
      <mesh position={[0, 0.14, 0.66]} rotation={[-0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.56, 0.02, 0.22]} />
        <DarkFrame theme={theme} />
      </mesh>

      {/* ---- a towel thrown over the backrest corner ---- */}
      <group position={[0.2, 1.14, -0.24]} rotation={[0.2, 0, 0.06]}>
        <RoundedBox args={[0.2, 0.34, 0.05]} radius={0.02} smoothness={3} castShadow>
          <meshStandardMaterial color={theme.name === 'arsenal' ? '#f6f4f0' : '#d8d4cb'} roughness={0.95} />
        </RoundedBox>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Supporting equipment
 * ------------------------------------------------------------------ */

/** Two-tier dumbbell rack with a run of hex dumbbells. */
export function DumbbellRack({ theme }: { theme: Theme }) {
  const grip = useMemo(() => knurl(1), []);
  const rows = [
    { y: 0.72, z: -0.16, scale: 1.0, n: 7 },
    { y: 0.36, z: 0.13, scale: 0.78, n: 7 },
  ];
  return (
    <group>
      {/* frame ends */}
      {[-1.35, 1.35].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.09, 0.9, 0.09]} />
            <DarkFrame theme={theme} />
          </mesh>
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.12, 0.1, 0.86]} />
            <DarkFrame theme={theme} />
          </mesh>
        </group>
      ))}
      {/* shelf rails */}
      {rows.map((r, i) => (
        <mesh key={i} position={[0, r.y - 0.09, r.z]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.07, 0.3]} />
          <Frame theme={theme} />
        </mesh>
      ))}
      {/* dumbbells */}
      {rows.map((r, ri) =>
        Array.from({ length: r.n }, (_, i) => {
          const s = r.scale * (1 - i * 0.055);
          const x = -1.15 + i * 0.385;
          return (
            <group key={`${ri}-${i}`} position={[x, r.y + 0.05 * s, r.z]} rotation={[0, 0, Math.PI / 2]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.3, 12]} />
                <meshStandardMaterial map={grip} color={theme.chrome} roughness={0.5} metalness={0.7} />
              </mesh>
              {[-0.13, 0.13].map((o) => (
                <mesh key={o} position={[0, o, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.11 * s, 0.11 * s, 0.1, 6]} />
                  <meshStandardMaterial color={theme.rubber} roughness={0.85} metalness={0.08} />
                </mesh>
              ))}
            </group>
          );
        }),
      )}
    </group>
  );
}

/** Power rack with a loaded barbell sitting in the J-hooks. */
export function PowerRack({ theme }: { theme: Theme }) {
  // Club red belongs on the rack in the Arsenal room; in the warehouse it just
  // competes with the neon, so the rack stays dark steel there.
  const rackColor = theme.name === 'arsenal' ? theme.accentDim : theme.metalDark;
  return (
    <group>
      {/* four uprights */}
      {[[-0.72, -0.5], [0.72, -0.5], [-0.72, 0.62], [0.72, 0.62]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.15, z]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 2.3, 0.1]} />
          <meshStandardMaterial color={rackColor} roughness={0.5} metalness={0.7} />
        </mesh>
      ))}
      {/* hole pattern down the front uprights */}
      {[-0.72, 0.72].map((x) =>
        Array.from({ length: 16 }, (_, i) => (
          <mesh key={`${x}-${i}`} position={[x, 0.5 + i * 0.1, -0.44]}>
            <cylinderGeometry args={[0.016, 0.016, 0.04, 8]} />
            <meshStandardMaterial color="#0a0a0a" roughness={1} />
          </mesh>
        )),
      )}
      {/* top cross members */}
      {[-0.5, 0.62].map((z) => (
        <mesh key={z} position={[0, 2.28, z]} castShadow>
          <boxGeometry args={[1.54, 0.1, 0.1]} />
          <meshStandardMaterial color={rackColor} roughness={0.5} metalness={0.7} />
        </mesh>
      ))}
      {/* pull-up bar */}
      <mesh position={[0, 2.15, 0.06]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.021, 0.021, 1.5, 16]} />
        <meshStandardMaterial color={theme.chrome} roughness={0.25} metalness={0.95} />
      </mesh>
      {/* base feet */}
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0.05, 0.06]} castShadow>
          <boxGeometry args={[0.12, 0.1, 1.4]} />
          <meshStandardMaterial color={theme.metalDark} roughness={0.6} metalness={0.7} />
        </mesh>
      ))}
      {/* loaded barbell in the hooks */}
      <group position={[0, 1.28, -0.42]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.0145, 0.0145, 2.2, 16]} />
          <meshStandardMaterial color={theme.chrome} roughness={0.3} metalness={0.95} />
        </mesh>
        {[-1, 1].map((s) =>
          [0.78, 0.84, 0.9].map((off, i) => (
            <group key={`${s}-${i}`} position={[s * off, 0, 0]}>
              <Plate theme={theme} radius={0.225 - i * 0.005} thickness={0.05} label="45" />
            </group>
          )),
        )}
        {/* collars */}
        {[-0.94, 0.94].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.05, 16]} />
            <meshStandardMaterial color={theme.accent} roughness={0.35} metalness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Vertical plate tree. */
export function PlateTree({ theme }: { theme: Theme }) {
  return (
    <group>
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.4, 0.08, 6]} />
        <DarkFrame theme={theme} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.11, 1.4, 0.11]} />
        <Frame theme={theme} />
      </mesh>
      {[
        { y: 1.16, r: 0.15, t: 0.035 },
        { y: 0.86, r: 0.19, t: 0.042 },
        { y: 0.54, r: 0.225, t: 0.05 },
        { y: 0.26, r: 0.225, t: 0.05 },
      ].map((p, i) => (
        <group key={i}>
          {/* peg */}
          <mesh position={[0, p.y, 0.14]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 0.3, 12]} />
            <meshStandardMaterial color={theme.chrome} roughness={0.35} metalness={0.9} />
          </mesh>
          {[0, 1].map((k) => (
            <group key={k} position={[0, p.y, 0.1 + k * p.t * 1.15]} rotation={[0, Math.PI / 2, 0]}>
              <Plate theme={theme} radius={p.r} thickness={p.t} />
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

/** A short row of kettlebells. */
export function Kettlebells({ theme }: { theme: Theme }) {
  return (
    <group>
      {[0, 1, 2].map((i) => {
        const s = 1 - i * 0.14;
        return (
          <group key={i} position={[i * 0.34, 0, i * 0.06]}>
            <mesh position={[0, 0.11 * s, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.115 * s, 20, 16]} />
              <meshStandardMaterial color={theme.rubber} roughness={0.7} metalness={0.25} />
            </mesh>
            <mesh position={[0, 0.225 * s, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.072 * s, 0.019 * s, 10, 20, Math.PI]} />
              <meshStandardMaterial color={theme.rubber} roughness={0.65} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.028 * s, 0]}>
              <cylinderGeometry args={[0.085 * s, 0.085 * s, 0.02, 20]} />
              <meshStandardMaterial color={theme.accentDim} roughness={0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Plain flat bench, used to fill the mid-ground. */
export function FlatBench({ theme }: { theme: Theme }) {
  return (
    <group>
      <RoundedBox args={[0.34, 0.1, 1.25]} radius={0.035} smoothness={4} position={[0, 0.46, 0]} castShadow receiveShadow>
        <Vinyl theme={theme} />
      </RoundedBox>
      {[-0.48, 0.48].map((z) => (
        <group key={z}>
          <mesh position={[0, 0.22, z]} castShadow>
            <boxGeometry args={[0.08, 0.42, 0.08]} />
            <Frame theme={theme} />
          </mesh>
          <mesh position={[0, 0.03, z]} castShadow receiveShadow>
            <boxGeometry args={[0.52, 0.06, 0.1]} />
            <DarkFrame theme={theme} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Loose plates leaning against a wall — set dressing. */
export function LeaningPlates({ theme }: { theme: Theme }) {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[i * 0.13, 0.225, i * 0.05]} rotation={[0, 0, -0.22 - i * 0.03]}>
          <group rotation={[0, Math.PI / 2, 0]}>
            <Plate theme={theme} radius={0.225} thickness={0.05} />
          </group>
        </group>
      ))}
    </group>
  );
}

/** Foam roller + a medicine ball. */
export function Recovery({ theme }: { theme: Theme }) {
  return (
    <group>
      <mesh position={[0, 0.075, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.62, 20]} />
        <meshStandardMaterial color={theme.accentDim} roughness={0.85} />
      </mesh>
      <mesh position={[0.62, 0.13, 0.18]} castShadow receiveShadow>
        <sphereGeometry args={[0.13, 24, 18]} />
        <meshStandardMaterial color={theme.metalDark} roughness={0.75} />
      </mesh>
    </group>
  );
}

/** Chalk bowl and a water bottle beside the bench. */
export function Odds({ theme }: { theme: Theme }) {
  return (
    <group>
      {/* water bottle */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.13, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.042, 0.046, 0.26, 20]} />
          <meshPhysicalMaterial
            color={theme.name === 'arsenal' ? '#EF0107' : '#1e222b'}
            roughness={0.28}
            metalness={0.35}
            clearcoat={0.6}
          />
        </mesh>
        <mesh position={[0, 0.275, 0]} castShadow>
          <cylinderGeometry args={[0.026, 0.03, 0.05, 16]} />
          <meshStandardMaterial color={theme.metalDark} roughness={0.5} />
        </mesh>
      </group>
      {/* chalk bowl */}
      <group position={[0.42, 0, 0.1]}>
        <mesh position={[0, 0.055, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.13, 0.1, 0.11, 20, 1, true]} />
          <meshStandardMaterial color={theme.metalDark} roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
        {/* Slightly grey and fully rough: pure white here caught the screen's
            area light and glowed like a puck. */}
        <mesh position={[0, 0.085, 0]}>
          <cylinderGeometry args={[0.115, 0.115, 0.03, 20]} />
          <meshStandardMaterial color="#9a9894" roughness={1} metalness={0} />
        </mesh>
      </group>
    </group>
  );
}
