import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { advance, Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import CameraRig from './CameraRig';
import type { CamMode } from './cameraPoses';
import Gym from './scene/Gym';
import { THEMES, type ThemeName } from './theme';
import type { DeviceTier } from '../ui/useDevice';

// Dev-only: browsers pause requestAnimationFrame for hidden documents, which stalls the
// render loop in headless/preview contexts. Exposing R3F's manual advance lets automated
// checks step frames deterministically. Stripped from production builds.
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__advance = (n = 1) => {
    for (let i = 0; i < n; i++) advance(performance.now() + i * 16.7);
  };
}

type Props = {
  themeName: ThemeName;
  mode: CamMode;
  onArrive: (m: CamMode) => void;
  onRequestZoom: () => void;
  laptopActive: boolean;
  paused?: boolean;
  tier: DeviceTier;
  /** Phones render the scene as a decorative hero; the OS lives outside the canvas. */
  hero?: boolean;
};

/** Quality budget per device. Phones get no shadows and no post-processing. */
const QUALITY = {
  phone: { dpr: [1, 1.5] as [number, number], shadows: false, post: false },
  tablet: { dpr: [1, 1.5] as [number, number], shadows: true, post: true },
  desktop: { dpr: [1, 1.75] as [number, number], shadows: true, post: true },
};

export default function Experience({
  themeName, mode, onArrive, onRequestZoom, laptopActive, paused, tier, hero,
}: Props) {
  const theme = THEMES[themeName];
  const q = QUALITY[tier];

  // Stable identity: an inline object here re-initialises the renderer on every render.
  const glConfig = useMemo(
    () => ({
      antialias: !q.post,
      powerPreference: 'high-performance' as const,
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: theme.exposure,
    }),
    [theme.exposure, q.post],
  );

  return (
    <Canvas
      shadows={q.shadows}
      dpr={q.dpr}
      gl={glConfig}
      camera={{ fov: 45, near: 0.02, far: 30, position: [1.75, 1.92, 3.55] }}
      onCreated={({ scene, gl }) => {
        scene.background = new THREE.Color(theme.bg);
        scene.fog = new THREE.Fog(theme.fog.color, theme.fog.near, theme.fog.far);
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        if (import.meta.env.DEV) {
          (window as unknown as Record<string, unknown>).__perf = () => {
            let objects = 0, lights = 0, casters = 0;
            scene.traverse((o) => {
              objects++;
              if ((o as { isLight?: boolean }).isLight) lights++;
              if ((o as { castShadow?: boolean }).castShadow) casters++;
            });
            return { objects, lights, casters, calls: gl.info.render.calls, tris: gl.info.render.triangles };
          };
        }
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[theme.bg]} />
      <fog attach="fog" args={[theme.fog.color, theme.fog.near, theme.fog.far]} />

      <CameraRig mode={mode} onArrive={onArrive} paused={paused} parallax={tier !== 'phone'} />

      <Suspense fallback={null}>
        <Gym
          theme={theme}
          laptopActive={laptopActive && !hero}
          onRequestZoom={onRequestZoom}
          shadows={q.shadows}
          liveScreen={!hero}
        />
        <Preload all />
      </Suspense>

      {q.post && (
        <EffectComposer multisampling={2} enableNormalPass={false}>
          <Bloom
            intensity={theme.bloom.intensity}
            luminanceThreshold={theme.bloom.threshold}
            luminanceSmoothing={theme.bloom.smoothing}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.24} darkness={theme.vignette} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.11} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
