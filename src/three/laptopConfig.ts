import * as THREE from 'three';

/**
 * Physical laptop constants. The camera keyframe for "sitting at the machine"
 * is derived from these rather than hand-tuned, so moving the laptop moves the camera with it.
 */
export const SCREEN_PX = { w: 1280, h: 800 };

export const LAPTOP = {
  /** World position of the lid hinge — the back edge of the base, resting on the seat pad. */
  position: new THREE.Vector3(0, 0.565, -0.03),
  /** Lid tilt about X. Negative leans the top of the screen away from the viewer. */
  tilt: THREE.MathUtils.degToRad(-15),
  base: { w: 0.41, h: 0.016, d: 0.27 },
  lid: { w: 0.41, h: 0.262, d: 0.012 },
  /** Viewable screen area, 16:10 to match SCREEN_PX. */
  screen: { w: 0.372, h: 0.2325 },
  /** Screen centre in lid-local space. */
  screenLocal: new THREE.Vector3(0, 0.131, 0.0025),
};

/**
 * drei's <Html transform> builds its CSS matrix with a factor of 400/distanceFactor,
 * defaulting to 40. So a DOM element W px wide occupies W * scale / 40 world units.
 * Solve for the scale that makes SCREEN_PX.w land exactly on screen.w.
 */
export const HTML_SCALE = (LAPTOP.screen.w / SCREEN_PX.w) * 40;

const _m = new THREE.Matrix4().makeRotationX(LAPTOP.tilt);

/** World-space centre of the screen. */
export const SCREEN_CENTER = LAPTOP.screenLocal.clone().applyMatrix4(_m).add(LAPTOP.position);

/** World-space outward normal of the screen. */
export const SCREEN_NORMAL = new THREE.Vector3(0, 0, 1).applyMatrix4(_m).normalize();

/**
 * Camera position that frames the screen at `fill` of the viewport height for a given vertical FOV.
 * Used for the "at the machine" keyframe.
 */
export function cameraForScreen(fovDeg: number, fill: number) {
  const d = LAPTOP.screen.h / (2 * Math.tan(THREE.MathUtils.degToRad(fovDeg) / 2) * fill);
  return SCREEN_CENTER.clone().addScaledVector(SCREEN_NORMAL, d);
}
