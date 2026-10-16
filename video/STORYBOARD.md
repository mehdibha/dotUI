# dotUI launch film — storyboard

The creative source of truth. Scenes, their order and lengths live in `src/scene-list.ts`; keep this file and that list in step.

1920×1080 · 60 fps · 120 BPM (a beat = 30 frames, a bar = 120 frames = 2 s). Frame numbers below are **scene-local** (each scene starts at 0).

> **Status: three candidates, none picked.** Options A, B and C below share the idea, rules and style, and differ in story. Once one is picked, its scenes move into `## Scenes`, the other two are deleted, and `src/scene-list.ts` is rewritten to match. Until then `scene-list.ts` keeps the rig's placeholder edit (Open, Studio, End).

## Idea

Recreate a design system you know, down to each component, and install it with the shadcn CLI.

The film never says which system. The look has to be recognizable on its own, which is the fidelity claim itself. Every option builds the same hero look: the `linear` preset (default, not yet confirmed; the alternatives are `vercel` and `stripe`).

## Rules

What the medium and the product impose, whatever the story:

- **Real product only.** Registry components through `Theme`, the studio through `StudioSet` / `studioAt`, real presets. No screenshots, no lookalikes.
- **Content.** Showcase cards and blocks only from `src/lib/content.ts`. No charts (chart colors are being rewritten). No brand names on screen — presets are named after companies, so never render their names. The preset picker is never filmed, and the panel header always reads "My design system".
- **Legibility.** The film is watched on phones: a 1080p frame shrinks ~5× on an X timeline. Anything meant to be read lands at 22 px or more on screen; prove a change in a close shot, not a wide one.
- **Beat grid.** Discrete changes (a preset swap, a toggle, a pick) land on beat frames: multiples of 30.
- **Budget.** Frame cost scales with DOM size: mount only what the camera can see, and keep a frame well under 2 s at 1080p.
- **Positioning.** dotUI sits inside the shadcn ecosystem: say "installed with the shadcn CLI", never compare with another builder.

## Style

Shared by all three options:

- **Ground.** The site's dark chrome (`bg-bg`), the same as /studio. The preview stays in dark mode except where an option flips it to light as a beat.
- **Type.** Overlay lines in the site's Geist, white, 72–96 px, one short line at a time, left-aligned in the lower third or centered on an empty frame. No line runs over six words.
- **Motion.** Cuts land on downbeats (bar starts). Camera moves use `ease.camera` and settle before the next beat; every discrete change gets a `punch` on its beat. No easing on panel chrome, matching the product.
- **Depth.** Flat 2D framing. No 3D tilts (3D layers rasterize at 1× and go soft on a push).
- **Close shots.** A change is proven with the camera on the component and the panel row that changed, both readable. The wide wall is for breadth, never for proof.
- **Sound.** One 120 BPM track; swaps and clicks sit on its kicks.

---

## Option A · Swap, then build

The structure from the planning thread: breadth first, then depth. Safest to make, since every shot is a variation of the proof shot the rig already renders.

**19 bars · 38 s**

### Story

1. The same wall of components flips through six very different looks, one per beat.
2. It snaps back to the plain starting point: "Let's build one."
3. Step by step, one decision per bar, the hero look assembles in close shots.
4. Pull back: the whole wall is the hero look, then it flips to light mode.
5. Export with the shadcn CLI, end card.

### Scenes

| # | Scene | Bars | What happens |
|---|-------|------|--------------|
| 1 | Swap | 4 | Bar 0: the preview wall (no panel) in `origin`, line "Same components." Bar 1: `claude`, `carbon`, `duolingo`, `material3`, one per beat. Bar 2: `vercel`, `airbnb`, line becomes "Any look." on beat 2. Bar 3: hard cut to `origin` with the panel in, line "Let's build one." |
| 2 | Build | 10 | One step per bar, the change on beat 0, a close shot of the panel row and the card it changes, beats 1–3 hold, camera travels to the next target on beat 3. Steps listed below. |
| 3 | Export | 3 | Bar 0: cursor to Export, click on beat 2. Bar 1: the real export dialog inline, close on the `npx shadcn@latest init "…/init.json"` command at ≥22 px; Copy clicked on beat 2, the icon turns to a check. Bar 2: line "Installed with the shadcn CLI." |
| 4 | End | 2 | The finished wall dims behind the dotUI mark, "Design your own shadcn style." and dotui.org. |

**Build steps** (each is a slice of the `linear` diff applied on top of `origin`; the state at step *n* is the first *n* slices):

1. **Color** — `brand`, `neutralTint`, semantic seeds. Close: the pricing card's primary button and the brand row.
2. **Surfaces** — `darkBg`/`lightBg`, `surfaceLayers`, `shellTone`, `surfaceShadow`. Close: two stacked cards.
3. **Type** — Inter, `uiTextSize` 13, JetBrains Mono. Close: the team-name card.
4. **Shape** — `radiusPx` 8, `roleControl`, `roleSurface`, pill buttons, field-cornered select. Close: the controls card.
5. **Icons** — `iconStroke`. Close: the command menu's icons.
6. **Menus** — large ⌘K, prompt search, matched rows, no arrows, outline kbd. Close: the command menu.
7. **Fields** — border focus, edge hover, medium labels, strong check edge. Close: two-factor or booking fields.
8. **Navigation & data** — pill tabs, outline segmented track, dot badges, circle calendar days. Close: the booking calendar.
9. **Everything else at once** — the rest of the diff lands on beat 0 while the camera pulls back to the full wall. Line "Down to each component."
10. **Light mode** — the preview flips to light on beat 0 and holds.

**Hands off:** Swap ends on `origin` with the panel in, the frame Build starts from. Build ends on the full wall in light mode; Export's cursor starts there.

**Risks:** the build is long (20 s) and every step must read in a close shot; if a step's change is too subtle (icon stroke, focus width), merge it into a neighbour and drop to 9 bars.

---

## Option B · The reveal

Opens on what looks like a real product, then reveals it was built in dotUI. Strongest hook for an autoplaying timeline, since the first three seconds show the claim instead of describing it.

**16 bars · 32 s**

### Story

1. Full frame: a real-looking app (the `mail` block in the hero look). The cursor opens a message. No text.
2. The camera pulls back fast: it is a preview tile inside dotUI Studio. "Built in dotUI Studio."
3. Rewind: the panel's decisions revert one per beat, close shots, until it is plain `origin`. "Every decision is yours."
4. From `origin`, it flips through other looks, one per beat. "Any system."
5. Export with the shadcn CLI, end card.

### Scenes

| # | Scene | Bars | What happens |
|---|-------|------|--------------|
| 1 | Hook | 3 | Bars 0–1: the `mail` block full frame in `linear`, dark; the cursor moves to a message row and clicks on bar 1 beat 0, the reading pane updates. Bar 2: on beat 0 the camera pulls back to the whole studio (panel left, mail block in the preview); line "Built in dotUI Studio." on beat 2. |
| 2 | Rewind | 4 | The `linear` slices from Option A's build list revert in reverse, one per beat (16 beats), camera cutting between the panel row and the block each time. Line "Every decision is yours." from bar 2. Ends on `origin`. |
| 3 | Swap | 4 | Bar 0: hold `origin`. Bars 1–2: `claude`, `carbon`, `duolingo`, `material3`, `vercel`, `airbnb`, `supabase`, `polaris`, one per beat. Line "Any system." on bar 1. Bar 3: snaps back to `linear`, the look from the hook. |
| 4 | Export | 3 | As Option A's Export. |
| 5 | End | 2 | As Option A's End. |

**Hands off:** Hook ends on the wide studio in `linear`; Rewind starts there. Rewind ends on `origin`, Swap starts there. Swap ends on `linear`; Export starts there.

**Risks:** the hook only works if the `mail` block in the hero look passes for the real app at a glance, so this option leans hardest on preset fidelity. The rewind runs at one change per beat: each close shot has 0.5 s, so changes must be big ones (color, shape, type, surfaces) and the subtle slices land together.

---

## Option C · One button, every component

Starts on a single component and lets the viewer watch one decision spread through the whole system, then goes past tokens into per-component styles. Best at explaining what makes dotUI different from a theme generator.

**18 bars · 36 s**

### Story

1. One button fills the frame. Each beat, one decision changes it: color, radius, pill, font, weight, shadow.
2. Pull back: every other component already followed. "Every component follows."
3. Per-component styles, one per bar, close shots: tabs, badges, ⌘K, calendar, alert, spinner. "Down to each component."
4. Wide wall, flips through other looks. "Or start from any look."
5. Export with the shadcn CLI, end card.

### Scenes

| # | Scene | Bars | What happens |
|---|-------|------|--------------|
| 1 | Button | 4 | Bars 0–1: one primary button, rendered large (not scaled up), centered. One change per beat on top of `origin`: `brand`, `radiusPx`, `buttonRadius` pill, `bodyFont`, `uiTextSize`, `surfaceShadow`, `buttonSecondary` (a second button joins), `darkBg`. Bars 2–3: on bar 2 beat 0 the camera pulls back; the button sits in the pricing card in the wall, which is already in the same look. Line "Every component follows." |
| 2 | Components | 6 | One per bar, the change on beat 0, panel row and component in a close shot: `tabStyle` pill, `badgeStyle` dot, `menuScale` large with prompt search, `calendarDayShape` circle with ring today, `alertStyle` soft-outline, `spinnerStyle` dots. Line "Down to each component." on the first bar only. Ends with the full `linear` state. |
| 3 | Swap | 3 | The wide wall: `claude`, `carbon`, `duolingo`, `material3`, `vercel`, `airbnb`, one per beat over bars 0–1, back to `linear` on bar 2. Line "Or start from any look." |
| 4 | Export | 3 | As Option A's Export. |
| 5 | End | 2 | As Option A's End. |

**Hands off:** Button ends on the wide wall in the first-half state; Components starts there and walks the camera from card to card. Components ends on the full `linear` wall; Swap starts there. Swap ends on `linear`; Export starts there.

**Risks:** the hero look only completes in scene 2, so the recognizable moment comes late (around 20 s). The button opener needs a big-render path: the button at about 4× its size, rendered at that size rather than scaled.

---

## Comparison

| | A · Swap, then build | B · The reveal | C · One button |
|---|---|---|---|
| Length | 38 s | 32 s | 36 s |
| First 3 s | Six looks flipping | A real-looking app | One button changing |
| Sells best | Breadth, then depth | Fidelity | Per-component depth |
| Hero look recognizable at | ~30 s | 0 s | ~20 s |
| Build effort | Lowest (extends the proof shot) | Medium (mail block, rewind cuts) | Medium (big button, card-to-card camera) |
| Main risk | Long middle | Hook depends on fidelity | Late payoff |

## Open decisions

- **Which option** (A, B or C), or a mix (B's hook in front of A's build is the obvious one).
- **Hero preset:** `linear` by default; `vercel` or `stripe` instead.
- **Swap list:** the presets above alternate warm/cool and round/square and avoid two greens in a row; `linear` is kept out so the hero stays fresh.
- **Overlay copy:** every line above is a draft.
- **Music:** pick a 120 BPM track (or change `BPM` in `src/lib/timing.ts`). `pnpm --filter video render --music=public/track.mp3` muxes it.
- **Rig gaps to check before building:** `StudioSet` needs a way to open a given panel page and to frame the preview without the panel; the export dialog has to render inline (overlays portal); `panelSystem` has no Export button yet (`buttons: null`).
