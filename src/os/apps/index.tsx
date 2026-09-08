import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  awards, education, experience, leadership, life, nowPlaying, profile, projects, publication, skills, socials, stats,
} from '../../data/content';
import Credits from './Credits';

/* ================================================================== *
 * ABOUT
 * ================================================================== */
export function About() {
  return (
    <div className="app">
      <div className="kicker">~/about.md</div>
      <h1>{profile.name}</h1>
      <p className="lead" style={{ marginBottom: 18 }}>
        <strong>{profile.role}</strong> at {profile.company} — {profile.tagline}. Based in {profile.location}.
      </p>

      <p className="lead">{profile.blurb}</p>
      <p>
        Most of what I do sits one layer below the thing a user actually sees. Right now that means search:
        making 8.4&nbsp;million products findable by people who type <span className="tag">16A 1 pole</span> and
        expect the right breaker back, and keeping the pipelines that feed it — 3&nbsp;million manufacturer
        datasheets every couple of weeks — running inside a window that does not forgive a slow week.
      </p>
      <p>
        The through-line in my work is cost per correct answer. It is easy to make retrieval better by throwing
        a bigger model at every request; the interesting problem is routing the easy 90% to something cheap and
        spending real money only where the hard cases are. That principle shows up in the page router in our
        extraction pipeline, in the hybrid search that avoids a rerank when lexical match is already decisive,
        and in the month I spent reading VPC flow logs until every dollar of a $5,000 NAT bill had an owner.
      </p>

      <h2>By the numbers</h2>
      <div className="grid4">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="v">{s.value}</div>
            <div className="l">{s.label}</div>
            <div className="s">{s.sub}</div>
          </div>
        ))}
      </div>

      <h2>Away from the keyboard</h2>
      <div className="grid2">
        <div className="card">
          <h3>🏋️ {life.gym.title}</h3>
          <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>{life.gym.body}</p>
        </div>
        <div className="card">
          <h3>🎸 {life.guitar.title}</h3>
          <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>{life.guitar.body}</p>
        </div>
        <div className="card">
          <h3>🐕 {life.dogs.title}</h3>
          <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>{life.dogs.body}</p>
        </div>
        <div className="card">
          <h3>🔴 {life.arsenal.title}</h3>
          <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>{life.arsenal.body}</p>
        </div>
      </div>

      <h2>Education</h2>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <div>
            <h3>{education.degree}</h3>
            <div className="muted" style={{ fontSize: 12.5 }}>{education.school}</div>
          </div>
          <div className="tl-when">{education.period} · GPA {education.gpa}</div>
        </div>
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
              {r.companyNote} — {r.location}
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
      <p className="muted" style={{ marginBottom: 20 }}>
        Hackathon wins, papers reimplemented, and a drum kit made of thin air. Click any of them to open it up.
      </p>

      {projects.map((p) => {
        const isOpen = open === p.id;
        return (
          <div className="card" key={p.id} style={{ cursor: 'pointer' }} onClick={() => setOpen(isOpen ? null : p.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
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
                  {p.stack.map((s) => <span className="tag" key={s}>{s}</span>)}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <hr />
      <p className="faint" style={{ fontSize: 12 }}>
        There is a lot more on GitHub — around 50 public repos, mostly from university.{' '}
        <a href="https://github.com/sd2001" target="_blank" rel="noreferrer">github.com/sd2001</a>
      </p>
    </div>
  );
}

/* ================================================================== *
 * SKILLS
 * ================================================================== */
export function Skills() {
  return (
    <div className="app">
      <div className="kicker">~/skills</div>
      <h1>The toolbox</h1>
      <p className="muted" style={{ marginBottom: 20 }}>
        Ordered roughly by how much of my week each one actually occupies.
      </p>
      {skills.map((g) => (
        <div key={g.group} style={{ marginBottom: 20 }}>
          <div className="gh" style={{
            fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--accent-2)', marginBottom: 9, paddingBottom: 6, borderBottom: '1px solid var(--line)',
          }}>{g.group}</div>
          <div>{g.items.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
        </div>
      ))}

      <hr />
      <h2>What I&rsquo;m actually good at</h2>
      <div className="card">
        <div className="bul"><span className="m">▸</span><span>
          <strong>Making retrieval behave.</strong> Hybrid dense + sparse, fusion, reranking, and knowing when
          each of those is not worth its latency.
        </span></div>
        <div className="bul"><span className="m">▸</span><span>
          <strong>Finding the real bottleneck.</strong> The 18.5s → 0.95s win was not a parsing optimisation;
          it was memory fragmentation and a segfaulting shared handle. Most performance work is diagnosis, not code.
        </span></div>
        <div className="bul"><span className="m">▸</span><span>
          <strong>Attribution before optimisation.</strong> You cannot cut a bill you cannot break down. Tag first,
          measure second, then move things.
        </span></div>
        <div className="bul"><span className="m">▸</span><span>
          <strong>Pipelines that repair themselves.</strong> Content-hash keys, idempotent reruns, and no silent
          failures — a document that fails should be loud and retryable, not absent.
        </span></div>
      </div>
    </div>
  );
}

/* ================================================================== *
 * GYM
 * ================================================================== */
export function GymLog() {
  return (
    <div className="app">
      <div className="kicker">~/gym.log</div>
      <h1>{life.gym.title}</h1>
      <p className="lead">{life.gym.body}</p>

      <h2>The split</h2>
      {life.gym.split.map((d) => (
        <div
          key={d.day}
          style={{
            display: 'grid', gridTemplateColumns: '58px 78px 1fr', gap: 12, alignItems: 'center',
            padding: '9px 12px', marginBottom: 6, borderRadius: 8,
            background: d.focus === 'REST' || d.focus === 'Rest' ? 'rgba(255,255,255,0.02)' : 'rgba(239,1,7,0.07)',
            border: '1px solid var(--line)',
          }}
        >
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent-2)', fontWeight: 700 }}>
            {d.day.toUpperCase()}
          </span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>{d.focus}</span>
          <span className="faint" style={{ fontSize: 12 }}>{d.detail}</span>
        </div>
      ))}

      <h2>Why it&rsquo;s in the portfolio</h2>
      <p>
        Because it is the reason this site is a gym and not another desk. Six days a week for years teaches you
        the thing that transfers directly into engineering: progress is boring, measurable and cumulative, and
        the temptation to skip the unglamorous part is exactly where people fall off.
      </p>
      <p className="muted" style={{ fontSize: 12.5 }}>
        Also, this laptop is on a desk in the middle of a gym, and the chair is a bench. Press Esc and look around.
      </p>
    </div>
  );
}

/* ================================================================== *
 * MUSIC / GUITAR
 * ================================================================== */
export function Music() {
  const [idx, setIdx] = useState(0);
  return (
    <div className="app">
      <div className="kicker">~/guitar</div>
      <h1>{life.guitar.title}</h1>
      <p className="lead">{life.guitar.body}</p>

      <h2>On rotation</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '18px 20px',
          background: 'linear-gradient(120deg, rgba(239,1,7,0.22), rgba(255,107,82,0.06))',
          borderBottom: '1px solid var(--line)',
        }}>
          <div className="faint" style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.18em' }}>
            NOW PLAYING
          </div>
          <div style={{ fontSize: 21, fontWeight: 800, marginTop: 6 }}>{nowPlaying[idx]}</div>
          <div className="bar" style={{ marginTop: 12 }}>
            <i style={{ width: `${((idx + 1) / nowPlaying.length) * 100}%` }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button className="btn ghost" onClick={() => setIdx((i) => (i - 1 + nowPlaying.length) % nowPlaying.length)}>◀◀</button>
            <button className="btn" onClick={() => setIdx((i) => (i + 1) % nowPlaying.length)}>▶▶</button>
          </div>
        </div>
        <div style={{ padding: '12px 20px 16px' }}>
          {nowPlaying.map((n, i) => (
            <div
              key={n}
              onClick={() => setIdx(i)}
              style={{
                display: 'flex', justifyContent: 'space-between', padding: '7px 0', cursor: 'pointer',
                fontSize: 12.5, color: i === idx ? 'var(--accent-2)' : 'var(--text-dim)',
                fontWeight: i === idx ? 700 : 400,
              }}
            >
              <span>{String(i + 1).padStart(2, '0')}. {n}</span>
              <span className="faint" style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{i === idx ? '▶' : ''}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="faint" style={{ fontSize: 11.5 }}>
        No audio yet — this is a track list, not a player. Actual sound is on the roadmap.
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
        The wallpaper behind this window and the banner on the gym wall are both doing a small victory lap. They
        have earned it.
      </p>
      <p className="faint" style={{ fontSize: 11.5 }}>
        Unofficial and unaffiliated — a supporter&rsquo;s page, no club marks used.
      </p>
    </div>
  );
}

/* ================================================================== *
 * RESUME
 * ================================================================== */
export function Resume() {
  return (
    <div className="app">
      <div className="kicker">~/resume.pdf</div>
      <h1>Resume</h1>
      <p className="muted">
        One page, kept current. Phone number stripped for the public web — email me and you&rsquo;ll get it.
      </p>
      <div style={{ display: 'flex', gap: 10, margin: '18px 0 22px' }}>
        <a className="btn" href={profile.resumePath} download="Swarnabha-Das-Resume.pdf">⬇ Download PDF</a>
        <a className="btn ghost" href={profile.resumePath} target="_blank" rel="noreferrer">↗ Open in new tab</a>
      </div>
      <div style={{
        border: '1px solid var(--line)', borderRadius: 9, overflow: 'hidden',
        height: 430, background: '#1a1d24',
      }}>
        <object data={`${profile.resumePath}#toolbar=0&navpanes=0`} type="application/pdf" width="100%" height="100%">
          <div className="app" style={{ padding: 22 }}>
            <p className="muted">
              Your browser will not preview PDFs inline here.{' '}
              <a href={profile.resumePath} target="_blank" rel="noreferrer">Open it directly</a> instead.
            </p>
          </div>
        </object>
      </div>
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
  'about.md': `${profile.name} — ${profile.role} at ${profile.company}.\n${profile.blurb}`,
  'stack.txt': skills.map((g) => `${g.group.padEnd(16)} ${g.items.join(', ')}`).join('\n'),
  'gym.log': life.gym.split.map((d) => `${d.day.toUpperCase().padEnd(5)} ${d.focus.padEnd(6)} ${d.detail}`).join('\n'),
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
open <app>        open an app window  (about, experience, projects, skills, gym, guitar, arsenal, resume, contact, credits)
skills            technical skills
exp               work history, short form
projects          project list
neofetch          system info
arsenal           come on you gunners
clear             clear the screen` });
        break;
      case 'whoami':
        push({ kind: 'out', text: `${profile.name}\n${profile.role} @ ${profile.company} — ${profile.location}\n${profile.blurb}` });
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
`This site's concept is Henry Heffernan's — henryheffernan.com (MIT).
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
  { id: 'skills', title: 'skills', icon: '🧰', w: 620, h: 520, onDesktop: true, inDock: true, render: () => <Skills /> },
  { id: 'gym', title: 'gym.log', icon: '🏋️', w: 620, h: 520, onDesktop: true, inDock: true, render: () => <GymLog /> },
  { id: 'guitar', title: 'guitar', icon: '🎸', w: 560, h: 520, onDesktop: true, inDock: true, render: () => <Music /> },
  { id: 'arsenal', title: 'arsenal', icon: '🔴', w: 560, h: 470, inDock: true, render: () => <Arsenal /> },
  { id: 'resume', title: 'resume.pdf', icon: '📎', w: 700, h: 620, onDesktop: true, inDock: true, render: () => <Resume /> },
  { id: 'contact', title: 'contact', icon: '✉️', w: 560, h: 520, onDesktop: true, inDock: true, render: () => <Contact /> },
  { id: 'terminal', title: 'zsh', icon: '⌘', w: 660, h: 440, inDock: true, render: ({ openApp }) => <Terminal onOpen={openApp} /> },
  { id: 'credits', title: 'credits', icon: '★', w: 680, h: 580, onDesktop: true, inDock: true, render: () => <Credits /> },
];

export const APP_BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a]));
