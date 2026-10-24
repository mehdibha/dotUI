# dotUI launch film — storyboard

The creative source of truth. Scenes, their order and lengths live in `src/scene-list.ts`; keep this file and that list in step.

1920×1080 · 60 fps · 120 BPM (a beat = 30 frames, a bar = 120 frames = 2 s). Frame numbers below are **scene-local** (each scene starts at 0).

**21 bars · 42 s.** Story picked 16 Oct; details still to refine (see Open decisions).

## Idea

Every product you admire has its own look. dotUI lets you make yours, then takes it everywhere: every component, every screen, every agent.

## Story

The film is one movement from watching to owning:

1. **Admire.** The same cards wear one famous-feeling look after another, at a calm pace. _Same components. Every look._
2. **Rush.** Now whole products fly by, each in a different look, faster and faster until it is a blur.
3. **Stop.** It lands hard on one product in one look. A slow, small pull back shows the studio panel beside it: this wasn't a product, it was a design system being made. _Now make it yours._
4. **Own.** A few quick decisions in the real panel, and the product follows each one.
5. **Everywhere.** Three short proofs of what you get: _Every component._ The catalog, in your look. _Every screen._ The same product on a phone, a sheet sliding up like iOS. _Every agent._ One prompt that sets it all up.
6. **End.** dotUI. _Design your own shadcn style._

The overlay lines in italics are the whole script: no voice-over, eight short lines.

## Rules

What the medium and the product impose, whatever the story:

- **Real product only.** Registry components through `Theme`, the studio through `StudioSet` / `studioAt`, real presets. No screenshots, no lookalikes.
- **Content.** Showcase cards and blocks only from `src/lib/content.ts`. No charts (chart colors are being rewritten). No brand names on screen — presets are named after companies, so never render their names. The preset picker and the export dialog's list of AI builders are never filmed, and the panel header always reads "My design system".
- **Legibility.** The film is watched on phones: a 1080p frame shrinks ~5× on an X timeline. Anything meant to be read lands at 22 px or more on screen; prove a change in a close shot, not a wide one.
- **Beat grid.** Discrete changes (a preset swap, a toggle, a pick) land on beat frames: multiples of 30. The Rush alone subdivides the beat (halves at 15 frames, quarters alternating 7 and 8).
- **Budget.** Frame cost scales with DOM size: mount only what the camera can see, and keep a frame well under 2 s at 1080p.
- **Positioning.** dotUI sits inside the shadcn ecosystem: say "the shadcn CLI", never compare with another builder.

## Style

- **Ground.** The site's dark chrome (`bg-bg`), the same as /studio. The preview stays in dark mode.
- **Type.** Overlay lines in the site's Geist, white, 72–96 px, one line at a time, lower third over footage or centered on an empty frame. Each line holds at least a bar so it can be read.
- **Motion.** Cuts land on downbeats. The camera eases with `ease.camera` and settles before the next beat; each discrete change gets a `punch` on its beat. Panel chrome never eases, matching the product.
- **Depth.** Flat 2D framing, no 3D tilts (3D layers rasterize at 1× and go soft on a push).
- **Sound.** One 120 BPM track that builds through the Rush, cuts to silence for the Stop, and drops back in for Own.

## Scenes

### 1 · Looks — 4 bars

The preview cards alone (no panel), framed so a card's text reads at ≥22 px. Every preset, one per beat, 16 beats: `origin`, `claude`, `carbon`, `duolingo`, `material3`, `vercel`, `airbnb`, `linear`, `supabase`, `polaris`, `stripe`, `notion`, `radix`, `spotify`, `untitled`, `github` (warm/cool and round/square alternate; no two greens in a row). Line "Same components." on bar 0, "Every look." on bar 2.

The file is a first draft: it cycles the presets on the full `StudioSet`, panel included.

**Hands off:** the last look (`github`) on the cards.

### 2 · Rush — 3 bars

Full frame, one block at a time from `SAFE_BLOCKS` (`mail`, `customers`, `file-manager`, `code-review`, `checkout`, `invoice`, `messaging`, `music-player`), and on every change both the block and the look switch. Speed builds: bar 0 one change per beat (4), bar 1 one per half beat (8), bar 2 beats 0–2 one per quarter beat (12). Bar 2 beat 3: hard stop on the hero, the `mail` block in `linear`. No text.

**Hands off:** `mail` in `linear`, full frame, frozen.

### 3 · Reveal — 2 bars

Bar 0 beat 0: silence, nothing moves for one beat. From beat 1 a slow, small pull back (about 1.0 → 0.8 over the rest of the scene) brings the panel into the left of the frame, with the mail block still most of the picture. It stops at a framing where the panel's row labels still read at ≥22 px; it is never the full wide studio. Line "Now make it yours." on bar 1.

**Hands off:** the panel and the block side by side, both legible.

### 4 · Tweak — 4 bars

The synthetic cursor makes one decision per bar in the real panel; the pick lands on beat 0 of the next bar, the block follows on the same frame, a `punch` marks it. The camera stays put, with small pushes toward the row in use.

1. Brand color: a swatch pick, from indigo to a new hue.
2. Corners: the radius slider dragged down to square.
3. Font: a different typeface for the whole block.
4. A per-component style: buttons from pill to square, the step a theme generator can't make.

No overlay line: the panel's own labels say what changed.

**Hands off:** the block in the tweaked look; the camera starts drifting right.

### 5 · Catalog — 2 bars

The camera leaves the panel and glides over a wall of real registry components (fields, menus, tabs, calendar, table, dialogs, toasts; no charts), all in the tweaked look. Line "Every component."

**Hands off:** the wall drifting out of frame.

### 6 · Mobile — 2 bars

The tweaked `mail` block inside a phone outline at phone width. Bar 0 beat 2: a tap on a picker; the bottom sheet (the `drawer` component, `mobilePickers: "drawer"`) slides up like iOS. Bar 1 beat 2: a swipe down and it dismisses. Line "Every screen." Sheet motion is keyframed by hand (transitions are off in the rig and overlays portal, so the sheet renders inline in the phone).

**Hands off:** the phone, sheet closed.

### 7 · Agent — 2 bars

The real export dialog, inline, close shot. Bar 0 beat 2: "Copy prompt" clicked, the button reads "Copied". Bar 1: the prompt itself scrolls past, its first line "Set up this project with my dotUI design system" and the `npx shadcn@latest init` line readable. Line "Every agent."

**Hands off:** the prompt, held.

### 8 · End — 2 bars

The dotUI mark, then "Design your own shadcn style." and dotui.org, centered on the dark ground.

## Open decisions

- **Preset count:** the repo has `origin` plus 15 named presets, so Looks shows 16 at one per beat. If some are cut before launch, the scene drops to a matching length.
- **Hero:** the `mail` block in `linear`, by default; another block or preset can replace either.
- **Tweak picks:** which hue, font and per-component style read best on the hero block.
- **Overlay copy:** every line is a draft.
- **Music:** pick a 120 BPM track (or change `BPM` in `src/lib/timing.ts`). `pnpm --filter video render --music=public/track.mp3` muxes it.
- **Rig gaps to fill:** `StudioSet` needs a cards-only framing and a block-only framing; the panel needs to open a given page for the Tweak shots; the export dialog and the mobile sheet must render inline (overlays portal); `panelSystem` has no Export button yet (`buttons: null`).
