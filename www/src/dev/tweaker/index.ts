/**
 * Dev tweaker — a dev-only floating panel for live design/layout exploration.
 * See ./README.md for the AI workflow and the full API.
 *
 * Public surface:
 * - `useTweak(label, config)` — call inside a feature component you're exploring.
 *   No-op in production (returns `config.default`), and the panel tree-shakes away.
 * - `DevTweaker` — the floating panel; mounted once, dev-gated, in `__root.tsx`.
 */

export { useTweak } from './use-tweak'
export { DevTweaker } from './tweaker'
export type { TweakConfig } from './types'
