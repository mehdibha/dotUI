import type { RegistryItem } from '@/registry/types'

export type RegistryCssFields = Pick<RegistryItem, 'css' | 'cssVars'>

type CssValue = NonNullable<RegistryItem['css']>[string]
type CssObject = Record<string, CssValue>
type CssVars = NonNullable<RegistryItem['cssVars']>

type CssNode = AtRuleNode | DeclarationNode | RuleNode

interface AtRuleNode {
  type: 'atrule'
  name: string
  params: string
  nodes: CssNode[]
}

interface DeclarationNode {
  type: 'decl'
  prop: string
  value: string
}

interface RuleNode {
  type: 'rule'
  selector: string
  nodes: CssNode[]
}

export function cssToRegistryFields(css: string): RegistryCssFields {
  const fields: RegistryCssFields = {}
  for (const node of parseCss(css)) {
    addNodeToFields(fields, node)
  }
  return compactFields(fields)
}

function addNodeToFields(fields: RegistryCssFields, node: CssNode): void {
  if (node.type === 'atrule' && node.name === 'theme') {
    addDeclarationsToVars(fields, 'theme', node.nodes, {
      stripCustomPropertyPrefix: false,
    })
    return
  }

  const entry = nodeToCssEntry(node)
  if (!entry) return

  fields.css ??= {}
  mergeCssEntry(fields.css, entry[0], entry[1])
}

function addDeclarationsToVars(
  fields: RegistryCssFields,
  key: keyof CssVars,
  nodes: CssNode[],
  options: { stripCustomPropertyPrefix: boolean },
): void {
  const declarations = nodes.filter(
    (node): node is DeclarationNode =>
      node.type === 'decl' && node.prop.startsWith('--'),
  )
  if (declarations.length === 0) return

  fields.cssVars ??= {}
  const target = (fields.cssVars[key] ??= {})
  for (const declaration of declarations) {
    target[cssVarKey(declaration.prop, options)] = declaration.value
  }
}

function nodeToCssEntry(node: CssNode): [string, CssValue] | undefined {
  if (node.type === 'decl') return [node.prop, node.value]
  if (node.type === 'rule') return [node.selector, nodesToCssObject(node.nodes)]

  const key = `@${node.name}${node.params ? ` ${node.params}` : ''}`
  // shadcn emits @plugin as a statement, so nested plugin option bodies would
  // be dropped by the installer anyway. Keep the plugin declaration explicit.
  if (node.name === 'plugin') return [key, {}]
  return [key, node.nodes.length > 0 ? nodesToCssObject(node.nodes) : {}]
}

function nodesToCssObject(nodes: CssNode[]): CssObject {
  const out: CssObject = {}
  for (const node of nodes) {
    const entry = nodeToCssEntry(node)
    if (!entry) continue
    mergeCssEntry(out, entry[0], entry[1])
  }
  return out
}

function mergeCssEntry(target: CssObject, key: string, value: CssValue): void {
  const existing = target[key]
  if (isPlainObject(existing) && isPlainObject(value)) {
    for (const [childKey, childValue] of Object.entries(value)) {
      mergeCssEntry(existing as CssObject, childKey, childValue)
    }
    return
  }
  target[key] = value
}

function compactFields(fields: RegistryCssFields): RegistryCssFields {
  const out: RegistryCssFields = {}
  if (fields.css && Object.keys(fields.css).length > 0) out.css = fields.css
  if (fields.cssVars) {
    const cssVars: CssVars = {}
    for (const key of ['theme', 'light', 'dark'] as const) {
      const value = fields.cssVars[key]
      if (value && Object.keys(value).length > 0) cssVars[key] = value
    }
    if (Object.keys(cssVars).length > 0) out.cssVars = cssVars
  }
  return out
}

function isPlainObject(value: unknown): value is Record<string, CssValue> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function cssVarKey(
  prop: string,
  options: { stripCustomPropertyPrefix: boolean },
): string {
  return options.stripCustomPropertyPrefix ? prop.replace(/^--/, '') : prop
}

function parseCss(input: string): CssNode[] {
  const parser = new CssParser(stripComments(input))
  return parser.parseNodes()
}

function stripComments(input: string): string {
  return input.replace(/\/\*[\s\S]*?\*\//g, '')
}

class CssParser {
  private index = 0

  constructor(private readonly input: string) {}

  parseNodes(): CssNode[] {
    const nodes: CssNode[] = []
    while (this.index < this.input.length) {
      this.skipWhitespace()
      if (this.peek() === '}') break
      const node = this.parseNode()
      if (node) nodes.push(node)
    }
    return nodes
  }

  private parseNode(): CssNode | undefined {
    const start = this.index
    const endChar = this.readPreludeEnd()
    const prelude = this.input.slice(start, this.index).trim()

    if (!prelude) {
      if (this.index < this.input.length) this.index += 1
      return undefined
    }

    if (endChar === '{') {
      this.index += 1
      const nodes = this.parseNodes()
      if (this.peek() === '}') this.index += 1
      return prelude.startsWith('@')
        ? atRuleWithNodes(prelude, nodes)
        : { type: 'rule', selector: prelude, nodes }
    }

    if (endChar === ';') this.index += 1
    if (prelude.startsWith('@')) return atRuleWithNodes(prelude, [])

    const colon = findTopLevelColon(prelude)
    if (colon === -1) return undefined
    return {
      type: 'decl',
      prop: prelude.slice(0, colon).trim(),
      value: prelude.slice(colon + 1).trim(),
    }
  }

  private readPreludeEnd(): string | undefined {
    let quote: string | undefined
    let parenDepth = 0
    for (; this.index < this.input.length; this.index += 1) {
      const char = this.input[this.index]
      const prev = this.input[this.index - 1]
      if (quote) {
        if (char === quote && prev !== '\\') quote = undefined
        continue
      }
      if (char === `"` || char === `'`) {
        quote = char
        continue
      }
      if (char === '(' || char === '[') {
        parenDepth += 1
        continue
      }
      if (char === ')' || char === ']') {
        parenDepth = Math.max(0, parenDepth - 1)
        continue
      }
      if (parenDepth === 0 && (char === '{' || char === ';' || char === '}'))
        return char
    }
    return undefined
  }

  private skipWhitespace(): void {
    while (/\s/.test(this.peek() ?? '')) this.index += 1
  }

  private peek(): string | undefined {
    return this.input[this.index]
  }
}

function atRuleWithNodes(prelude: string, nodes: CssNode[]): AtRuleNode {
  const body = prelude.slice(1).trim()
  const space = body.search(/\s/)
  if (space === -1) return { type: 'atrule', name: body, params: '', nodes }
  return {
    type: 'atrule',
    name: body.slice(0, space),
    params: body.slice(space + 1).trim(),
    nodes,
  }
}

function findTopLevelColon(input: string): number {
  let quote: string | undefined
  let parenDepth = 0
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]
    const prev = input[i - 1]
    if (quote) {
      if (char === quote && prev !== '\\') quote = undefined
      continue
    }
    if (char === `"` || char === `'`) {
      quote = char
      continue
    }
    if (char === '(' || char === '[') {
      parenDepth += 1
      continue
    }
    if (char === ')' || char === ']') {
      parenDepth = Math.max(0, parenDepth - 1)
      continue
    }
    if (char === ':' && parenDepth === 0) return i
  }
  return -1
}
