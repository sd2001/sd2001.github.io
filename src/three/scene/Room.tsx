import { useMemo } from 'react';
import * as THREE from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';
import type { Theme } from '../theme';
import { concrete, rubberTiles, titleBanner } from '../textures';

export const ROOM = { w: 17, d: 12, h: 4.3 };

/** A hanging industrial dome lamp. `cast` adds a shadow-casting spotlight (expensive — use sparingly). */
function Lamp({ theme, position, cast = false }: { theme: Theme; position: [number, number, number]; cast?: boolean }) {
  const [x, y, z] = position;
  return (
    <group position={position}>
      {/* drop cable */}
      <mesh position={[0, (ROOM.h - y) / 2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, ROOM.h - y, 6]} />
        <meshStandardMaterial color={theme.metalDark} roughness={0.8} />
      </mesh>
      {/* dome shade — deeper, so the bulb sits up inside it rather than hanging below */}
      <mesh castShadow>
        <sphereGeometry args={[0.3, 24, 14, 0, Math.PI * 2, 0, Math.PI / 1.75]} />
        <meshStandardMaterial
          color={theme.name === 'arsenal' ? theme.accent : '#1a1a1d'}
          roughness={0.38}
          metalness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* hot inner surface of the shade, catching the bulb */}
      <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.26, 24]} />
        <meshBasicMaterial color={theme.lamp} toneMapped={false} transparent opacity={0.5} />
      </mesh>
      {/* bulb, tucked up into the shade */}
      <mesh position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.055, 14, 12]} />
        <meshBasicMaterial color={theme.lamp} toneMapped={false} />
      </mesh>
      <pointLight
        position={[0, -0.12, 0]}
        color={theme.lamp}
        intensity={theme.lampIntensity}
        distance={11}
        decay={2}
      />
      {cast && (
        <spotLight
          position={[0, -0.14, 0]}
          target-position={[x, -y, z]}
          color={theme.lamp}
          intensity={theme.lampIntensity * 1.6}
          angle={0.85}
          penumbra={0.75}
          distance={13}
          decay={2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0016}
        />
      )}
    </group>
  );
}

/** Exposed steel roof truss running across the ceiling. */
function Truss({ theme, z }: { theme: Theme; z: number }) {
  return (
    <group position={[0, ROOM.h - 0.28, z]}>
      <mesh>
        <boxGeometry args={[ROOM.w, 0.1, 0.16]} />
        <meshStandardMaterial color={theme.metalDark} roughness={0.75} metalness={0.65} />
      </mesh>
      <mesh position={[0, -0.34, 0]}>
        <boxGeometry args={[ROOM.w, 0.08, 0.14]} />
        <meshStandardMaterial color={theme.metalDark} roughness={0.75} metalness={0.65} />
      </mesh>
      {/* zig-zag web members */}
      {Array.from({ length: 22 }, (_, i) => {
        const x = -ROOM.w / 2 + 0.4 + i * (ROOM.w / 22);
        return (
          <mesh key={i} position={[x, -0.17, 0]} rotation={[0, 0, i % 2 ? 0.7 : -0.7]}>
            <boxGeometry args={[0.05, 0.55, 0.05]} />
            <meshStandardMaterial color={theme.metalDark} roughness={0.8} metalness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Room({ theme }: { theme: Theme }) {
  const floorTex = useMemo(() => rubberTiles(theme, 16), [theme]);
  const wallTex = useMemo(() => concrete(theme, 5), [theme]);
  const lowerTex = useMemo(() => concrete(theme, 5, theme.wallLower), [theme]);
  const banner = useMemo(() => titleBanner(theme), [theme]);

  const halfW = ROOM.w / 2;
  const halfD = ROOM.d / 2;
  const isDark = theme.name === 'warehouse';

  return (
    <group>
      {/* ---------- FLOOR ---------- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
        <MeshReflectorMaterial
          map={floorTex}
          resolution={1024}
          mixBlur={1.15}
          mixStrength={isDark ? 26 : 11}
          blur={[340, 110]}
          depthScale={1.05}
          minDepthThreshold={0.35}
          maxDepthThreshold={1.35}
          roughness={isDark ? 0.72 : 0.6}
          metalness={0.18}
          mirror={theme.mirror * 0.5}
          color={theme.floor}
        />
      </mesh>

      {/* platform under the lifting area — a lighter rubber square */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -0.4]} receiveShadow>
        <planeGeometry args={[4.4, 3.6]} />
        <meshStandardMaterial color={theme.rubber} roughness={0.95} metalness={0.02} />
      </mesh>
      {/* Painted platform boundary — matte, so it does not compete with the laptop. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -0.4]}>
        <ringGeometry args={[2.15, 2.19, 4, 1, Math.PI / 4]} />
        <meshStandardMaterial color={theme.floorLine} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* ---------- WALLS ---------- */}
      {/* back */}
      <mesh position={[0, ROOM.h / 2, -halfD]} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.h]} />
        <meshStandardMaterial map={wallTex} color={theme.wall} roughness={0.94} metalness={0.02} />
      </mesh>
      {/* back wall wainscot + accent band */}
      <mesh position={[0, 0.65, -halfD + 0.02]}>
        <planeGeometry args={[ROOM.w, 1.3]} />
        <meshStandardMaterial map={lowerTex} color={theme.wallLower} roughness={0.9} />
      </mesh>
      {/* A painted band, lit like the wall it is on — emissive here read as a laser. */}
      <mesh position={[0, 1.34, -halfD + 0.03]}>
        <planeGeometry args={[ROOM.w, 0.07]} />
        <meshStandardMaterial color={theme.wallStripe} roughness={0.92} metalness={0.0} />
      </mesh>

      {/* left */}
      <mesh position={[-halfW, ROOM.h / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.d, ROOM.h]} />
        <meshStandardMaterial map={wallTex} color={theme.wall} roughness={0.94} />
      </mesh>
      {/* right */}
      <mesh position={[halfW, ROOM.h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.d, ROOM.h]} />
        <meshStandardMaterial map={wallTex} color={theme.wall} roughness={0.94} />
      </mesh>
      {/* front (behind camera, keeps the room enclosed for reflections) */}
      <mesh position={[0, ROOM.h / 2, halfD]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM.w, ROOM.h]} />
        <meshStandardMaterial map={wallTex} color={theme.wall} roughness={0.95} side={THREE.FrontSide} />
      </mesh>
      {/* ceiling */}
      <mesh position={[0, ROOM.h, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
        <meshStandardMaterial color={theme.ceiling} roughness={0.97} />
      </mesh>

      {/* ---------- MIRROR WALL (left) ---------- */}
      <group position={[-halfW + 0.06, 1.55, -0.6]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[6.4, 2.3]} />
          <MeshReflectorMaterial
            resolution={512}
            mixBlur={0.35}
            mixStrength={5}
            blur={[110, 45]}
            roughness={0.16}
            metalness={0.72}
            mirror={theme.mirror}
            color={isDark ? '#8b909a' : '#dfe4ea'}
          />
        </mesh>
        {/* frame */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[6.56, 2.46]} />
          <meshStandardMaterial color={theme.metalDark} roughness={0.5} metalness={0.7} />
        </mesh>
      </group>

      {/* ---------- BACK-WALL BANNER (Arsenal title) ---------- */}
      <group position={[3.05, 2.3, -halfD + 0.08]}>
        {/* Backlit print, not a light source — a small emissive lift keeps it alive
            in the dark without blowing out the corner of the room. */}
        <mesh>
          <planeGeometry args={[2.55, 1.43]} />
          <meshStandardMaterial
            map={banner}
            emissiveMap={banner}
            emissive="#ffffff"
            emissiveIntensity={isDark ? 0.42 : 0.16}
            roughness={0.72}
            metalness={0.03}
          />
        </mesh>
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[2.7, 1.58]} />
          <meshStandardMaterial color={theme.metalDark} roughness={0.45} metalness={0.6} />
        </mesh>
        <pointLight position={[0, 0, 0.8]} color="#ff4a3d" intensity={isDark ? 2.6 : 1.1} distance={4.2} decay={2} />
      </group>

      {/* ---------- CEILING STRUCTURE ---------- */}
      <Truss theme={theme} z={-3.4} />
      <Truss theme={theme} z={0.4} />
      <Truss theme={theme} z={4.2} />

      {/* ---------- LAMPS ---------- */}
      <Lamp theme={theme} position={[0, 3.05, -0.4]} cast />
      <Lamp theme={theme} position={[-4.6, 3.05, -1.6]} />
      <Lamp theme={theme} position={[4.6, 3.05, -1.6]} cast />
      <Lamp theme={theme} position={[-2.4, 3.05, 3.6]} />
      <Lamp theme={theme} position={[2.4, 3.05, 3.6]} />

      {/* ---------- HIGH WINDOWS (right wall) — cold light source ---------- */}
      {[-3.2, -0.4, 2.4].map((z, i) => (
        <group key={i} position={[halfW - 0.05, 3.15, z]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[1.9, 1.15]} />
            <meshBasicMaterial color={isDark ? '#2c3d63' : '#e8f0ff'} toneMapped={false} />
          </mesh>
          {/* mullions */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[1.95, 0.05, 0.04]} />
            <meshStandardMaterial color={theme.metalDark} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.05, 1.2, 0.04]} />
            <meshStandardMaterial color={theme.metalDark} roughness={0.7} />
          </mesh>
          <rectAreaLight
            width={1.9}
            height={1.15}
            intensity={isDark ? 3.5 : 9}
            color={isDark ? '#5f86ff' : '#eaf2ff'}
            position={[0, 0, 0.1]}
          />
        </group>
      ))}

      {/* ---------- GLOBAL LIGHTING ---------- */}
      <ambientLight color={theme.ambient.color} intensity={theme.ambient.intensity} />
      <hemisphereLight
        color={theme.name === 'arsenal' ? '#ffffff' : '#33405e'}
        groundColor={theme.floor}
        intensity={isDark ? 0.45 : 0.9}
      />
      {/* key: rakes across the bench from front-left */}
      <directionalLight
        position={[-5, 6.5, 5]}
        color={theme.keyLight.color}
        intensity={theme.keyLight.intensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={7}
        shadow-camera-bottom={-3}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-bias={-0.0008}
        shadow-normalBias={0.022}
      />
      {/* rim: cold, from behind-right, separates equipment from the dark */}
      <directionalLight position={[7, 4, -7]} color={theme.rimLight.color} intensity={theme.rimLight.intensity} />
      {/* fill: lifts the shadow side just enough to read */}
      <directionalLight position={[3, 2.5, 8]} color={theme.fillLight.color} intensity={theme.fillLight.intensity} />
    </group>
  );
}
