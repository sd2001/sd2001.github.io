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
    fog: { color: '#08080c', near: 9, far: 32 },
    floor: '#141417',
    floorLine: '#232329',
    wall: '#26262b',
    wallLower: '#1b1b1f',
    wallStripe: '#c0141b',
    ceiling: '#131316',
    metal: '#4a4e55',
    metalDark: '#26282d',
    pad: '#141416',
    padAccent: '#8f1218',
    rubber: '#0f0f11',
    chrome: '#8d939c',
    accent: '#ff3b30',
    accentDim: '#7a1a17',
    neon: '#ff2b21',
    lamp: '#ffc98a',
    lampIntensity: 26,
    ambient: { color: '#2b3346', intensity: 0.5 },
    keyLight: { color: '#ffd0a0', intensity: 1.5 },
    rimLight: { color: '#5f86ff', intensity: 1.9 },
    fillLight: { color: '#334066', intensity: 0.7 },
    bloom: { intensity: 0.85, threshold: 0.72, smoothing: 0.32 },
    vignette: 0.52,
    exposure: 1.05,
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
    fog: { color: '#241a1f', near: 13, far: 40 },
    floor: '#2c2023',
    floorLine: '#3d2c30',
    wall: '#ece9e3',
    wallLower: '#d8d4cc',
    wallStripe: '#EF0107',
    ceiling: '#f4f2ee',
    metal: '#b9bec6',
    metalDark: '#5d6268',
    pad: '#9d0a10',
    padAccent: '#f2f2f0',
    rubber: '#1b1416',
    chrome: '#dfe3e8',
    accent: '#EF0107',
    accentDim: '#9b0a10',
    neon: '#ff1f27',
    lamp: '#fff4e2',
    lampIntensity: 30,
    ambient: { color: '#8f9099', intensity: 1.15 },
    keyLight: { color: '#fff6e8', intensity: 2.2 },
    rimLight: { color: '#ff5a52', intensity: 1.2 },
    fillLight: { color: '#9fb0cc', intensity: 1.0 },
    bloom: { intensity: 0.5, threshold: 0.85, smoothing: 0.4 },
    vignette: 0.34,
    exposure: 1.0,
    mirror: 0.75,
  },
};

export const DEFAULT_THEME: ThemeName = 'warehouse';
