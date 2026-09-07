import { useCallback, useEffect, useState } from 'react';
import Experience from './three/Experience';
import Hud from './ui/Hud';
import StartScreen from './ui/StartScreen';
import type { CamMode } from './three/cameraPoses';
import { DEFAULT_THEME, type ThemeName } from './three/theme';
import { osBus } from './os/bus';

export default function App() {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<CamMode>('intro');
  const [arrived, setArrived] = useState(false);
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME);

  // The scene is fully procedural, so "ready" is really "the first frames have compiled".
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  const go = useCallback((m: CamMode) => {
    setArrived(false);
    setMode(m);
  }, []);

  const onArrive = useCallback((m: CamMode) => {
    setArrived(true);
    void m;
  }, []);

  // Esc steps back out of the machine.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode === 'monitor') go('intro');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, go]);

  const laptopActive = mode === 'monitor' && arrived;

  // Credits live in a window on the laptop, so fly to the screen and ask the OS to
  // open it. The bus holds the request if the desktop has not booted yet.
  const showCredits = useCallback(() => {
    if (mode !== 'monitor') go('monitor');
    osBus.openApp('credits');
  }, [mode, go]);

  return (
    <>
      <Experience
        themeName={themeName}
        mode={mode}
        onArrive={onArrive}
        onRequestZoom={() => go('monitor')}
        laptopActive={laptopActive}
        paused={!started}
        arrived={arrived}
      />

      {started && (
        <Hud
          mode={mode}
          arrived={arrived}
          themeName={themeName}
          onTheme={setThemeName}
          onEnter={() => go('monitor')}
          onBack={() => go('intro')}
          onFree={() => go('free')}
          onCredits={showCredits}
        />
      )}

      <StartScreen gone={started} ready={ready} onStart={() => setStarted(true)} />

      <div className="notice mobile">
        <div className="inner">
          <b>This one wants a bigger screen.</b>
          The portfolio is a 3D room with a laptop you sit down at, and it needs the width to work.
          Open it on a desktop — or reach me at{' '}
          <a href="mailto:im.swarnabha2001@gmail.com" style={{ color: '#ff8d82' }}>im.swarnabha2001@gmail.com</a>.
        </div>
      </div>
    </>
  );
}
