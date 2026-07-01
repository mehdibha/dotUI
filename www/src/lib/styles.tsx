'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { UNSAFE_PortalProvider } from 'react-aria/PortalProvider'
import { tv } from 'tailwind-variants'
import type { ClassValue, TVReturnType, VariantProps } from 'tailwind-variants'

import {
  DEFAULT_SEMANTICS,
  emitCss,
  emitPrimitivesCss,
  resolveColorConfig,
} from '@/registry/theme'
import type { ColorConfig } from '@/registry/theme'
import type {
  Density,
  EnumParamDef,
  ParamDef,
  RegistryItem,
} from '@/registry/types'

/* --------------------------------- Types --------------------------------- */

type ParamSelections = Record<string, Record<string, string>>
type GlobalTokenSelections = Record<string, string>

interface DesignSystemContextValue {
  params: ParamSelections
  tokens: GlobalTokenSelections
  density: Density
}

/* -------------------------------- Context -------------------------------- */

const DesignSystemContext = React.createContext<DesignSystemContextValue>({
  params: {},
  tokens: {},
  density: 'default',
})

/* ----------------------------- Param registry ----------------------------- */

/**
 * Module-scoped registry populated by `createStyles` at module load. The
 * provider reads it to resolve the user's per-component selections into CSS
 * vars on `:root`. Two kinds:
 *   - enum vars: `{ [component]: { [paramName]: { [valueName]: vars } } }`
 *   - scalar bindings: `{ [component]: { [paramName]: cssVar } }`
 */
const enumVarsRegistry = new Map<
  string,
  Record<string, Record<string, Record<string, string>>>
>()
const scalarVarsRegistry = new Map<string, Record<string, string>>()
const emptyParamSelections: Record<string, string> = {}

/* -------------------------------- Provider ------------------------------- */

/** Resolve a token value to a CSS value. "--radius-md" → "var(--radius-md)", "0" → "0" */
function resolveCssValue(value: string): string {
  return value.startsWith('--') ? `var(${value})` : value
}

// The global `:root` write must land before paint on the client (no flash of the
// previous theme), so it wants `useLayoutEffect` — but layout effects do nothing on
// the server, where calling `useLayoutEffect` only logs React's SSR warning. Falling
// back to `useEffect` server-side lets the provider render during SSR without warning,
// so callers can mount it unconditionally (no client-only gate that would remount the
// subtree). Same idiom as the Skeleton component.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect

/* ----------------------------- Scoped theming ----------------------------- */

/*
 * Why scoping needs more than overriding `--radius-factor` / the primitive ramps on a wrapper:
 * the design system declares its whole token closure at `:root` — primitive ramps, the
 * semantic `--color-*` vocabulary, AND every component surface var (`--card-radius:
 * var(--radius-lg)`, `--btn-radius`, …). Because those are computed *on `:root`*, they bake in
 * `:root`'s `--radius-factor` / primitives and inherit down frozen; re-pointing them on a
 * descendant does nothing (dark mode escapes this only because `.dark` lives on the same
 * `<html>` element as `:root`). The robust, self-maintaining fix is to clone that closure onto
 * the scope: re-emit `:root`'s *authored* (var-preserving) declarations under the scope
 * selector, then layer the scoped primitive overrides on top. Every var — including ones from
 * components added later — then recomputes from the scope's own tokens.
 */

// Simple selectors whose declarations make up the document's theme closure. `.dark` is the
// palette's dark override (it targets `<html>`, the same element as `:root`).
const ROOT_SELECTOR_TOKENS = new Set([
  ':root',
  ':host',
  'html',
  ':where(:root)',
])
const DARK_SELECTOR_TOKENS = new Set([
  '.dark',
  ':root.dark',
  'html.dark',
  ':where(.dark)',
])

/** A grouped selector (`:root, :host`) counts if any of its simple parts is in `tokens`. */
function selectorIn(selectorText: string, tokens: Set<string>): boolean {
  return selectorText.split(',').some((part) => tokens.has(part.trim()))
}

interface RootClosure {
  light: string
  dark: string
}
let rootClosureCache: RootClosure | null = null

// The semantic vocabulary's exact prop names. Excluded from the harvest by KEY, not by the
// `--color-` prefix: component surface vars share the prefix (`--color-area-radius`,
// `--color-swatch-picker-item-radius`) and must be harvested like any other token, or they
// stay frozen at `:root` values inside the scope.
const SEMANTIC_COLOR_PROPS = new Set(
  Object.keys(DEFAULT_SEMANTICS).map((name) => `--${name}`),
)

/**
 * Harvest, as raw CSS text, the authored custom-property declarations the document defines at
 * `:root` (light) and `.dark`. Reading from `cssRules` (not `getComputedStyle`) preserves the
 * `var()` / `calc()` references, so re-emitting the result under a scope selector lets each
 * token recompute from that scope's primitives + `--radius-factor`. Cached — the closure is
 * static (scoped mode never writes `:root`); cross-origin sheets are skipped.
 *
 * The semantic `--color-*` vocabulary is deliberately EXCLUDED here and emitted from
 * `DEFAULT_SEMANTICS` instead (see `buildScopedThemeCss`): it's the typed source of truth, and
 * its targets may be authored as `color-mix()` (the vocabulary supports it), whose CSSOM
 * read-back is unreliable.
 */
function harvestRootClosure(): RootClosure {
  if (rootClosureCache) return rootClosureCache
  if (typeof document === 'undefined') return { light: '', dark: '' }

  const light = new Map<string, string>()
  const dark = new Map<string, string>()
  const collect = (rule: CSSStyleRule, into: Map<string, string>) => {
    const { style } = rule
    for (let i = 0; i < style.length; i++) {
      const prop = style.item(i)
      // Skip: non-custom props; `--radius-factor` (rides inline on the scope element so the
      // cloned radius scale recomputes there); and the semantic vocabulary (emitted from
      // DEFAULT_SEMANTICS — see SEMANTIC_COLOR_PROPS for why it's an exact-key match).
      if (
        !prop.startsWith('--') ||
        prop === '--radius-factor' ||
        SEMANTIC_COLOR_PROPS.has(prop)
      )
        continue
      into.set(prop, style.getPropertyValue(prop).trim())
    }
  }
  const walk = (rules: CSSRuleList) => {
    for (const rule of rules) {
      const nested = (rule as CSSGroupingRule).cssRules
      if (nested?.length) walk(nested) // descend @layer / @media
      const styleRule = rule as CSSStyleRule
      if (!styleRule.selectorText || !styleRule.style?.length) continue
      if (selectorIn(styleRule.selectorText, ROOT_SELECTOR_TOKENS))
        collect(styleRule, light)
      else if (selectorIn(styleRule.selectorText, DARK_SELECTOR_TOKENS))
        collect(styleRule, dark)
    }
  }
  for (const sheet of document.styleSheets) {
    try {
      walk(sheet.cssRules)
    } catch {
      // Cross-origin stylesheet — `cssRules` throws; nothing of ours lives there.
    }
  }

  const toText = (map: Map<string, string>) =>
    [...map].map(([prop, value]) => `\t${prop}: ${value};`).join('\n')
  rootClosureCache = { light: toText(light), dark: toText(dark) }
  return rootClosureCache
}

/**
 * Build the `<style>` text that themes only `selector`'s subtree: clone `:root`'s token closure
 * onto the scope (primitives + component vars, so they recompute there), add the semantic
 * `--color-*` layer from `DEFAULT_SEMANTICS` (the reliable source — see `harvestRootClosure`),
 * then, when a `color` is given, override the primitive ramps with the scoped palette.
 * `--radius-factor` + param vars ride inline on the scope element.
 */
function buildScopedThemeCss(
  selector: string,
  color: ColorConfig | undefined,
): string | null {
  const { light, dark } = harvestRootClosure()
  // No closure to clone — we're on the server, or the document's stylesheets aren't
  // parsed yet. Scoped theming is inherently client-only (it mirrors the live `:root`
  // closure), so emit nothing here; it applies once mounted on the client. Rendering a
  // partial closure now would also mismatch the client during hydration.
  if (!light && !dark) return null
  const blocks = [
    `${selector} {\n${light}\n}`,
    `.dark ${selector} {\n${dark}\n}`,
    // Mode-agnostic `--color-*` (they reference primitives that flip via the `.dark` block above).
    emitCss(DEFAULT_SEMANTICS, { selector }),
  ]
  if (color) {
    blocks.push(
      emitPrimitivesCss(resolveColorConfig(color), {
        onColors: true,
        lightSelector: selector,
        darkSelector: `.dark ${selector}`,
      }),
    )
  }
  return blocks.join('\n')
}

interface DesignSystemProviderProps {
  params?: ParamSelections
  tokens?: GlobalTokenSelections
  density?: Density
  color?: ColorConfig
  /**
   * Scope the theme to this provider's children instead of the whole page. Off by default:
   * color + radius land on `:root` (and a global `<style>`), re-theming the entire document —
   * the only place semantic tokens re-resolve. On, the provider wraps children in a
   * `display: contents` element and clones `:root`'s token closure onto it, so only the
   * subtree re-themes and surrounding UI (e.g. the controls driving it) stays put. Overlays
   * the children render (which portal to `document.body`) are redirected via
   * `UNSAFE_PortalProvider` into a scope-marked container so they're themed too.
   */
  scoped?: boolean
  children: React.ReactNode
}

function DesignSystemProvider({
  params = {},
  tokens = {},
  density = 'default',
  color,
  scoped = false,
  children,
}: DesignSystemProviderProps) {
  const value = React.useMemo(
    () => ({ params, tokens, density }),
    [params, tokens, density],
  )

  const cssVars = React.useMemo(() => {
    const vars: Record<string, string> = {}

    // Layer 1: global theme tokens (palette, radius factor, cursors, etc.).
    for (const [prop, val] of Object.entries(tokens)) {
      vars[prop] = resolveCssValue(val)
    }

    // Layer 2: per-component param selections.
    // Enum params write a value's `vars` block; scalar params write a single
    // CSS var resolved from the selected token reference.
    for (const [componentName, componentSelections] of Object.entries(params)) {
      const enumVars = enumVarsRegistry.get(componentName)
      const scalarBindings = scalarVarsRegistry.get(componentName)
      for (const [paramName, paramValue] of Object.entries(
        componentSelections,
      )) {
        const enumValueVars = enumVars?.[paramName]?.[paramValue]
        if (enumValueVars) {
          for (const [k, v] of Object.entries(enumValueVars)) {
            vars[k] = v
          }
          continue
        }
        const scalarCssVar = scalarBindings?.[paramName]
        if (scalarCssVar) {
          vars[scalarCssVar] = resolveCssValue(paramValue)
        }
      }
    }

    return vars
  }, [tokens, params])

  // A stable, unique scope selector (only used in `scoped` mode). useId is SSR-safe and
  // constant across renders, so the injected <style> and the wrapper element always agree.
  const scopeId = React.useId()
  const scopeSelector = `[data-dotui-scope="${scopeId}"]`

  // Scoped mode emits a `<style>` (buildScopedThemeCss reads the live CSSOM — unavailable
  // during SSR) and a body portal. DEFAULTS still sets hasTokenOverrides, so the client
  // almost always renders a <style> the server omitted — a structural hydration mismatch
  // Suspense cannot prevent (it only walls off recovery). Gate both until after commit.
  const [scopedMounted, setScopedMounted] = React.useState(false)
  useIsomorphicLayoutEffect(() => {
    if (scoped) setScopedMounted(true)
  }, [scoped])

  // Apply the global token vars to :root so values that reference each other via calc() +
  // var() (e.g. --radius-sm = calc(.25rem * var(--radius-factor))) recompute correctly —
  // setting them on a wrapper <div> would leave the :root-declared tokens frozen. In `scoped`
  // mode they ride inline on the wrapper instead, over the cloned closure (see buildScopedThemeCss).
  useIsomorphicLayoutEffect(() => {
    if (scoped) return
    const root = document.documentElement
    const applied = Object.entries(cssVars)
    for (const [key, value] of applied) {
      root.style.setProperty(key, value)
    }
    return () => {
      for (const [key] of applied) {
        root.style.removeProperty(key)
      }
    }
  }, [cssVars, scoped])

  // Warm the closure cache off the critical path: built lazily, the first divergence would pay
  // the full-document CSSOM walk synchronously inside the render of the user's first drag tick.
  React.useEffect(() => {
    if (scoped) harvestRootClosure()
  }, [scoped])

  // Generative palette as a rendered <style> (the element is declared in the returned tree
  // below, not imperatively appended). Global mode writes :root + .dark (the flat-token
  // path above only writes :root). Scoped mode clones :root's token closure onto the wrapper
  // (so semantic + component vars recompute from the scope) and overrides the ramps there — but
  // only once something actually diverges (a color, or a token like --radius-factor); an
  // untouched preview emits nothing and just inherits the page defaults.
  //
  // `cssVars` themselves ride inline on the scope element and never enter the CSS text, so the
  // memo depends on whether any override EXISTS (a boolean) rather than the object's identity —
  // otherwise every radius-slider tick would rebuild a byte-identical stylesheet.
  const hasTokenOverrides = Object.keys(cssVars).length > 0
  const themeCss = React.useMemo(() => {
    if (scoped) {
      if (!scopedMounted) return null
      const diverges = Boolean(color) || hasTokenOverrides
      return diverges ? buildScopedThemeCss(scopeSelector, color) : null
    }
    return color
      ? emitPrimitivesCss(resolveColorConfig(color), { onColors: true })
      : null
  }, [scoped, scopedMounted, scopeSelector, color, hasTokenOverrides])

  const themeStyle = themeCss ? (
    <style data-dotui-color>{themeCss}</style>
  ) : null

  const tree = (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  )

  if (!scoped)
    return (
      <>
        {themeStyle}
        {tree}
      </>
    )

  const scopeStyle = { ...cssVars } as React.CSSProperties
  // `useId` ids contain ':' etc.; strip to a valid, stable DOM id for the portal target.
  const portalDomId = `dotui-portal-${scopeId.replace(/[^a-zA-Z0-9]/g, '')}`

  // `display: contents` keeps the wrapper out of layout (the children stay direct flow/flex
  // items of the real parent) while still carrying the scope marker + inline token vars.
  //
  // Card overlays (Select / popovers / tooltips) portal to `document.body` by default — outside
  // this subtree — so they'd escape the scope and render with the page's default theme.
  // `UNSAFE_PortalProvider` redirects every overlay rendered by the children into `#portalDomId`:
  // a body-level node that also carries `data-dotui-scope` (so the injected closure `<style>`
  // themes it) but lives outside the showcase's `overflow-hidden`/masked container, so overlays
  // inherit the scoped theme without being clipped.
  return (
    <div
      data-dotui-scope={scopeId}
      style={{ display: 'contents', ...scopeStyle }}
    >
      {themeStyle}
      <UNSAFE_PortalProvider
        getContainer={() => document.getElementById(portalDomId)}
      >
        {tree}
      </UNSAFE_PortalProvider>
      {scopedMounted
        ? createPortal(
            <div
              id={portalDomId}
              data-dotui-scope={scopeId}
              style={scopeStyle}
            />,
            document.body,
          )
        : null}
    </div>
  )
}

function useComponentParams(componentName: string): Record<string, string> {
  const { params } = React.useContext(DesignSystemContext)
  return params[componentName] ?? {}
}

interface DynamicComponentConfig<Props extends object, Value extends string> {
  componentName: string
  paramName: string
  defaultValue: Value
  components: Record<Value, React.ComponentType<Props>>
  displayName?: string
}

function createDynamicComponent<
  Props extends object,
  const Value extends string,
>({
  componentName,
  paramName,
  defaultValue,
  components,
  displayName,
}: DynamicComponentConfig<Props, Value>) {
  function DynamicComponent(props: Props) {
    const componentParams = useComponentParams(componentName)
    const selectedValue = componentParams[paramName]
    const Component =
      selectedValue && Object.hasOwn(components, selectedValue)
        ? components[selectedValue as Value]
        : components[defaultValue]

    return React.createElement(Component, props)
  }

  DynamicComponent.displayName =
    displayName ?? `Dynamic(${componentName}.${paramName})`

  return DynamicComponent
}

/* ------------------------------ createStyles ----------------------------- */

/**
 * Strict tv-config override type. Any layer above `base` (density, param values)
 * must match base's shape exactly:
 *   - same slot keys (no new slots)
 *   - same variant keys (no new variants)
 *   - same variant value keys per variant
 *   - variant values may be ClassValue, or — when base has slots — a partial
 *     slot map keyed by base's slots.
 */
type SlotKeys<Base> = Base extends { slots: infer S }
  ? S extends Record<string, unknown>
    ? Extract<keyof S, string>
    : never
  : never

type VariantKeys<Base> = Base extends { variants: infer V }
  ? V extends Record<string, unknown>
    ? Extract<keyof V, string>
    : never
  : never

type VariantValueKeys<Base, K extends PropertyKey> = Base extends {
  variants: { [P in K]: infer VV }
}
  ? VV extends Record<string, unknown>
    ? Extract<keyof VV, string>
    : never
  : never

type HasSlots<Base> = [SlotKeys<Base>] extends [never] ? false : true
type HasVariants<Base> = [VariantKeys<Base>] extends [never] ? false : true

type SlotsOverride<Base> =
  HasSlots<Base> extends true
    ? { slots?: { [K in SlotKeys<Base>]?: ClassValue } }
    : { slots?: never }

type VariantValueOverride<Base> =
  HasSlots<Base> extends true
    ? ClassValue | { [S in SlotKeys<Base>]?: ClassValue }
    : ClassValue

type VariantsOverride<Base> =
  HasVariants<Base> extends true
    ? {
        variants?: {
          [K in VariantKeys<Base>]?: {
            [V in VariantValueKeys<Base, K>]?: VariantValueOverride<Base>
          }
        }
        defaultVariants?: {
          [K in VariantKeys<Base>]?: VariantValueKeys<Base, K>
        }
      }
    : { variants?: never; defaultVariants?: never }

type CompoundVariantsOverride<Base> =
  HasVariants<Base> extends true
    ? {
        compoundVariants?: Array<
          {
            [K in VariantKeys<Base>]?:
              | VariantValueKeys<Base, K>
              | VariantValueKeys<Base, K>[]
          } & {
            class?: ClassValue
            className?: ClassValue
          }
        >
      }
    : { compoundVariants?: never }

export type ExtendingTv<Base> = { base?: ClassValue } & SlotsOverride<Base> &
  VariantsOverride<Base> &
  CompoundVariantsOverride<Base>

/* ----- Meta-driven param shape inference ----- */

type EnumParamNamesOf<M> = M extends { params: infer P }
  ? P extends Record<string, ParamDef>
    ? { [K in keyof P]: P[K] extends EnumParamDef ? K : never }[keyof P]
    : never
  : never

type EnumParamValuesOf<M, K extends PropertyKey> = M extends {
  params: { [P in K]: infer Def }
}
  ? Def extends EnumParamDef
    ? Def['values'][number]
    : never
  : never

type EnumParamsConfig<M, Base> = [EnumParamNamesOf<M>] extends [never]
  ? { params?: never }
  : {
      params?: {
        [K in EnumParamNamesOf<M>]?: {
          [V in EnumParamValuesOf<M, K> & string]?: ExtendingTv<Base> & {
            vars?: Record<string, string>
          }
        }
      }
    }

/* ----- useStyles return type ----- */

type EmptyVariants = Record<never, never>
type ExtractVariants<Base> = Base extends { variants: infer V }
  ? V
  : EmptyVariants
type ExtractSlots<Base> = Base extends { slots: infer S } ? S : undefined
type ExtractBase<Base> = Base extends { base: infer B } ? B : undefined

type InferTv<Base> = TVReturnType<
  // @ts-expect-error — ExtractVariants<Base> may not exactly match the constrained TVVariants shape
  ExtractVariants<Base>,
  ExtractSlots<Base>,
  ExtractBase<Base>,
  EmptyVariants,
  undefined
>

/* ----- createStyles ----- */

type CreateStylesConfig<M, Base> = {
  base: Base
  density?: Record<Density, ExtendingTv<Base>>
} & EnumParamsConfig<M, Base>

function createStyles<const M extends RegistryItem, const Base>(
  meta: M,
  config: CreateStylesConfig<M, Base>,
): {
  useStyles: () => InferTv<Base>
  styles: InferTv<Base>
} {
  const { base, density, params } = config as {
    base: Base
    density?: Record<Density, Record<string, unknown>>
    params?: Record<
      string,
      Record<
        string,
        Record<string, unknown> & { vars?: Record<string, string> }
      >
    >
  }

  /* ----- Register param vars / scalar bindings into runtime registry ----- */
  const metaParams = (meta.params ?? {}) as Record<string, ParamDef>
  const enumParamNames: string[] = []
  const paramDefaults: Record<string, string> = {}

  const enumVarsForComponent: Record<
    string,
    Record<string, Record<string, string>>
  > = {}
  const scalarBindingsForComponent: Record<string, string> = {}

  for (const [paramName, def] of Object.entries(metaParams)) {
    paramDefaults[paramName] = def.default
    if (def.kind === 'enum') {
      enumParamNames.push(paramName)
      const valueVarsByValue: Record<string, Record<string, string>> = {}
      const valuesConfig = (params?.[paramName] ?? {}) as Record<
        string,
        { vars?: Record<string, string> }
      >
      let hasAny = false
      for (const [valueName, valueConfig] of Object.entries(valuesConfig)) {
        if (valueConfig?.vars && Object.keys(valueConfig.vars).length > 0) {
          valueVarsByValue[valueName] = valueConfig.vars
          hasAny = true
        }
      }
      if (hasAny) enumVarsForComponent[paramName] = valueVarsByValue
    } else if (def.kind === 'scalar') {
      scalarBindingsForComponent[paramName] = def.cssVar
    }
  }

  if (Object.keys(enumVarsForComponent).length > 0) {
    enumVarsRegistry.set(meta.name, enumVarsForComponent)
  }
  if (Object.keys(scalarBindingsForComponent).length > 0) {
    scalarVarsRegistry.set(meta.name, scalarBindingsForComponent)
  }

  /* ----- Build per-density tv functions ----- */
  type AnyTv = ReturnType<typeof tv>
  const baseTv = tv(base as Parameters<typeof tv>[0]) as unknown as AnyTv

  const densities: Density[] = ['compact', 'default', 'comfortable']
  const densityTvs: Record<string, AnyTv> = {}
  for (const d of densities) {
    const densityConfig = density?.[d]
    densityTvs[d] = densityConfig
      ? (tv({
          extend: baseTv as never,
          ...(densityConfig as Parameters<typeof tv>[0]),
        } as never) as AnyTv)
      : baseTv
  }

  /* ----- Composition: base → density → params(in declared order) ----- */
  function stripVars<T extends { vars?: unknown }>(input: T): Omit<T, 'vars'> {
    // tv() can't see the `vars` key, so drop it before passing through.
    const { vars: _vars, ...rest } = input
    return rest as Omit<T, 'vars'>
  }

  function compose(
    d: Density,
    paramSelection: Record<string, string>,
  ): ReturnType<typeof tv> {
    const defaultTv = densityTvs.default ?? baseTv
    let current: ReturnType<typeof tv> = densityTvs[d] ?? defaultTv
    for (const paramName of enumParamNames) {
      const selectedValue =
        paramSelection[paramName] ?? paramDefaults[paramName]
      if (!selectedValue) continue
      const valueConfig = params?.[paramName]?.[selectedValue]
      if (!valueConfig) continue
      const tvOverride = stripVars(valueConfig)
      if (Object.keys(tvOverride).length === 0) continue
      current = tv({
        extend: current as never,
        ...(tvOverride as Parameters<typeof tv>[0]),
      } as never)
    }
    return current
  }

  function useStyles() {
    const { params: paramSelections, density } =
      React.useContext(DesignSystemContext)
    const componentParams = paramSelections[meta.name] ?? emptyParamSelections
    return React.useMemo(
      () => compose(density, componentParams) as InferTv<Base>,
      [density, componentParams],
    )
  }

  return {
    useStyles,
    styles: compose('default', paramDefaults) as InferTv<Base>,
  }
}

export type { VariantProps }
export {
  createDynamicComponent,
  createStyles,
  DesignSystemContext,
  DesignSystemProvider,
  useComponentParams,
}
