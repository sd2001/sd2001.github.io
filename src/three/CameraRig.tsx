import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { cameraForScreen, SCREEN_CENTER } from './laptopConfig';
import { FOV, INTRO, type CamMode } from './cameraPoses';

export type { CamMode };

const SCREEN_ASPECT = 0.372 / 0.2325;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Props = {
  mode: CamMode;
  onArrive?: (mode: CamMode) => void;
  paused?: boolean;
  /** Pointer parallax on the wide shot. Off on touch, where there is no hover. */
  parallax?: boolean;
};

/**
 * Two fixed poses and a transition between them. There is no free navigation: the room
 * is a set, not a space to walk around, so the only camera move is sitting down at the
 * laptop and standing back up.
 *
 * State lives in refs and is driven from useFrame rather than effects, which makes the
 * rig immune to StrictMode double-mounting and to re-renders of the Canvas subtree.
 */
export default function CameraRig({ mode, onArrive, paused, parallax = true }: Props) {
  const { camera, size } = useThree();

  const fromPos = useRef(new THREE.Vector3());
  const fromTarget = useRef(new THREE.Vector3());
  const toPos = useRef(new THREE.Vector3());
  const toTarget = useRef(new THREE.Vector3());
  const lookAt = useRef(INTRO.target.clone());

  const t = useRef(1);
  const dur = useRef(1);
  const settled = useRef(true);
  const activeMode = useRef<CamMode | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const aspect = useRef(size.width / Math.max(1, size.height));
  aspect.current = size.width / Math.max(1, size.height);

  useEffect(() => {
    if (!parallax) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [parallax]);

  /** On a narrow or portrait window, fit the screen to width instead of height. */
  const monitorPose = () => {
    const a = aspect.current;
    const fill = a >= SCREEN_ASPECT ? 0.84 : 0.84 * (a / SCREEN_ASPECT);
    return { pos: cameraForScreen(FOV, Math.max(0.28, fill)), target: SCREEN_CENTER.clone() };
  };

  const poseFor = (m: CamMode) =>
    m === 'monitor' ? monitorPose() : { pos: INTRO.pos.clone(), target: INTRO.target.clone() };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (activeMode.current !== mode) {
      const first = activeMode.current === null;
      const pose = poseFor(mode);
      if (first) {
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
      }
      fromPos.current.copy(camera.position);
      fromTarget.current.copy(lookAt.current);
      toPos.current.copy(pose.pos);
      toTarget.current.copy(pose.target);
      t.current = 0;
      settled.current = false;
      dur.current = mode === 'monitor' ? 1.9 : 1.5;
      activeMode.current = mode;
    }

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

    if (mode === 'monitor') {
      // Hold dead still: drift here would fight with clicking things on screen.
      const want = monitorPose();
      if (camera.position.distanceToSquared(want.pos) > 1e-6) {
        camera.position.copy(want.pos);
        lookAt.current.copy(want.target);
        camera.lookAt(lookAt.current);
      }
      return;
    }

    if (paused) return;

    // A little pointer parallax so the fixed shot is not completely dead.
    if (parallax) {
      const desired = new THREE.Vector3(
        INTRO.pos.x + mouse.current.x * 0.3,
        INTRO.pos.y - mouse.current.y * 0.16,
        INTRO.pos.z,
      );
      camera.position.lerp(desired, 1 - Math.pow(0.004, dt));
      lookAt.current.lerp(
        new THREE.Vector3(
          INTRO.target.x + mouse.current.x * 0.08,
          INTRO.target.y - mouse.current.y * 0.04,
          INTRO.target.z,
        ),
        1 - Math.pow(0.006, dt),
      );
      camera.lookAt(lookAt.current);
    }
  });

  return null;
}
