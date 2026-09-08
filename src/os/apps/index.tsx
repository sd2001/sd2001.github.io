import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  awards, drivePreviewUrl, driveThumbUrl, education, experience, leadership, life, lifeOrder,
  listenUrl, profile, projects, projectsNote, publication, skills, socials, songs,
} from '../../data/content';
import { player } from '../player';
import Credits from './Credits';

/* ================================================================== *
 * ABOUT
 * ================================================================== */
export function About() {
  return (
    <div className="app">
      <div className="kicker">~/about.md</div>
      <h1>{profile.name}</h1>
      <p className="lead" style={{ marginBottom: 6 }}>
        <strong>{profile.role}</strong> at {profile.company}, doing backend and AI infrastructure.
        Based in {profile.location}.
      </p>
      <p className="lead" style={{ fontSize: 14.5, marginTop: 14 }}>{life.intro}</p>
      <p className="muted" style={{ fontSize: 13 }}>{life.intro2}</p>
      <p className="muted" style={{ fontSize: 13 }}>{life.intro3}</p>

      <div className="grid2" style={{ marginTop: 18 }}>
        {lifeOrder.map((k) => {
          const item = life[k];
          return (
            <div className="card" key={k}>
              <h3 style={{ fontSize: 14 }}>
                <span style={{ marginRight: 8 }}>{item.icon}</span>{item.title}
              </h3>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#cfd6e2' }}>{item.body}</p>
            </div>
          );
        })}
      </div>

      <h2>{education.heading}</h2>
      <div className="card">
        <p className="lead" style={{ margin: 0, fontSize: 14 }}>{education.line}</p>
      </div>
    </div>
  );
}

/* ================================================================== *
 * EXPERIENCE
 * ================================================================== */
export function Experience() {
  return (
    <div className="app">
      <div className="kicker">~/experience</div>
      <h1>Where I&rsquo;ve worked</h1>
      <p className="muted" style={{ marginBottom: 22 }}>
        Five roles, one thread: backend systems that have to keep working when the data gets ugly.
      </p>

      <div className="tl">
        {experience.map((r) => (
          <div className={`tl-node${r.current ? ' now' : ''}`} key={r.id}>
            <div className="tl-head">
              <div className="tl-role">
                {r.title} <span className="muted">·</span> <span className="tl-co">{r.company}</span>
              </div>
              <div className="tl-when">{r.period}</div>
            </div>
            <div className="tl-note">
              {r.companyNote} · {r.location}
            </div>
            <p style={{ fontSize: 13 }}>{r.summary}</p>

            {r.groups.map((g) => (
              <div className="tl-group" key={g.heading}>
                <div className="gh">{g.heading}</div>
                {g.bullets.map((b, i) => (
                  <div className="bul" key={i}>
                    <span className="m">▸</span>
                    <span>
                      {b.text}
                      {b.tags && (
                        <div style={{ marginTop: 6 }}>
                          {b.tags.map((t) => (
                            <span className="tag hot" key={t}>{t}</span>
                          ))}
                        </div>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ marginTop: 12 }}>
              {r.stack.map((s) => (
                <span className="tag" key={s}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <hr />
      <h2>Publication</h2>
      <div className="card">
        <h3>{publication.title}</h3>
        <div className="tl-when" style={{ margin: '4px 0 8px' }}>{publication.venue} · {publication.period}</div>
        <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>{publication.blurb}</p>
      </div>

      <h2>Awards</h2>
      {awards.map((a) => (
        <div className="bul" key={a.year}>
          <span className="m">★</span>
          <span><span className="tl-when">{a.year}</span> &nbsp; {a.text}</span>
        </div>
      ))}

      <h2>Leadership</h2>
      {leadership.map((l) => (
        <div className="card" key={l.org}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <h3>{l.org}</h3>
            <div className="tl-when">{l.period}</div>
          </div>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 12.5 }}>{l.text}</p>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== *
 * PROJECTS
 * ================================================================== */
export function Projects() {
  const [open, setOpen] = useState<string | null>(projects[0].id);
  return (
    <div className="app">
      <div className="kicker">~/projects</div>
      <h1>Things I built for the fun of it</h1>

      <div
        className="card"
        style={{ background: 'rgba(255,176,32,0.07)', borderColor: 'rgba(255,176,32,0.28)', marginBottom: 16 }}
      >
        <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>{projectsNote}</p>
      </div>

      {projects.map((p) => {
        const isOpen = open === p.id;
        return (
          <div className="card" key={p.id}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, cursor: 'pointer' }}
              onClick={() => setOpen(isOpen ? null : p.id)}
            >
              <div>
                <h3>
                  <span style={{ color: 'var(--accent)', marginRight: 8, fontSize: 11 }}>{isOpen ? '▼' : '▶'}</span>
                  {p.title}
                </h3>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{p.subtitle}</div>
              </div>
              <div className="tl-when">{p.period}</div>
            </div>

            {isOpen && (
              <div style={{ marginTop: 12 }}>
                {p.bullets.map((b, i) => (
                  <div className="bul" key={i}><span className="m">▸</span><span>{b.text}</span></div>
                ))}
                <div style={{ marginTop: 10 }}>
                  {p.stack.map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
                <div style={{ marginTop: 11 }}>
                  {p.repo ? (
                    <a
                      className="btn ghost"
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ⌨ View on GitHub
                    </a>
                  ) : (
                    <span className="faint" style={{ fontSize: 11.5, fontFamily: 'var(--mono)' }}>
                      {p.repoNote}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <hr />
      <p className="faint" style={{ fontSize: 12 }}>
        Around 50 public repos in total, most of them from university.{' '}
        <a href="https://github.com/sd2001" target="_blank" rel="noreferrer">github.com/sd2001</a>
      </p>
    </div>
  );
}

/* ================================================================== *
 * GUITAR — the video player
 * ================================================================== */
export function Music() {
  // Starts on whatever the guitar in the room last selected.
  const [pick, setPick] = useState<number | null>(null);
  /**
   * Google throttles a burst of thumbnail requests, so a cold load can fail a few tiles
   * for no lasting reason. Count attempts and give each one a second go before falling
   * back to the typographic tile.
   */
  const [tries, setTries] = useState<Record<number, number>>({});

  useEffect(() => {
    setPick(player.index);
    return player.subscribe((i) => setPick(i));
  }, []);

  const song = pick !== null ? songs[pick] : null;
  const video = drivePreviewUrl(song?.drive);

  return (
    <div className="app gp">
      <div className="kicker">~/guitar</div>
      <h1>Me, a guitar, and questionable timing</h1>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
        {songs.length} covers, all filmed badly on a phone. Pick any of them and it plays right here.
      </p>

      {song && video && (
        <div className="gp-now">
          <div className="gp-frame">
            <iframe
              src={video}
              title={`${song.title} by ${song.artist}`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          </div>
          <div className="gp-now-meta">
            <div>
              <div className="gp-now-title">{song.title}</div>
              <div className="gp-now-sub">
                {song.artist}{song.year ? ` · ${song.year}` : ''}
              </div>
            </div>
            <a className="btn ghost" href={listenUrl(song)} target="_blank" rel="noreferrer">
              Hear the original ↗
            </a>
          </div>
        </div>
      )}

      {/* Without this the player fills the window and the grid below is invisible, so
          nobody realises there are nine more videos down there. */}
      <div className="gp-more">
        <span className="gp-more-rule" />
        <span className="gp-more-text">
          Scroll down for more videos
          <span className="gp-more-arrow" aria-hidden>↓</span>
        </span>
        <span className="gp-more-rule" />
      </div>

      <div className="gp-grid">
        {songs.map((sg, i) => {
          const thumb = driveThumbUrl(sg.drive, 400);
          const active = i === pick;
          return (
            <button
              key={sg.drive ?? sg.title}
              className={`gp-tile${active ? ' on' : ''}`}
              onClick={() => { player.select(i); setPick(i); }}
              title={`${sg.title} by ${sg.artist}`}
            >
              <span className="gp-art">
                {thumb && (tries[i] ?? 0) < 2 ? (
                  /* No loading="lazy": the screen is a CSS3D-transformed element, which
                     makes the intersection observer treat every tile as off-screen, so
                     lazy images never load at all. Ten small JPEGs, so eager is fine.
                     no-referrer keeps Google's hotlink protection out of the picture. */
                  <img
                    key={`${i}-${tries[i] ?? 0}`}
                    src={(tries[i] ?? 0) === 0 ? thumb : `${thumb}&retry=1`}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={() => setTries((t) => ({ ...t, [i]: (t[i] ?? 0) + 1 }))}
                  />
                ) : (
                  // Drive thumbnails can be slow or rate-limited; fall back to type.
                  <span className="gp-art-fallback">{sg.title.slice(0, 1)}</span>
                )}
                <span className="gp-play">▶</span>
              </span>
              <span className="gp-label">
                <span className="gp-title">{sg.title}</span>
                <span className="gp-artist">{sg.artist}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="faint" style={{ fontSize: 11.5, marginTop: 14 }}>
        Videos stream from my Google Drive, so the player is Drive&rsquo;s own. Press play inside the
        frame: browsers will not let a page start a video with sound on its own, which is probably
        for the best.
      </p>
    </div>
  );
}

/* ================================================================== *
 * ARSENAL
 * ================================================================== */
export function Arsenal() {
  return (
    <div className="app">
      <div className="kicker">~/arsenal</div>
      <h1>{life.arsenal.title}</h1>
      <p className="lead">{life.arsenal.body}</p>
      <div className="card" style={{
        background: 'linear-gradient(130deg, rgba(239,1,7,0.28), rgba(239,1,7,0.05))',
        borderColor: 'rgba(239,1,7,0.4)', textAlign: 'center', padding: '30px 20px',
      }}>
        <div className="faint" style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.3em' }}>
          NORTH LONDON
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', margin: '8px 0 2px' }}>CHAMPIONS</div>
        <div style={{ fontSize: 22, fontWeight: 700, opacity: 0.85 }}>2025 / 26</div>
      </div>
      <p className="muted" style={{ fontSize: 12.5 }}>
        The wallpaper behind this window is the Emirates tifo, <em>the streets are our own</em>, and
        the photo framed on the gym wall is the title being lifted. Both are doing a small victory
        lap. They have earned it.
      </p>
      <p className="faint" style={{ fontSize: 11.5 }}>
        Unofficial and unaffiliated, just a supporter&rsquo;s page. The club photography here belongs to
        Arsenal FC and its photographers.
      </p>
    </div>
  );
}

/* ================================================================== *
 * CONTACT
 * ================================================================== */
const ICONS: Record<string, string> = {
  github: '⌨', linkedin: 'in', mail: '✉', medium: 'M', x: '𝕏', instagram: '◎',
};

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="app">
      <div className="kicker">~/contact</div>
      <h1>Say hello</h1>
      <p className="lead">
        Open to interesting backend and AI-infrastructure problems. Fastest way to reach me is email.
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 9,
        background: 'rgba(239,1,7,0.1)', border: '1px solid rgba(239,1,7,0.32)', marginBottom: 20,
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 14, flex: 1 }}>{profile.email}</span>
        <button className="btn ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
        <a className="btn" href={`mailto:${profile.email}`}>Compose</a>
      </div>

      <h2>Elsewhere</h2>
      {socials.map((s) => (
        <a className="link-row" key={s.label} href={s.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
          <span className="ic">{ICONS[s.icon] ?? '•'}</span>
          <span style={{ flex: 1 }}>
            <div className="t">{s.label}</div>
            <div className="h">{s.handle}</div>
          </span>
          <span className="faint">↗</span>
        </a>
      ))}
    </div>
  );
}

/* ================================================================== *
 * TERMINAL
 * ================================================================== */
type Line = { kind: 'in' | 'out' | 'err'; text: string };

const FILES: Record<string, string> = {
  'about.md': `${profile.name}, ${profile.role} at ${profile.company}.\n${profile.blurb}`,
  'stack.txt': skills.map((g) => `${g.group.padEnd(16)} ${g.items.join(', ')}`).join('\n'),
  'contact.txt': socials.map((s) => `${s.label.padEnd(10)} ${s.url}`).join('\n'),
};

const NEOFETCH = `        ▄▄▄▄▄▄▄        swarnabha@gym
      ▄█████████▄      ─────────────────────────────
     ███████████▀      OS        SwarnabhaOS 2.0
     ███████████       Host      Desk, gym floor
     ▀█████████▀       Uptime    ${new Date().getFullYear() - 2021} yrs in backend
       ▀▀███▀▀         Shell     zsh
                       Role      ${profile.role} @ ${profile.company}
                       Lang      Python, Go, C++, SQL
                       Search    Qdrant · HNSW · BM25+RRF
                       Split     PPL x2, 6 days/week
                       Club      Arsenal`;

export function Terminal({ onOpen }: { onOpen?: (id: string) => void }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', text: "SwarnabhaOS shell. Type 'help' for commands." },
  ]);
  const [value, setValue] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useRef<string[]>([]);
  const hIdx = useRef(-1);

  useEffect(() => {
    boxRef.current?.scrollTo(0, boxRef.current.scrollHeight);
  }, [lines]);

  const push = (...l: Line[]) => setLines((p) => [...p, ...l]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    push({ kind: 'in', text: cmd });
    if (!cmd) return;
    history.current.unshift(cmd);
    hIdx.current = -1;

    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ');

    switch (head.toLowerCase()) {
      case 'help':
        push({ kind: 'out', text:
`help              this
whoami            short bio
ls                list files
cat <file>        print a file
open <app>        open an app window  (about, experience, projects, guitar, arsenal, contact, credits)
skills            technical skills
exp               work history, short form
projects          project list
neofetch          system info
arsenal           come on you gunners
clear             clear the screen` });
        break;
      case 'whoami':
        push({ kind: 'out', text: `${profile.name}\n${profile.role} @ ${profile.company}, ${profile.location}\n${profile.blurb}` });
        break;
      case 'ls':
        push({ kind: 'out', text: Object.keys(FILES).join('   ') });
        break;
      case 'cat':
        if (!arg) push({ kind: 'err', text: 'cat: missing operand' });
        else if (FILES[arg]) push({ kind: 'out', text: FILES[arg] });
        else push({ kind: 'err', text: `cat: ${arg}: No such file or directory` });
        break;
      case 'open':
        if (onOpen && arg) { onOpen(arg.toLowerCase()); push({ kind: 'out', text: `opening ${arg}…` }); }
        else push({ kind: 'err', text: 'open: which app? try `open projects`' });
        break;
      case 'skills':
        push({ kind: 'out', text: FILES['stack.txt'] });
        break;
      case 'exp':
        push({ kind: 'out', text: experience.map((r) => `${r.period.padEnd(24)} ${r.title} @ ${r.company}`).join('\n') });
        break;
      case 'projects':
        push({ kind: 'out', text: projects.map((p) => `${p.title.padEnd(22)} ${p.subtitle}`).join('\n') });
        break;
      case 'neofetch':
        push({ kind: 'out', text: NEOFETCH });
        break;
      case 'credits':
        push({ kind: 'out', text:
`This site's concept is Henry Heffernan's. See henryheffernan.com (MIT).
A 3D room, a fixed camera path, and a computer screen that is real
interactive DOM rather than a texture. The office became a gym.

Run \`open credits\` for the full list.` });
        break;
      case 'arsenal':
      case 'coyg':
        push({ kind: 'out', text: 'Up the Arsenal. 🔴⚪' });
        break;
      case 'sudo':
        push({ kind: 'err', text: `${profile.handle} is not in the sudoers file. This incident will be reported.` });
        break;
      case 'clear':
        setLines([]);
        return;
      default:
        push({ kind: 'err', text: `zsh: command not found: ${head}` });
    }
  };

  return (
    <div className="term" ref={boxRef} onClick={() => inputRef.current?.focus()} style={{ height: '100%', overflowY: 'auto' }}>
      {lines.map((l, i) =>
        l.kind === 'in' ? (
          <div className="in" key={i}><span className="ps">➜  ~</span><span>{l.text}</span></div>
        ) : (
          <div className={`out${l.kind === 'err' ? ' err' : ''}`} key={i}>{l.text}</div>
        ),
      )}
      <div className="in">
        <span className="ps">➜  ~</span>
        <input
          ref={inputRef}
          value={value}
          autoFocus
          spellCheck={false}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { run(value); setValue(''); }
            else if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (hIdx.current < history.current.length - 1) {
                hIdx.current += 1;
                setValue(history.current[hIdx.current]);
              }
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              hIdx.current = Math.max(-1, hIdx.current - 1);
              setValue(hIdx.current === -1 ? '' : history.current[hIdx.current]);
            }
          }}
        />
      </div>
    </div>
  );
}

/* ================================================================== *
 * REGISTRY
 * ================================================================== */
export type AppDef = {
  id: string;
  title: string;
  icon: string;
  w: number;
  h: number;
  render: (api: { openApp: (id: string) => void }) => ReactNode;
  /** Shown on the desktop as an icon. */
  onDesktop?: boolean;
  /** Shown in the dock. */
  inDock?: boolean;
};

export const APPS: AppDef[] = [
  { id: 'about', title: 'about.md', icon: '📄', w: 720, h: 560, onDesktop: true, inDock: true, render: () => <About /> },
  { id: 'experience', title: 'experience', icon: '💼', w: 760, h: 590, onDesktop: true, inDock: true, render: () => <Experience /> },
  { id: 'projects', title: 'projects', icon: '🗂', w: 700, h: 540, onDesktop: true, inDock: true, render: () => <Projects /> },
  { id: 'guitar', title: 'guitar.mp4', icon: '🎸', w: 720, h: 640, onDesktop: true, inDock: true, render: () => <Music /> },
  { id: 'arsenal', title: 'arsenal', icon: '🔴', w: 560, h: 470, inDock: true, render: () => <Arsenal /> },
  { id: 'contact', title: 'contact', icon: '✉️', w: 560, h: 520, onDesktop: true, inDock: true, render: () => <Contact /> },
  { id: 'terminal', title: 'zsh', icon: '⌘', w: 660, h: 440, inDock: true, render: ({ openApp }) => <Terminal onOpen={openApp} /> },
  { id: 'credits', title: 'credits', icon: '★', w: 680, h: 580, onDesktop: true, inDock: true, render: () => <Credits /> },
];

export const APP_BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a]));
