import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { advance, Canvas } from '@react-three/fiber';
import { AdaptiveDpr, OrbitControls, Preload } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, SMAA, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import CameraRig from './CameraRig';
import { APPROACH, type CamMode } from './cameraPoses';
import Gym from './scene/Gym';
import { THEMES, type ThemeName } from './theme';

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
  /** True once the camera has finished its move — gates OrbitControls so it cannot fight the transition. */
  arrived: boolean;
};

export default function Experience({ themeName, mode, onArrive, onRequestZoom, laptopActive, paused, arrived }: Props) {
  const theme = THEMES[themeName];

  // Stable identity: an inline object here re-initialises the renderer on every render.
  const glConfig = useMemo(
    () => ({
      antialias: false,
      powerPreference: 'high-performance' as const,
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: theme.exposure,
    }),
    [theme.exposure],
  );

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={glConfig}
      camera={{ fov: 45, near: 0.02, far: 60, position: [3.1, 2.35, 6.2] }}
      onCreated={({ scene, gl }) => {
        scene.background = new THREE.Color(theme.bg);
        scene.fog = new THREE.Fog(theme.fog.color, theme.fog.near, theme.fog.far);
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
      // The DOM screen lives inside the canvas subtree, so let clicks through to it.
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* Drop resolution rather than framerate on weaker GPUs. AdaptiveDpr works the
          dpr range above without pushing React state through the Canvas props. */}
      <AdaptiveDpr pixelated />

      <color attach="background" args={[theme.bg]} />
      <fog attach="fog" args={[theme.fog.color, theme.fog.near, theme.fog.far]} />

      <CameraRig mode={mode} onArrive={onArrive} paused={paused} />

      {mode === 'free' && arrived && (
        <OrbitControls
          makeDefault
          target={APPROACH.target}
          enablePan={false}
          minDistance={0.8}
          maxDistance={9}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 2.06}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.55}
          zoomSpeed={0.7}
        />
      )}

      <Suspense fallback={null}>
        <Gym theme={theme} laptopActive={laptopActive} onRequestZoom={onRequestZoom} />
        <Preload all />
      </Suspense>

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={theme.bloom.intensity}
          luminanceThreshold={theme.bloom.threshold}
          luminanceSmoothing={theme.bloom.smoothing}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.24} darkness={theme.vignette} />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.42} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
