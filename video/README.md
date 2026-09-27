# video

The dotUI launch film, made with [Remotion](https://remotion.dev). It renders the **real** product: registry components from `www/src/registry`, themed by the real engine, and the real /studio panel — imported straight from `www/src` (`@/…`), so the film always shows the current components.

Creative direction lives in [STORYBOARD.md](STORYBOARD.md).

## Commands

From the repo root (or `video/` without the filter):

```bash
pnpm --filter video studio
```

Remotion Studio: scrub the timeline, hot reload. Every scene is also its own composition (`Open`, `Wall`, `Axes`, …) next to the full `Launch`.

```bash
pnpm --filter video frames Axes 0-1079:60 --sheet
```

Renders stills of one composition from a single bundle into `out/frames/<Composition>/` plus a contact sheet `out/frames/<Composition>.sheet.jpg`. Frames: `0,45,90`, `0-600:30` (range:step), or `all:60`. `--scale=1` for full size (default 0.5).

```bash
pnpm --filter video render
```

The full film to `out/launch.mp4` (h264). Add `--scale=2` for a 4K master.

## How it's built

- `src/launch.tsx` — the edit: scenes and their lengths in bars.
- `src/scenes/*.tsx` — one file per scene; every frame is a pure function of `useCurrentFrame()`.
- `src/lib/timing.ts` — the 120 BPM grid (`BEAT`, `BAR`, `at(bar, beat)`).
- `src/lib/motion.ts` — easings (`ease.out`/`in`/`inOut`/`camera`), `progress`, `keys`, `hold`, springs, deterministic `random`.
- `src/lib/theme.tsx` — `<Theme state mode>`: partial studio state → `resolveDesignSystem` → a scoped `DesignSystemProvider`. `preset(id)` gives a preset's full state. Font tokens are loaded before the frame is captured.
- `src/lib/studio.ts` — `studioAt(state)`: a `Studio` for the real `PanelPage`, with inert setters.
- `src/lib/stage.tsx` — `Stage` (ground + dot grid + vignette), `Camera` (3D plane), `Place` (centered absolute box).
- `src/lib/type.tsx` — `HEADLINE`, `BlurWords`, `Headline`.
- `src/lib/cursor.tsx` — a keyframed pointer with click ripples.
- `src/lib/code.tsx` — `MagicCode`: the site's keyed-token magic move, frame-driven.

## Gotchas

- **Time comes from the frame, never the clock.** CSS transitions are disabled globally; CSS animations are paused and scrubbed by `--video-time` (see `src/styles.css`). Registry states that animate by transition (a switch thumb) snap — drive in-between states yourself if they matter.
- **Themes are scoped and cached by content.** Each distinct state adds a stylesheet, so quantize anything interpolated per frame (hue in steps, radius to 0.5 px) — never feed raw floats.
- **Overlays portal.** Popovers, menus and selects position against the viewport, which a transformed `Camera` breaks. Render open lists inline (`ListBox`, `Menu`, `Calendar` standalone inside a surface) instead of real overlays.
- **Non-lucide icon libraries lazy-load.** `Theme` wraps children in a Suspense boundary that holds the frame until they're in.
- **`starter-themes` is shimmed** (`src/shims/`) — the site's version pulls in TanStack Start server code.
- **JSX is forced to the automatic runtime** in `webpack.ts`: Remotion reads it from tsconfig through the TypeScript API, which TS 7 no longer exposes.
- Remotion's bundled ffmpeg lacks `tile`; the contact sheet uses a system ffmpeg (`brew install ffmpeg`).
