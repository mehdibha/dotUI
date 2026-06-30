/**
 * Dev tweaker — the store.
 *
 * A framework-free singleton (so it's unit-testable without React and tree-shakes
 * out of production via the `useTweak` build-constant split in ./use-tweak.ts).
 * Mirrors the localStorage + useSyncExternalStore pattern of
 * `@/modules/create/preset/storage.ts`, with two deliberate twists:
 *
 *   1. Value lifetime ≠ control lifetime. `values` (live, chosen values) is NEVER
 *      cleared when a control unmounts — only `controls` (the mounted set the panel
 *      renders) is ref-counted in/out. That's what makes a choice survive React
 *      StrictMode's double-invoke, an HMR edit to the feature file, and route
 *      remounts.
 *
 *   2. On-disk snapshot (`persisted`) is kept separate from `values`, and a value
 *      only moves into `values` when its control *registers* (in a mount effect).
 *      So `getValue` returns `undefined` (→ the hook falls back to the default)
 *      during SSR and the first client render, and the stored choice is applied
 *      only after mount — no hydration mismatch when a tweak changes the DOM.
 *
 * Keep this module side-effect-free at the top level (all `window`/`localStorage`
 * access lives inside `typeof window`-guarded functions) so production DCE can drop
 * it entirely.
 */

import type {
  PersistedTweakerState,
  RegisteredControl,
  TweakConfig,
  TweakerUiState,
} from './types'

const STORAGE_KEY = 'dotui:tweaker'

const DEFAULT_UI: TweakerUiState = {
  open: false,
  side: 'right',
  y: 0.5,
}

/* ------------------------------ module state ------------------------------ */

const controls = new Map<string, RegisteredControl>()
const values = new Map<string, unknown>() // live, chosen this session
const persisted = new Map<string, unknown>() // last on-disk snapshot (seed source)
const order = new Map<string, number>()
let ui: TweakerUiState = DEFAULT_UI
let nextOrder = 0
let loaded = false

const listeners = new Set<() => void>()

// useSyncExternalStore demands referentially-stable snapshots: rebuild the sorted
// control list only when the set actually changes, and hand back the cached array
// otherwise. The `ui` object is likewise replaced (never mutated) on change.
let controlListSnapshot: RegisteredControl[] = []
let controlListDirty = true
const EMPTY_CONTROLS: RegisteredControl[] = []

/* -------------------------------- helpers --------------------------------- */

function idFor(label: string, group: string): string {
  return `${group}::${label}`
}

/** Validate/repair a stored value against the control's *current* config. */
export function coerceTweakValue(config: TweakConfig, raw: unknown): unknown {
  switch (config.type) {
    case 'boolean':
      return typeof raw === 'boolean' ? raw : config.default
    case 'number': {
      if (typeof raw !== 'number' || Number.isNaN(raw)) return config.default
      const min = config.min ?? Number.NEGATIVE_INFINITY
      const max = config.max ?? Number.POSITIVE_INFINITY
      return Math.min(Math.max(raw, min), max) // snap into the current range
    }
    case 'select':
      return typeof raw === 'string' && config.options.includes(raw)
        ? raw
        : config.default
    case 'color':
      return typeof raw === 'string' && raw.length > 0 ? raw : config.default
    case 'text':
      return typeof raw === 'string' ? raw : config.default
    default:
      return (config as TweakConfig).default
  }
}

function ensureLoaded(): void {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as PersistedTweakerState
    if (parsed?.v !== 1) return
    for (const [k, val] of Object.entries(parsed.values ?? {}))
      persisted.set(k, val)
    for (const [k, o] of Object.entries(parsed.order ?? {})) {
      order.set(k, o)
      nextOrder = Math.max(nextOrder, o + 1)
    }
    if (parsed.ui) ui = { ...DEFAULT_UI, ...parsed.ui }
  } catch {
    // Corrupt/disabled storage — start clean. Non-fatal for a dev tool.
  }
}

function persist(): void {
  if (typeof window === 'undefined') return
  try {
    // Live values win over the on-disk snapshot; orphans (persisted but not mounted
    // this session) are preserved so a choice isn't lost by navigating away.
    const merged: Record<string, unknown> = {
      ...Object.fromEntries(persisted),
      ...Object.fromEntries(values),
    }
    const data: PersistedTweakerState = {
      v: 1,
      values: merged,
      order: Object.fromEntries(order),
      ui,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Private mode / quota — the tweaker just won't persist this session.
  }
}

function notify(): void {
  for (const l of listeners) l()
}

/* ------------------------------ registration ------------------------------ */

/** Register (or re-register) a control. Idempotent and ref-counted. Returns its id. */
export function registerControl(
  label: string,
  config: TweakConfig,
  ownerToken: string,
): string {
  ensureLoaded()
  const group = config.group ?? 'default'
  const id = idFor(label, group)
  const existing = controls.get(id)

  if (existing) {
    existing.refCount += 1
    existing.config = config
    // HMR may have changed options/min/max — re-validate the held value.
    values.set(id, coerceTweakValue(config, values.get(id)))
    if (existing.ownerToken !== ownerToken && import.meta.env.DEV) {
      console.warn(
        `[tweaker] duplicate control id "${id}". Give one a different \`group\` or \`label\`; last writer wins and the value is shared.`,
      )
    }
  } else {
    let o = order.get(id)
    if (o === undefined) {
      o = nextOrder++
      order.set(id, o)
    }
    // Seed from the on-disk value (if any) coerced to this config, else default.
    const seed = values.has(id) ? values.get(id) : persisted.get(id)
    values.set(id, coerceTweakValue(config, seed))
    controls.set(id, {
      id,
      label,
      group,
      order: o,
      refCount: 1,
      ownerToken,
      config,
    })
    controlListDirty = true
  }

  persist()
  notify()
  return id
}

/** Drop one mount's reference. Removes the control from the panel at zero refs; never clears its value. */
export function unregisterControl(id: string): void {
  const control = controls.get(id)
  if (!control) return
  control.refCount -= 1
  if (control.refCount <= 0) {
    controls.delete(id)
    controlListDirty = true
    notify()
  }
}

/** Write a value (coerced against the control's config when registered). No-ops on an equal value. */
export function setValue(id: string, raw: unknown): void {
  ensureLoaded()
  const control = controls.get(id)
  const next = control ? coerceTweakValue(control.config, raw) : raw
  if (Object.is(values.get(id), next)) return // prevent controlled-input ping-pong
  values.set(id, next)
  persist()
  notify()
}

/** Reset one control to its config default. */
export function resetControl(id: string): void {
  const control = controls.get(id)
  if (!control) return
  setValue(id, control.config.default)
}

/** Reset every currently-mounted control to its default. */
export function resetAll(): void {
  for (const control of controls.values()) {
    values.set(control.id, control.config.default)
  }
  persist()
  notify()
}

/* -------------------------------- reads ----------------------------------- */

/**
 * The live value for an id, or `undefined` if no control has registered it yet
 * this session. The hook treats `undefined` as "use the default", which keeps the
 * stored choice from being applied until after mount (SSR-safe).
 */
export function getValue(id: string): unknown {
  return values.get(id)
}

/** Stable, sorted (group, then source order) snapshot of mounted controls. */
export function getControls(): RegisteredControl[] {
  ensureLoaded()
  if (controlListDirty) {
    controlListSnapshot = [...controls.values()].sort(
      (a, b) => a.group.localeCompare(b.group) || a.order - b.order,
    )
    controlListDirty = false
  }
  return controlListSnapshot
}

export function getServerControls(): RegisteredControl[] {
  return EMPTY_CONTROLS
}

export function getUiState(): TweakerUiState {
  ensureLoaded()
  return ui
}

export function getServerUiState(): TweakerUiState {
  return DEFAULT_UI
}

export function setUiState(patch: Partial<TweakerUiState>): void {
  ensureLoaded()
  ui = { ...ui, ...patch }
  persist()
  notify()
}

/* ----------------------------- subscription ------------------------------- */

export function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

/** Test-only: wipe all state and skip localStorage. */
export function __resetStoreForTests(): void {
  controls.clear()
  values.clear()
  persisted.clear()
  order.clear()
  ui = DEFAULT_UI
  nextOrder = 0
  loaded = true // skip localStorage in tests
  controlListSnapshot = []
  controlListDirty = true
  listeners.clear()
}
