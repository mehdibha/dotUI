'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { UNSAFE_PortalProvider } from 'react-aria/PortalProvider'
import { tv } from 'tailwind-variants'
import type { ClassValue, TVReturnType, VariantProps } from 'tailwind-variants'

import { ensureFontStylesheets, fontFamiliesFromTokens } from '@/lib/fonts'
import { resolveColorConfigCached } from '@/lib/resolve-color'
import {
  closureText,
  DARK_SELECTOR_TOKENS,
  isHarvestedProp,
  ROOT_SELECTOR_TOKENS,
  selectorIn,
} from '@/lib/root-closure'
import type { RootClosure } from '@/lib/root-closure'
import serverRootClosure from '@/lib/root-closure-data'
import {
  IconLibraryContext,
  IconWeightContext,
} from '@/registry/icons/create-icon'
import { phosphorWeights } from '@/registry/icons/icon-map'
import type { IconLibraryName, PhosphorWeight } from '@/registry/icons/icon-map'
import {
  emitCss,
  emitDarkOverridesCss,
  emitPrimitivesCss,
  semanticDelta,
  semanticsFor,
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

// Only what consumers (useStyles / useComponentParams) actually read. Tokens and
// color deliberately stay OUT of the context: they apply as CSS vars / stylesheets
// from the provider, so a palette/radius-only preset swap re-renders zero consumers.
interface DesignSystemContextValue {
  params: ParamSelections
  density: Density
}

/* -------------------------------- Context -------------------------------- */

const DesignSystemContext = React.createContext<DesignSystemContextValue>({
  params: {},
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

let rootClosureCache: RootClosure | null = null

/**
 * The root closure, from whichever source this environment has (shape rules —
 * selector sets, excluded props — live in `@/lib/root-closure`):
 *
 * On the server, the closure parsed from the compiled stylesheet at build time
 * (see `root-closure-data`), so scoped themes render during SSR/prerender and
 * the first paint is already themed.
 *
 * On the client, harvest the authored custom-property declarations the
 * document defines at `:root` (light) and `.dark`, as raw CSS text. Reading
 * from `cssRules` (not `getComputedStyle`) preserves the `var()` / `calc()`
 * references, so re-emitting the result under a scope selector lets each token
 * recompute from that scope's primitives + `--radius-factor`. Cached — the
 * closure is static (scoped mode never writes `:root`); cross-origin sheets
 * are skipped.
 *
 * The semantic `--color-*` vocabulary is deliberately EXCLUDED here and emitted
 * from `DEFAULT_SEMANTICS` instead (see `buildScopedThemeCss`): it's the typed
 * source of truth, and its targets may be authored as `color-mix()` (the
 * vocabulary supports it), whose CSSOM read-back is unreliable.
 */
function getRootClosure(): RootClosure {
  if (typeof document === 'undefined')
    return serverRootClosure ?? { light: '', dark: '' }
  if (rootClosureCache) return rootClosureCache

  const light = new Map<string, string>()
  const dark = new Map<string, string>()
  const collect = (rule: CSSStyleRule, into: Map<string, string>) => {
    const { style } = rule
    for (let i = 0; i < style.length; i++) {
      const prop = style.item(i)
      if (!isHarvestedProp(prop)) continue
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

  const closure = { light: closureText(light), dark: closureText(dark) }
  // An empty harvest means the stylesheets weren't parsed yet — don't cache it, or scoped
  // theming would stay off for the whole session.
  if (closure.light || closure.dark) rootClosureCache = closure
  return closure
}

/**
 * Build the `<style>` text that themes only `selector`'s subtree: clone `:root`'s token closure
 * onto the scope (primitives + component vars, so they recompute there), add the semantic
 * `--color-*` layer from `DEFAULT_SEMANTICS` (the reliable source — see `getRootClosure`),
 * then, when a `color` is given, override the primitive ramps with the scoped palette.
 * `--radius-factor` + param vars ride inline on the scope element.
 *
 * A forced mode pins one mode's values on both the base and the `.dark`-page selector, so
 * the page theme can't flip them. The dark harvest holds only `.dark`'s overrides over
 * `:root`, so pinned-dark layers it on the full light closure. Raw `dark:` utilities are
 * class-keyed and can't be pinned from here — the scope's `data-mode` attribute handles
 * them via the dark custom-variant in registry/base/base.css.
 */
function buildScopedThemeCss(
  selector: string,
  color: ColorConfig | undefined,
  forcedMode: 'light' | 'dark' | undefined,
): string | null {
  const { light, dark } = getRootClosure()
  // No closure to clone — the document's stylesheets aren't parsed yet (client) or the
  // server closure is missing. Emit nothing rather than a partial closure; the caller
  // retries on a later render.
  if (!light && !dark) return null

  const base = forcedMode === 'dark' ? `${light}\n${dark}` : light
  const darkOverrides = forcedMode === 'light' ? light : dark

  const blocks = [
    // `color` re-establishes the base text color from the scope's own tokens,
    // as `body { text-fg }` does for the page — otherwise text with no explicit
    // color class inherits the page's, which is wrong once the scope diverges.
    `${selector} {\n${base}\n\tcolor: var(--color-fg);\n}`,
    `.dark ${selector} {\n${darkOverrides}\n}`,
    // Mode-agnostic `--color-*` (they reference primitives that flip via the blocks above).
    emitCss(semanticsFor(color), { selector }),
    // `.dark` re-points for per-mode targets (per-mode token overrides).
    emitDarkOverridesCss(semanticsFor(color), {
      selector: `.dark ${selector}`,
    }),
  ]
  if (color) {
    let resolved = resolveColorConfigCached(color)
    if (forcedMode) {
      const ramp = forcedMode === 'dark' ? resolved.dark : resolved.light
      const chartSet = resolved.charts[forcedMode]
      resolved = {
        ...resolved,
        light: ramp,
        dark: ramp,
        charts: { light: chartSet, dark: chartSet },
      }
    }
    blocks.push(
      emitPrimitivesCss(resolved, {
        lightSelector: selector,
        darkSelector: `.dark ${selector}`,
      }),
    )
  }
  return blocks.filter(Boolean).join('\n')
}

/* ----------------------- Shared scoped theme styles ----------------------- */

/*
 * The closure-clone stylesheet is ~10KB and fully determined by `color` + `forcedMode`,
 * so it renders as a React hoistable <style href precedence>: every provider on the
 * same theme renders the same href and React dedupes them to one node in <head> — a
 * docs page rendering N demos in the user's stored preset gets one style node, not N.
 * Rendering (instead of imperatively injecting) is what makes SSR work: the server has
 * the closure too (see `root-closure-data`), so the style streams with the shell and
 * scoped themes paint correctly before hydration. Hydration adopts hoistables by href
 * without diffing content, so cosmetic serialization differences between the
 * server-parsed and CSSOM-harvested closure are harmless. React never removes
 * hoistables, so styles outlive their last provider — fine: they're keyed by content
 * hash and inert without a matching scope attribute on the page.
 */

const scopedThemeCssCache = new Map<string, string>()

/**
 * djb2 over the theme key. Deterministic from content — the token renders as the
 * `data-dotui-scope` attribute and the style's href on the server too, so it must
 * hydrate identically (a session counter would drift between server and client).
 */
function themeTokenFor(key: string): string {
  let hash = 5381
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) + hash + key.charCodeAt(i)) | 0
  }
  return `t${(hash >>> 0).toString(36)}${key.length.toString(36)}`
}

/**
 * The scoped theme's scope token — the value the provider renders as
 * `data-dotui-scope` — and its stylesheet as a hoistable <style> element for the
 * provider to render. Both `undefined`/null when the provider doesn't diverge
 * from the page theme (nothing to emit).
 */
function useScopedTheme(
  color: ColorConfig | undefined,
  forcedMode: 'light' | 'dark' | undefined,
  enabled: boolean,
): { token: string | undefined; sheet: React.ReactNode } {
  // Content key = everything the stylesheet is built from (color config + pinned mode).
  // Token-only divergence (inline vars, no palette) shares a per-mode colorless entry.
  // `color`/`forcedMode` enter only through the key: an identity-only `color` change
  // must not rebuild, and the cache below keys on content.
  const [key, token] = React.useMemo(() => {
    if (!enabled) return [null, undefined] as const
    const k = `${forcedMode ?? 'auto'}:${color ? JSON.stringify(color) : 'default'}`
    return [k, themeTokenFor(k)] as const
  }, [enabled, color, forcedMode])

  let css: string | null = null
  if (key !== null && token !== undefined) {
    css = scopedThemeCssCache.get(key) ?? null
    if (css === null) {
      css = buildScopedThemeCss(
        `[data-dotui-scope="${token}"]`,
        color,
        forcedMode,
      )
      // null: no closure available yet — don't cache, a later render retries.
      if (css !== null) scopedThemeCssCache.set(key, css)
    }
  }

  return {
    token,
    sheet:
      css !== null && token !== undefined ? (
        <style href={token} precedence="dotui-scope">
          {css}
        </style>
      ) : null,
  }
}

interface DesignSystemProviderProps {
  params?: ParamSelections
  tokens?: GlobalTokenSelections
  density?: Density
  color?: ColorConfig
  /** Icon library rendered by registry icons; defaults to lucide. */
  icons?: IconLibraryName
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
  /**
   * Pin this (scoped) subtree to `light` or `dark` regardless of the page theme.
   * Only meaningful in `scoped` mode; omit to follow the page. Pins the token
   * closure via the scoped stylesheet and sets `data-mode` on the scope, which
   * the registry's dark custom-variant honors for raw `dark:` utilities.
   */
  forcedMode?: 'light' | 'dark'
  children: React.ReactNode
}

function DesignSystemProvider({
  params = {},
  tokens = {},
  density = 'default',
  color,
  icons = 'lucide',
  scoped = false,
  forcedMode,
  children,
}: DesignSystemProviderProps) {
  const value = React.useMemo(() => ({ params, density }), [params, density])

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

  // Per-instance id for the overlay portal target (only used in `scoped` mode). The
  // scope *selector* is no longer per-instance — see useScopedTheme.
  const scopeId = React.useId()

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

  // Load the faces the font tokens reference (Google-hosted; the untouched
  // defaults are self-hosted and never pass through here). Works in both modes:
  // this effect runs in whichever document hosts the provider — the preview
  // iframe in global mode, the main page for scoped thumbnails/demos.
  const fontFamilies = fontFamiliesFromTokens(tokens).join('\n')
  React.useEffect(() => {
    if (!fontFamilies) return
    ensureFontStylesheets(document, fontFamilies.split('\n'))
  }, [fontFamilies])

  // Warm the closure cache off the critical path: built lazily, the first divergence would pay
  // the full-document CSSOM walk synchronously inside the render of the user's first drag tick.
  React.useEffect(() => {
    if (scoped) getRootClosure()
  }, [scoped])

  // Scoped mode: render the shared closure-clone stylesheet, but only once something
  // actually diverges (a color, or a token like --radius-factor); an untouched preview
  // emits nothing and inherits the page defaults. `cssVars` ride inline on the scope
  // element and never enter the CSS text, so divergence keys on whether any override
  // EXISTS (a boolean), not object identity — else every radius tick rebuilds identical CSS.
  const hasTokenOverrides = Object.keys(cssVars).length > 0
  const { token: scopeToken, sheet: scopeSheet } = useScopedTheme(
    color,
    forcedMode,
    scoped && (Boolean(color) || hasTokenOverrides || Boolean(forcedMode)),
  )

  // Global mode: generative palette as a rendered <style>, writing :root + .dark (the
  // flat-token path above only writes :root). Null until a color is set, so an untouched
  // provider renders no <style> and SSR/first paint stay byte-identical to the bare
  // children. A plain <style> (no `precedence`) renders in place — fine, its rules are
  // global selectors and `<style>` carries the UA `display: none`, so layout is untouched.
  const themeCss = React.useMemo(() => {
    if (scoped || !color) return null
    const primitives = emitPrimitivesCss(resolveColorConfigCached(color))
    // Tokens the config re-points (primary source, per-token overrides)
    // re-declare on plain `:root` (beats the layered `@theme` declarations),
    // plus their per-mode re-points on `.dark`.
    const delta = semanticDelta(color)
    if (Object.keys(delta).length === 0) return primitives
    return (
      primitives +
      emitCss(delta, { selector: ':root' }) +
      emitDarkOverridesCss(delta, { selector: '.dark' })
    )
  }, [scoped, color])
  const themeStyle = themeCss ? (
    <style data-dotui-color>{themeCss}</style>
  ) : null

  // The weight axis rides in tokens (so it round-trips the preset URL like any
  // global token) but reaches icons as a component prop, hence the context.
  const iconWeight = phosphorWeights.find(
    (w): w is PhosphorWeight => w === tokens['--icon-weight'],
  )

  const tree = (
    <DesignSystemContext.Provider value={value}>
      <IconLibraryContext.Provider value={icons}>
        <IconWeightContext.Provider value={iconWeight}>
          {children}
        </IconWeightContext.Provider>
      </IconLibraryContext.Provider>
    </DesignSystemContext.Provider>
  )

  if (!scoped)
    return (
      <>
        {themeStyle}
        {tree}
      </>
    )

  // A body-font token only re-themes text that re-reads `--font-sans` INSIDE
  // the scope — inherited text keeps the font already resolved on `<body>`,
  // outside it. Declaring font-family on the wrapper (inheritance flows through
  // `display: contents`) makes the subtree re-resolve; absent a token, nothing
  // is declared and the markup stays byte-identical to the untouched provider.
  const scopeStyle = {
    ...cssVars,
    ...(cssVars['--font-sans'] ? { fontFamily: 'var(--font-sans)' } : {}),
  } as React.CSSProperties
  // `useId` ids contain ':' etc.; strip to a valid, stable DOM id for the portal target.
  const portalDomId = `dotui-portal-${scopeId.replace(/[^a-zA-Z0-9]/g, '')}`

  // `display: contents` keeps the wrapper out of layout (the children stay direct flow/flex
  // items of the real parent) while still carrying the scope marker + inline token vars.
  // The marker value is the shared theme token (absent while nothing diverges), so every
  // provider on the same theme is targeted by the one shared closure <style>.
  //
  // Card overlays (Select / popovers / tooltips) portal to `document.body` by default — outside
  // this subtree — so they'd escape the scope and render with the page's default theme.
  // `UNSAFE_PortalProvider` redirects every overlay rendered by the children into `#portalDomId`:
  // a body-level node that also carries `data-dotui-scope` (so the shared closure `<style>`
  // themes it) but lives outside the showcase's `overflow-hidden`/masked container, so overlays
  // inherit the scoped theme without being clipped.
  return (
    <div
      data-dotui-scope={scopeToken}
      data-mode={forcedMode}
      style={{ display: 'contents', ...scopeStyle }}
    >
      {scopeSheet}
      <UNSAFE_PortalProvider
        getContainer={() => document.getElementById(portalDomId)}
      >
        {tree}
      </UNSAFE_PortalProvider>
      {typeof document === 'undefined'
        ? null
        : createPortal(
            <div
              id={portalDomId}
              data-dotui-scope={scopeToken}
              data-mode={forcedMode}
              style={scopeStyle}
            />,
            document.body,
          )}
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

  // Selection objects are stable references (preset/store constants or
  // `emptyParamSelections`), so composition can be cached per (density,
  // selections) at module level: once per component type, not per instance,
  // and `useStyles` returns a stable reference across instances.
  const composeCache = new Map<
    Density,
    WeakMap<object, ReturnType<typeof tv>>
  >()
  function composeCached(d: Density, selections: Record<string, string>) {
    let byRef = composeCache.get(d)
    if (!byRef) {
      byRef = new WeakMap()
      composeCache.set(d, byRef)
    }
    let composed = byRef.get(selections)
    if (!composed) {
      composed = compose(d, selections)
      byRef.set(selections, composed)
    }
    return composed
  }

  function useStyles() {
    const { params: paramSelections, density } =
      React.useContext(DesignSystemContext)
    const componentParams = paramSelections[meta.name] ?? emptyParamSelections
    return composeCached(density, componentParams) as InferTv<Base>
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
