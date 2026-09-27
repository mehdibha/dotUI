# dotUI launch film — storyboard

62 s · 1920×1080 · 60 fps · 120 BPM (a beat = 30 frames, a bar = 120 frames = 2 s). 31 bars. Every cut and every discrete change lands on a beat; continuous motion spans bars. Frame numbers below are **scene-local** (each scene starts at 0).

The film sells one idea: _every design decision is yours_ — and proves it with the product itself. Everything on screen is the real thing: registry components rendered by the real engine (`Theme`), the real /studio panel (`PanelPage` + `studioAt`), real presets, real blocks. Nothing is a screenshot or a lookalike.

## Style bible

**Ground.** `Stage`: near-black `#08080a`, a faint dot grid (the brand's dot), a vignette. Product surfaces can be light; the ground stays dark. Keep the grid moving with the camera so space reads as space.

**Type.** The landing hero's voice (`HEADLINE`): Geist ~450, tracking −0.055em, a muted second voice (`MUTED`). Words resolve out of blur with no travel (`BlurWords`), stagger 3–5 frames, exit together on cubic-in. One text block on screen at a time, six words max. Sizes: 120–150 statements, 40–64 labels.

**Motion.** `ease.out` (expo) for arrivals, 20–40 frames. `ease.in` for departures, 12–18 frames. `ease.camera` / `ease.inOut` for camera moves, 60–150 frames. Springs (`springAt`) for physical UI pops. Nothing is ever dead still: planes drift 0.5–1.5 % per bar. Overlap everything — the next thing starts before the last one lands.

**Depth.** Real 3D: `Camera` with perspective 2600, tilts ≤ 35°, pushes through planes. Far layers can take 1–3 px blur (sparingly, it's expensive).

**Rules.**

- No brand names on screen (presets are named after companies — never render those names).
- No charts in frame (chart colors are being rewritten).
- Discrete changes (preset swap, toggle, cut) exactly on beat frames: multiples of 30.
- No crossfades between scenes; hard cuts on the downbeat or match cuts through a shared element.
- Budget: a frame should render in well under 2 s at 1080p.

## Scenes

### 1 · Open — 2 bars (0:00–0:04)

Black. A single white dot pops in at center on frame 0 (spring, soft bloom) and pulses on every beat. It is the period of the first sentence: "Every product is built on" resolves in (beat 1), then "a design system" (beat 3) — the dot glides into place as the final period. Bar 2, beat 3: the words blur out; the dot stays, recentres and shrinks to 10 px.

**Hands off:** last frame = black, the white dot alone at (960, 540), 10 px.

### 2 · Wall — 3 bars (0:04–0:10)

Frame 0: the dot is the inner dot of a selected Radio at center. From it, a ripple of real component tiles pops outward (distance-based delay, spring scale 0.6→1 + fade): 40–60 tiles — buttons, switches, checkboxes, inputs, selects, sliders, tabs, badges, avatars, segmented controls, a calendar, a card — all in the builder's default neutral look. The camera pulls back and tilts the wall into 3D, drifting. Text: "Most are built on someone else's." Bar 3: text out; the wall recedes and dims; the title resolves over it — the dotUI mark (a rounded square with its dot) + "dotUI Studio".

**Hands off:** last frame = title centered over a dimmed, receding wall.

### 3 · Axes — 9 bars (0:10–0:28)

The heart. The real studio: a dark app frame with the preview on the left (a composition of real components — the landing `CardsGrid`, or group examples) and the real `PanelPage` on the right (~380 px wide), driven frame by frame by `studioAt(state)`. A synthetic `Cursor` works the panel; the preview follows. When a value changes, the preview re-themes as a wave travelling away from the panel (tiles wrapped in their own `Theme`, each at its own progress).

- Bar 1: the studio flies in from depth and settles in a gentle tilt. "Design your system." resolves and leaves.
- Bars 2–8, one axis per bar, each with a big label (Color · Typography · Radius · Density · Icons · Light & dark · Components): the camera leans toward the panel row, the cursor drags or clicks, the state animates, the wave rolls across the preview.
  - Color: brand hue sweeps (quantize hue to steps).
  - Typography: body and heading faces swap on beats (e.g. Geist → Inter + serif headings → mono).
  - Radius: `radiusPx` drags 2 → 20 → back to a middle value (quantize to 0.5 px).
  - Density: compact ↔ comfortable (`density`, `spacingUnit`).
  - Icons: lucide → phosphor → hugeicons.
  - Light & dark: the preview flips mode with a circular wipe from the cursor.
  - Components: button / input styles change.
- Bar 9: the camera pulls back to the whole studio: "Every decision is yours."

**Hands off:** last frame = "Every decision is yours." over the pulled-back studio.

### 4 · Presets — 3 bars (0:28–0:34)

Full frame: one rich composition (a block or `CardsGrid`) switches preset on every beat — origin, claude, supabase, stripe, linear, vercel, airbnb, github, notion, spotify — each swap a fast clip-path wipe (diagonal or radial) with a small camera punch on the beat. Names never appear. Bar 1: "Start from a preset." Bar 3: "Make it yours."

### 5 · Compose — 4 bars (0:34–0:42)

Code on the left (`MagicCode`, frame-driven magic move), the live component on the right on a card, building up a beat pair at a time: `<Input />` → `TextField` + `Label` → `Description` → `InputGroup` + mail icon → a trailing `Button` → wrapped in a `Card` ("Stay in the loop"). Text: "Built to compose." then "Accessible by default." (React Aria underneath; a focus ring travels through the fields on the beat).

**Hands off:** last frame = the finished card alone at center (960, 540), code gone.

### 6 · Patterns — 4 bars (0:42–0:50)

Frame 0: the card from Compose at center. The camera pulls back through it into a vast tilted grid of complete products — the studio blocks (dashboard, mail, settings, checkout, ai-chat, music-player, banking, invoice, messaging, file-manager, customers…) and landing showcase cards — mixed light and dark. The camera glides across. Bar 3: one theme wave sweeps every screen at once (a diagonal re-theme). Text: "From components" / "to complete products."

### 7 · Export — 3 bars (0:50–0:56)

A terminal window types `npx shadcn@latest init "https://dotui.org/r/init?preset=…"`; output lines stream; component files fly out into a file tree; an editor pane shows real `button.tsx` source. Text: "Install with the shadcn CLI." then "It's your code." A small "Open in v0" chip lands last.

### 8 · End — 3 bars (0:56–1:02)

Everything collapses into the dot. The logo draws around it — a rounded square, the dot at its lower right — the wordmark "dotUI" slides out beside it, "The Design System Studio for the Web" resolves below, then "dotui.org". Hold the final bar; the dot pulses on the last beats.

## Open decisions

- Music: pick a 120 BPM track (or re-time: change `BPM` in `src/lib/timing.ts`). Drop it in `public/` and wire it in `src/launch.tsx`.
- Copy is a first pass — every line is a string in its scene file.
