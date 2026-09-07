# sd2001.github.io — Portfolio v2

A portfolio you walk into. The site opens on a 3D gym; a laptop sits open on the chest
press; you fly to the screen and the screen is a real, working desktop.

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
│   ├── laptopConfig.ts    Laptop dimensions; camera keyframe is DERIVED from these
│   ├── cameraPoses.ts     Named camera positions
│   ├── CameraRig.tsx      Transitions between poses, driven from useFrame
│   ├── Experience.tsx     Canvas, post-processing, orbit controls
│   └── scene/
│       ├── Room.tsx       Floor, walls, trusses, lamps, mirror, windows, banner
│       ├── Equipment.tsx  Chest press, power rack, dumbbells, plates, kettlebells
│       ├── Props.tsx      Guitar, dog, neon, wall clock, split board, fan
│       ├── Laptop.tsx     The laptop, and the live DOM screen
│       └── Gym.tsx        Layout — where everything stands
├── os/                    The desktop that runs on the laptop screen
│   ├── Desktop.tsx        Boot sequence, wallpaper, menu bar, icons, dock
│   ├── Window.tsx         Window chrome and dragging
│   ├── bus.ts             Lets the page HUD open a window on the laptop
│   └── apps/              About, Experience, Projects, Skills, Gym, Guitar,
│                          Arsenal, Resume, Contact, Terminal, Credits
└── ui/                    Start screen and the page HUD
```

### Two details worth knowing

**No 3D assets.** Every bench, plate, dumbbell, the guitar, the dog and the neon are
three.js primitives assembled in code, and the textures are drawn to `<canvas>` at
runtime. Nothing is downloaded or purchased, so there is no asset pipeline and no
licensing to track.

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
- The site asks for a desktop-sized window; below ~700px wide it shows a note with contact
  details instead of trying to squeeze a 3D room onto a phone.
- `V1/` is the previous Django-era portfolio, kept intact.
