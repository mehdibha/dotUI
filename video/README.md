# video

The dotUI launch film, made with [Remotion](https://remotion.dev). It renders the **real** product: registry components and the real /studio panel are imported straight from `www/src` (`@/…`), themed by the real engine, so the film always shows the current components.

The scenes are placeholders for now, except `Studio`, which proves the rig. Creative direction lives in [STORYBOARD.md](STORYBOARD.md).

## Commands

From the repo root (or `video/` without the filter):

```bash
pnpm --filter video studio
```

Remotion Studio: scrub the timeline, hot reload. Every scene is also its own composition next to the full `Launch`.

```bash
pnpm --filter video frames Studio 0-479:60 --sheet
```

Renders stills of one composition into `out/frames/<Composition>/` plus a contact sheet `out/frames/<Composition>.sheet.jpg`. A scene id bundles only that scene. Frames: `0,45,90`, `0-600:30` (range:step), or `all:60`. `--scale=1` for full size (default 0.5).

```bash
pnpm --filter video render
```

The full film to `out/launch.mp4`: each scene renders in chunks, each chunk in its own process on a fresh browser, kept under the bundle's hash so a rerun resumes; then a lossless concat. `--scenes=Studio,End` re-renders only those; `--skip=Open` leaves scenes out; `--scale=2` makes a 4K master; `--music=public/track.mp3` muxes the soundtrack; `--concurrency=3` (the default) is what a 24 GB machine holds.

## How it's built

- `src/scene-list.ts` — the edit as data (ids, files, bars), read by the scripts; `src/launch.tsx` sequences it.
- `src/scenes/*.tsx` — one file per scene; every frame is a pure function of `useCurrentFrame()`. `placeholder.tsx` stands in for scenes not made yet.
- `src/lib/set.tsx` — `StudioSet`: /studio at 1920×1080, the real `PanelPage` beside a preview of showcase cards, all driven by one state.
- `src/lib/studio.ts` — `studioAt(state)` and `panelSystem(name, swatch)`: the props the real `PanelPage` takes, with inert setters.
- `src/lib/theme.tsx` — `<Theme state mode>`: partial studio state → `resolveDesignSystem` → a scoped `DesignSystemProvider`. `preset(id)` gives a preset's state. The frame holds until font tokens load; `facesReady()` resolves once they have (for scenes that measure text); `<WarmIcons />` preloads the lazy icon libraries.
- `src/lib/timing.ts` — the 120 BPM grid (`BEAT`, `BAR`, `at(bar, beat)`).
- `src/lib/motion.ts` — easings, `progress`, `keys`, `hold`, springs, the beat accent `punch`, deterministic `random`.
- `src/lib/cursor.tsx` — a keyframed pointer with click ripples; `src/lib/measure.ts` reads element boxes for it to aim at.
- `src/lib/content.ts` — the showcase cards and blocks the film may show.
- `src/film.tsx` — wraps every composition: scrubs CSS animations to the frame and holds the first frame for fonts.

## Gotchas

- **Time comes from the frame, never the clock.** CSS transitions are disabled globally; CSS animations are paused and scrubbed by `--video-time` (see `src/styles.css`). Registry states that animate by transition (a switch thumb) snap — drive in-between states yourself if they matter.
- **The stylesheet is the site's.** `src/styles.css` imports `www/src/styles.css`, so site utilities (the panel's `tint-*`) and variants match /studio.
- **Themes are scoped and cached by content.** Each distinct state adds a stylesheet, so quantize anything interpolated per frame (hue in steps, radius to 0.5 px) — never feed raw floats.
- **Overlays portal.** Popovers, menus and selects position against the viewport, which a transformed camera breaks. Render open lists inline (`ListBox`, `Menu`, `Calendar` standalone inside a surface) instead of real overlays.
- **Non-lucide icon libraries lazy-load** behind their own Suspense (lucide shows meanwhile): mount `<WarmIcons />` in any scene that shows another library.
- **Frame cost scales with DOM size, not pixels:** every capture resizes the viewport and restyles the whole document. Mount only what the camera can see.
- **3D layers rasterize at 1×.** A push past 1× under perspective goes soft — render bigger instead of scaling up.
- **Fonts come from Google**, capped at 20 s per family (`FONT_TIMEOUT`): a missing face beats a render hung on the network.
- **Packages resolve from where they're imported.** `www/src` files get www's `node_modules`; a film file importing a package needs it in `video/package.json` at the same version, so pnpm hands both the same instance.
- **`starter-themes` is shimmed** (`src/shims/`) — the site's version pulls in TanStack Start server code.
- **JSX is forced to the automatic runtime** in `webpack.ts`: Remotion reads it from tsconfig through the TypeScript API, which TS 7 no longer exposes.
- Remotion's bundled ffmpeg lacks `tile`; the contact sheet uses a system ffmpeg (`brew install ffmpeg`).
