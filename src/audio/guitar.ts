/**
 * A synthesised electric-guitar strum, played when you click the guitar in the room.
 *
 * Generated in the browser with WebAudio — Karplus-Strong plucked strings through a
 * soft-clip overdrive — so there are no audio files to ship and nothing to license. It is
 * a guitar chord, deliberately not a reproduction of any recording: hosting the actual
 * track would be a copyright problem, so the card links out to the real thing instead.
 *
 * Audio is only ever created inside a click handler, which is the user gesture browsers
 * require before an AudioContext may start.
 */

let ctx: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** Karplus-Strong: a noise burst fed through a short averaging delay line. */
function pluckBuffer(ac: AudioContext, freq: number, seconds: number, damping: number) {
  const key = `${freq.toFixed(2)}-${seconds}-${damping}`;
  const cached = bufferCache.get(key);
  if (cached) return cached;

  const rate = ac.sampleRate;
  const length = Math.floor(rate * seconds);
  const period = Math.max(2, Math.floor(rate / freq));
  const buf = ac.createBuffer(1, length, rate);
  const y = buf.getChannelData(0);

  for (let i = 0; i < period; i++) y[i] = Math.random() * 2 - 1;
  for (let i = period; i < length; i++) {
    y[i] = damping * 0.5 * (y[i - period] + y[i - period - 1]);
  }

  // fade the tail so it never clicks off
  const fade = Math.floor(rate * 0.15);
  for (let i = 0; i < fade; i++) y[length - fade + i] *= 1 - i / fade;

  bufferCache.set(key, buf);
  return buf;
}

/** Soft-clip curve — an overdriven edge without going fuzzy. */
function overdriveCurve(amount = 6) {
  const n = 1024;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((1 + amount) * x) / (1 + amount * Math.abs(x));
  }
  return curve;
}

/** Open-position power chord voicing, low to high. */
const CHORD = [82.41, 123.47, 164.81, 207.65, 246.94, 329.63];

/**
 * -Infinity, not 0: a freshly created AudioContext starts its clock at 0, so seeding this
 * at 0 made the rate-limiter below swallow the very first strum.
 */
let lastPlayed = -Infinity;

/**
 * Strum the chord once. Returns false if audio is unavailable or the call was
 * rate-limited, so callers can stay quiet rather than stacking sounds.
 */
export function strumGuitar(volume = 0.5): boolean {
  const ac = getCtx();
  if (!ac) return false;

  const now = ac.currentTime;
  if (now - lastPlayed < 0.18) return false;
  lastPlayed = now;

  const master = ac.createGain();
  master.gain.value = Math.max(0, Math.min(1, volume)) * 0.5;

  const drive = ac.createWaveShaper();
  drive.curve = overdriveCurve(6);
  drive.oversample = '2x';

  // roll the top off so the overdrive does not get harsh
  const tone = ac.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 3200;
  tone.Q.value = 0.6;

  drive.connect(tone);
  tone.connect(master);
  master.connect(ac.destination);

  CHORD.forEach((freq, i) => {
    const src = ac.createBufferSource();
    src.buffer = pluckBuffer(ac, freq, 1.9, 0.996);

    const g = ac.createGain();
    // lower strings ring louder, as under a downstroke
    g.gain.value = 0.9 - i * 0.07;

    src.connect(g);
    g.connect(drive);
    // ~16ms between strings is what makes it read as a strum, not a chord stab
    src.start(now + i * 0.016);
    src.stop(now + 2.1);
  });

  return true;
}

/** Release the audio context. Called when sound is switched off. */
export function stopGuitarAudio() {
  if (!ctx) return;
  void ctx.close();
  ctx = null;
  bufferCache.clear();
}
