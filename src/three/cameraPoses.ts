import * as THREE from 'three';

export type CamMode = 'intro' | 'monitor';

export const FOV = 45;

/**
 * The establishing shot. The room is small and the camera never moves from here
 * beyond a little pointer parallax, so this framing is the whole first impression.
 */
export const INTRO = {
  pos: new THREE.Vector3(1.75, 1.92, 3.55),
  target: new THREE.Vector3(-0.05, 0.86, -1.05),
};
