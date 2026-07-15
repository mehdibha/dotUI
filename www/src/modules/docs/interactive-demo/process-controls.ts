/**
 * Control processing for InteractiveDemo.
 * Builds and enriches controls from API reference at build time.
 */

import type { HighlighterGeneric } from 'shiki'
import { Node, Project, ScriptKind } from 'ts-morph'

import type { ControlSelection } from '../codegen/source-overlay'
import { loadApiReference } from '../references/loader'
import type { PropDefinition, TType } from '../references/types'
import type {
  BooleanControl,
  Control,
  ControlInput,
  EnumControl,
  IconControl,
  NumberControl,
  SerializableControl,
  StringControl,
} from './types'

// ============================================================================
// Build Controls from Reference
// ============================================================================

/**
 * Build controls from simplified inputs + API reference.
 * Infers type, options, and defaults from the API reference.
 */
export async function buildControlsFromReference(
  name: string,
  controlInputs: ControlInput[],
  demoSource?: string,
): Promise<Control[]> {
  const reference = await loadApiReference(name)

  if (!reference) {
    throw new Error(`API reference not found for ${name}`)
  }

  const controls: Control[] = []

  for (const input of controlInputs) {
    const propName = typeof input === 'string' ? input : input.name
    const overrides = typeof input === 'string' ? {} : input

    const prop = reference.props[propName]
    if (!prop) {
      // If prop not in reference, use overrides directly (for custom controls like icons)
      if (typeof input !== 'string' && input.type) {
        controls.push(input as Control)
        continue
      }
      throw new Error(`Prop ${propName} not found in API reference for ${name}`)
    }

    const inferredControl = inferControlFromProp(propName, prop, overrides)
    controls.push(inferredControl)
  }

  // SourceFirst: the default the user SEES in the demo's param signature is the
  // authoritative control default (Problem #4 fix) — it overrides the reference
  // default, which can be alphabetized/absent. Legacy callers pass no source.
  if (demoSource) {
    applyParamDefaults(controls, readParamDefaults(demoSource))
  }

  return controls
}

/**
 * Project controls down to what the source overlay needs to plan holes.
 * Single definition shared by the rehype build and the fidelity tests.
 */
export function toControlSelections(controls: Control[]): ControlSelection[] {
  return controls.map((c) => ({
    name: c.name,
    kind: c.type,
    default:
      c.type === 'icon'
        ? null
        : (((c as { defaultValue?: unknown }).defaultValue as never) ?? null),
  }))
}

// ============================================================================
// Param-signature defaults (SourceFirst)
// ============================================================================

const ctrlProject = new Project({ useInMemoryFileSystem: true })
let ctrlCounter = 0

/** Read destructured param defaults from the demo's exported function signature. */
export function readParamDefaults(source: string): Record<string, string> {
  const sf = ctrlProject.createSourceFile(`ctl-${ctrlCounter++}.tsx`, source, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })
  try {
    const fn = sf
      .getFunctions()
      .find((f) => f.isDefaultExport() || f.hasExportKeyword())
    const out: Record<string, string> = {}
    const nameNode = fn?.getParameters()[0]?.getNameNode()
    if (nameNode && Node.isObjectBindingPattern(nameNode)) {
      for (const el of nameNode.getElements()) {
        const init = el.getInitializer()
        if (init) out[el.getName()] = init.getText() // literal source: '"md"' / 'false' / '60'
      }
    }
    return out
  } finally {
    ctrlProject.removeSourceFile(sf)
  }
}

function applyParamDefaults(
  controls: Control[],
  paramDefaults: Record<string, string>,
): void {
  for (const c of controls) {
    if (c.type === 'icon') continue
    const pd = paramDefaults[c.name]
    if (pd === undefined) continue
    const parsed = parseParamDefault(pd, c.type)
    if (parsed !== undefined)
      (c as { defaultValue?: unknown }).defaultValue = parsed
  }
}

function parseParamDefault(src: string, type: Control['type']): unknown {
  let v: unknown
  try {
    // oxlint-disable-next-line no-new-func -- build-time eval of a trusted authored literal
    v = new Function(`"use strict"; return (${src});`)()
  } catch {
    return undefined
  }
  if (type === 'number') return typeof v === 'number' ? v : undefined
  if (type === 'boolean') return typeof v === 'boolean' ? v : undefined
  return typeof v === 'string' ? v : undefined
}

/**
 * Infer a control definition from a prop definition.
 */
function inferControlFromProp(
  name: string,
  prop: PropDefinition,
  overrides: Partial<Omit<Control, 'name'>>,
): Control {
  // If type is explicitly provided in overrides, use it
  if (overrides.type) {
    return buildControlWithOverrides(name, prop, overrides)
  }

  // Infer from typeAst
  if (prop.typeAst) {
    const inferred = inferFromTypeAst(name, prop.typeAst, prop)
    if (inferred) {
      return applyOverrides(inferred, overrides)
    }
  }

  // Fallback: try to infer from type string
  const inferredFromString = inferFromTypeString(name, prop)
  if (inferredFromString) {
    return applyOverrides(inferredFromString, overrides)
  }

  // Final fallback to string control
  return {
    type: 'string',
    name,
    defaultValue: parseDefaultValue(prop.default, 'string') as string,
    ...overrides,
  } as StringControl
}

/**
 * Infer control from TypeAST structure.
 */
function inferFromTypeAst(
  name: string,
  typeAst: TType,
  prop: PropDefinition,
): Control | null {
  // Handle union types
  if (typeAst.type === 'union') {
    // Filter out undefined from union elements (optional props)
    const nonUndefinedElements = typeAst.elements.filter(
      (el) => el.type !== 'undefined',
    )

    // Check if it's a union of string literals → enum
    const stringLiterals = nonUndefinedElements
      .filter((el) => el.type === 'stringLiteral')
      .map((el) => (el as { type: 'stringLiteral'; value: string }).value)

    if (
      stringLiterals.length > 0 &&
      stringLiterals.length === nonUndefinedElements.length
    ) {
      return {
        type: 'enum',
        name,
        options: stringLiterals,
        defaultValue:
          (parseDefaultValue(prop.default, 'enum') as string) ??
          stringLiterals[0],
      } as EnumControl
    }

    // Check if it's a boolean union (true | false | undefined)
    const hasBooleanLiteral = nonUndefinedElements.some(
      (el) => el.type === 'booleanLiteral',
    )
    const hasBoolean = nonUndefinedElements.some((el) => el.type === 'boolean')

    if (
      (hasBooleanLiteral || hasBoolean) &&
      nonUndefinedElements.every(
        (el) => el.type === 'boolean' || el.type === 'booleanLiteral',
      )
    ) {
      return {
        type: 'boolean',
        name,
        defaultValue:
          (parseDefaultValue(prop.default, 'boolean') as boolean) ?? false,
      } as BooleanControl
    }
  }

  // Handle primitive keyword types
  if (typeAst.type === 'boolean') {
    return {
      type: 'boolean',
      name,
      defaultValue:
        (parseDefaultValue(prop.default, 'boolean') as boolean) ?? false,
    } as BooleanControl
  }

  if (typeAst.type === 'string') {
    return {
      type: 'string',
      name,
      defaultValue: (parseDefaultValue(prop.default, 'string') as string) ?? '',
    } as StringControl
  }

  if (typeAst.type === 'number') {
    return {
      type: 'number',
      name,
      defaultValue: (parseDefaultValue(prop.default, 'number') as number) ?? 0,
    } as NumberControl
  }

  return null
}

/**
 * Fallback: infer from type string when AST is not available.
 */
function inferFromTypeString(
  name: string,
  prop: PropDefinition,
): Control | null {
  const type = prop.type

  if (type === 'boolean') {
    return {
      type: 'boolean',
      name,
      defaultValue:
        (parseDefaultValue(prop.default, 'boolean') as boolean) ?? false,
    } as BooleanControl
  }

  if (type === 'string') {
    return {
      type: 'string',
      name,
      defaultValue: (parseDefaultValue(prop.default, 'string') as string) ?? '',
    } as StringControl
  }

  if (type === 'number') {
    return {
      type: 'number',
      name,
      defaultValue: (parseDefaultValue(prop.default, 'number') as number) ?? 0,
    } as NumberControl
  }

  // Check for union of string literals in type string (e.g., '"sm" | "md" | "lg"')
  const stringLiteralMatch = type.match(/^"[^"]+"/)
  if (stringLiteralMatch) {
    const options = type
      .split('|')
      .map((s) => s.trim().replace(/^"|"$/g, ''))
      .filter((s) => s && !s.includes(' '))

    if (options.length > 0) {
      return {
        type: 'enum',
        name,
        options,
        defaultValue:
          (parseDefaultValue(prop.default, 'enum') as string) ?? options[0],
      } as EnumControl
    }
  }

  return null
}

/**
 * Build a control with explicit type from overrides.
 */
function buildControlWithOverrides(
  name: string,
  prop: PropDefinition,
  overrides: Partial<Omit<Control, 'name'>>,
): Control {
  const type = overrides.type as NonNullable<typeof overrides.type>

  switch (type) {
    case 'boolean':
      return {
        type: 'boolean',
        name,
        defaultValue:
          (overrides as Partial<BooleanControl>).defaultValue ??
          (parseDefaultValue(prop.default, 'boolean') as boolean) ??
          false,
        ...overrides,
      } as BooleanControl

    case 'string':
      return {
        type: 'string',
        name,
        defaultValue:
          (overrides as Partial<StringControl>).defaultValue ??
          (parseDefaultValue(prop.default, 'string') as string) ??
          '',
        ...overrides,
      } as StringControl

    case 'number':
      return {
        type: 'number',
        name,
        defaultValue:
          (overrides as Partial<NumberControl>).defaultValue ??
          (parseDefaultValue(prop.default, 'number') as number) ??
          0,
        ...overrides,
      } as NumberControl

    case 'enum': {
      let options = (overrides as Partial<EnumControl>).options
      if (!options && prop.typeAst?.type === 'union') {
        options = prop.typeAst.elements
          .filter((el) => el.type === 'stringLiteral')
          .map((el) => (el as { type: 'stringLiteral'; value: string }).value)
      }
      return {
        type: 'enum',
        name,
        options: options ?? [],
        defaultValue:
          (overrides as Partial<EnumControl>).defaultValue ??
          (parseDefaultValue(prop.default, 'enum') as string) ??
          options?.[0] ??
          '',
        ...overrides,
      } as EnumControl
    }

    case 'icon':
      return {
        type: 'icon',
        name,
        alwaysShow: overrides.alwaysShow,
        defaultValue: (overrides as Partial<IconControl>).defaultValue,
      }

    default:
      return {
        type: 'string',
        name,
        defaultValue:
          (parseDefaultValue(prop.default, 'string') as string) ?? '',
        ...overrides,
      } as StringControl
  }
}

/**
 * Apply overrides to an inferred control.
 */
function applyOverrides(
  control: Control,
  overrides: Partial<Omit<Control, 'name'>>,
): Control {
  return { ...control, ...overrides } as Control
}

/**
 * Parse a default value string from the API reference.
 */
function parseDefaultValue(
  defaultStr: string | undefined,
  type: 'string' | 'number' | 'boolean' | 'enum',
): string | number | boolean | undefined {
  if (!defaultStr) return undefined

  // Remove quotes from string defaults like "'default'" or "\"md\""
  const cleaned = defaultStr.replace(/^['"]|['"]$/g, '')

  switch (type) {
    case 'boolean':
      return cleaned === 'true'
    case 'number':
      return Number(cleaned) || 0
    case 'string':
    case 'enum':
      return cleaned
    default:
      return cleaned
  }
}

// ============================================================================
// Enrich Controls for Serialization
// ============================================================================

/**
 * Enrich controls with API reference data.
 * Uses shiki highlighter to produce HTML strings (not React nodes).
 */
export async function enrichControlsForSerialization(
  name: string,
  controls: Control[],
  // oxlint-disable-next-line typescript/no-explicit-any -- shiki generic types are complex
  highlighter: HighlighterGeneric<any, any>,
): Promise<SerializableControl[]> {
  const reference = await loadApiReference(name)

  if (!reference) {
    throw new Error(`API reference not found for ${name}`)
  }

  const enrichedControls: SerializableControl[] = []

  for (const control of controls) {
    const prop = reference.props[control.name]

    // Base serializable control without reference
    const baseControl = {
      ...control,
      reference: undefined,
    }

    if (!prop) {
      // Skip enrichment for props not in reference (e.g., custom icon controls)
      enrichedControls.push(baseControl as SerializableControl)
      continue
    }

    // Highlight type and default value as HTML strings
    const typeHighlighted = highlightToHtml(prop.type, highlighter)
    const defaultHighlighted = prop.default
      ? highlightToHtml(prop.default, highlighter)
      : undefined

    const enrichedControl: SerializableControl = {
      ...baseControl,
      reference: {
        description: prop.description,
        typeHighlighted,
        defaultHighlighted,
        defaultRaw: prop.default,
        required: prop.required,
      },
    } as SerializableControl

    enrichedControls.push(enrichedControl)
  }

  return enrichedControls
}

/**
 * Highlight code to HTML string using shiki.
 */
function highlightToHtml(
  code: string,
  // oxlint-disable-next-line typescript/no-explicit-any -- shiki generic types are complex
  highlighter: HighlighterGeneric<any, any>,
): string {
  if (!code) return ''

  const html = highlighter.codeToHtml(code, {
    lang: 'ts',
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  })

  // Extract just the inner content from <pre><code>...</code></pre>
  // We want to inline the highlighted spans, not the full code block
  const match = html.match(/<code[^>]*>([\s\S]*?)<\/code>/)
  return match?.[1] ?? code
}

// ============================================================================
// Utility
// ============================================================================

/**
 * Convert kebab-case to PascalCase.
 */
export function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}
