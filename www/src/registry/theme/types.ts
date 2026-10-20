import type { StepName } from "@dotui/colors"

export type ModeName = "light" | "dark"

/**
 * Which ramp the primary-action tokens draw from: neutral (black/white) or the
 * brand accent.
 */
export type PrimaryColorSource = "neutral" | "accent"

export type SemanticTarget =
  | { ref: { palette: string; step: StepName } } // → var(--<palette>-<step>)
  | { on: { palette: string; step: "700" | "800" } } // → var(--on-<palette>-<step>)
  | { value: string } // a literal CSS value
  | { mix: [SemanticTarget, number, SemanticTarget] } // → color-mix(in oklab, a <n>%, b)

/** Customizer grouping for a token; the picker filters on it. */
export type SemanticCategory = "background" | "foreground" | "border"

export interface SemanticToken {
  target: SemanticTarget | { light: SemanticTarget; dark: SemanticTarget }
  category: SemanticCategory
  /**
   * Ramp pools the customizer picker may offer for this token; `".."` means
   * "any custom palette". Omitted for solved `on-*` tokens.
   */
  scales?: readonly string[]
  description?: string
}

/** The semantic vocabulary, keyed by token name WITHOUT the leading `--` (e.g. `"color-bg"`). */
export type SemanticVocabulary = Record<string, SemanticToken>

/** The engine's 12-job ladder by job name. */
export const JOB_STEPS = {
  "app-bg": "25",
  "subtle-bg": "50",
  "ui-rest": "100",
  "ui-hover": "200",
  "ui-active": "300",
  "border-subtle": "400",
  "border-interactive": "500",
  "border-emphasized": "600",
  solid: "700",
  "solid-hover": "800",
  "text-muted": "900",
  text: "950",
} as const satisfies Record<string, StepName>

export type JobName = keyof typeof JOB_STEPS

/** A remap destination: a palette + job, resolved to `ref(palette, step)`. */
export interface TokenTargetSpec {
  palette: string
  job: JobName
}

/**
 * A per-token remap: one destination for both modes, or a per-mode pair where
 * a missing mode keeps the token's default target.
 */
export type TokenOverride =
  | TokenTargetSpec
  | { light?: TokenTargetSpec; dark?: TokenTargetSpec }

/** Per-token remaps, keyed by token name (e.g. `"color-card"`). */
export type TokenOverrides = Record<string, TokenOverride>
