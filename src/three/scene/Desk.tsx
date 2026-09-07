import { RoundedBox } from '@react-three/drei';
import type { Theme } from '../theme';
import { DESK } from '../laptopConfig';

/**
 * The desk the laptop lives on — the hero object, in the spirit of the reference site.
 * A gym bench stands in for the chair, which is the joke the whole room is built around.
 */
export default function Desk({ theme }: { theme: Theme }) {
  const woodTop = theme.name === 'arsenal' ? '#2f3238' : '#33363d';

  return (
    <group position={[0, 0, DESK.z]}>
      {/* top slab */}
      <RoundedBox
        args={[DESK.w, DESK.thickness, DESK.d]}
        radius={0.008}
        smoothness={2}
        position={[0, DESK.top - DESK.thickness / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={woodTop} roughness={0.55} metalness={0.15} />
      </RoundedBox>

      {/* side panels rather than four legs — half the meshes, reads the same */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (DESK.w / 2 - 0.04), (DESK.top - DESK.thickness) / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.035, DESK.top - DESK.thickness, DESK.d - 0.06]} />
          <meshStandardMaterial color={theme.metal} roughness={0.45} metalness={0.75} />
        </mesh>
      ))}

      {/* modesty panel across the back */}
      <mesh position={[0, 0.5, -DESK.d / 2 + 0.05]} castShadow>
        <boxGeometry args={[DESK.w - 0.18, 0.34, 0.022]} />
        <meshStandardMaterial color={theme.metalDark} roughness={0.6} metalness={0.5} />
      </mesh>

      {/* drawer unit */}
      <group position={[DESK.w / 2 - 0.33, 0, 0.02]}>
        <mesh position={[0, 0.33, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.66, DESK.d - 0.12]} />
          <meshStandardMaterial color={theme.metalDark} roughness={0.55} metalness={0.45} />
        </mesh>
        {[0.2, 0.46].map((y) => (
          <mesh key={y} position={[0, y, (DESK.d - 0.12) / 2 + 0.002]}>
            <planeGeometry args={[0.38, 0.2]} />
            <meshStandardMaterial color={theme.metal} roughness={0.5} metalness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, 0.33, (DESK.d - 0.12) / 2 + 0.012]}>
          <boxGeometry args={[0.16, 0.014, 0.02]} />
          <meshStandardMaterial color={theme.chrome} roughness={0.35} metalness={0.9} />
        </mesh>
      </group>

      {/* desk mat under the laptop */}
      <mesh position={[-0.12, DESK.top + 0.001, 0.02]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.78, 0.42]} />
        <meshStandardMaterial color={theme.rubber} roughness={0.95} />
      </mesh>

      {/* mug */}
      <group position={[0.42, DESK.top, 0.18]}>
        <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.038, 0.033, 0.09, 16]} />
          <meshStandardMaterial color={theme.name === 'arsenal' ? '#f2f0ec' : '#d9d5cc'} roughness={0.5} />
        </mesh>
        <mesh position={[0.045, 0.048, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.021, 0.006, 6, 14, Math.PI * 1.2]} />
          <meshStandardMaterial color={theme.name === 'arsenal' ? '#f2f0ec' : '#d9d5cc'} roughness={0.5} />
        </mesh>
      </group>

      {/* notebook + pen */}
      <group position={[-0.62, DESK.top, 0.14]} rotation={[0, 0.28, 0]}>
        <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.17, 0.016, 0.23]} />
          <meshStandardMaterial color={theme.accentDim} roughness={0.75} />
        </mesh>
        <mesh position={[0.01, 0.019, 0.01]} rotation={[0, 0.4, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.13, 6]} />
          <meshStandardMaterial color={theme.chrome} roughness={0.4} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
