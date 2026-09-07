import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { cameraForScreen, SCREEN_CENTER } from './laptopConfig';
import { APPROACH, FOV, INTRO, type CamMode } from './cameraPoses';

export type { CamMode };

const SCREEN_ASPECT = 0.372 / 0.2325;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Props = {
  mode: CamMode;
  onArrive?: (mode: CamMode) => void;
  paused?: boolean;
};

/**
 * All transition state lives in refs and is driven from useFrame rather than from
 * effects. That makes the rig immune to StrictMode double-mounting and to any
 * re-render of the Canvas subtree — a mode change is detected by comparing against
 * the last mode we actually animated to, not by an effect firing.
 */
export default function CameraRig({ mode, onArrive, paused }: Props) {
  const { camera, size } = useThree();

  const fromPos = useRef(new THREE.Vector3());
  const fromTarget = useRef(new THREE.Vector3());
  const toPos = useRef(new THREE.Vector3());
  const toTarget = useRef(new THREE.Vector3());
  const lookAt = useRef(INTRO.target.clone());

  const t = useRef(1);
  const dur = useRef(1);
  const settled = useRef(true);
  /** The mode the rig is currently animating to (or resting at). */
  const activeMode = useRef<CamMode | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const aspect = useRef(size.width / Math.max(1, size.height));

  aspect.current = size.width / Math.max(1, size.height);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  /** Screen framing depends on aspect: on a narrow window, fit to width instead of height. */
  const monitorPose = () => {
    const a = aspect.current;
    const fill = a >= SCREEN_ASPECT ? 0.8 : 0.8 * (a / SCREEN_ASPECT);
    return { pos: cameraForScreen(FOV, Math.max(0.3, fill)), target: SCREEN_CENTER.clone() };
  };

  const poseFor = (m: CamMode) => {
    if (m === 'monitor') return monitorPose();
    if (m === 'free') return { pos: APPROACH.pos.clone(), target: APPROACH.target.clone() };
    return { pos: INTRO.pos.clone(), target: INTRO.target.clone() };
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);


    // ---- detect a mode change without relying on effects ----
    if (activeMode.current !== mode) {
      const first = activeMode.current === null;
      const pose = poseFor(mode);

      if (first) {
        // Cold start: snap straight to the opening pose.
        camera.position.copy(pose.pos);
        lookAt.current.copy(pose.target);
        camera.lookAt(lookAt.current);
        (camera as THREE.PerspectiveCamera).fov = FOV;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
        t.current = 1;
        settled.current = true;
        activeMode.current = mode;
        onArrive?.(mode);
        return;
      } else {
        fromPos.current.copy(camera.position);
        fromTarget.current.copy(lookAt.current);
        toPos.current.copy(pose.pos);
        toTarget.current.copy(pose.target);
        t.current = 0;
        settled.current = false;
        // Flying into the screen is the money shot — give it room to breathe.
        dur.current = mode === 'monitor' ? 2.15 : mode === 'intro' ? 1.9 : 1.35;
      }
      activeMode.current = mode;
    }

    // ---- run the transition ----
    if (!settled.current) {
      t.current = Math.min(1, t.current + dt / dur.current);
      const e = easeInOutCubic(t.current);
      camera.position.lerpVectors(fromPos.current, toPos.current, e);
      lookAt.current.lerpVectors(fromTarget.current, toTarget.current, e);
      camera.lookAt(lookAt.current);

      if (t.current >= 1) {
        settled.current = true;
        onArrive?.(mode);
      }
      return;
    }

    // ---- settled behaviour ----
    if (mode === 'monitor') {
      // Hold dead still: any drift here fights with clicking things on screen.
      // Re-frame only if the window has been resized out from under us.
      const want = monitorPose();
      if (camera.position.distanceToSquared(want.pos) > 1e-6) {
        camera.position.copy(want.pos);
        lookAt.current.copy(want.target);
        camera.lookAt(lookAt.current);
      }
      return;
    }

    if (paused || mode === 'free') return;

    // Slow arc plus a little pointer parallax, so the establishing shot stays alive.
    const time = performance.now() / 1000;
    const orbit = Math.sin(time * 0.12) * 0.55;
    const bob = Math.sin(time * 0.19) * 0.09;

    const desired = new THREE.Vector3(
      INTRO.pos.x + orbit + mouse.current.x * 0.42,
      INTRO.pos.y + bob - mouse.current.y * 0.22,
      INTRO.pos.z - Math.abs(orbit) * 0.25,
    );
    camera.position.lerp(desired, 1 - Math.pow(0.001, dt));

    lookAt.current.lerp(
      new THREE.Vector3(
        INTRO.target.x + mouse.current.x * 0.12,
        INTRO.target.y - mouse.current.y * 0.06,
        INTRO.target.z,
      ),
      1 - Math.pow(0.002, dt),
    );
    camera.lookAt(lookAt.current);
  });

  return null;
}
