import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './os.css';
import Window, { type WinState } from './Window';
import { APPS, APP_BY_ID } from './apps';
import type { Theme } from '../three/theme';
import { profile } from '../data/content';
import { osBus } from './bus';

/* ------------------------------------------------------------------ *
 * Boot sequence
 * ------------------------------------------------------------------ */

const BOOT_LINES: { t: string; cls?: string; d: number }[] = [
  { t: 'SwarnabhaOS 2.0.0 (gym-build)  ·  kernel 6.9.0-rep', cls: 'dim', d: 130 },
  { t: '', d: 60 },
  { t: '[  OK  ] Mounted /dev/desk0 → gym floor', cls: 'ok', d: 150 },
  { t: '[  OK  ] Started rubber-floor.service', cls: 'ok', d: 110 },
  { t: '[  OK  ] Loaded 6 overhead lamps', cls: 'ok', d: 110 },
  { t: '[  OK  ] neon.tube "ONE MORE REP" online', cls: 'ok', d: 140 },
  { t: '[ WARN ] dog.service is asleep, not restarting', cls: 'warn', d: 200 },
  { t: '[  OK  ] guitar tuned to standard E', cls: 'ok', d: 130 },
  { t: '[  OK  ] Qdrant collections attached (3)', cls: 'ok', d: 130 },
  { t: '[  OK  ] Indexed 8,412,556 products', cls: 'ok', d: 190 },
  { t: '', d: 80 },
  { t: 'user       swarnabha (sd2001)', cls: 'dim', d: 90 },
  { t: 'role       Software Engineer 2 @ Parspec', cls: 'dim', d: 90 },
  { t: 'club       Arsenal, champions', cls: 'accent', d: 160 },
  { t: '', d: 90 },
  { t: 'starting desktop…', cls: 'dim', d: 420 },
];

const LOGO = `   ▄▄▄▄▄   ▄▄▄▄▄
  █     █ █     █    S W A R N A B H A
  █▄▄▄▄▄  █     █    ─────────────────
        █ █     █    b a c k e n d  ·  a i   i n f r a
  █▄▄▄▄▄█ █▄▄▄▄▄█`;

function Boot({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (n >= BOOT_LINES.length) {
      if (done.current) return;
      done.current = true;
      const t = setTimeout(onDone, 260);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN((v) => v + 1), BOOT_LINES[n].d);
    return () => clearTimeout(t);
  }, [n, onDone]);

  return (
    <div className="os-boot">
      <div className="os-boot-logo">{LOGO}</div>
      {BOOT_LINES.slice(0, n).map((l, i) => (
        <div key={i} className={l.cls}>{l.t || ' '}</div>
      ))}
      <span className="os-boot-cursor" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Wallpaper
 * ------------------------------------------------------------------ */

function Wallpaper() {
  return (
    <div className="os-wall">
      <div className="os-wall-photo" />
      {/* Scrim: the photo is busy and bright in places, and window text has to stay
          readable over it. Kept light so the tifo still reads. */}
      <div className="os-wall-scrim" />
      <div className="os-wall-vig" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Menu bar
 * ------------------------------------------------------------------ */

function MenuBar({ focused }: { focused?: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="os-menubar">
      <span className="brand"><span className="dot" />{profile.handle}</span>
      <span className="mi" style={{ fontWeight: 600, color: 'var(--text)' }}>{focused ?? 'Finder'}</span>
      <span className="mi">File</span>
      <span className="mi">Edit</span>
      <span className="mi">View</span>
      <span className="spacer" />
      <span className="right">
        <span className="batt">
          <span style={{ fontSize: 11 }}>96%</span>
          <span className="batt-body"><span className="batt-fill" style={{ width: '96%' }} /></span>
        </span>
        <span>{date}</span>
        <span style={{ color: 'var(--text)' }}>{time}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Desktop
 * ------------------------------------------------------------------ */

const DESKTOP_APPS = APPS.filter((a) => a.onDesktop);
const DOCK_APPS = APPS.filter((a) => a.inDock);

export default function Desktop({ theme, active }: { theme: Theme; active: boolean }) {
  const [booted, setBooted] = useState(false);
  const [wins, setWins] = useState<WinState[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const zTop = useRef(1);

  const openApp = useCallback((id: string) => {
    const def = APP_BY_ID[id];
    if (!def) return;
    setWins((prev) => {
      const existing = prev.find((w) => w.id === id);
      zTop.current += 1;
      if (existing) {
        return prev.map((w) => (w.id === id ? { ...w, minimized: false, z: zTop.current } : w));
      }
      // Cascade new windows off the top-left, wrapping so they never march off-screen.
      const n = prev.length;
      const x = 168 + (n % 5) * 34;
      const y = 62 + (n % 5) * 30;
      return [
        ...prev,
        {
          id, title: def.title, icon: def.icon,
          x, y, w: def.w, h: def.h,
          z: zTop.current, minimized: false, maximized: false,
        },
      ];
    });
  }, []);

  const focusWin = useCallback((id: string) => {
    zTop.current += 1;
    const z = zTop.current;
    setWins((prev) => prev.map((w) => (w.id === id ? { ...w, z } : w)));
  }, []);

  const closeWin = useCallback((id: string) => setWins((p) => p.filter((w) => w.id !== id)), []);
  const minWin = useCallback((id: string) => setWins((p) => p.map((w) => (w.id === id ? { ...w, minimized: true } : w))), []);
  const maxWin = useCallback((id: string) => setWins((p) => p.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))), []);
  const moveWin = useCallback(
    (id: string, x: number, y: number) => setWins((p) => p.map((w) => (w.id === id ? { ...w, x, y } : w))),
    [],
  );

  // Open the About window once the boot finishes, so the screen is never empty.
  useEffect(() => {
    if (booted) openApp('about');
  }, [booted, openApp]);

  // The page HUD can ask the OS to open a window (e.g. the Credits button).
  // Subscribing only after boot means a pre-boot request is queued, not lost.
  useEffect(() => {
    if (!booted) return;
    return osBus.subscribe(openApp);
  }, [booted, openApp]);

  const focusedTitle = useMemo(() => {
    const top = wins.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];
    return top ? APP_BY_ID[top.id]?.title : undefined;
  }, [wins]);

  const api = useMemo(() => ({ openApp }), [openApp]);

  return (
    <div className="os" data-theme={theme.name} onPointerDown={() => setSelected(null)}>
      <Wallpaper />
      <MenuBar focused={focusedTitle} />

      {/* desktop icons */}
      <div className="os-icons">
        {DESKTOP_APPS.map((a) => (
          <button
            key={a.id}
            className={`os-icon${selected === a.id ? ' sel' : ''}`}
            onPointerDown={(e) => { e.stopPropagation(); setSelected(a.id); }}
            onDoubleClick={() => openApp(a.id)}
            onClick={() => { if (selected === a.id) openApp(a.id); }}
          >
            <span className="glyph">{a.icon}</span>
            <span className="lbl">{a.title}</span>
          </button>
        ))}
      </div>

      {/* windows */}
      {wins.map((w) => (
        <Window
          key={w.id}
          win={w}
          onFocus={() => focusWin(w.id)}
          onClose={() => closeWin(w.id)}
          onMinimize={() => minWin(w.id)}
          onToggleMax={() => maxWin(w.id)}
          onMove={(x, y) => moveWin(w.id, x, y)}
        >
          {APP_BY_ID[w.id].render(api)}
        </Window>
      ))}

      {/* dock */}
      <div className="os-dock" onPointerDown={(e) => e.stopPropagation()}>
        {DOCK_APPS.map((a, i) => (
          <div key={a.id}>
            {i === DOCK_APPS.length - 1 && <span className="os-dock-sep" />}
            <div className="os-dock-item" style={{ display: 'inline-flex' }}>
              <span className="os-dock-tip">{a.title}</span>
              <button className="os-dock-btn" onClick={() => openApp(a.id)} aria-label={a.title}>{a.icon}</button>
              <span className={`os-dock-run${wins.some((w) => w.id === a.id) ? '' : ' hidden'}`} />
            </div>
          </div>
        ))}
      </div>

      {!booted && <Boot onDone={() => setBooted(true)} />}

      {/* Before the camera arrives, the screen is a picture, not an app. */}
      {!active && <div style={{ position: 'absolute', inset: 0, zIndex: 950 }} />}
    </div>
  );
}
