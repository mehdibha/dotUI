# Drawer Port Comparison Report — `dotui` vs `base-ui`

Scope: `www/src/registry/ui/drawer/**` against `base-ui/packages/react/src/drawer/**` + `utils/useSwipeDismiss.ts` + `utils/scrollable.ts`.

Score scale: **0** (missing), **1** (stub/divergent), **2** (partial), **3** (functional but lossy), **4** (faithful with minor gaps), **5** (full mirror).

---

## 1. Architectural shape

| Area | base-ui | dotui port | Score |
|---|---|---|---|
| Composition model | `Root / Trigger / Portal / Backdrop / Viewport / Popup / Content / Title / Description / Close / SwipeArea / Indent / IndentBackground / Provider` (13 parts) | `Drawer / DrawerHandle / DrawerSwipeArea / DrawerProvider / DrawerIndent / DrawerIndentBackground` (6 parts) | **2/5** |
| Headless framework | own Dialog primitives (Floating UI focus mgmt, CloseWatcher, controlled state, `eventDetails`) | `react-aria-components` Modal/ModalOverlay (RAC's overlay state, focus scope) | **n/a** (different by design) |
| Portal | explicit `DrawerPortal` (`container`, `keepMounted`) | implicit via RAC `ModalOverlay` portal — no API to redirect | **3/5** |
| Trigger linkage | `DrawerTrigger`, `triggerId`, `handle` (detached imperative open) | none — consumers wire `<DialogTrigger>` themselves | **2/5** |

**Notes**
- The collapse from 13 → 6 parts is the single biggest functional gap. Several ones dropped (`Viewport`, `Backdrop`, `Content`, `Title`, `Description`, `Close`, `Trigger`, `Portal`) carry meaningful behaviour — the `Viewport` in particular owns the gesture in base-ui; the port folds its job into `Drawer` root. Defensible for a small port but it forfeits snap points and the swipe-area open gesture.
- `DrawerContent`'s `data-swipe-ignore` attribute is gone — consumers can't mark a sub-tree as undraggable except via the `[data-drawer-no-drag]` selector hard-coded in `use-swipe-dismiss.ts:326`.

---

## 2. Public API surface

| Prop / part | base-ui | dotui | Score |
|---|---|---|---|
| `swipeDirection` ↔ `placement` | `'up' \| 'down' \| 'left' \| 'right'` (gesture vector) | `'top' \| 'bottom' \| 'left' \| 'right'` (anchor side) | **4/5** — equivalent, names diverge |
| `disablePointerDismissal` | yes | uses RAC `isDismissable` | **4/5** |
| `modal` (`true \| false \| 'trap-focus'`) | yes | RAC modal-only | **3/5** |
| `snapPoints`, `snapPoint`, `defaultSnapPoint`, `onSnapPointChange`, `snapToSequentialPoints` | yes | **none** | **0/5** |
| `swipeThreshold` (number \| function) | both forms | number only | **3/5** |
| `swipeFromHandleOnly` | not in base-ui (gesture is on Viewport, opt-in via `DrawerHandle` prop) | yes | **n/a — addition** |
| `onOpenChangeComplete` | yes | not exposed | **2/5** |
| `eventDetails` (`reason`: triggerPress / outsidePress / escapeKey / closeWatcher / closePress / focusOut / imperativeAction / swipe / none) | yes | none | **0/5** |
| `initialFocus` / `finalFocus` on Popup | yes | rely on RAC defaults | **3/5** |
| Imperative handle (`handle`, `useDialogHandle`) | yes | none | **0/5** |

---

## 3. `useSwipeDismiss` (gesture core)

`use-swipe-dismiss.ts` (441 lines) vs `utils/useSwipeDismiss.ts` (1143 lines).

| Feature | base-ui | dotui | Score |
|---|---|---|---|
| Pointer-down via `addEventListener` (not React synthetic) so events on portaled child drawer don't bubble to parent | yes | yes | **5/5** |
| Skip drag on interactive descendants | dynamic `ignoreSelectorWhenTouch` | hard-coded selector list | **4/5** |
| Pointer capture (mouse/pen only) | yes (`safelyChangePointerCapture`) | yes (`safePointerCapture`) | **5/5** |
| Right-click cancels gesture via `contextmenu` window listener | yes | yes | **5/5** |
| Velocity sampling: prefer recent (≤80 ms) frame delta, else gesture average | yes (`MAX_RELEASE_VELOCITY_AGE_MS=80`, `MIN_VELOCITY_DURATION_MS=50`, `MIN_RELEASE_VELOCITY_DURATION_MS=16`) | yes — constants identical | **5/5** |
| Single-deep ring buffer for velocity samples | yes | yes | **5/5** |
| Directional sqrt damping (`applyDirectionalDamping`) | yes | yes | **5/5** |
| `MIN_DRAG_THRESHOLD = 1px` activation gate | yes | uses `4px` for the scrollable-resolver only; no general 1 px gate | **3/5** |
| `REVERSE_CANCEL_THRESHOLD = 10px` (drag back > 10 px past peak cancels dismissal) | yes | **missing** — release decision uses only end-state threshold/velocity | **0/5** |
| Direction lock once one axis crosses 1 px | yes | implicit via fixed-axis (placement decides axis upfront) | **3/5** |
| Cross-axis scroll preservation (≥6 px on perpendicular axis releases native scroll) | yes | not implemented — `pendingScrollable` only resolves intent vs scroll edge | **2/5** |
| `scrollable.ts` ancestor walk + edge detection | yes | yes | **5/5** |
| Selection clearing on swipe start; veto if selection alive on release | yes | not done | **0/5** |
| `data-swipe-ignore` opt-out attribute on descendants | yes | only `[data-drawer-no-drag]` via hard-coded selector | **3/5** |
| `swipeThreshold` as a function | yes | number only | **3/5** |
| `canStart(position, details)` veto callback | yes | none | **0/5** |
| Document-level `touchmove` capture-phase preventDefault during gesture | yes | yes | **5/5** |
| Public hook return surface (`getDragStyles`, `getPointerProps`, `getTouchProps`, `reset`) | yes | only `attachRef` | **2/5** |

**Section score: 3.7/5** — the *physics* are faithful; the *guard rails* (reverse cancel, axis lock, selection veto, cross-axis preserve, function thresholds) are not.

---

## 4. Release animation tuning

| Mechanism | base-ui (`DrawerViewport`) | dotui (`use-swipe-dismiss.ts:155-170`) | Score |
|---|---|---|---|
| `--drawer-swipe-strength` written on dismiss | yes | yes | **5/5** |
| Formula | velocity-bounded duration: `clamp(remaining/velocity, MIN_SWIPE_RELEASE_DURATION_MS=80, MAX_SWIPE_RELEASE_DURATION_MS=360)` then normalized to `[0.1, 1]` | `clamp(remaining/(velocity * SPRING_BACK_MS=300), 0.1, 1)` | **3/5** |
| Constants | `MIN_SWIPE_RELEASE_VELOCITY=0.2`, `MAX=4`, plus duration clamp | velocity unclamped, duration baked into `SPRING_BACK_MS` | **3/5** |
| `FAST_SWIPE_VELOCITY = 0.5 px/ms` instant-close | yes | yes | **5/5** |
| Threshold default | `swipeThresholdProp ?? 40px` (**flat**) | `max(80, size * 0.3)` (**adaptive**) | **n/a — different defaults** |

**Section score: 3.5/5** — close in feel, mathematically distinct.

---

## 5. CSS variable contract

CSS custom properties registered with `inherits:false` for perf:

| Variable | base-ui | dotui | Score |
|---|---|---|---|
| `--drawer-progress` | yes (`<number>`, init `0`) | yes | **5/5** |
| `--drawer-swipe-progress` | yes | yes | **5/5** |
| `--drawer-swipe-strength` | yes | yes | **5/5** |
| `--drawer-swipe-movement-x/-y` | yes (`<length>`) | yes | **5/5** |
| `--drawer-height` | yes | yes | **5/5** |
| `--drawer-frontmost-height` | yes | yes | **5/5** |
| `--nested-drawers` | yes | yes | **5/5** |
| `--drawer-snap-point-offset` | yes | **missing** (no snap points) | **0/5** |

**Data attributes**

| Attribute | base-ui | dotui | Score |
|---|---|---|---|
| `data-swiping` on popup + backdrop | yes | yes | **5/5** |
| `data-swipe-direction` | yes | yes | **5/5** |
| `data-nested-drawer-open` / `data-nested-drawer-swiping` | yes | yes | **5/5** |
| `data-swipe-dismiss` (animation cue when dismissing) | yes | **missing** — relies on RAC's `data-exiting` | **2/5** |
| `data-expanded` (snap point at 1) | yes | n/a | **0/5** |
| `data-open` / `data-closed` / `data-starting-style` / `data-ending-style` | yes | RAC's `data-entering/data-exiting` only — different naming | **3/5** |
| `data-active` / `data-inactive` on Indent | yes | not set; only `data-swiping` and `data-placement` | **2/5** |
| `data-placement` on popup | n/a (uses `data-swipe-direction`) | yes | **n/a — addition** |

**Section score: 4.2/5**

---

## 6. Snap points

`useDrawerSnapPoints` (192 LOC) + viewport snap logic (~400 LOC of `DrawerViewport.tsx`).

| Feature | base-ui | dotui |
|---|---|---|
| Snap point values: `0..1` fraction, `>1` px, `'Xpx'`, `'Xrem'` | yes | none |
| Resolved offsets via `popupHeight - clampedHeight` | yes | none |
| Sequential vs velocity-skip mode | yes | none |
| Velocity-aware target snap selection (`SNAP_VELOCITY_*`, `MAX_SNAP_VELOCITY=4`) | yes | none |
| `--drawer-snap-point-offset` variable | yes | none |
| `data-expanded` on full-open snap | yes | none |
| Controlled `snapPoint` w/ revert-on-cancel via `controlledDismissFrame` | yes | none |
| Damped overshoot above top snap point (sqrt) | yes | none (only damp the *dismiss* axis) |

**Score: 0/5** — out of scope for this rewrite.

---

## 7. SwipeArea (open-by-swipe gesture)

`DrawerSwipeArea.tsx` (481 LOC) vs current port (a 9-line ref-registering `<div>`).

| Feature | base-ui | dotui |
|---|---|---|
| Acts as an off-screen "edge swipe to open" region | yes | **no** — current `DrawerSwipeArea` is just an additional drag-source registration *inside* an already-open drawer (used with `swipeFromHandleOnly`) |
| Tracks open progress, sets `--drawer-swipe-progress = 1 - openProgress` on backdrop | yes | none |
| `DEFAULT_SWIPE_OPEN_RATIO = 0.5` | yes | none |
| `MIN_SWIPE_START_DISTANCE`, `VELOCITY_THRESHOLD = 0.1`, `FALLBACK_SWIPE_OPEN_THRESHOLD = 40` | yes | none |
| Damped overshoot during pull | yes | none |
| `disabled` prop, `swipeDirection` override prop | yes | none |
| `outsidePressEnabledRef` Safari workaround | yes | n/a |
| `data-open/closed/swiping/swipe-direction/disabled` | yes | none |

**Score: 1/5** — same component name; entirely different function.

---

## 8. Visual state store / nested coordination

| Concern | base-ui | dotui | Score |
|---|---|---|---|
| Pub-sub store outside React for high-freq updates | `createNestedSwipeProgressStore` + `DrawerVisualStateStore` (two stores) | one merged `visualStateStore` | **4/5** |
| Tracks: stack, placements, heights, openCount, progress, isSwiping, placement | mostly mirrors via per-drawer ctx | merged in single state | **5/5** |
| Default fallback store (no `<Provider>` needed) | no (provider required) | yes | **n/a — addition** |
| Parent disables its own swipe while nested open | yes (`nestedSwiping` flag on viewport) | **partial** — no automatic disable while a nested child is swiping. Mitigated by native-listener-on-element trick (events don't bubble across portals) but parent's listener is not gated | **3/5** |
| Per-drawer popup-height ResizeObserver feeds parents | yes | yes | **5/5** |
| `--nested-drawers` integer + `--drawer-frontmost-height` write to parent popup | yes | yes | **5/5** |
| `notifyParent*` chain through arbitrary nesting depth | yes | **no** — store is one global per `<DrawerProvider>` scope | **2/5** |
| `eventDetails`-aware open/close cancellation | yes | none | **2/5** |

**Section score: 3.7/5**

---

## 9. Indent / IndentBackground

| Feature | base-ui | dotui | Score |
|---|---|---|---|
| Subscribe to visualStateStore, write `--drawer-progress` directly to DOM | yes | yes | **5/5** |
| Write `--drawer-height` (frontmost height) | yes | **missing** — only `--drawer-progress` and `data-swiping` | **2/5** |
| `data-active` / `data-inactive` toggle | yes | only `data-swiping` and `data-placement` | **3/5** |
| `pointer-events: none` + `aria-hidden` on background | yes | yes | **5/5** |
| Render-once-at-root expectation | yes | yes (documented) | **5/5** |

**Section score: 4.0/5**

---

## 10. Focus, A11y, dialog semantics

| Concern | base-ui | dotui | Score |
|---|---|---|---|
| Focus trap | own implementation | RAC handles | **4/5** — equivalent |
| `Escape` to close, `outsidePress`, scroll lock | yes | RAC defaults | **4/5** |
| `aria-modal`, `role="dialog"`, label/description wiring | via `DrawerTitle`/`DrawerDescription` parts | requires consumer to render `<Dialog>` and use RAC `<Heading>` themselves | **3/5** |
| Android `CloseWatcher` integration | yes | none | **2/5** |
| Fake focus / pointer-up dismissal Safari quirks | handled | not handled | **2/5** |

**Section score: 3.0/5**

---

## 11. Tests

| | base-ui | dotui |
|---|---|---|
| Component test files | `DrawerRoot.test.tsx`, `DrawerPopup.test.tsx`, `DrawerViewport.test.tsx`, `DrawerIndent.test.tsx`, `DrawerIndentBackground.test.tsx`, `DrawerSwipeArea.test.tsx`, `DrawerContent.test.tsx`, `useSwipeDismiss.test.tsx` | none |
| Visual regression / spec | `DrawerRoot.spec.tsx` | none |

**Score: 0/5**

---

## 12. Demos / coverage parity

dotui has: `basic`, `controlled`, `handle-only`, `indent`, `nested`, `non-dismissable`, `placement`, `playground`, `scrollable`, `with-form`. Base UI's docs site adds: snap-points, with-trigger-id (imperative open), backdrop-only (modal=false), trap-focus mode. **Score: 4/5**.

---

## Aggregate scorecard

| Module | Weight | Score |
|---|---:|---:|
| 1. Architectural shape | 3× | 2.5/5 |
| 2. Public API surface | 3× | 2.7/5 |
| 3. `useSwipeDismiss` core | 4× | 3.7/5 |
| 4. Release animation | 2× | 3.5/5 |
| 5. CSS var / data-attr contract | 2× | 4.2/5 |
| 6. Snap points | 3× | **0/5** |
| 7. SwipeArea (open gesture) | 2× | **1/5** |
| 8. Visual store / nesting | 2× | 3.7/5 |
| 9. Indent / IndentBackground | 1× | 4.0/5 |
| 10. A11y / dialog semantics | 2× | 3.0/5 |
| 11. Tests | 1× | 0/5 |
| 12. Demos | 1× | 4.0/5 |
| **Weighted total** | | **≈ 2.7 / 5** |

---

## Improvement backlog (ordered by impact ÷ effort)

**P0 — fast, high-value**
1. Add `REVERSE_CANCEL_THRESHOLD = 10` logic in `handleUp` — track `maxDirectionalMovement`, refuse dismiss if user dragged back >10 px from peak. ~15 LOC.
2. Write `--drawer-height` from `DrawerIndent`/`DrawerIndentBackground`.
3. Add `data-active` / `data-inactive` on Indent + `data-swipe-dismiss` on popup at dismiss start.
4. Tune release-strength to base-ui's duration-clamped formula.

**P1 — medium effort, real behaviour parity**
5. Function-form `swipeThreshold: number | (({ element, direction }) => number)`.
6. `data-swipe-ignore` descendant attribute support in `onPointerDown` skip-test.
7. Cross-axis scroll preservation: detect ≥6 px perpendicular movement → release native scroll.
8. Selection-veto: clear selection on swipe start; cancel if non-empty on release.
9. Auto-disable parent gesture while nested drawer is swiping.

**P2 — bigger lifts**
10. Real `DrawerSwipeArea` open-gesture component.
11. Test coverage for `useSwipeDismiss`.
12. Owned overlay primitive (Option C — see `01-architecture.md`).

**P3 — out of scope (this rewrite)**
- Snap points.
- `eventDetails` close reasons.
- Imperative `useDialogHandle`.
- Android `CloseWatcher`.
