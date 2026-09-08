import * as THREE from 'three';
import type { Theme } from './theme';

const cache = new Map<string, THREE.Texture>();

function makeCanvas(size: number) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  return { cv, ctx: cv.getContext('2d')! };
}

function finish(cv: HTMLCanvasElement, repeat: number, srgb = true) {
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = 8;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Rubber gym flooring: interlocking tiles with a speckled EPDM fleck. */
export function rubberTiles(theme: Theme, repeat = 14) {
  const key = `rubber-${theme.name}-${repeat}`;
  if (cache.has(key)) return cache.get(key)!;
  const { cv, ctx } = makeCanvas(512);

  ctx.fillStyle = theme.floor;
  ctx.fillRect(0, 0, 512, 512);

  // EPDM colour flecks
  const fleck = [theme.floorLine, theme.accentDim, '#5a5a63', theme.floor];
  for (let i = 0; i < 5200; i++) {
    ctx.fillStyle = fleck[(Math.random() * fleck.length) | 0];
    ctx.globalAlpha = 0.10 + Math.random() * 0.30;
    const r = 0.7 + Math.random() * 2.1;
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Tile seams — a 2x2 grid of tiles per texture repeat
  ctx.strokeStyle = 'rgba(0,0,0,0.55)';
  ctx.lineWidth = 3;
  [0, 256].forEach((o) => {
    ctx.beginPath();
    ctx.moveTo(o, 0); ctx.lineTo(o, 512);
    ctx.moveTo(0, o); ctx.lineTo(512, o);
    ctx.stroke();
  });
  // seam highlight so the bevel reads
  ctx.strokeStyle = 'rgba(255,255,255,0.045)';
  ctx.lineWidth = 1;
  [2, 258].forEach((o) => {
    ctx.beginPath();
    ctx.moveTo(o, 0); ctx.lineTo(o, 512);
    ctx.moveTo(0, o); ctx.lineTo(512, o);
    ctx.stroke();
  });

  const tex = finish(cv, repeat);
  cache.set(key, tex);
  return tex;
}

/** Poured-concrete or painted wall with blotchy variation and a faint trowel grain. */
export function concrete(theme: Theme, repeat = 4, tint?: string) {
  const key = `concrete-${theme.name}-${repeat}-${tint ?? ''}`;
  if (cache.has(key)) return cache.get(key)!;
  const { cv, ctx } = makeCanvas(512);

  ctx.fillStyle = tint ?? theme.wall;
  ctx.fillRect(0, 0, 512, 512);

  // large soft blotches
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 512, y = Math.random() * 512;
    const r = 30 + Math.random() * 120;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const dark = Math.random() > 0.5;
    g.addColorStop(0, dark ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.06)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // fine grain
  const img = ctx.getImageData(0, 0, 512, 512);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);

  const tex = finish(cv, repeat);
  cache.set(key, tex);
  return tex;
}

/** Knurled-grip band for barbells and dumbbell handles. */
export function knurl(repeat = 1) {
  const key = `knurl-${repeat}`;
  if (cache.has(key)) return cache.get(key)!;
  const { cv, ctx } = makeCanvas(256);
  ctx.fillStyle = '#8f959d';
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 2;
  for (let i = -256; i < 512; i += 9) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 256, 256); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(i + 256, 0); ctx.lineTo(i, 256); ctx.stroke();
  }
  const tex = finish(cv, repeat);
  cache.set(key, tex);
  return tex;
}

/** Soft radial blob used as a fake contact shadow / light pool decal. */
export function radialFalloff(color = '#000', power = 1) {
  const key = `radial-${color}-${power}`;
  if (cache.has(key)) return cache.get(key)!;
  const { cv, ctx } = makeCanvas(256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  const cc = new THREE.Color(color);
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    g.addColorStop(t, `rgba(${(cc.r * 255) | 0},${(cc.g * 255) | 0},${(cc.b * 255) | 0},${Math.pow(1 - t, 2 * power)})`);
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}


/**
 * Laptop keyboard drawn as a texture. This was 70 individual box meshes, which is a lot
 * of scene graph for something the size of a postage stamp on screen.
 */
export function keyboardFace() {
  const key = 'keyboard';
  if (cache.has(key)) return cache.get(key)!;
  const cv = document.createElement('canvas');
  cv.width = 1024; cv.height = 560;
  const ctx = cv.getContext('2d')!;

  ctx.fillStyle = '#101115';
  ctx.fillRect(0, 0, 1024, 560);

  const rows = 5;
  const cols = 14;
  const padX = 26, padY = 26;
  const gw = (1024 - padX * 2) / cols;
  const gh = (560 - padY * 2) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // widen the outer keys on the bottom row so it reads as a keyboard, not a grid
      let x = padX + c * gw;
      let w = gw - 5;
      if (r === rows - 1) {
        if (c > 3 && c < 10) { if (c !== 4) continue; x = padX + 4 * gw; w = gw * 6 - 5; }
      }
      const y = padY + r * gh;
      const h = gh - 5;
      ctx.fillStyle = '#23252b';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 6);
      ctx.fill();
      // top bevel
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, w - 4, h * 0.42, 5);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(key, tex);
  return tex;
}

export function disposeTextureCache() {
  cache.forEach((t) => t.dispose());
  cache.clear();
}
