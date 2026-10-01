# dotUI launch film — storyboard

62 s · 1920×1080 · 60 fps · 120 BPM (a beat = 30 frames, a bar = 120 frames = 2 s). 31 bars. Every cut and every discrete change lands on a beat; continuous motion spans bars. Frame numbers below are **scene-local** (each scene starts at 0).

The film sells one idea: _every design decision is yours_ — and proves it with the product itself. Everything on screen is the real thing: registry components rendered by the real engine (`Theme`), the real /studio panel (`PanelPage` + `studioAt`), real presets, real blocks. Nothing is a screenshot or a lookalike.

## Style bible

**Ground.** `Stage`: near-black `#08080a`, a faint dot grid (phase-centred: a dot sits on 960,540), a vignette. Product surfaces can be light; the ground stays dark. When light UI fills the frame, pass `vignette={false}` (it greys light corners). Keep the grid moving with the camera so space reads as space.

**Type.** The landing hero's voice (`HEADLINE`): Geist ~450, tracking −0.055em, a muted second voice (`MUTED`). One scale for the whole film (`TYPE` in `lib/type.tsx`): statements `TYPE.statement` (128), labels `TYPE.label` (80), the End tagline `TYPE.tagline` (44). Two anchors only: optical centre, or top-anchored at `TOP_ANCHOR`. Words resolve out of blur with no travel (`BlurWords`), stagger 3–5 frames, exit together on cubic-in. One text block on screen at a time, six words max. Text over busy UI gets a soft scrim or a clean band.

**Brand.** The logo comes only from `lib/brand.tsx` (`Mark`, `Wordmark`, `Lockup`) — the real wordmark path, never "dotUI" typed in Geist.

**Motion.** `ease.out` (expo) for arrivals, 20–40 frames. `ease.in` for departures, 12–18 frames. `ease.camera` for camera moves, 60–150 frames (`keys()` defaults to it). Springs (`springAt`) for physical UI pops. The beat accent is `punch()` / `punches()` from `lib/motion.ts` at the film amplitude (2.5 %) — no scene-local punch curves. `pulse()` is the dot's heartbeat. Nothing is ever dead still: planes drift 0.5–1.5 % per bar. Overlap everything — the next thing starts before the last one lands.

**Depth.** Real 3D: `Camera` with perspective 2600, tilts ≤ 35°, pushes through planes. Far layers can take 1–3 px blur (sparingly, it's expensive). Chrome rasterizes a 3D layer at 1× and upscales it, so a push past 1× under perspective goes soft: render the content larger (or move the zoom into CSS `zoom` on an inner wrapper, as Wall does) instead of scaling a small layer up.

**Legibility (the film is watched on phones).** A 1080p frame shrinks ~5× on an X timeline. Anything meant to be read lands on screen at `TYPE.minReadable` (22 px) or more; the proof of a change is shown in a macro shot (1.5–3× on the element that changed), not in a wide shot of a whole screen. Wide shots of whole products last a bar at most.

**Cuts.** No crossfades; hard cuts on a downbeat or match cuts through a shared element. **No dead frames:** every scene's frame 0 already has content and camera velocity, and its last frames are still moving, so a hard cut carries motion across.

**Content.** Showcase cards and blocks only from `lib/content.ts` (`SAFE_SHOWCASE`, `SAFE_BLOCKS`) — the rest carry charts, real people's names, other brands, or remote images. Custom compositions of registry components are always fine. No brand names on screen (presets are named after companies — never render those names). No charts.

**Beat grid.** Discrete changes (preset swap, toggle, pick) exactly on beat frames: multiples of 30.

**Budget.** Frame cost scales with DOM size (every capture forces a full restyle): mount only what the camera can see; keep a frame well under 2 s at 1080p.

## Story

Every product is built on a design system → most use someone else's → dotUI Studio → start from a preset → make it yours, every decision → built to compose → complete products → install it, own the code → dotUI.

## Scenes

### 1 · Open — 2 bars (0:00–0:04)

Black. A single white dot pops in at center on frame 0 (spring, soft bloom) and pulses on every beat (`pulse()`). It is the period of the first sentence: "Every product is built on" resolves in, then "a design system" — the dot glides into place as the true final period (measured from the text layout, sitting on the baseline). Bar 2, beat 3: the words blur out; the dot recentres and shrinks to 10 px.

**Hands off:** last frame = INK ground with the vignette and **no** dot grid, the pure-white dot alone at (960, 540), 10 px, no bloom.

### 2 · Wall — 3 bars (0:04–0:10)

Frame 0: the dot is the inner dot of a selected Radio at center. From it, a ripple of real component tiles pops outward — the builder's default neutral look. The camera pulls back and tilts the wall into 3D, drifting. Text: "Most are built on someone else's." Bar 3: text out; the wall recedes and dims; the lockup resolves over it: `Lockup` with "Studio".

**Hands off:** last frame = the lockup over the dimmed, still-drifting wall.

### 3 · Presets — 3 bars (0:10–0:16)

Hard cut on the downbeat to full frame: a rich board of real cards already moving, switching preset on every beat — each swap a fast clip-path wipe (circle or blade) with a `punch()` on the beat. Names never appear. Bar 1: "Start from a preset." Bars 2–3: no text — push in (~1.45–1.5×) so each look reads, three or four cards large.

**Hands off:** the last beat lands on the Origin look (`preset("origin")`), dark mode, cards large in frame — the same look and on-screen scale the Axes scene opens on.

### 4 · Axes — 9 bars (0:16–0:34)

The heart: the real studio (the site header, the real `PanelPage` at its true width on the left, the preview on the right), driven frame by frame by `studioAt(state)` from `preset("origin")` onward.

- Bar 1: frame 0 is tight on the preview cards in the Origin look, matching Presets' last frame; the camera pulls back and reveals the panel — "Make it yours."
- Bars 2–8, one axis per bar, each with a `TYPE.label` label in one fixed clear zone: the cursor works the panel row, then the camera **pushes into the preview element that proves the change** at 2–2.5× macro, alternating sides bar to bar. The change rolls across the preview as a wave.
- Bar 9: pull back to the whole studio, still alive (slow dolly, a light sweep): "Every decision is yours."

**Hands off:** last frame = "Every decision is yours." over the pulled-back studio, still moving.

### 5 · Compose — 4 bars (0:34–0:42)

Frame 0 already shows `<Input />` and its render. Code left (`MagicCode`), the live component right, both large; they build up on beats: `<Input />` → `TextField` + `Label` → `Description` → `InputGroup` + mail icon → a trailing primary `Button` → wrapped in a `Card` ("Stay in the loop"). Text: "Built to compose." then "Accessible by default." — a focus ring travels through the fields with a screen-reader caption, large.

**Hands off:** last frame = the finished card alone at center (960, 540), code gone (Patterns reproduces it exactly).

### 6 · Patterns — 4 bars (0:42–0:50)

Frame 0: the same card at center, already moving. The camera pulls back through it into a tilted field of complete products (`SAFE_BLOCKS`, `SAFE_SHOWCASE`), with one fly-past where two screens cross the lens at readable scale. Bar 3: one clean theme wave sweeps every screen. Text: "From components" / "to complete products."

**Hands off:** last frames still gliding.

### 7 · Export — 3 bars (0:50–0:56)

Frame 0: the terminal already mid-type, the push-in already moving. `npx shadcn@latest init "https://dotui.org/r/init?preset=…"` → real init output → `npx shadcn@latest add @dotui/…` → component files fly out (large) into a file tree; an editor shows real `button.tsx` source, large. Text: "Install with the shadcn CLI." then "Own the code." An "Open in v0" pill lands last.

**Hands off:** last frame = editor + pill + "Own the code.", still moving.

### 8 · End — 3 bars (0:56–1:02)

Frame 0: Export's editor and pill, already swirling — everything collapses into the dot. The dot becomes the mark, the wordmark slides out, "The Design System Studio for the Web" resolves below at `TYPE.tagline`, then "dotui.org". Hold the final bar; the dot pulses on the last beats. The last ~60 frames are the poster frame on X.

## Open decisions

- Music: pick a 120 BPM track (or re-time: change `BPM` in `src/lib/timing.ts`). `node scripts/render.ts --music=public/track.mp3` muxes it.
- Copy is a first pass — every line is a string in its scene file.
