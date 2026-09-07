/**
 * Credits. This site's whole concept — a 3D room you fly into, with a working
 * computer screen rendered as real DOM in 3D space — is Henry Heffernan's.
 * That belongs at the front, not in a footer.
 */

const CREDITS = [
  {
    heading: 'The idea',
    items: [
      {
        name: 'Henry Heffernan',
        role: 'Original concept, design and interaction model',
        url: 'https://henryheffernan.com',
        repo: 'https://github.com/henryjeff/portfolio-website',
        license: 'MIT',
        body:
          'This portfolio is a reinterpretation of Henry Heffernan’s 2022 portfolio. The core ideas are all his: ' +
          'a 3D room you approach on a fixed camera path, a computer in that room whose screen is genuinely interactive ' +
          'rather than a texture, a monospace HUD framing the scene, and the "click to begin → sit down at the machine" ' +
          'flow. His implementation renders the screen with CSS3DRenderer; this one reaches the same effect through ' +
          'react-three-fiber. The office became a gym and the content is mine, but the concept is his and it is a very good one.',
        emphasis: true,
      },
    ],
  },
  {
    heading: 'Built with',
    items: [
      { name: 'three.js', role: 'WebGL renderer', url: 'https://threejs.org', license: 'MIT' },
      { name: 'React Three Fiber', role: 'React renderer for three.js', url: 'https://docs.pmnd.rs/react-three-fiber', license: 'MIT' },
      { name: 'drei', role: 'R3F helpers — Html, MeshReflectorMaterial, OrbitControls', url: 'https://github.com/pmndrs/drei', license: 'MIT' },
      { name: 'postprocessing', role: 'Bloom, vignette, film grain, SMAA', url: 'https://github.com/pmndrs/postprocessing', license: 'Zlib' },
      { name: 'React', role: 'UI', url: 'https://react.dev', license: 'MIT' },
      { name: 'Vite', role: 'Build tooling', url: 'https://vite.dev', license: 'MIT' },
    ],
  },
  {
    heading: 'Type',
    items: [
      { name: 'Inter', role: 'Interface type — Rasmus Andersson', url: 'https://rsms.me/inter/', license: 'SIL Open Font License 1.1' },
      { name: 'JetBrains Mono', role: 'Monospace — JetBrains', url: 'https://www.jetbrains.com/lp/mono/', license: 'SIL Open Font License 1.1' },
    ],
  },
];

export default function Credits() {
  return (
    <div className="app">
      <div className="kicker">~/credits</div>
      <h1>Credit where it&rsquo;s due</h1>
      <p className="lead">
        Almost nothing here is invented from nothing. The parts that came from other people are listed below,
        starting with the one this whole site is built on top of.
      </p>

      {CREDITS.map((section) => (
        <div key={section.heading}>
          <h2>{section.heading}</h2>
          {section.items.map((it) => (
            <div
              className="card"
              key={it.name}
              style={
                'emphasis' in it && it.emphasis
                  ? { borderColor: 'rgba(239,1,7,0.42)', background: 'linear-gradient(130deg, rgba(239,1,7,0.13), rgba(255,255,255,0.03))' }
                  : undefined
              }
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                <h3 style={{ fontSize: 'emphasis' in it && it.emphasis ? 17 : 13 }}>{it.name}</h3>
                <span className="tag" style={{ margin: 0 }}>{it.license}</span>
              </div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{it.role}</div>

              {'body' in it && it.body && (
                <p style={{ fontSize: 12.8, marginTop: 10, marginBottom: 10 }}>{it.body}</p>
              )}

              <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
                <a href={it.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontFamily: 'var(--mono)' }}>
                  ↗ {it.url.replace(/^https?:\/\//, '')}
                </a>
                {'repo' in it && it.repo && (
                  <a href={it.repo} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontFamily: 'var(--mono)' }}>
                    ↗ source ({it.license})
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      <hr />
      <h2>What is mine</h2>
      <p style={{ fontSize: 12.8 }}>
        The gym itself is modelled procedurally in code — every bench, plate, dumbbell, the guitar, the dog and
        the neon are three.js primitives assembled by hand, with no purchased or downloaded 3D assets. The textures
        are drawn to canvas at runtime. The desktop OS, its window manager, the terminal and all written content
        are mine.
      </p>
      <p className="faint" style={{ fontSize: 11.5 }}>
        Arsenal FC is referenced as a supporter, without affiliation. No club crest, cannon or other registered
        mark is reproduced anywhere on this site — the banner and wallpaper use colour and type only.
      </p>
    </div>
  );
}
