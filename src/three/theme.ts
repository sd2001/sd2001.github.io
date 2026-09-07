export type ThemeName = 'warehouse' | 'arsenal';

export type Theme = {
  name: ThemeName;
  label: string;
  blurb: string;
  bg: string;
  fog: { color: string; near: number; far: number };
  floor: string;
  floorLine: string;
  wall: string;
  wallLower: string;
  wallStripe: string;
  ceiling: string;
  metal: string;
  metalDark: string;
  pad: string;
  padAccent: string;
  rubber: string;
  chrome: string;
  accent: string;
  accentDim: string;
  neon: string;
  lamp: string;
  lampIntensity: number;
  ambient: { color: string; intensity: number };
  keyLight: { color: string; intensity: number };
  rimLight: { color: string; intensity: number };
  fillLight: { color: string; intensity: number };
  bloom: { intensity: number; threshold: number; smoothing: number };
  vignette: number;
  exposure: number;
  mirror: number;
};

export const THEMES: Record<ThemeName, Theme> = {
  /**
   * Late-night warehouse gym. Concrete and rubber, pools of warm lamp light,
   * a cold rim from the high windows, and the laptop as the brightest thing in the room.
   */
  warehouse: {
    name: 'warehouse',
    label: 'Late-night warehouse',
    blurb: 'Concrete, rubber and one red neon. 11pm, nobody else in the building.',
    bg: '#07070a',
    fog: { color: '#0a0a10', near: 7, far: 20 },
    floor: '#191a1e',
    floorLine: '#2a2b32',
    wall: '#32333a',
    wallLower: '#212228',
    wallStripe: '#5c1a1c',
    ceiling: '#131316',
    metal: '#4e535b',
    metalDark: '#2e3138',
    pad: '#1a1b1f',
    padAccent: '#8f1218',
    rubber: '#141418',
    chrome: '#8d939c',
    accent: '#ff3b30',
    accentDim: '#7a1a17',
    neon: '#ff2b21',
    lamp: '#ffc98a',
    lampIntensity: 30,
    ambient: { color: '#3d4560', intensity: 1.15 },
    keyLight: { color: '#ffd3a6', intensity: 2.1 },
    rimLight: { color: '#6d90ff', intensity: 2.3 },
    fillLight: { color: '#3d4a72', intensity: 1.0 },
    bloom: { intensity: 0.62, threshold: 0.8, smoothing: 0.35 },
    vignette: 0.46,
    exposure: 1.12,
    mirror: 0.55,
  },

  /**
   * Arsenal home gym. Cream walls with a red band at waist height, chrome equipment,
   * bright and clean — club colours running through the whole room.
   */
  arsenal: {
    name: 'arsenal',
    label: 'Arsenal home gym',
    blurb: 'Cream walls, a red band at waist height, chrome everywhere. North London, red half.',
    bg: '#141013',
    fog: { color: '#241a1f', near: 8, far: 22 },
    floor: '#2c2023',
    floorLine: '#3d2c30',
    wall: '#ece9e3',
    wallLower: '#d8d4cc',
    wallStripe: '#EF0107',
    ceiling: '#f4f2ee',
    metal: '#a9aeb6',
    metalDark: '#585d64',
    pad: '#9d0a10',
    padAccent: '#f2f2f0',
    rubber: '#1b1416',
    chrome: '#bcc2ca',
    accent: '#EF0107',
    accentDim: '#9b0a10',
    neon: '#ff1f27',
    lamp: '#fff4e2',
    lampIntensity: 30,
    ambient: { color: '#8f9099', intensity: 0.78 },
    keyLight: { color: '#fff6e8', intensity: 1.85 },
    rimLight: { color: '#ff5a52', intensity: 1.2 },
    fillLight: { color: '#9fb0cc', intensity: 1.0 },
    bloom: { intensity: 0.34, threshold: 0.94, smoothing: 0.45 },
    vignette: 0.34,
    exposure: 1.0,
    mirror: 0.6,
  },
};

export const DEFAULT_THEME: ThemeName = 'warehouse';
