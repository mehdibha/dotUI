# Drawer Rewrite — Sprint Plan

5 sprints × 1 week. Each sprint ships a green branch (typecheck + tests + demos working). No half-states between sprints.

**Locked decisions** — see `01-architecture.md §5`.
**Parity bar (8 scenarios)** — see `01-architecture.md §2.7`.
**CSS / data-attr contract** — see `01-architecture.md §2.6`.

---

## Sprint 0 — Overlay primitive on react-aria hooks

**Goal:** Replace the RAC `<Modal>` / `<ModalOverlay>` wrapper with an owned overlay built from `react-aria` hooks. No behavioural change visible to consumers; gesture wiring stays as today (cleaned up to use `state.close()` directly instead of `flushSync`).

### Deliverables

1. **File layout**
   ```
   internal/
     overlay/
       use-drawer-state.ts        # phase machine on top of useOverlayTriggerState
       use-drawer-overlay.ts      # composes useModalOverlay + useDialog + scroll lock
       overlay.tsx                # <DrawerOverlay> = portal + FocusScope + underlay + panel
     context.ts                   # DrawerContext (unchanged)
     visual-state-store.ts        # unchanged
     use-drawer-gesture.ts        # current use-swipe-dismiss, renamed (placeholder)
     use-scrollable.ts            # unchanged
     constants.ts                 # unchanged
     index.tsx                    # <Drawer>, <DrawerHandle>, …
   ```

2. **Phase machine (`useDrawerState`)**
   ```
   closed ─ open() ─▶ starting ── rAF ──▶ open
   open ─ close() ─▶ ending ── transitionend ──▶ closed (unmount)
   ```
   Reads parent `OverlayTriggerStateContext` if present; creates own `useOverlayTriggerState` otherwise.

3. **`useDrawerOverlay`** — composes `useModalOverlay`, `useDialog`, `usePreventScroll`. Returns spreadable `overlayProps` / `modalProps` / `underlayProps`.

4. **`<DrawerOverlay>` shell** — `Overlay` (portal) → `FocusScope contain restoreFocus` → underlay div → modal div. Unmounts when phase is `closed`.

5. **Public `<Drawer>`** — same prop signature as today. Internally renders `<DrawerOverlay>` and forwards refs / className / style.

6. **CSS contract migration** — `entering:` / `exiting:` Tailwind variants in `styles.ts` swapped for `data-[starting-style]:` / `data-[ending-style]:`.

7. **Demos verified** — `basic`, `placement`, `controlled`, `non-dismissable`, `with-form`, `scrollable`, `handle-only` all functional.

### Exit criteria

- `grep -r "react-aria-components/Modal\|react-aria-components/ModalOverlay" internal/` returns empty.
- All 9 demos render, open, close, restore focus, lock scroll.
- Existing gesture still works (calls `state.close()` directly, no `flushSync`).
- TypeScript clean.

### Risks

- **Portal target / SSR.** `react-aria`'s `Overlay` uses `OverlayContainerProvider` if present, else `document.body`. Mitigation: render-after-mount guard; document `<OverlayProvider>` setup in migration doc.
- **`useEnterAnimation` / `useExitAnimation`.** Private API in RAC. Skip — implement the four-state machine manually.
- **`<DialogTrigger>` interop.** Verify `OverlayTriggerStateContext` reads cleanly when `<Drawer>` is the trigger's child. Single integration test in `basic.tsx` is the proof.
- **Scroll-lock visual viewport.** `usePreventScroll` interacts with mobile virtual keyboard; verify `--visual-viewport-height` still resolves correctly in existing styles.

---

## Sprint 1 — Gesture core hardening

**Goal:** `useDrawerGesture` reaches base-ui's physics + guard rails. No architectural changes.

### Deliverables

1. **Release formula** — replace `SPRING_BACK_MS`-based math with duration-clamped formula:
   ```
   MIN_SWIPE_RELEASE_VELOCITY  = 0.2
   MAX_SWIPE_RELEASE_VELOCITY  = 4
   MIN_SWIPE_RELEASE_DURATION_MS = 80
   MAX_SWIPE_RELEASE_DURATION_MS = 360
   MIN_SWIPE_RELEASE_SCALAR    = 0.1
   MAX_SWIPE_RELEASE_SCALAR    = 1
   ```

2. **`REVERSE_CANCEL_THRESHOLD = 10`** — track `maxDirectionalMovement`; refuse dismiss when user drags ≥10 px back from peak.

3. **`MIN_DRAG_THRESHOLD = 1`** — gesture only activates after 1 px on the dismiss axis.

4. **Axis lock** — once locked, perpendicular movement is rejected for the gesture lifetime.

5. **Cross-axis scroll preservation** — ≥6 px perpendicular before lock → mark `rejected = true`, native scroll proceeds.

6. **Selection veto** — `getSelection()?.removeAllRanges()` on swipe start; on release, if selection is non-empty inside the popup, treat as cancel.

7. **`swipeThreshold: number | (ctx => number)`** — function form supported. Default `40` (drop current `max(80, size*0.3)`).

8. **`ignoreSelector`** — consumer selector merged with built-in list; `[data-swipe-ignore]` added (canonical); `[data-drawer-no-drag]` kept as deprecated alias.

9. **`data-swipe-dismiss`** — set on the panel for the dismissing frame.

10. **Callbacks** — `onSwipeStart(e)`, `onSwipeMove({ progress, movement })`, `onSwipeEnd({ dismissed, velocity })` plumbed through `<Drawer>`.

11. **Rename** `use-swipe-dismiss.ts` → `use-drawer-gesture.ts`.

### Exit criteria

- Manual run-through of the 8-scenario contract passes in `playground.tsx`.
- Threshold default change (`max(80, size*0.3)` → `40`) noted in migration draft.
- TypeScript clean.

### Risks

- **Selection-veto false positives** in editable content. Skip the veto when `target.closest('[contenteditable], textarea, input')` — already fails the interactive-skip guard but worth an explicit assertion.
- **Cross-axis preservation vs scroll-edge gating ordering** — perpendicular check must run **before** the scrollable resolver, otherwise we lock the axis prematurely on diagonal flicks.

---

## Sprint 2 — Visual store, nesting, component shape

**Goal:** Two-tier coordination model + Indent/IndentBackground reach base-ui parity + `DrawerSwipeArea` → `DrawerDragArea` rename.

### Deliverables

1. **`<DrawerProvider>` required** — `<DrawerIndent>` / `<DrawerIndentBackground>` throw a dev-only error when no provider is in scope. Module-default store removed.

2. **`DrawerContext` parent-link** — each `<Drawer>` sees the nearest ancestor drawer's context; publishes `nestedSwiping` upward via that link, not via the global store.

3. **Parent gesture gating** — `<Drawer>`'s gesture is `enabled = isOpen && swipeToDismiss && !childIsSwiping`.

4. **Indent / IndentBackground updates**
   - Write `--drawer-height` (frontmost) on both.
   - Toggle `data-active` / `data-inactive` based on `store.openCount > 0`.
   - Keep existing `--drawer-progress`, `data-swiping`, `data-placement`.

5. **Rename**
   - `DrawerSwipeArea` → `DrawerDragArea` (invisible drag-source registration).
   - All demos updated.
   - `DrawerSwipeArea` export temporarily re-aliased with deprecation JSDoc — removed at end of Sprint 3.

6. **First-mount CSS-var registration** — confirm regression-free; move from module-load if currently there.

7. **Demo update** — `nested.tsx` exercises parent-gating; verify visually.

### Exit criteria

- 8-scenario contract still green.
- Nesting test: drag on a child does not move the parent panel; releasing the child re-enables the parent's gesture.
- All Indent/IndentBackground attributes/vars from the contract land in the DOM.

### Risks

- **Provider-required is a breaking change** for any consumer using `<DrawerIndent>` standalone. Mitigation: clear migration note + dev-only error message linking to it.
- **Parent-link via context** during render must not cause re-render loops. Implementation uses refs + DOM mutation for the swiping flag, only ctx for static identity (id, placement).

---

## Sprint 3 — `<DrawerSwipeArea>` (open-by-swipe)

**Goal:** Off-screen edge component that opens the drawer with a swipe. Net-new code; touches no existing path.

### Deliverables

1. **Component skeleton** — `<DrawerSwipeArea>` renders a positioned `<div>`. Uses `useDrawerState` (read via context) to call `state.open()`.

2. **Constants (port verbatim)**
   ```
   DEFAULT_SWIPE_OPEN_RATIO       = 0.5
   MIN_SWIPE_START_DISTANCE       = 1
   VELOCITY_THRESHOLD             = 0.1
   FALLBACK_SWIPE_OPEN_THRESHOLD  = 40
   ```

3. **Damped overshoot** — `clampedDisplacement > closedOffset ? closedOffset + sqrt(overshoot) : clampedDisplacement`.

4. **Backdrop progress** — write `--drawer-swipe-progress = 1 - openProgress` on the linked overlay element while pulling.

5. **Open commit** — at threshold met OR velocity ≥ `VELOCITY_THRESHOLD`, call `state.open()`.

6. **Data attributes** — `data-open` / `data-closed` / `data-swiping` / `data-swipe-direction` / `data-disabled`.

7. **Safari `outsidePress` workaround** — equivalent of base-ui's `outsidePressEnabledRef` + `setTimeout(0)` re-enable on release.

8. **Props** — `swipeDirection?`, `disabled?`, `threshold?`.

9. **Drop the deprecated alias** — `DrawerSwipeArea` (Sprint 2 alias) removed; the export now points to this component.

10. **New demo** — `demos/swipe-to-open.tsx`.

### Exit criteria

- Edge swipe opens the drawer.
- Slow pull below threshold returns to closed (damped).
- `disabled` fully suppresses gesture.
- Touching the SwipeArea while drawer is open does not interfere with dismiss.

### Risks

- **Safari outside-press race** — the late tap-as-outside-press fires after our open commit. Mitigation: re-enable `outsidePress` on next tick (`setTimeout(0)`), matching base-ui.
- **Z-index / pointer-events** between SwipeArea, open-state backdrop, and panel. Document recommended stacking in the contract doc.

---

## Sprint 4 — Tests, parity contract, polish

**Goal:** Lock the parity bar with automation. Polish docs.

### Deliverables

1. **`use-drawer-gesture.test.ts`** — adapted from base-ui's `useSwipeDismiss.test.tsx`. Cases: threshold dismiss, velocity dismiss, reverse-cancel, axis lock, cross-axis preserve, scroll-edge gating, selection veto, nested gating, function `swipeThreshold`, `[data-swipe-ignore]` opt-out.

2. **Component tests** — `<Drawer>` open/close/focus/scroll-lock; `<DrawerHandle>` / `<DrawerDragArea>` source registration; `<DrawerSwipeArea>` open commit; `<DrawerProvider>` required-for-indent enforcement; `<DrawerIndent>` data-attr writes; nested parent-gating.

3. **`tests/parity.test.tsx`** — single file walking the 8-scenario contract end-to-end. Build gate.

4. **CSS contract test** — assert all expected `inherits:false` properties register without throwing on a fresh `document`.

5. **JSDoc pass** on every exported type in `types.ts` and `base.tsx`.

6. **`internal/CONTRACT.md`** — frozen list of public CSS vars + data-attrs (mirrors `01-architecture.md §2.6`).

7. **`MIGRATION.md`** — entries for: Option C overlay change (no consumer-visible API break beyond enter/exit attribute names if styled against), `DrawerSwipeArea` rename, threshold default `80→40`, `<DrawerProvider>` required for Indent.

### Exit criteria

- All tests green in CI.
- `tests/parity.test.tsx` runs as part of the standard test command.
- Docs land alongside the code.

### Risks

- **JSDOM PointerEvent gaps** — JSDOM doesn't natively dispatch pointer events with proper coordinates. Mitigation: `@testing-library/user-event` v14's pointer API or manual `dispatchEvent(new PointerEvent(...))` in gesture tests.
- **`transitionend` timing in tests** — may need fake timer + manual `transitionend` dispatch for the phase machine. Add a `__TEST__` escape hatch (`onPhaseChange` callback or sync close) in `useDrawerState` if necessary.

---

## Cross-sprint risks

| Risk | Affected | Mitigation |
|---|---|---|
| `Overlay` portal target SSR-unsafe | Sprint 0 | Render-after-mount guard; document `<OverlayProvider>` setup. |
| Two-tier store re-renders parent on every child swipe frame | Sprint 2 | DOM mutation + ref, no setState; ctx carries identities only. |
| `transitionend` doesn't fire (transition cancelled) | Sprint 0 | Fallback timeout = `MAX_SWIPE_RELEASE_DURATION_MS + 50ms` to force phase to `closed`. |
| RAC version bump changes `OverlayTriggerStateContext` shape | All | Pinned via `vendor/*.tgz`; revisit on bump. |
| Tailwind `entering:` / `exiting:` variants used elsewhere in codebase | Sprint 0 | Grep `entering:|exiting:` outside drawer; update only drawer styles. |

---

## Schedule summary

| Sprint | Goal | Output |
|---|---|---|
| 0 | Overlay primitive on react-aria hooks | `<Drawer>` no longer wraps RAC `<Modal>`; phase machine; demos green |
| 1 | Gesture hardening | base-ui physics + 8-scenario contract green manually |
| 2 | Visual store + nesting + rename | Two-tier store; provider required; `DrawerDragArea` |
| 3 | `<DrawerSwipeArea>` rewrite | Open-by-swipe component live |
| 4 | Tests + docs | Contract suite gates merges; CONTRACT.md + MIGRATION.md |

**Total: 5 weeks.**

Optional Sprint 5 buffer — drop unless something slips.
