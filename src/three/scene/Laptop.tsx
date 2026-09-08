import { useRef, useState } from 'react';
import * as THREE from 'three';
import { Html, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Theme } from '../theme';
import { HTML_SCALE, LAPTOP, SCREEN_PX } from '../laptopConfig';
import { keyboardFace } from '../textures';
import Desktop from '../../os/Desktop';

type Props = {
  theme: Theme;
  /** true once the camera has arrived at the screen — enables DOM interaction. */
  active: boolean;
  onRequestZoom: () => void;
  /**
   * When false the screen is painted rather than mounted as live DOM. Phones show the
   * room as a hero image and get the portfolio as a real page, so mounting a 1280x800
   * desktop into CSS3D there is pure cost for something a few pixels tall.
   */
  liveScreen?: boolean;
  /** Show the floating "click me" arrow. Off on phones, where there is nothing to click. */
  hint?: boolean;
  /**
   * Hide the arrow. Driven by the camera mode rather than by arrival, so it fades out the
   * instant the camera starts moving rather than hanging around through the whole fly-in.
   */
  hintHidden?: boolean;
};


/**
 * Floating arrow above the laptop, so it is obvious the screen is the thing to click.
 * Bobs on a sine, scales away once you are sitting at the machine, and is clickable
 * itself — pointing at a target the user then has to aim past would be annoying.
 */
function ClickHint({ theme, hidden, onClick }: { theme: Theme; hidden: boolean; onClick: () => void }) {
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const scale = useRef(0);
  const [hovered, setHovered] = useState(false);

  /** Sized for the wide establishing shot, where the laptop is small in frame. */
  const BASE = 1.45;

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;

    // ease the whole thing in and out rather than popping
    const target = hidden ? 0 : 1;
    scale.current += (target - scale.current) * Math.min(1, delta * 6);
    const s = scale.current * BASE * (hovered ? 1.14 : 1);
    g.scale.setScalar(s);
    g.visible = s > 0.01;

    if (halo.current) {
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity = (0.13 + Math.sin(t * 2.1) * 0.06) * scale.current;
      const hs = 1 + Math.sin(t * 2.1) * 0.12;
      halo.current.scale.setScalar(hs);
    }

    // 0.253 is where the tilted lid tops out; sit clear of it
    g.position.y = 0.345 + Math.sin(t * 2.1) * 0.03;
    g.rotation.y = t * 0.7;
  });

  return (
    <group
      ref={group}
      position={[0, 0.345, -0.02]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* shaft */}
      <mesh position={[0, 0.062, 0]}>
        <cylinderGeometry args={[0.011, 0.011, 0.075, 8]} />
        <meshBasicMaterial color={theme.accent} toneMapped={false} />
      </mesh>
      {/* head, pointing down at the screen */}
      <mesh position={[0, 0.0, 0]} rotation={[Math.PI, Math.PI / 4, 0]}>
        <coneGeometry args={[0.042, 0.062, 4]} />
        <meshBasicMaterial color={theme.accent} toneMapped={false} />
      </mesh>
      {/* soft halo so it reads against the dark wall and catches the bloom */}
      <mesh ref={halo} position={[0, 0.03, -0.012]}>
        <circleGeometry args={[0.105, 20]} />
        <meshBasicMaterial
          color={theme.accent}
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function Laptop({
  theme, active, onRequestZoom, liveScreen = true, hint = true, hintHidden = false,
}: Props) {
  const lidRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const keys = keyboardFace();

  // Gentle flicker on the screen-glow so the room does not feel frozen.
  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const t = clock.elapsedTime;
    const mat = glowRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.14 + Math.sin(t * 2.1) * 0.012 + Math.sin(t * 7.3) * 0.006;
  });

  const { base, lid, screen } = LAPTOP;

  return (
    <group position={LAPTOP.position}>
      {/* ---------------- BASE ---------------- */}
      <group position={[0, base.h / 2, base.d / 2]}>
        <RoundedBox args={[base.w, base.h, base.d]} radius={0.005} smoothness={3} castShadow receiveShadow>
          <meshStandardMaterial color="#2c2f34" roughness={0.36} metalness={0.85} />
        </RoundedBox>
        {/* Keyboard as a single textured plane. This used to be 70 box meshes for
            something a few pixels tall on screen. */}
        <mesh position={[0, base.h / 2 + 0.0009, -0.028]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[base.w * 0.87, base.d * 0.56]} />
          <meshStandardMaterial map={keys} roughness={0.78} />
        </mesh>
        {/* trackpad */}
        <mesh position={[0, base.h / 2 + 0.0009, 0.072]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.115, 0.075]} />
          <meshStandardMaterial color="#25282d" roughness={0.32} metalness={0.5} />
        </mesh>
        {/* front lip notch */}
        <mesh position={[0, 0, base.d / 2 - 0.001]}>
          <boxGeometry args={[0.05, base.h * 0.7, 0.004]} />
          <meshStandardMaterial color="#1a1c20" roughness={0.6} metalness={0.7} />
        </mesh>
      </group>

      {/* ---------------- LID ---------------- */}
      <group rotation={[LAPTOP.tilt, 0, 0]}>
        {/* hinge barrel */}
        <mesh position={[0, 0.012, -0.004]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.009, 0.009, base.w * 0.55, 12]} />
          <meshStandardMaterial color="#1e2126" roughness={0.45} metalness={0.85} />
        </mesh>

        {/* lid shell */}
        <RoundedBox
          ref={lidRef as never}
          args={[lid.w, lid.h, lid.d]}
          radius={0.005}
          smoothness={3}
          position={[0, lid.h / 2, -lid.d / 2]}
          castShadow
          receiveShadow
          onPointerOver={() => !active && setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            if (!active) onRequestZoom();
          }}
        >
          <meshStandardMaterial color="#2c2f34" roughness={0.34} metalness={0.88} />
        </RoundedBox>

        {/* bezel */}
        <mesh position={[0, LAPTOP.screenLocal.y, 0.0012]}>
          <planeGeometry args={[lid.w - 0.006, lid.h - 0.006]} />
          <meshStandardMaterial color="#0b0c0e" roughness={0.5} />
        </mesh>

        {/* emissive backing so the screen glows in reflections and lights the room */}
        <mesh ref={glowRef} position={[0, LAPTOP.screenLocal.y, 0.0018]}>
          <planeGeometry args={[screen.w, screen.h]} />
          <meshBasicMaterial color={theme.name === 'arsenal' ? '#ff5a52' : '#6f8dff'} transparent opacity={0.14} toneMapped={false} />
        </mesh>

        {/* Screen spill. A rectAreaLight was truer but needs RectAreaLightUniformsLib
            and costs several times a point light for a glow this small. */}
        <pointLight
          position={[0, LAPTOP.screenLocal.y, 0.09]}
          color={theme.name === 'arsenal' ? '#ffd7d4' : '#cfe0ff'}
          intensity={0.5}
          distance={1.5}
          decay={2}
        />

        {/* ---------------- SCREEN ---------------- */}
        {!liveScreen && (
          // Painted stand-in: a lit panel in the club colours, no DOM, no CSS3D.
          <mesh position={[LAPTOP.screenLocal.x, LAPTOP.screenLocal.y, LAPTOP.screenLocal.z]}>
            <planeGeometry args={[screen.w, screen.h]} />
            <meshBasicMaterial color="#b4232a" toneMapped={false} />
          </mesh>
        )}

        {liveScreen && (
        <Html
          transform
          scale={HTML_SCALE}
          position={[LAPTOP.screenLocal.x, LAPTOP.screenLocal.y, LAPTOP.screenLocal.z]}
          occlude={lidRef.current ? [lidRef as never] : undefined}
          zIndexRange={[10, 0]}
          style={{ pointerEvents: active ? 'auto' : 'none' }}
        >
          <div
            id="laptop-screen"
            style={{
              width: SCREEN_PX.w,
              height: SCREEN_PX.h,
              overflow: 'hidden',
              background: '#05060a',
              userSelect: active ? 'auto' : 'none',
              cursor: active ? 'auto' : 'pointer',
            }}
          >
            <Desktop theme={theme} active={active} />
          </div>
        </Html>
        )}

        {/* screen reflection sheen — a faint diagonal gradient sitting over the DOM */}
        <mesh position={[0, LAPTOP.screenLocal.y, 0.004]} renderOrder={2}>
          <planeGeometry args={[screen.w, screen.h]} />
          <meshBasicMaterial
            color="#9fb4d8"
            transparent
            opacity={active ? 0.015 : 0.05}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>

        {/* webcam dot + chin logo */}
        <mesh position={[0, lid.h - 0.008, 0.0022]}>
          <circleGeometry args={[0.0016, 12]} />
          <meshStandardMaterial color="#05060a" roughness={0.2} />
        </mesh>

        {/* hover affordance ring when zoomed out */}
        {hovered && !active && (
          <mesh position={[0, LAPTOP.screenLocal.y, 0.006]}>
            <ringGeometry args={[screen.w * 0.52, screen.w * 0.54, 4, 1, Math.PI / 4]} />
            <meshBasicMaterial color={theme.accent} toneMapped={false} transparent opacity={0.9} />
          </mesh>
        )}
      </group>

      {/*
        The arrow lives outside the lid group so it stays vertical — inside it, it would
        inherit the lid's 15-degree tilt and lean backwards over the screen.
      */}
      {hint && <ClickHint theme={theme} hidden={hintHidden} onClick={onRequestZoom} />}
    </group>
  );
}
