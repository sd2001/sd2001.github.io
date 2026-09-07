import { useCallback, useEffect, useRef, useState } from 'react';
import Experience from './three/Experience';
import Hud from './ui/Hud';
import StartScreen from './ui/StartScreen';
import MobileShell from './ui/MobileShell';
import SceneBoundary from './ui/SceneBoundary';
import { useDevice } from './ui/useDevice';
import type { CamMode } from './three/cameraPoses';
import { DEFAULT_THEME, type ThemeName } from './three/theme';
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
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME);

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
              themeName={themeName}
              mode={mode}
              onArrive={onArrive}
              onRequestZoom={() => go('monitor')}
              laptopActive={laptopActive}
              paused={!started && !device.isPhone}
              tier={device.tier}
              hero={device.isPhone}
            />
          </SceneBoundary>
        )}
        {device.isPhone && <div className="stage-fade" />}
      </div>

      {device.isPhone ? (
        <MobileShell />
      ) : (
        <>
          {started && (
            <Hud
              mode={mode}
              arrived={arrived}
              themeName={themeName}
              onTheme={setThemeName}
              onEnter={() => go('monitor')}
              onBack={() => go('intro')}
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
