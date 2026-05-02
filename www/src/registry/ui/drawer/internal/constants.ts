// Ported verbatim from Base UI's drawer/swipe-dismiss to preserve drag feel.
// See https://github.com/mui/base-ui packages/react/src/utils/useSwipeDismiss.ts

export const MIN_VELOCITY_DURATION_MS = 50;
export const MAX_RELEASE_VELOCITY_AGE_MS = 80;
export const MIN_RELEASE_VELOCITY_DURATION_MS = 16;

// Above this px/ms in the dismiss direction at release: dismiss regardless of distance.
export const FAST_SWIPE_VELOCITY = 0.5;

// Spring-back animation defaults.
export const SPRING_BACK_MS = 300;
export const SPRING_BACK_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

// Bounds for the per-flick `--drawer-swipe-strength` scalar.
export const MIN_RELEASE_STRENGTH = 0.1;
export const MAX_RELEASE_STRENGTH = 1;
