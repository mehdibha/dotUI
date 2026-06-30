/**
 * Dev tweaker — type definitions.
 *
 * The tweaker is dev-only tooling (see ./README.md): an AI agent adds `useTweak`
 * calls to a feature component while you explore designs/layouts, and the floating
 * panel lets you flip between the options live. None of this ships to production.
 */

export interface BaseTweakConfig {
  /** Heading the control is grouped under in the panel. Defaults to "default". */
  group?: string
}

export interface BooleanTweakConfig extends BaseTweakConfig {
  type: 'boolean'
  default: boolean
}

export interface SelectTweakConfig extends BaseTweakConfig {
  type: 'select'
  /** The choices. Each string is both the option's label and its value. */
  options: readonly string[]
  default: string
}

export interface NumberTweakConfig extends BaseTweakConfig {
  type: 'number'
  default: number
  /** When both `min` and `max` are set the control renders as a slider. */
  min?: number
  max?: number
  step?: number
}

export interface ColorTweakConfig extends BaseTweakConfig {
  type: 'color'
  /** Any CSS color string (e.g. "#635bff", "hsl(217 91% 60%)"). */
  default: string
}

export interface TextTweakConfig extends BaseTweakConfig {
  type: 'text'
  default: string
}

export type TweakConfig =
  | BooleanTweakConfig
  | SelectTweakConfig
  | NumberTweakConfig
  | ColorTweakConfig
  | TextTweakConfig

type SelectOptionValue<O> = O extends readonly (infer E)[] ? E : string

/**
 * The value a given config resolves to. A `select` narrows to the union of its
 * options (when `useTweak` is called with a `const`-inferred config), so
 * `useTweak('Layout', { type: 'select', options: ['a', 'b'], default: 'a' })`
 * is typed `'a' | 'b'`.
 */
export type TweakValue<C extends TweakConfig> = C extends BooleanTweakConfig
  ? boolean
  : C extends NumberTweakConfig
    ? number
    : C extends SelectTweakConfig
      ? SelectOptionValue<C['options']>
      : string

/** A control currently mounted in a feature component (lives only while mounted). */
export interface RegisteredControl {
  id: string
  label: string
  group: string
  /** Stable source-order index, assigned on first registration and persisted. */
  order: number
  /** How many mounted components reference this id (ref-counted register/unregister). */
  refCount: number
  /** `useId()` of the first registrant — used to warn on a true id collision. */
  ownerToken: string
  config: TweakConfig
}

/** Floating-panel chrome state. */
export interface TweakerUiState {
  /** Whether the popover panel is open (the docked trigger is always visible). */
  open: boolean
  /** Which edge the trigger is docked to. */
  side: 'left' | 'right'
  /** Vertical position of the trigger as a fraction (0–1) of the viewport height. */
  y: number
}

/** What we persist to localStorage. Versioned so a schema change can drop it cleanly. */
export interface PersistedTweakerState {
  v: 1
  /** Chosen values, keyed by control id. Outlives any single control's mount. */
  values: Record<string, unknown>
  /** Stable order index per id, so the panel doesn't reshuffle across reloads. */
  order: Record<string, number>
  ui: TweakerUiState
}
