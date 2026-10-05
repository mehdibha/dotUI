# dotUI launch film — storyboard

The creative source of truth. Scenes, their order and lengths live in `src/scene-list.ts`; keep this file and that list in step.

1920×1080 · 60 fps · 120 BPM (a beat = 30 frames, a bar = 120 frames = 2 s). Frame numbers below are **scene-local** (each scene starts at 0).

## Idea

_TBD — the one thing the film sells, in a sentence._

## Rules

What the medium and the product impose, whatever the story:

- **Real product only.** Registry components through `Theme`, the studio through `StudioSet` / `studioAt`, real presets. No screenshots, no lookalikes.
- **Content.** Showcase cards and blocks only from `src/lib/content.ts`. No charts (chart colors are being rewritten). No brand names on screen — presets are named after companies, so never render their names.
- **Legibility.** The film is watched on phones: a 1080p frame shrinks ~5× on an X timeline. Anything meant to be read lands at 22 px or more on screen; prove a change in a close shot, not a wide one.
- **Beat grid.** Discrete changes (a preset swap, a toggle, a pick) land on beat frames: multiples of 30.
- **Budget.** Frame cost scales with DOM size: mount only what the camera can see, and keep a frame well under 2 s at 1080p.

## Style

_TBD — ground, type, motion, depth, cuts._

## Story

_TBD — the beats, in one line each._

## Scenes

### 1 · Open — 2 bars

_TBD — placeholder._

**Hands off:** _the last frame the next scene picks up from._

### 2 · Studio — 4 bars

The rig's proof shot: the real studio (`StudioSet`), one preset per bar. Replace with the real scenes.

### 3 · End — 2 bars

_TBD — placeholder._

## Open decisions

- Music: pick a 120 BPM track (or change `BPM` in `src/lib/timing.ts`). `pnpm --filter video render --music=public/track.mp3` muxes it.
