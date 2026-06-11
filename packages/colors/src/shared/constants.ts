/** Default 11-step scale names. Producers may emit any step set via `ModeCtx.steps`. */
export const SCALE_STEPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const

/**
 * Default seed hues for the optional status palettes (used when toggled on with `true`).
 * Typed with explicit status keys so `SEMANTIC_COLORS.info` is `string` for direct
 * consumers, while the index signature keeps dynamic `SEMANTIC_COLORS[name]` lookups working.
 */
export const SEMANTIC_COLORS: Record<string, string> &
  Record<'success' | 'danger' | 'warning' | 'info', string> = {
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#eab308',
  info: '#3b82f6',
}

/** Default modes when none are provided. */
export const DEFAULT_MODES = {
  light: true,
  dark: true,
} as const
