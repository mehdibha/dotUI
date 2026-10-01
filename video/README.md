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

The full film to `out/launch.mp4`: one bundle, one take per scene in `out/scenes/`, then a lossless concat. `--scenes=Axes,End` re-renders only those scenes; `--scale=2` makes a 4K master; `--music=public/track.mp3` muxes the soundtrack; `--concurrency=3` (the default) is what a 24 GB machine holds.

## How it's built

- `src/launch.tsx` — the edit: scenes and their lengths in bars.
- `src/scenes/*.tsx` — one file per scene; every frame is a pure function of `useCurrentFrame()`.
- `src/lib/timing.ts` — the 120 BPM grid (`BEAT`, `BAR`, `at(bar, beat)`).
- `src/lib/motion.ts` — easings (`ease.out`/`in`/`inOut`/`camera`), `progress`, `keys`, `hold`, springs, the beat accent `punch`/`punches`, the dot's `pulse`, deterministic `random`.
- `src/lib/theme.tsx` — `<Theme state mode>`: partial studio state → `resolveDesignSystem` → a scoped `DesignSystemProvider`. `preset(id)` gives a preset's full state. Font tokens are loaded before the frame is captured; `facesReady()` resolves when they are (for scenes that measure text); `<WarmIcons />` preloads the lazy icon libraries.
- `src/lib/studio.ts` — `studioAt(state)`: a `Studio` for the real `PanelPage`, with inert setters.
- `src/lib/stage.tsx` — `Stage` (ground + dot grid + vignette), `Camera` (3D plane), `Place` (centered absolute box).
- `src/lib/type.tsx` — `HEADLINE`, `TYPE` (the one type scale), `BlurWords`, `Headline`.
- `src/lib/cursor.tsx` — a keyframed pointer with click ripples.
- `src/lib/code.tsx` — `MagicCode`: the site's keyed-token magic move, frame-driven.
- `src/lib/brand.tsx` — `Mark`, `Wordmark`, `Lockup`: the only way the logo is drawn.
- `src/lib/content.ts` — the showcase cards and blocks the film may show (no charts, real names, other brands, remote images).
- `src/scene-list.ts` — the edit as data (ids, files, bars), read by the scripts.

## Gotchas

- **Time comes from the frame, never the clock.** CSS transitions are disabled globally; CSS animations are paused and scrubbed by `--video-time` (see `src/styles.css`). Registry states that animate by transition (a switch thumb) snap — drive in-between states yourself if they matter.
- **Themes are scoped and cached by content.** Each distinct state adds a stylesheet, so quantize anything interpolated per frame (hue in steps, radius to 0.5 px) — never feed raw floats.
- **Overlays portal.** Popovers, menus and selects position against the viewport, which a transformed `Camera` breaks. Render open lists inline (`ListBox`, `Menu`, `Calendar` standalone inside a surface) instead of real overlays.
- **Non-lucide icon libraries lazy-load** behind their own Suspense (lucide shows meanwhile): mount `<WarmIcons />` in any scene that shows another library.
- **Frame cost scales with DOM size, not pixels:** every capture resizes the viewport and restyles the whole document. Mount only what the camera can see.
- **3D layers rasterize at 1×.** A push past 1× under perspective goes soft — render bigger instead of scaling up.
- **Long renders can lose a Chrome tab** ("Target closed") under memory pressure; `scripts/render.ts` retries per scene. Keep concurrency modest.
- **`starter-themes` is shimmed** (`src/shims/`) — the site's version pulls in TanStack Start server code.
- **JSX is forced to the automatic runtime** in `webpack.ts`: Remotion reads it from tsconfig through the TypeScript API, which TS 7 no longer exposes.
- Remotion's bundled ffmpeg lacks `tile`; the contact sheet uses a system ffmpeg (`brew install ffmpeg`).
