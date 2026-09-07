# sd2001.github.io — Portfolio v2

A portfolio you walk into. The site opens on a small 3D gym; a laptop sits open on a desk
between the squat rack and the dumbbells; you fly to the screen and the screen is a real,
working desktop.

The room is a fixed set, not a space to navigate — one camera pose, one move (sitting down
at the laptop), and back. On phones the room becomes a hero image and the portfolio becomes
a normal scrolling page.

**Live:** https://sd2001.github.io

---

## Credit where it's due

The concept — a 3D room approached on a fixed camera path, with a computer in it whose
screen is genuinely interactive rather than a texture — is **[Henry Heffernan's][hh]**
(source: [henryjeff/portfolio-website][hhsrc], MIT). His version renders the screen with
`CSS3DRenderer`; this one reaches the same effect through react-three-fiber. The office
became a gym and the content is mine, but the idea is his.

Full attribution lives in the **Credits** app inside the site (desktop icon, dock, or
`open credits` in the terminal) and in the bottom-right of the page.

[hh]: https://henryheffernan.com
[hhsrc]: https://github.com/henryjeff/portfolio-website

---

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Script | Does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck, then production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript only, no emit |

---

## Deployment

GitHub Pages, via `.github/workflows/deploy.yml`. Every push to `main` typechecks,
builds, and publishes `dist/`.

**One-time setup:** repo → *Settings* → *Pages* → *Build and deployment* → *Source*:
**GitHub Actions**. No `gh-pages` branch needed.

Because this is a *user site* served from the domain root, `vite.config.ts` sets
`base: '/'`. If this were ever moved to a project repo, that has to become
`base: '/<repo-name>/'`.

The workflow also copies the archived v1 site into `dist/V1/`, so the old portfolio stays
reachable at https://sd2001.github.io/V1/.

---

## How it's put together

```
src/
├── data/content.ts        Every word of portfolio content — the single source of truth
├── three/
│   ├── theme.ts           Two complete looks: 'warehouse' and 'arsenal'
│   ├── textures.ts        Canvas-drawn textures (rubber tiles, concrete, knurling, banner)
│   ├── laptopConfig.ts    Desk and laptop dimensions; the camera keyframe DERIVES from these
│   ├── cameraPoses.ts     The two camera poses
│   ├── CameraRig.tsx      Transition between them, driven from useFrame
│   ├── Experience.tsx     Canvas, per-device quality budget, post-processing
│   └── scene/
│       ├── Room.tsx       Floor, walls, lamps, banner, lighting rig
│       ├── Desk.tsx       The desk the laptop sits on
│       ├── Equipment.tsx  Squat rack, dumbbells, bench, plates
│       ├── Props.tsx      Guitar, dog, neon
│       ├── Laptop.tsx     The laptop, and the live DOM screen
│       └── Gym.tsx        Layout — where everything stands
├── os/                    The desktop that runs on the laptop screen
│   ├── Desktop.tsx        Boot sequence, wallpaper, menu bar, icons, dock
│   ├── Window.tsx         Window chrome and dragging
│   ├── bus.ts             Lets the page HUD open a window on the laptop
│   └── apps/              About, Experience, Projects, Skills, Gym, Guitar,
│                          Arsenal, Resume, Contact, Terminal, Credits
└── ui/
    ├── useDevice.ts       phone / tablet / desktop tiering
    ├── MobileShell.tsx    The phone layout (shares the app components)
    ├── SceneBoundary.tsx  Keeps a WebGL failure from blanking the page
    ├── StartScreen.tsx
    └── Hud.tsx
```

### Performance budget

The scene is deliberately small: **~40 draw calls, 177 objects, 10 lights, 2,660 triangles.**
An earlier, larger version ran roughly 3,000 draw calls a frame — 21 lights, 204 shadow
casters and two `MeshReflectorMaterial` surfaces that each cost a full extra scene render.

What keeps it cheap:

- **One shadow-casting light.** Everything else is unshadowed.
- **No live reflectors.** The floor is glossy, not mirrored.
- **No `rectAreaLight`.** They need `RectAreaLightUniformsLib` initialising and cost several
  times a point light.
- **Textures instead of geometry** where the mesh would be a few pixels tall — the laptop
  keyboard was 70 boxes and is now one plane.
- **Per-device tiers** (`Experience.tsx`): phones drop shadows and post-processing entirely,
  and paint the laptop screen rather than mounting a 1280x800 desktop into CSS3D.

If you add to the scene, check the budget in the browser console: `__perf()` (dev builds only).

### Three details worth knowing

**No 3D assets.** Every bench, plate, dumbbell, the guitar, the dog and the neon are
three.js primitives assembled in code, and the textures are drawn to `<canvas>` at
runtime. Nothing is downloaded or purchased, so there is no asset pipeline and no
licensing to track.

**The Canvas is mounted once, and only once it has a size.** Moving it between a phone and
desktop subtree remounts the whole WebGL root, and react-three-fiber's `Provider` then calls
`events.connect()` on a detached element and throws — taking the React root with it, leaving
a page that renders but does not respond. So the canvas lives in one `.stage` wrapper whose
*CSS* changes across the breakpoint, never its position in the tree, and it does not mount
until a `ResizeObserver` reports non-zero dimensions. For the same family of reasons the app
is not wrapped in `<React.StrictMode>` — r3f v8 is not StrictMode-safe.

**The screen is real DOM.** `@react-three/drei`'s `<Html transform>` places the desktop
in 3D space via CSS3D, so text stays vector-crisp and everything is genuinely clickable.
The pixel-to-world mapping is not eyeballed — drei builds its CSS matrix with a factor of
`400 / distanceFactor` (default `40`), so `HTML_SCALE` in `laptopConfig.ts` solves for the
scale that lands 1280 CSS pixels exactly on the physical screen width. The camera keyframe
is derived from the same constants, so moving the laptop moves the camera with it.

---

## Editing content

Almost everything is in **`src/data/content.ts`** — experience, projects, skills, links,
the training split. Change it there and it updates everywhere, including the terminal's
`cat` output.

Photos live in `public/img/` (see the README there). `public/resume.pdf` is a
phone-number-redacted copy of the source resume.

---

## Notes

- Arsenal FC is referenced as a supporter, without affiliation. No club crest, cannon or
  other registered mark appears anywhere — the banner and wallpaper use colour and type only.
- Phones and portrait tablets get a dedicated layout: the 3D room as a hero band, then the
  same content as a normal scrolling page. The breakpoint is ~820px, chosen because below it
  a 1280x800 screen rendered inside the scene cannot be legible at any camera distance.
- `V1/` is the previous Django-era portfolio, kept intact.
