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

interface VariantAxis {
  name: string
  /** Boolean axes only have `true`/`false` keys → applied as `name && styles.x`. */
  kind: 'enum' | 'boolean'
  /** value name → translated StyleX style. */
  values: Record<string, StyleXStyle>
  /** ordered value names (for the type union). */
  order: string[]
}

const BOOLEAN_KEYS = new Set(['true', 'false'])

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
 * Returns `handled: false` (with the template untouched) for shapes outside the
 * flat single-resolver case.
 */
export function emitStylexComponent({
  template,
  flat,
  meta,
  placeholder,
}: EmitInput): EmitStylexResult {
  const untranslated: string[] = []

  // Out-of-scope shapes → let the caller keep Tailwind.
  if (flat.slots && Object.keys(flat.slots).length > 0)
    return { handled: false, untranslated, content: template }
  if (flat.compoundVariants && flat.compoundVariants.length > 0)
    return { handled: false, untranslated, content: template }
  // No `tv(...)` to swap → nothing for us to do.
  if (!template.includes(placeholder))
    return { handled: false, untranslated, content: template }

  const ident = `${toCamelCase(meta.name)}Variants`
  const typeIdent = `${capitalize(toCamelCase(meta.name))}Variants`

  // 1. Translate the base layer. dotUI composite utilities (`focus-ring`, …) have
  // no same-element StyleX form, but they ship as real classes to every consumer,
  // so keep them as literal classNames rather than dropping them — that preserves
  // e.g. the focus ring. (Base-layer only; variant-scoped composites, which would
  // need conditional className logic, stay on the PARITY-TODO list for the rollout.)
  const baseRes = translateClasses(joinClassValue(flat.base))
  const passthrough: string[] = []
  for (const token of baseRes.untranslated) {
    if (isPassthroughToken(token)) passthrough.push(token)
    else untranslated.push(token)
  }
  const baseStyles: Record<string, StyleXStyle> = { base: baseRes.style }

  // 2. Translate each variant axis.
  const axes: VariantAxis[] = []
  for (const [axisName, values] of Object.entries(flat.variants ?? {})) {
    const valueNames = Object.keys(values)
    const isBoolean = valueNames.every((v) => BOOLEAN_KEYS.has(v))
    const translated: Record<string, StyleXStyle> = {}
    for (const [valueName, slice] of Object.entries(values)) {
      if (!sliceIsFlat(slice))
        return { handled: false, untranslated, content: template } // slot map → unsupported
      const res = translateClasses(joinClassValue(slice))
      untranslated.push(...res.untranslated)
      translated[valueName] = res.style
    }
    if (isBoolean) {
      // Fold the `true` style into the shared `styles` create.
      baseStyles[axisName] = translated['true'] ?? {}
    }
    axes.push({
      name: axisName,
      kind: isBoolean ? 'boolean' : 'enum',
      values: translated,
      order: valueNames,
    })
  }

  const defaults = flat.defaultVariants ?? {}

  // 3. Build the StyleX declarations.
  const decls: string[] = []
  decls.push(`const styles = stylex.create(${serializeStyleMap(baseStyles)});`)
  for (const axis of axes) {
    if (axis.kind === 'boolean') continue // folded into `styles`
    decls.push(
      `const ${axis.name}Styles = stylex.create(${serializeStyleMap(axis.values)});`,
    )
  }

  // 4. The variant props type (replaces `VariantProps<typeof …>`).
  const typeLines = axes.map((axis) => {
    if (axis.kind === 'boolean') return `\t${axis.name}?: boolean;`
    const union = axis.order.map((v) => JSON.stringify(v)).join(' | ')
    return `\t${axis.name}?: ${union};`
  })
  const variantType = `type ${typeIdent} = {\n${typeLines.join('\n')}\n};`

  // 5. The resolver — same call signature as the tv() function it replaces.
  const params = axes.map((axis) => {
    const def = defaults[axis.name]
    return def !== undefined
      ? `${axis.name} = ${JSON.stringify(def)}`
      : axis.name
  })
  params.push('className')
  const applyArgs = ['styles.base']
  for (const axis of axes) {
    applyArgs.push(
      axis.kind === 'boolean'
        ? `${axis.name} && styles.${axis.name}`
        : `${axis.name}Styles[${axis.name}]`,
    )
  }
  const resolver = [
    `function ${ident}(`,
    `\t{ ${params.join(', ')} }: ${typeIdent} & { className?: string } = {},`,
    `) {`,
    `\t// All dotUI theming is static var() references, so stylex.props' \`style\``,
    `\t// is empty and the className string alone carries the styles.`,
    `\tconst { className: sx } = stylex.props(`,
    ...applyArgs.map((a) => `\t\t${a},`),
    `\t);`,
    // Order: StyleX atomic classes, then dotUI composite passthrough classes,
    // then the consumer's className override last so it can win.
    passthrough.length > 0
      ? `\treturn [sx, ${JSON.stringify(passthrough.join(' '))}, className].filter(Boolean).join(" ");`
      : `\treturn [sx, className].filter(Boolean).join(" ");`,
    `}`,
  ].join('\n')

  // 6. Splice into the template.
  const declarationBlock = `${decls.join('\n\n')}\n\n${resolver}`
  let content = template

  // 6a. tailwind-variants import → stylex import.
  content = content.replace(
    /import\s*\{[^}]*\}\s*from\s*["']tailwind-variants["'];?/,
    'import * as stylex from "@stylexjs/stylex";',
  )

  // 6b. `const <ident> = tv(%%TV_CONFIG%%);` → StyleX declarations + resolver.
  const tvDeclRe = new RegExp(
    `const\\s+${ident}\\s*=\\s*tv\\(${escapeRegex(placeholder)}\\);?`,
  )
  if (!tvDeclRe.test(content))
    return { handled: false, untranslated, content: template }
  content = content.replace(tvDeclRe, declarationBlock)

  // 6c. `type <Type> = VariantProps<typeof <ident>>;` → explicit type.
  content = content.replace(
    new RegExp(
      `type\\s+${typeIdent}\\s*=\\s*VariantProps<typeof\\s+${ident}>;?`,
    ),
    variantType,
  )

  // 7. PARITY-TODO header for anything the translator couldn't express.
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
