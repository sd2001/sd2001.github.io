import * as THREE from 'three';

export type CamMode = 'intro' | 'monitor' | 'free';

export const FOV = 45;

/** Wide establishing shot, slightly off-axis so the room reads as a space. */
export const INTRO = {
  pos: new THREE.Vector3(1.15, 2.18, 6.35),
  target: new THREE.Vector3(-0.1, 0.95, -0.55),
};

/** Mid shot — off the machine, laptop legible but the room still visible. Also the free-look anchor. */
export const APPROACH = {
  pos: new THREE.Vector3(0.55, 1.42, 2.05),
  target: new THREE.Vector3(0, 0.78, -0.1),
};
