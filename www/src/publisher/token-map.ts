/**
 * The static token pools the publisher's class rewriter resolves through:
 * `rounded-(--alert-radius)` → `rounded-md` when the var chain lands on
 * `--radius-md`. Values are CSS var references (`--radius-md`) or literals
 * (`0`, `none`); `suffix` is the Tailwind utility suffix.
 *
 * Not in these pools — spacing (emitted as arbitrary values), color (kept as
 * vars in the base item), font-size (unused) — ships as var references.
 */

export interface TokenOption {
  /** Human-readable label for the picker. */
  label: string
  /** Preset value. Either a CSS var reference (`--radius-md`) or a literal (`0`, `none`). */
  value: string
  /**
   * Tailwind utility suffix when this value is picked.
   * Example: `--radius-md` → `md` so `rounded-(--btn-radius)` becomes `rounded-md`.
   */
  suffix: string
}

export const RADIUS_OPTIONS: readonly TokenOption[] = [
  { label: "none", value: "0", suffix: "none" },
  { label: "xs", value: "--radius-xs", suffix: "xs" },
  { label: "sm", value: "--radius-sm", suffix: "sm" },
  { label: "md", value: "--radius-md", suffix: "md" },
  { label: "lg", value: "--radius-lg", suffix: "lg" },
  { label: "xl", value: "--radius-xl", suffix: "xl" },
  { label: "2xl", value: "--radius-2xl", suffix: "2xl" },
  { label: "3xl", value: "--radius-3xl", suffix: "3xl" },
  { label: "4xl", value: "--radius-4xl", suffix: "4xl" },
  { label: "full", value: "--radius-full", suffix: "full" },
]

export const BLUR_OPTIONS: readonly TokenOption[] = [
  { label: "None", value: "0px", suffix: "none" },
  { label: "Extra Small", value: "--blur-xs", suffix: "xs" },
  { label: "Small", value: "--blur-sm", suffix: "sm" },
  { label: "Medium", value: "--blur-md", suffix: "md" },
  { label: "Large", value: "--blur-lg", suffix: "lg" },
  { label: "Extra Large", value: "--blur-xl", suffix: "xl" },
]

export const OPACITY_OPTIONS: readonly TokenOption[] = [
  { label: "20%", value: "20%", suffix: "20" },
  { label: "40%", value: "40%", suffix: "40" },
  { label: "60%", value: "60%", suffix: "60" },
  { label: "80%", value: "80%", suffix: "80" },
]

export const SHADOW_OPTIONS: readonly TokenOption[] = [
  { label: "None", value: "none", suffix: "none" },
  { label: "Extra Small", value: "--shadow-xs", suffix: "xs" },
  { label: "Small", value: "--shadow-sm", suffix: "sm" },
  { label: "Medium", value: "--shadow-md", suffix: "md" },
  { label: "Large", value: "--shadow-lg", suffix: "lg" },
  { label: "Extra Large", value: "--shadow-xl", suffix: "xl" },
  { label: "2XL", value: "--shadow-2xl", suffix: "2xl" },
]

export const CURSOR_OPTIONS: readonly TokenOption[] = [
  {
    label: "Interactive",
    value: "--cursor-interactive",
    suffix: "interactive",
  },
  { label: "Disabled", value: "--cursor-disabled", suffix: "disabled" },
  { label: "Default", value: "default", suffix: "default" },
  { label: "Pointer", value: "pointer", suffix: "pointer" },
  { label: "Grab", value: "grab", suffix: "grab" },
  { label: "Grabbing", value: "grabbing", suffix: "grabbing" },
  { label: "Not allowed", value: "not-allowed", suffix: "not-allowed" },
  { label: "Wait", value: "wait", suffix: "wait" },
  { label: "Help", value: "help", suffix: "help" },
  { label: "Crosshair", value: "crosshair", suffix: "crosshair" },
  { label: "Text", value: "text", suffix: "text" },
  { label: "Move", value: "move", suffix: "move" },
  { label: "Progress", value: "progress", suffix: "progress" },
]

const TOKEN_POOLS = [
  RADIUS_OPTIONS,
  BLUR_OPTIONS,
  OPACITY_OPTIONS,
  SHADOW_OPTIONS,
  CURSOR_OPTIONS,
]

/**
 * Map a token var reference (`--radius-md`) to its Tailwind suffix by
 * searching every static pool. For callers that don't know the token type —
 * the styles.css default-seeding path. Only var-shaped values are looked up:
 * literal option values (`0`, `none`, `40%`) are ambiguous across pools.
 */
export function tokenRefToSuffix(ref: string): string | undefined {
  if (!ref.startsWith("--")) return undefined
  for (const options of TOKEN_POOLS) {
    const hit = options.find((opt) => opt.value === ref)
    if (hit) return hit.suffix
  }
  return undefined
}
