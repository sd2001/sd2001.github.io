import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import type { Theme } from '../theme';
import { knurl } from '../textures';

/**
 * Minimal gym kit. Every piece here is budgeted: the room is small, the camera never
 * moves, and the whole scene has to stay well under 200 draw calls.
 */

/** Rubber bumper plate — two meshes, not four. */
function Plate({ theme, r, t }: { theme: Theme; r: number; t: number }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[r, r, t, 20]} />
        <meshStandardMaterial color={theme.rubber} roughness={0.88} metalness={0.05} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[r * 0.34, r * 0.34, t * 1.06, 12]} />
        <meshStandardMaterial color={theme.accentDim} roughness={0.6} metalness={0.35} />
      </mesh>
    </group>
  );
}

/** Flat bench — doubles as the chair at the desk. */
export function FlatBench({ theme }: { theme: Theme }) {
  return (
    <group>
      <RoundedBox args={[0.33, 0.1, 1.15]} radius={0.03} smoothness={2} position={[0, 0.46, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={theme.pad} roughness={0.62} metalness={0.06} />
      </RoundedBox>
      <mesh position={[0, 0.512, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 0.95]} />
        <meshStandardMaterial color={theme.padAccent} roughness={0.75} />
      </mesh>
      {[-0.44, 0.44].map((z) => (
        <group key={z}>
          <mesh position={[0, 0.22, z]} castShadow>
            <boxGeometry args={[0.07, 0.42, 0.07]} />
            <meshStandardMaterial color={theme.metal} roughness={0.5} metalness={0.72} />
          </mesh>
          <mesh position={[0, 0.03, z]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.06, 0.09]} />
            <meshStandardMaterial color={theme.metalDark} roughness={0.6} metalness={0.65} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Squat rack with a loaded bar in the hooks. */
export function SquatRack({ theme }: { theme: Theme }) {
  const rackColor = theme.name === 'arsenal' ? theme.accentDim : theme.metalDark;
  return (
    <group>
      {([[-0.62, -0.34], [0.62, -0.34], [-0.62, 0.42], [0.62, 0.42]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, 1.02, z]} castShadow receiveShadow>
          <boxGeometry args={[0.09, 2.04, 0.09]} />
          <meshStandardMaterial color={rackColor} roughness={0.5} metalness={0.68} />
        </mesh>
      ))}
      {[-0.34, 0.42].map((z) => (
        <mesh key={z} position={[0, 2.02, z]} castShadow>
          <boxGeometry args={[1.33, 0.09, 0.09]} />
          <meshStandardMaterial color={rackColor} roughness={0.5} metalness={0.68} />
        </mesh>
      ))}
      <mesh position={[0, 1.9, 0.04]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.019, 0.019, 1.3, 12]} />
        <meshStandardMaterial color={theme.chrome} roughness={0.28} metalness={0.9} />
      </mesh>
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} position={[x, 0.045, 0.04]} castShadow receiveShadow>
          <boxGeometry args={[0.11, 0.09, 1.05]} />
          <meshStandardMaterial color={theme.metalDark} roughness={0.6} metalness={0.65} />
        </mesh>
      ))}

      {/* loaded barbell */}
      <group position={[0, 1.16, -0.3]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 1.9, 12]} />
          <meshStandardMaterial color={theme.chrome} roughness={0.3} metalness={0.92} />
        </mesh>
        {[-1, 1].map((sgn) =>
          [0.68, 0.75].map((off, i) => (
            <group key={`${sgn}-${i}`} position={[sgn * off, 0, 0]}>
              <Plate theme={theme} r={0.215 - i * 0.006} t={0.055} />
            </group>
          )),
        )}
      </group>
    </group>
  );
}

/** Compact rack with three dumbbells. */
export function DumbbellRack({ theme }: { theme: Theme }) {
  const grip = useMemo(() => knurl(1), []);
  return (
    <group>
      {[-0.52, 0.52].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.08, 0.56, 0.08]} />
            <meshStandardMaterial color={theme.metalDark} roughness={0.6} metalness={0.65} />
          </mesh>
          <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.11, 0.09, 0.5]} />
            <meshStandardMaterial color={theme.metalDark} roughness={0.6} metalness={0.65} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.48, -0.03]} castShadow receiveShadow>
        <boxGeometry args={[1.12, 0.06, 0.26]} />
        <meshStandardMaterial color={theme.metal} roughness={0.5} metalness={0.7} />
      </mesh>

      {[0, 1, 2].map((i) => {
        const s = 1 - i * 0.13;
        return (
          <group key={i} position={[-0.36 + i * 0.36, 0.56, -0.03]} rotation={[0, 0, Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[0.021, 0.021, 0.26, 8]} />
              <meshStandardMaterial map={grip} color={theme.chrome} roughness={0.5} metalness={0.68} />
            </mesh>
            {[-0.115, 0.115].map((o) => (
              <mesh key={o} position={[0, o, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.1 * s, 0.1 * s, 0.085, 6]} />
                <meshStandardMaterial color={theme.rubber} roughness={0.85} metalness={0.08} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

/** A few plates leaning against the wall. */
export function LeaningPlates({ theme }: { theme: Theme }) {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[i * 0.12, 0.215, i * 0.05]} rotation={[0, 0, -0.2 - i * 0.03]}>
          <group rotation={[0, Math.PI / 2, 0]}>
            <Plate theme={theme} r={0.215} t={0.05} />
          </group>
        </group>
      ))}
    </group>
  );
}
