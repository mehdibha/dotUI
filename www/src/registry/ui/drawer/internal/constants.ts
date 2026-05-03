// Ported verbatim from Base UI's drawer/swipe-dismiss to preserve drag feel.
// See https://github.com/mui/base-ui packages/react/src/utils/useSwipeDismiss.ts

// MARK: Velocity sampling
export const MIN_VELOCITY_DURATION_MS = 50;
export const MAX_RELEASE_VELOCITY_AGE_MS = 80;
export const MIN_RELEASE_VELOCITY_DURATION_MS = 16;

// Above this px/ms in the dismiss direction at release: dismiss regardless of distance.
export const FAST_SWIPE_VELOCITY = 0.5;

// MARK: Release-strength formula (Sprint 1: duration-clamped, base-ui parity)
//   dur = clamp(remaining/velocity, MIN_DUR, MAX_DUR)
//   scalar = clamp(MIN_SCALAR + (dur - MIN_DUR)/(MAX_DUR - MIN_DUR) * (MAX_SCALAR - MIN_SCALAR), MIN_SCALAR, MAX_SCALAR)
export const MIN_SWIPE_RELEASE_VELOCITY = 0.2;
export const MAX_SWIPE_RELEASE_VELOCITY = 4;
export const MIN_SWIPE_RELEASE_DURATION_MS = 80;
export const MAX_SWIPE_RELEASE_DURATION_MS = 360;
export const MIN_SWIPE_RELEASE_SCALAR = 0.1;
export const MAX_SWIPE_RELEASE_SCALAR = 1;

// MARK: Drag-activation gates
/** Movement on the dismiss axis required before the gesture activates. */
export const MIN_DRAG_THRESHOLD = 1;
/** Movement back from peak (in px) past which a release does NOT dismiss, even if past `swipeThreshold`. */
export const REVERSE_CANCEL_THRESHOLD = 10;
/** Perpendicular movement (in px) before lock → release the gesture so native scroll can take over. */
export const CROSS_AXIS_PRESERVE_THRESHOLD = 6;
/** Default flat threshold (in px) on the dismiss axis past which a release dismisses. */
export const DEFAULT_SWIPE_THRESHOLD = 40;

// MARK: Built-in `pointerdown` skip selector
//
// Interactive descendants never start a drag; `[data-swipe-ignore]` is the
// canonical opt-out (base-ui name); `[data-drawer-no-drag]` is kept as a
// deprecated alias from the v1 port.
export const DEFAULT_IGNORE_SELECTOR =
	"button, a, input, textarea, select, [role='button'], [role='link'], [role='checkbox'], [role='switch'], [role='tab'], [role='menuitem'], [role='option'], [role='radio'], [role='slider'], [contenteditable='true'], [data-swipe-ignore], [data-drawer-no-drag]";
