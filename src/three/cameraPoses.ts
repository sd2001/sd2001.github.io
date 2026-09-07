import * as THREE from 'three';

export type CamMode = 'intro' | 'monitor' | 'free';

export const FOV = 45;

/** Wide establishing shot, slightly off-axis so the room reads as a space. */
export const INTRO = {
  pos: new THREE.Vector3(3.1, 2.35, 6.2),
  target: new THREE.Vector3(-0.15, 0.95, -0.35),
};

/** Mid shot — off the machine, laptop legible but the room still visible. Also the free-look anchor. */
export const APPROACH = {
  pos: new THREE.Vector3(0.55, 1.42, 2.05),
  target: new THREE.Vector3(0, 0.78, -0.1),
};
