import { useCallback, useEffect, useRef, useState } from 'react';
import Experience from './three/Experience';
import Hud from './ui/Hud';
import StartScreen from './ui/StartScreen';
import MobileShell from './ui/MobileShell';
import SceneBoundary from './ui/SceneBoundary';
import NowPlaying from './ui/NowPlaying';
import { songs } from './data/content';
import { stopGuitarAudio, strumGuitar } from './audio/guitar';
import { useDevice } from './ui/useDevice';
import type { CamMode } from './three/cameraPoses';
import { DEFAULT_THEME } from './three/theme';
import { osBus } from './os/bus';

export default function App() {
  const device = useDevice();
  const stageRef = useRef<HTMLDivElement>(null);

  /*
   * Do not mount the Canvas until the stage actually has dimensions.
   *
   * react-three-fiber only configures its root once the container measures non-zero, and
   * a zero-size first paint (a background tab, a collapsed pane, a hidden iframe) leaves
   * it half-initialised — its Provider then calls events.connect() on a root element that
   * is no longer attached and throws. Waiting for a real size removes that window.
   */
  const [stageSized, setStageSized] = useState(false);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const check = () => {
      const r = el.getBoundingClientRect();
      setStageSized(r.width > 0 && r.height > 0);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<CamMode>('intro');
  const [arrived, setArrived] = useState(false);

  // The scene is fully procedural, so "ready" is really "the first frames have compiled".
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700);
    return () => clearTimeout(t);
  }, []);

  const go = useCallback((m: CamMode) => {
    setArrived(false);
    setMode(m);
  }, []);

  const onArrive = useCallback(() => setArrived(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode === 'monitor') go('intro');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, go]);

  /**
   * Clicking the guitar advances through the track list and shows the card. playId is
   * bumped every click so re-clicking the same track replays the animation.
   */
  const [track, setTrack] = useState(-1);
  const [playId, setPlayId] = useState(0);
  /**
   * Sound is on by default but nothing can make a noise until the visitor clicks the
   * guitar, so this never ambushes anyone — it is not autoplay.
   */
  const [sound, setSound] = useState(true);

  const strum = useCallback(() => {
    setTrack((i) => (i + 1) % songs.length);
    setPlayId((n) => n + 1);
    if (sound) strumGuitar(0.5);
  }, [sound]);

  const toggleSound = useCallback(() => {
    setSound((on) => {
      if (on) stopGuitarAudio();
      return !on;
    });
  }, []);

  const laptopActive = mode === 'monitor' && arrived;

  return (
    <>
      {/*
        The canvas lives here and only here, in a wrapper that never unmounts. Moving it
        into a phone-specific subtree remounts the whole WebGL root on every breakpoint
        crossing — a rotated phone was enough to tear it down — so the phone layout only
        changes this element's CSS, never its position in the tree.
      */}
      <div ref={stageRef} className={`stage${device.isPhone ? ' stage-hero' : ''}`}>
        {stageSized && (
          <SceneBoundary>
            <Experience
              themeName={DEFAULT_THEME}
              mode={mode}
              onArrive={onArrive}
              onRequestZoom={() => go('monitor')}
              laptopActive={laptopActive}
              paused={!started && !device.isPhone}
              tier={device.tier}
              hero={device.isPhone}
              onStrum={strum}
            />
          </SceneBoundary>
        )}
        {device.isPhone && <div className="stage-fade" />}
      </div>

      <NowPlaying song={track >= 0 ? songs[track] : null} playId={playId} />

      {device.isPhone ? (
        <MobileShell />
      ) : (
        <>
          {started && (
            <Hud
              mode={mode}
              arrived={arrived}
              onEnter={() => go('monitor')}
              onBack={() => go('intro')}
              sound={sound}
              onToggleSound={toggleSound}
              onCredits={() => {
                if (mode !== 'monitor') go('monitor');
                osBus.openApp('credits');
              }}
            />
          )}
          <StartScreen gone={started} ready={ready} onStart={() => setStarted(true)} />
        </>
      )}
    </>
  );
}
