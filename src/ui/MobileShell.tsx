import { useState } from 'react';
import { APPS, APP_BY_ID } from '../os/apps';
import { profile, socials } from '../data/content';
import '../os/os.css';

const ICON: Record<string, string> = {
  github: '⌨', linkedin: 'in', mail: '✉', medium: 'M', x: '𝕏', instagram: '◎',
};

/**
 * Phone and portrait-tablet layout. The 3D room stays as a hero at the top of the page
 * (rendered by the shared canvas, which sits behind this), but the portfolio itself is a
 * normal scrolling page: a 1280x800 desktop rendered inside a laptop screen is unreadable
 * at this size, and pinch-zooming a CSS3D plane is worse. The app components are shared
 * with the desktop build, so the content never diverges.
 */
export default function MobileShell() {
  const [active, setActive] = useState('about');
  const app = APP_BY_ID[active];

  return (
    <div className="m-shell">
      {/* transparent spacer letting the fixed 3D hero show through */}
      <div className="m-hero-spacer">
        <div className="m-hero-copy">
          <div className="m-hero-name">{profile.name}</div>
          <div className="m-hero-role">{profile.role} · {profile.company}</div>
        </div>
      </div>

      <nav className="m-tabs" aria-label="Sections">
        {APPS.map((a) => (
          <button
            key={a.id}
            className={`m-tab${active === a.id ? ' on' : ''}`}
            onClick={() => setActive(a.id)}
          >
            <span aria-hidden>{a.icon}</span>
            {a.title}
          </button>
        ))}
      </nav>

      <main className="m-body">
        <div className="os os-flow">{app.render({ openApp: setActive })}</div>
      </main>

      <footer className="m-foot">
        <div className="m-socials">
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}>
              {ICON[s.icon] ?? '•'}
            </a>
          ))}
        </div>
        <p>
          Concept inspired by{' '}
          <a href="https://henryheffernan.com" target="_blank" rel="noreferrer">Henry Heffernan</a>
          {' · '}
          <a href="https://github.com/henryjeff/portfolio-website" target="_blank" rel="noreferrer">MIT</a>
        </p>
        <p className="m-foot-note">
          The full 3D version — a gym with a laptop you sit down at — is on desktop.
        </p>
      </footer>
    </div>
  );
}
