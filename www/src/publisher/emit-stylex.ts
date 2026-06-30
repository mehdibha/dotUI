/**
 * StyleX emitter — the StyleX sibling of `serialize.ts`.
 *
 * Consumes the *same* flat `TvLayer` IR the Tailwind path serializes into a
 * `tv(...)` literal, and instead emits a StyleX styling module. The trick that
 * keeps the component body backend-agnostic: tailwind-variants' resolver
 * (`buttonVariants({ variant, size, className })`) returns a className *string*,
 * and so does `stylex.props(...).className`. So we emit a `buttonVariants`
 * function with the identical call signature, and the rest of the transformed
 * `base.tsx` (the JSX, the render-prop composition) works untouched — we only
 * swap three things: the `tailwind-variants` import, the `const … = tv(%%…%%)`
 * declaration, and the `VariantProps<typeof …>` type line.
 *
 * Scope (PoC): the flat, single-resolver shape (Button, ToggleButton, …) — no
 * slots, no compoundVariants. Components outside this shape return
 * `handled: false` and the caller keeps the Tailwind output, so the route is
 * never broken. Descendant/group/has classes StyleX can't express are listed in
 * `untranslated` and surfaced as a `// PARITY-TODO` header — the work-list the
 * parity system hands to the `when.*`/refactor step.
 *
 * Request-time safe (pure data + string building). Mirrors `serialize.ts`.
 */

import type { RegistryItem } from '@/registry/types'

import { serializeTvConfig } from './serialize'
import { isPassthroughToken, translateClasses } from './tw-to-stylex'
import type { StyleXStyle } from './tw-to-stylex'
import type { ClassValue, TvLayer, VariantSliceValue } from './types'

/* ------------------------------ ident helpers ----------------------------- */

function toCamelCase(slug: string): string {
  return slug.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())
}
function capitalize(s: string): string {
  return s ? s[0]!.toUpperCase() + s.slice(1) : s
}

/* ------------------------------- IR helpers ------------------------------- */

function joinClassValue(value: ClassValue | undefined): string {
  if (value == null || value === false) return ''
  if (Array.isArray(value)) return value.filter(Boolean).join(' ')
  return value
}

/** A variant slice without slots is a class value; with slots it's unsupported here. */
function sliceIsFlat(
  value: VariantSliceValue | undefined,
): value is ClassValue {
  return (
    value == null ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    Array.isArray(value)
  )
}

interface AxisSpec {
  name: string
  /** Boolean axes only have `true`/`false` keys → applied as `name && …`. */
  kind: 'enum' | 'boolean'
  /** ordered value names (for the type union). */
  order: string[]
}

const BOOLEAN_KEYS = new Set(['true', 'false'])

/** Discover the variant axes (name, enum vs boolean, value order) from the IR. */
function discoverAxes(variants: TvLayer['variants']): AxisSpec[] {
  const axes: AxisSpec[] = []
  for (const [name, values] of Object.entries(variants ?? {})) {
    const order = Object.keys(values)
    const kind = order.every((v) => BOOLEAN_KEYS.has(v)) ? 'boolean' : 'enum'
    axes.push({ name, kind, order })
  }
  return axes
}

/** The `type XVariants = { … }` declaration built from the axis specs. */
function buildVariantType(typeIdent: string, axes: AxisSpec[]): string {
  const lines = axes.map((axis) =>
    axis.kind === 'boolean'
      ? `\t${axis.name}?: boolean;`
      : `\t${axis.name}?: ${axis.order.map((v) => JSON.stringify(v)).join(' | ')};`,
  )
  return `type ${typeIdent} = {\n${lines.join('\n')}\n};`
}

/**
 * Translate one class string, splitting dotUI composite passthrough utilities
 * (`focus-ring`, …) out of the genuinely-untranslated set (which feeds the
 * PARITY-TODO list). The passthrough classes are layered back as literal classNames.
 */
function translatePartitioned(
  classes: string,
  untranslatedSink: string[],
): { style: StyleXStyle; passthrough: string[] } {
  const res = translateClasses(classes)
  const passthrough: string[] = []
  for (const token of res.untranslated) {
    if (isPassthroughToken(token)) passthrough.push(token)
    else untranslatedSink.push(token)
  }
  return { style: res.style, passthrough }
}

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/
/** Quote a slot name when it isn't a valid object-key identifier. */
function slotKey(slot: string): string {
  return IDENT_RE.test(slot) ? slot : JSON.stringify(slot)
}
/** A namespace identifier for a slot (+ optional axis): `root`, `rootVariantStyles`. */
function nsIdent(slot: string, axis?: string): string {
  const s = toCamelCase(slot)
  return axis ? `${s}${capitalize(axis)}Styles` : `${s}Styles`
}

export interface EmitStylexResult {
  /** True when the IR shape is one the emitter handles (flat, no compounds). */
  handled: boolean
  /** Tokens with no same-element StyleX form — surfaced as PARITY-TODO. */
  untranslated: string[]
  /** The full component file content (only meaningful when `handled`). */
  content: string
}

interface EmitInput {
  /** The transformed Tailwind template (with `%%TV_CONFIG%%` still present). */
  template: string
  /** The flattened IR for the selected preset. */
  flat: TvLayer
  meta: RegistryItem
  /** The runtime placeholder string the template carries. */
  placeholder: string
}

/**
 * Emit a StyleX component file from the transformed Tailwind template + IR.
 * Dispatches to the flat (single-element) or slotted path. Returns
 * `handled: false` (template untouched) only for shapes still out of scope
 * (compound variants — none exist in dotUI today), so the route never breaks.
 */
export function emitStylexComponent({
  template,
  flat,
  meta,
  placeholder,
}: EmitInput): EmitStylexResult {
  const untranslated: string[] = []

  // Compound variants aren't used by any dotUI styles.ts today; bail rather than
  // silently drop them if that ever changes.
  if (flat.compoundVariants && flat.compoundVariants.length > 0)
    return { handled: false, untranslated, content: template }
  // No `tv(...)` placeholder to swap → nothing for us to do.
  if (!template.includes(placeholder))
    return { handled: false, untranslated, content: template }

  const ident = `${toCamelCase(meta.name)}Variants`
  const typeIdent = `${capitalize(toCamelCase(meta.name))}Variants`
  const slots =
    flat.slots && Object.keys(flat.slots).length > 0 ? flat.slots : null
  const base = { template, flat, ident, typeIdent, placeholder, untranslated }
  return slots ? emitSlotted({ ...base, slots }) : emitFlat(base)
}

interface PathInput {
  template: string
  flat: TvLayer
  ident: string
  typeIdent: string
  placeholder: string
  untranslated: string[]
}

/**
 * Flat (single-element) components — Button, ToggleButton… The resolver returns a
 * className string, the exact shape `tv()` returns, so the JSX body is untouched.
 */
function emitFlat({
  template,
  flat,
  ident,
  typeIdent,
  placeholder,
  untranslated,
}: PathInput): EmitStylexResult {
  const base = translatePartitioned(joinClassValue(flat.base), untranslated)
  const baseStyles: Record<string, StyleXStyle> = { base: base.style }

  const axes = discoverAxes(flat.variants)
  const enumStyles: Record<string, Record<string, StyleXStyle>> = {}
  for (const [axisName, values] of Object.entries(flat.variants ?? {})) {
    const axis = axes.find((a) => a.name === axisName)!
    const translated: Record<string, StyleXStyle> = {}
    for (const [valueName, slice] of Object.entries(values)) {
      if (!sliceIsFlat(slice))
        return { handled: false, untranslated, content: template }
      translated[valueName] = translatePartitioned(
        joinClassValue(slice),
        untranslated,
      ).style
    }
    // Boolean axes fold the `true` style into the shared `styles` namespace.
    if (axis.kind === 'boolean') baseStyles[axisName] = translated['true'] ?? {}
    else enumStyles[axisName] = translated
  }

  const defaults = flat.defaultVariants ?? {}
  const decls = [
    `const styles = stylex.create(${serializeStyleMap(baseStyles)});`,
  ]
  for (const axis of axes) {
    if (axis.kind === 'enum')
      decls.push(
        `const ${axis.name}Styles = stylex.create(${serializeStyleMap(enumStyles[axis.name]!)});`,
      )
  }

  const params = axes
    .map((axis) => {
      const def = defaults[axis.name]
      return def !== undefined
        ? `${axis.name} = ${JSON.stringify(def)}`
        : axis.name
    })
    .concat('className')
  const applyArgs = ['styles.base']
  for (const axis of axes)
    applyArgs.push(
      axis.kind === 'boolean'
        ? `${axis.name} && styles.${axis.name}`
        : `${axis.name}Styles[${axis.name}]`,
    )

  const resolver = [
    `function ${ident}(`,
    `\t{ ${params.join(', ')} }: ${typeIdent} & { className?: string } = {},`,
    `) {`,
    `\t// dotUI theming is all static var() references, so stylex.props' \`style\``,
    `\t// is empty and the className string alone carries the styles.`,
    `\tconst { className: sx } = stylex.props(`,
    ...applyArgs.map((a) => `\t\t${a},`),
    `\t);`,
    `\t${returnExpr(base.passthrough, 'className')}`,
    `}`,
  ].join('\n')

  return finalize(
    template,
    placeholder,
    ident,
    typeIdent,
    `${decls.join('\n\n')}\n\n${resolver}`,
    buildVariantType(typeIdent, axes),
    untranslated,
  )
}

/**
 * Slotted components — Alert, Card… `tv()` returns a function whose call yields a
 * `{ slot: (props) => className }` map; we reproduce that exact shape so the JSX
 * (`const { root } = xVariants(); root({ variant, className })`) is untouched.
 * Each slot gets its own `stylex.create` namespaces (base + per-variant).
 */
function emitSlotted({
  template,
  flat,
  slots,
  ident,
  typeIdent,
  placeholder,
  untranslated,
}: PathInput & { slots: Record<string, ClassValue> }): EmitStylexResult {
  const slotNames = Object.keys(slots)
  const axes = discoverAxes(flat.variants)
  const defaults = flat.defaultVariants ?? {}

  // Slotted variant values must be slot maps; a flat value here is out of scope.
  for (const values of Object.values(flat.variants ?? {}))
    for (const slice of Object.values(values))
      if (sliceIsFlat(slice))
        return { handled: false, untranslated, content: template }

  // Per slot: base style + composite passthrough classes.
  const slotBase: Record<string, StyleXStyle> = {}
  const slotPass: Record<string, string[]> = {}
  for (const slot of slotNames) {
    const r = translatePartitioned(joinClassValue(slots[slot]), untranslated)
    slotBase[slot] = r.style
    slotPass[slot] = r.passthrough
  }

  // Per slot, per axis: { value: style }. Skip a namespace when no value carries
  // content for that slot (keeps the emitted module lean).
  const slotAxis: Record<
    string,
    Record<string, Record<string, StyleXStyle>>
  > = {}
  for (const slot of slotNames) slotAxis[slot] = {}
  for (const [axisName, values] of Object.entries(flat.variants ?? {}))
    for (const slot of slotNames) {
      const perValue: Record<string, StyleXStyle> = {}
      let hasContent = false
      for (const [valueName, slice] of Object.entries(values)) {
        const slotMap = slice as Record<string, ClassValue>
        const style = translatePartitioned(
          joinClassValue(slotMap[slot]),
          untranslated,
        ).style
        perValue[valueName] = style
        if (Object.keys(style).length > 0) hasContent = true
      }
      if (hasContent) slotAxis[slot]![axisName] = perValue
    }

  const decls: string[] = []
  for (const slot of slotNames) {
    decls.push(
      `const ${nsIdent(slot)} = stylex.create(${serializeStyleMap({ base: slotBase[slot]! })});`,
    )
    for (const axis of axes) {
      const perValue = slotAxis[slot]![axis.name]
      if (perValue)
        decls.push(
          `const ${nsIdent(slot, axis.name)} = stylex.create(${serializeStyleMap(perValue)});`,
        )
    }
  }

  // Each slot fn resolves its own variant props (merged over any top-level props),
  // mirroring tv's slotted API, and appends its passthrough + the consumer className.
  // Only the axes a slot actually styles are destructured, so the shipped code has
  // no unused bindings.
  const slotFns = slotNames.map((slot) => {
    const usedAxes = axes.filter((axis) => slotAxis[slot]![axis.name])
    const destructure = usedAxes
      .map((axis) => {
        const def = defaults[axis.name]
        return def !== undefined
          ? `${axis.name} = ${JSON.stringify(def)}`
          : axis.name
      })
      .concat('className')
      .join(', ')
    const args = [`${nsIdent(slot)}.base`]
    for (const axis of usedAxes)
      args.push(
        axis.kind === 'boolean'
          ? `${axis.name} && ${nsIdent(slot, axis.name)}.true`
          : `${nsIdent(slot, axis.name)}[${axis.name}]`,
      )
    return [
      `\t\t${slotKey(slot)}: (slotProps: ${typeIdent} & { className?: string } = {}) => {`,
      `\t\t\tconst { ${destructure} } = { ...props, ...slotProps };`,
      `\t\t\tconst { className: sx } = stylex.props(${args.join(', ')});`,
      `\t\t\t${returnExpr(slotPass[slot]!, 'className')}`,
      `\t\t},`,
    ].join('\n')
  })

  const resolver = [
    `function ${ident}(props: ${typeIdent} = {}) {`,
    `\t// dotUI theming is all static var() references, so stylex.props' \`style\``,
    `\t// is empty and the className string alone carries the styles.`,
    `\treturn {`,
    ...slotFns,
    `\t};`,
    `}`,
  ].join('\n')

  return finalize(
    template,
    placeholder,
    ident,
    typeIdent,
    `${decls.join('\n')}\n\n${resolver}`,
    buildVariantType(typeIdent, axes),
    untranslated,
  )
}

/** `return [sx, "<passthrough>", className].filter(Boolean).join(" ");` */
function returnExpr(passthrough: string[], classNameVar: string): string {
  const parts =
    passthrough.length > 0
      ? `[sx, ${JSON.stringify(passthrough.join(' '))}, ${classNameVar}]`
      : `[sx, ${classNameVar}]`
  return `return ${parts}.filter(Boolean).join(" ");`
}

/**
 * Splice the StyleX declarations + variant type into the transformed template,
 * swap the `tailwind-variants` import for StyleX, retarget the variant-props type
 * (both the `type X = VariantProps<…>` alias and inline `VariantProps<typeof X>`
 * uses), and prepend the PARITY-TODO work-list. Shared by both paths.
 */
function finalize(
  template: string,
  placeholder: string,
  ident: string,
  typeIdent: string,
  declBody: string,
  variantType: string,
  untranslated: string[],
): EmitStylexResult {
  let content = template.replace(
    /import\s*\{[^}]*\}\s*from\s*["']tailwind-variants["'];?/,
    'import * as stylex from "@stylexjs/stylex";',
  )

  const tvDeclRe = new RegExp(
    `const\\s+${ident}\\s*=\\s*tv\\(${escapeRegex(placeholder)}\\);?`,
  )
  if (!tvDeclRe.test(content))
    return { handled: false, untranslated: [], content: template }
  // TS hoists type aliases, so position doesn't matter — defining the variant type
  // here also covers components whose interface uses `VariantProps<…>` inline with
  // no `type X = …` line of their own.
  content = content.replace(tvDeclRe, `${variantType}\n\n${declBody}`)

  // Drop a now-redundant `type X = VariantProps<typeof ident>` alias, then point any
  // remaining inline `VariantProps<typeof ident>` use at the emitted type.
  content = content.replace(
    new RegExp(
      `type\\s+${typeIdent}\\s*=\\s*VariantProps<typeof\\s+${ident}>;?\\s*`,
    ),
    '',
  )
  content = content.replace(
    new RegExp(`VariantProps<typeof\\s+${ident}>`, 'g'),
    typeIdent,
  )

  const unique = [...new Set(untranslated)]
  if (unique.length > 0) {
    const header = [
      '// PARITY-TODO (StyleX export): the following Tailwind classes style',
      "// descendants/other elements, which StyleX can't express on this element.",
      '// Re-express via stylex.when.* + a marker, or refactor into a slot/gap.',
      ...unique.map((t) => `//   - ${t}`),
      '',
    ].join('\n')
    content = `${header}\n${content}`
  }

  return { handled: true, untranslated: unique, content }
}

/* ------------------------------ serialization ----------------------------- */

/** Serialize a `{ name: StyleXStyle }` map to a JS object literal via serialize.ts. */
function serializeStyleMap(map: Record<string, StyleXStyle>): string {
  return serializeTvConfig(map)
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
