import { useMemo } from 'react';
import * as THREE from 'three';
import type { Theme } from '../theme';
import { useTexture } from '@react-three/drei';
import { concrete, rubberTiles } from '../textures';

/** Deliberately small. A big room meant a lot of geometry for space nobody looks at. */
export const ROOM = { w: 8.4, d: 6.6, h: 3.15 };

/** Hanging dome lamp. Three meshes; only some carry an actual light. */
function Lamp({ theme, position, lit = true }: { theme: Theme; position: [number, number, number]; lit?: boolean }) {
  const drop = ROOM.h - position[1];
  return (
    <group position={position}>
      <mesh position={[0, drop / 2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, drop, 5]} />
        <meshStandardMaterial color={theme.metalDark} roughness={0.8} />
      </mesh>
      <mesh castShadow>
        <sphereGeometry args={[0.26, 18, 10, 0, Math.PI * 2, 0, Math.PI / 1.75]} />
        <meshStandardMaterial
          color={theme.name === 'arsenal' ? theme.accent : '#1a1a1d'}
          roughness={0.38}
          metalness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshBasicMaterial color={theme.lamp} toneMapped={false} />
      </mesh>
      {lit && (
        <pointLight
          position={[0, -0.12, 0]}
          color={theme.lamp}
          intensity={theme.lampIntensity}
          distance={9}
          decay={2}
        />
      )}
    </group>
  );
}

export default function Room({ theme, shadows }: { theme: Theme; shadows: boolean }) {
  const floorTex = useMemo(() => rubberTiles(theme, 9), [theme]);
  const wallTex = useMemo(() => concrete(theme, 3), [theme]);
  // The framed photo on the back wall. 736x414, so the frame is 16:9.
  const banner = useTexture('/img/arsenal-champions.jpg');
  banner.colorSpace = THREE.SRGBColorSpace;
  banner.anisotropy = 8;

  const hw = ROOM.w / 2;
  const hd = ROOM.d / 2;
  const isDark = theme.name === 'warehouse';

  return (
    <group>
      {/* floor — plain glossy rubber; a live reflector here cost a whole extra scene pass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
        <meshStandardMaterial
          map={floorTex}
          color={theme.floor}
          roughness={isDark ? 0.55 : 0.62}
          metalness={0.28}
        />
      </mesh>

      {/* walls */}
      <mesh position={[0, ROOM.h / 2, -hd]} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.h]} />
        <meshStandardMaterial map={wallTex} color={theme.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-hw, ROOM.h / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.d, ROOM.h]} />
        <meshStandardMaterial map={wallTex} color={theme.wall} roughness={0.95} />
      </mesh>
      <mesh position={[hw, ROOM.h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.d, ROOM.h]} />
        <meshStandardMaterial map={wallTex} color={theme.wall} roughness={0.95} />
      </mesh>
      <mesh position={[0, ROOM.h, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
        <meshStandardMaterial color={theme.ceiling} roughness={0.98} />
      </mesh>

      {/* painted band at waist height */}
      <mesh position={[0, 1.18, -hd + 0.02]}>
        <planeGeometry args={[ROOM.w, 0.06]} />
        <meshStandardMaterial color={theme.wallStripe} roughness={0.92} />
      </mesh>

      {/* Framed Arsenal photo on the back wall. A modest emissive lift keeps it legible
          in a dark room without turning the frame into a light source. */}
      <group position={[-2.1, 2.02, -hd + 0.06]}>
        <mesh>
          <planeGeometry args={[2.4, 1.35]} />
          <meshStandardMaterial
            map={banner}
            emissiveMap={banner}
            emissive="#ffffff"
            emissiveIntensity={isDark ? 0.32 : 0.12}
            roughness={0.66}
          />
        </mesh>
        {/* frame */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[2.52, 1.47]} />
          <meshStandardMaterial color={theme.metalDark} roughness={0.45} metalness={0.6} />
        </mesh>
      </group>

      {/* lamps */}
      <Lamp theme={theme} position={[0, 2.5, -0.5]} />
      <Lamp theme={theme} position={[-2.7, 2.5, -1.9]} lit={false} />
      <Lamp theme={theme} position={[2.7, 2.5, -1.9]} />

      {/* lighting rig — one shadow caster, everything else cheap */}
      <ambientLight color={theme.ambient.color} intensity={theme.ambient.intensity} />
      <hemisphereLight
        color={theme.name === 'arsenal' ? '#ffffff' : '#33405e'}
        groundColor={theme.floor}
        intensity={isDark ? 0.5 : 0.9}
      />
      <directionalLight
        position={[-3.2, 4.4, 3.4]}
        color={theme.keyLight.color}
        intensity={theme.keyLight.intensity}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={4.5}
        shadow-camera-bottom={-2}
        shadow-camera-near={0.5}
        shadow-camera-far={14}
        shadow-bias={-0.0009}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[4, 2.6, -4]} color={theme.rimLight.color} intensity={theme.rimLight.intensity} />
    </group>
  );
}
