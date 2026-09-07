import { useEffect, useState } from 'react';
import { profile, socials } from '../data/content';
import type { ThemeName } from '../three/theme';
import { THEMES } from '../three/theme';
import type { CamMode } from '../three/cameraPoses';

const ICON: Record<string, string> = {
  github: '⌨', linkedin: 'in', mail: '✉', medium: 'M', x: '𝕏', instagram: '◎',
};

type Props = {
  mode: CamMode;
  arrived: boolean;
  themeName: ThemeName;
  onTheme: (t: ThemeName) => void;
  onEnter: () => void;
  onBack: () => void;
  onFree: () => void;
  /** Opens the Credits window on the laptop, flying the camera in if needed. */
  onCredits: () => void;
};

export default function Hud({ mode, arrived, themeName, onTheme, onEnter, onBack, onFree, onCredits }: Props) {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const inMonitor = mode === 'monitor';

  return (
    <div className="hud">
      {/* ---- identity, top-left ---- */}
      <div className="hud-tl">
        <div className="hud-box">{profile.name}</div>
        <div className="hud-box dim">{profile.role} · {profile.company}</div>
        <div className="hud-box time"><span className="sq" />{clock}</div>
      </div>

      {/* ---- controls, top-right ---- */}
      <div className="hud-tr">
        <div className="hud-switch" title="Gym look">
          {(Object.keys(THEMES) as ThemeName[]).map((t) => (
            <button key={t} className={themeName === t ? 'on' : ''} onClick={() => onTheme(t)}>
              {THEMES[t].label}
            </button>
          ))}
        </div>
        {mode !== 'free' && (
          <button className="hud-btn" onClick={onFree}>◎ Look around</button>
        )}
        {mode !== 'intro' && (
          <button className="hud-btn" onClick={onBack}>⤺ Wide shot</button>
        )}
      </div>

      {/* ---- prompt / actions, bottom-centre ---- */}
      <div className="hud-bottom">
        {!inMonitor && arrived && (
          <div className="hud-prompt">Click the laptop on the chest press to sit down</div>
        )}
        {inMonitor && arrived && (
          <div className="hud-prompt" style={{ animation: 'none', opacity: 0.75 }}>
            You are at the machine — the screen is live. Press <b>Esc</b> to step back.
          </div>
        )}
        <div className="hud-actions">
          {!inMonitor && <button className="hud-btn on" onClick={onEnter}>▶ Sit down at the laptop</button>}
          {inMonitor && <button className="hud-btn" onClick={onBack}>⤺ Stand up</button>}
        </div>
      </div>

      {/* ---- socials, bottom-left ---- */}
      <div className="hud-bl">
        <div className="hud-social">
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" title={`${s.label} — ${s.handle}`}>
              {ICON[s.icon] ?? '•'}
            </a>
          ))}
        </div>
        <div className="hud-hint">
          {mode === 'free' ? 'drag to orbit · scroll to zoom' : 'drag your cursor to look around'}
        </div>
      </div>

      {/* ---- attribution, bottom-right — the concept is Henry Heffernan's ---- */}
      <div className="hud-credit">
        <span className="hud-credit-line">
          Concept inspired by{' '}
          <a href="https://henryheffernan.com" target="_blank" rel="noreferrer">Henry Heffernan</a>
          {' · '}
          <a href="https://github.com/henryjeff/portfolio-website" target="_blank" rel="noreferrer">MIT</a>
        </span>
        <button className="hud-btn" onClick={onCredits}>★ Full credits</button>
      </div>
    </div>
  );
}
