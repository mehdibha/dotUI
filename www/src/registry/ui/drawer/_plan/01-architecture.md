# Drawer Rewrite — Architecture & API Surface

**Goal:** behavioural parity with base-ui (gesture quality, nested coordination, CSS contract, edge cases), expressed idiomatically over `react-aria` hooks.

**Out of scope:** snap points; `Title` / `Description` / `Trigger` / `Close` / `Portal` / `Backdrop` (RAC); `eventDetails` close reasons.

---

## 1. Architecture

### 1.1 The structural question

base-ui composes drawers as `Root → Portal → Backdrop → Viewport → Popup`. The split exists because their `Viewport` *hosts the gesture and sizes the panel*, while `Popup` *is the panel*. Two boxes are needed because the gesture host has to be measured (snap-point math).

Wrapping `react-aria-components` `<Modal>` / `<ModalOverlay>` was the v1 approach. It pays a real complexity tax:

- `flushSync(() => overlayState?.close())` in `finishGesture` — racing RAC's exit-animation commit against inline-translate cleanup. Works, fragile.
- Cannot delay close on `onSwipeEnd` to await an in-flight gesture animation — RAC commits `data-exiting` synchronously the moment we call `close()`.
- Animation state vocabulary is RAC's (`entering`/`exiting`), not ours (`open`/`closed`/`starting-style`/`ending-style`). Public CSS contract leaks RAC.
- Two sources of truth: RAC's `OverlayTriggerStateContext` + the `visualStateStore`. Nested-coordination work has to bridge both.

### 1.2 Decision: own the overlay primitive (Option C)

Drop down one layer to `react-aria` hooks: `useOverlayTriggerState`, `useModalOverlay`, `useOverlay`, `useDialog`, `usePreventScroll`, `FocusScope` (contain + restoreFocus), `Overlay` (portal).

Same accessibility guarantees — these hooks *are* what RAC composes from. base-ui drops to the equivalent layer (Floating UI hooks) for the same reason.

What this buys:

- A single state machine we own. Dismiss flow: gesture commits → set our `state` to `ending` → run exit animation → on `transitionend` (or fallback timer) → `closed`, unmount via `Overlay` presence. No `flushSync`, no racing.
- One source of truth (`visualStateStore`). RAC's `OverlayTriggerStateContext` is gone from our internals (we still *read* it from a parent `<DialogTrigger>` for trigger composition).
- A CSS contract owned end-to-end (`data-open` / `data-closed` / `data-starting-style` / `data-ending-style` / `data-swipe-dismiss`).
- Nested coordination simplifies: parent-link via context with no overlay-state mediator.

Cost: ~250–400 LOC of overlay plumbing under our roof.

### 1.3 Component shape

```
<DrawerProvider>            ← required for Indent/IndentBackground to react
  <DrawerIndent>            ← page-content wrapper; reads visualStateStore
    …app…
  </DrawerIndent>
  <DrawerIndentBackground/> ← dark layer; reads visualStateStore

  <DialogTrigger>           ← RAC, user-supplied (state source)
    <Button>…</Button>
    <Drawer>                ← own Overlay + FocusScope + DrawerContext + gesture
      <DrawerHandle/>       ← visible drag affordance (drag source)
      <DrawerDragArea/>     ← invisible drag source (renamed from DrawerSwipeArea)
      …content…
    </Drawer>
  </DialogTrigger>

  <DrawerSwipeArea/>        ← REWRITTEN: edge region that *opens* by swipe
</DrawerProvider>
```

Internals decomposed into:

- `useDrawerState` — wraps `useOverlayTriggerState`; adds the four-phase animation machine (`closed → starting → open → ending`).
- `useDrawerOverlay` — composes `useModalOverlay`, `useDialog`, `usePreventScroll`. Returns spreadable prop bags.
- `useDrawerGesture` — port of base-ui `useSwipeDismiss`. Pure DOM, no JSX. **Internal, not exported.**
- `useDrawerNesting` — registers with `visualStateStore`; sets `--nested-drawers` / `--drawer-frontmost-height`; owns the ResizeObserver.
- `visualStateStore` — pub-sub, two-tier (see §3).
- `DrawerContext` — placement, swipeToDismiss, drag-source registry, parent-link for nested coordination.

### 1.4 Components — finalized list

| Component | Role | Mapping to base-ui |
|---|---|---|
| `Drawer` | Overlay + FocusScope + gesture host + DrawerContext | Root + Viewport + Popup, collapsed |
| `DrawerHandle` | Visible drag affordance; drag source; `cursor-grab`, ARIA `role="presentation"` | `Drawer.Handle` |
| `DrawerDragArea` (renamed) | Invisible drag source; opt-in extra grab regions when `swipeFromHandleOnly` | What the current `DrawerSwipeArea` actually is |
| `DrawerSwipeArea` (rewritten) | Off-screen edge region that **opens** the drawer by swipe | base-ui `Drawer.SwipeArea` |
| `DrawerProvider` | Visual-state scope; coordinates nested drawers | `Drawer.Provider` |
| `DrawerIndent` | Page-content wrapper; subscribes to store; writes `--drawer-progress`, `--drawer-height`, `data-active` | `Drawer.Indent` |
| `DrawerIndentBackground` | Dark layer behind indented page | `Drawer.IndentBackground` |

Renaming `DrawerSwipeArea` → `DrawerDragArea` is a breaking change for current demos. Worth it: the current name lies, and we want the *real* `SwipeArea` later.

### 1.5 What is deliberately not built

- `Drawer.Root` — `OverlayTriggerStateContext` covers it.
- `Drawer.Portal` — `Overlay` portals.
- `Drawer.Backdrop` — the underlay we render inside `<Drawer>`.
- `Drawer.Title/.Description/.Close/.Trigger` — RAC `<Heading>`, `<Button slot="close">`, `<DialogTrigger>`.
- `eventDetails` reason discrimination on close — RAC's `onOpenChange` doesn't carry this.
- Snap points.
- Imperative `useDialogHandle`.

---

## 2. API surface

### 2.1 `<Drawer>` props

```ts
interface DrawerProps {
  placement?: "top" | "bottom" | "left" | "right";       // default "bottom"

  // — gesture —
  swipeToDismiss?: boolean;                              // default true
  swipeFromHandleOnly?: boolean;                         // default false
  swipeThreshold?:
    | number
    | ((ctx: { element: HTMLElement; placement: Placement; size: number }) => number);
  /** Selector for descendants where pointerdown should NOT start a drag. Merged with built-ins. */
  ignoreSelector?: string;

  // — gesture callbacks (mirror base-ui hook) —
  onSwipeStart?: (e: PointerEvent) => void;
  onSwipeMove?:  (info: { progress: number; movement: number }) => void;
  onSwipeEnd?:   (info: { dismissed: boolean; velocity: number }) => void;

  // — overlay / dialog —
  isDismissable?: boolean;                               // default true
  overlayProps?: ComponentProps<"div">;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
```

Notes:
- `placement` not `swipeDirection` — anchor side reads better for an overlay.
- `swipeThreshold` accepts the function form. Default is `40` (drop the current `max(80, size*0.3)`).
- `ignoreSelector` extends a built-in list (`button, a, input, …, [data-drawer-no-drag], [data-swipe-ignore]`).
- `[data-swipe-ignore]` is the supported opt-out (base-ui name); `[data-drawer-no-drag]` kept as deprecated alias.

### 2.2 `<DrawerHandle>` / `<DrawerDragArea>`

```ts
interface DrawerHandleProps   extends ComponentProps<"div"> {} // visible
interface DrawerDragAreaProps extends ComponentProps<"div"> {} // invisible
```

Both register as drag sources via `DrawerContext.registerDragSource`.

### 2.3 `<DrawerSwipeArea>` (rewritten)

```ts
interface DrawerSwipeAreaProps extends ComponentProps<"div"> {
  /** Direction the swipe must travel to open. Defaults to opposite of `placement`. */
  swipeDirection?: "up" | "down" | "left" | "right";
  disabled?: boolean;
  /** Distance threshold to commit to opening. Default min(size*0.5, 40). */
  threshold?: number;
}
```

Sets `data-open / data-closed / data-swiping / data-swipe-direction / data-disabled`.
Writes `--drawer-swipe-progress` on the linked backdrop while pulling.

### 2.4 `<DrawerProvider>` / `<DrawerIndent>` / `<DrawerIndentBackground>`

Same signatures as today. Behavioural changes:
- `<DrawerProvider>` is **required** for `<DrawerIndent>` / `<DrawerIndentBackground>` — they throw a dev-only error otherwise.
- Both Indent components additionally write `--drawer-height` and toggle `data-active`/`data-inactive`.

### 2.5 `useDrawerGesture` — internal

Not exported from the package (matches base-ui's stance on `useSwipeDismiss`).

```ts
function useDrawerGesture(opts: {
  modalRef: RefObject<HTMLElement | null>;
  underlayRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  isDismissable: boolean;
  placement: Placement;
  swipeFromHandleOnly: boolean;
  handleSources: RefObject<Set<HTMLElement>>;
  swipeThreshold?: number | ((ctx) => number);
  ignoreSelector?: string;
  onDismiss: () => void;
  onProgress?: (progress: number, isSwiping: boolean) => void;
  onSwipeStart?: (e: PointerEvent) => void;
  onSwipeEnd?: (info: { dismissed: boolean; velocity: number }) => void;
}): {
  attachRef: (el: HTMLElement | null) => void;
  swiping: boolean;
  reset: () => void;
};
```

### 2.6 CSS variable / data-attribute contract (frozen)

Variables (all `registerProperty(inherits:false)`):
```
--drawer-progress              <number>  0..1, written by Indent/IndentBackground
--drawer-swipe-progress        <number>  0..1, written by Drawer + Backdrop during swipe
--drawer-swipe-strength        <number>  0.1..1, release-duration multiplier
--drawer-swipe-movement-x/-y   <length>  raw drag offset
--drawer-height                <length>  drawer's own height (also Indent/IndentBackground)
--drawer-frontmost-height      <length>  topmost drawer's height
--nested-drawers               <number>  stack depth above this drawer
```

Data attributes:
```
[data-placement]                 on Drawer panel (and Indent during swipe)
[data-open] / [data-closed]      on panel + underlay
[data-starting-style]            during enter animation (before next frame)
[data-ending-style]              during exit animation
[data-swipe-dismiss]             on the dismissing frame (NEW)
[data-swiping]                   on Drawer, underlay, Indent, IndentBackground during gesture
[data-swipe-direction]           on Drawer + underlay during swipe
[data-nested-drawer-open]        on Drawer when has children above it
[data-nested-drawer-swiping]     on Drawer when topmost child is being swiped
[data-active] / [data-inactive]  on Indent, IndentBackground (NEW)
[data-swipe-ignore]              read on descendants to skip drag start (NEW; opt-out)
[data-drawer-no-drag]            DEPRECATED alias of data-swipe-ignore
```

This is the public CSS contract — consumers will style against it.

### 2.7 Behavioural contract (the parity bar)

The rewrite passes when all 8 scenarios hold:

1. **Threshold dismiss** — slow drag past 40 px threshold → dismiss.
2. **Velocity dismiss** — short drag, fast flick → dismiss with release-strength `<1`.
3. **Reverse cancel** — drag past threshold, drag back ≥10 px from peak → does not dismiss.
4. **Axis lock** — once 1 px crossed on an axis, perpendicular movement rejected.
5. **Cross-axis scroll preservation** — ≥6 px perpendicular before activation hands gesture to native scroll.
6. **Scroll-edge gating** — drag inside scrollable doesn't close until at edge in dismiss direction.
7. **Selection veto** — selecting text never starts a drag; non-empty selection on release cancels.
8. **Nested coordination** — parent gesture suspended while child swiping; `--drawer-frontmost-height` / `--nested-drawers` resolve correctly.

---

## 3. Visual-state store — two-tier

Single store today. Problem: nested drawers in *separate* provider scopes can't coordinate. Base-ui solves this with parent context propagation.

Proposal:

- **Tier 1 — `visualStateStore`** (per `<DrawerProvider>`). Tracks the open *stack* across siblings. Indent / IndentBackground subscribe here. Same shape as today.
- **Tier 2 — `DrawerContext`** carries a `parentDrawer` reference; nested drawer publishes `nestedSwiping` + height upward via the parent's context, not the global store. Parent reads its own children, gates its gesture (`enabled = isOpen && swipeToDismiss && !childIsSwiping`).

Correct behaviour for:
- Sibling drawers in same provider (current model — still works).
- A drawer rendered inside another drawer (current model breaks topmost-detection corner case — fixed).

---

## 4. Release physics

Adopt base-ui's duration-clamped formula and constants verbatim:

```
MIN_SWIPE_RELEASE_VELOCITY  = 0.2
MAX_SWIPE_RELEASE_VELOCITY  = 4
MIN_SWIPE_RELEASE_DURATION_MS = 80
MAX_SWIPE_RELEASE_DURATION_MS = 360
MIN_SWIPE_RELEASE_SCALAR    = 0.1
MAX_SWIPE_RELEASE_SCALAR    = 1
```

Formula: `dur = clamp(remaining/velocity, 80, 360 ms)` → normalize to `[0.1, 1]`. Bounded duration, predictable feel. Replaces the current `clamp(remaining/(velocity*300), 0.1, 1)`.

---

## 5. Resolved questions

1. **`DrawerSwipeArea` → `DrawerDragArea` rename + reclaim `SwipeArea`** for the open gesture: **yes**.
2. **Module-default `visualStateStore`**: **removed** — `<DrawerProvider>` required (matches base-ui).
3. **Export `useDrawerGesture`**: **no, internal** (matches base-ui).
4. **`onSwipeStart/Move/End` callbacks** on `<Drawer>`: **yes**.
5. **CSS-var registration scope**: **first-mount via `useEffect`** (matches base-ui).
