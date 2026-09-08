import { useEffect, useState } from 'react';
import { profile, socials } from '../data/content';
import type { CamMode } from '../three/cameraPoses';

const ICON: Record<string, string> = {
  github: '⌨', linkedin: 'in', mail: '✉', medium: 'M', x: '𝕏', instagram: '◎',
};

type Props = {
  mode: CamMode;
  arrived: boolean;
  onEnter: () => void;
  onBack: () => void;
  onCredits: () => void;
  sound: boolean;
  onToggleSound: () => void;
};

export default function Hud({ mode, arrived, onEnter, onBack, onCredits, sound, onToggleSound }: Props) {
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
      <div className="hud-tl">
        <div className="hud-box">{profile.name}</div>
        <div className="hud-box dim">{profile.role} · {profile.company}</div>
        <div className="hud-box time"><span className="sq" />{clock}</div>
      </div>

      <div className="hud-tr">
        <button
          className={`hud-btn${sound ? ' on' : ''}`}
          onClick={onToggleSound}
          title={sound ? 'Sound on — click the guitar to strum it' : 'Sound off'}
        >
          {sound ? '🔊 Sound on' : '🔇 Sound off'}
        </button>
      </div>

      <div className="hud-bottom">
        {!inMonitor && arrived && (
          <div className="hud-prompt">
            Click the laptop to sit down &nbsp;·&nbsp; click the guitar to play it
          </div>
        )}
        {inMonitor && arrived && (
          <div className="hud-prompt" style={{ animation: 'none', opacity: 0.75 }}>
            The screen is live — click around it. Press <b>Esc</b> to step back.
          </div>
        )}
        <div className="hud-actions">
          {!inMonitor
            ? <button className="hud-btn on" onClick={onEnter}>▶ Sit down at the laptop</button>
            : <button className="hud-btn" onClick={onBack}>⤺ Stand up</button>}
        </div>
      </div>

      <div className="hud-bl">
        <div className="hud-social">
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" title={`${s.label} — ${s.handle}`}>
              {ICON[s.icon] ?? '•'}
            </a>
          ))}
        </div>
      </div>

      {/* attribution — the concept is Henry Heffernan's */}
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
