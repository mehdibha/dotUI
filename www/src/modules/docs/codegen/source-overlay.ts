/**
 * SourceFirst playground — BUILD-TIME source overlay.
 *
 * Turns one real demo `.tsx` into a `CodeTemplate`: the demo is formatted ONCE
 * with oxfmt, then the formatted root JSX is lifted into a tree that keeps
 * verbatim formatted text for everything static and structured nodes for every
 * position a control can change (attr holes, `{param}` text slots,
 * `{cond && <El>…</El>}` conditionals). The runtime renderer in
 * `code-template.ts` owns the layout of the dynamic parts, so no per-value
 * formatting ever happens — and the output stays byte-identical to oxfmt.
 *
 * Hole scoping: attr holes attach to the ROOT element, to elements marked with
 * a bare `data-control-target` attribute, and to attrs carrying an
 * `@control:` marker comment (with optional `@drop-when:`). `{ident}` and
 * `{ident && …}` children match controls anywhere in the tree.
 *
 * Build-time only (imports oxfmt + ts-morph, both `www` deps).
 */
import { format } from 'oxfmt'
import { Node, Project, ScriptKind, SyntaxKind } from 'ts-morph'
import type {
  FunctionDeclaration,
  JsxAttribute,
  JsxElement,
  JsxSelfClosingElement,
  SourceFile,
} from 'ts-morph'

// NOTE: relative (not `@/`) — this module is loaded by the rehype plugin at vite
// config-load time, before the `@/` alias is registered.
import { rewriteImportPath } from '../../../publisher/build-time/transform-base'
import type {
  AttrPart,
  ChildPart,
  CodeTemplate,
  ConstDecl,
  ImportDecl,
  SerializedDefault,
  TemplateElement,
  ValueKind,
} from './code-template'

// The style contract for GENERATED demo code: oxfmt defaults (semicolons,
// double quotes) at printWidth 120, 2-space indent. SPACES because Shiki/
// DynamicPre consume spaces; sortImports stays OFF for stable line identity.
// Exported so the fidelity spec verifies against the exact same options.
export const OXFMT_OPTIONS = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
} as const
const BODY_INDENT = 4

export interface ControlSelection {
  name: string
  kind: ValueKind
  /** From the demo PARAM signature (the default the user sees). */
  default: SerializedDefault
  /** Marker-derived: drop this attr when boolean `dropWhen` control is truthy. */
  dropWhen?: string
}

export interface OverlayInput {
  source: string
  controls: ControlSelection[]
  componentName?: string
}

export class OverlayError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OverlayError'
  }
}

// Singleton project (matches transformer.ts). Each call removes its files in finally.
const project = new Project({
  useInMemoryFileSystem: true,
  compilerOptions: {},
})
let fileCounter = 0
function createSourceFile(source: string): SourceFile {
  return project.createSourceFile(`overlay-${fileCounter++}.tsx`, source, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

export async function buildSourceOverlay(
  input: OverlayInput,
): Promise<CodeTemplate> {
  const sf = createSourceFile(input.source)
  try {
    stripNonEmitStatements(sf)
    rewriteImports(sf)

    const templated = sf
      .getFullText()
      .replace(/export default function/, 'export function')
    const formatted = await formatOrThrow(templated, input)

    // Lift the FORMATTED file into the template tree.
    const f2 = createSourceFile(formatted)
    try {
      const fn = findExportFunction(f2)
      if (!fn)
        throw new OverlayError(`No exported function in demo${named(input)}`)
      const root = getRootJsxElement(fn)
      if (!root)
        throw new OverlayError(
          `Exported function has no root JSX element${named(input)}`,
        )

      const builder = new TreeBuilder(input)
      const rootElement = builder.buildElement(root, { holesAllowed: true })
      builder.assertAllControlsResolved()

      return {
        root: rootElement,
        consts: collectConsts(f2),
        imports: collectImports(f2),
        bodyIndent: BODY_INDENT,
      }
    } finally {
      project.removeSourceFile(f2)
    }
  } finally {
    project.removeSourceFile(sf)
  }
}

// ---------------------------------------------------------------------------
// Pre-processing
// ---------------------------------------------------------------------------

function stripNonEmitStatements(sf: SourceFile): void {
  for (const st of [...sf.getStatements()]) {
    if (
      Node.isExpressionStatement(st) &&
      /["']use client["']/.test(st.getText())
    ) {
      st.remove()
      continue
    }
    if (Node.isInterfaceDeclaration(st) || Node.isTypeAliasDeclaration(st))
      st.remove()
  }
}

function rewriteImports(sf: SourceFile): void {
  for (const imp of sf.getImportDeclarations()) {
    if (imp.isTypeOnly()) {
      imp.remove()
      continue
    }
    for (const spec of imp.getNamedImports())
      if (spec.isTypeOnly()) spec.remove()
    if (
      imp.getNamedImports().length === 0 &&
      !imp.getDefaultImport() &&
      !imp.getNamespaceImport()
    ) {
      imp.remove()
      continue
    }
    imp.setModuleSpecifier(
      rewriteImportPath(imp.getModuleSpecifierValue()) ??
        imp.getModuleSpecifierValue(),
    )
  }
}

function findExportFunction(sf: SourceFile): FunctionDeclaration | undefined {
  return (
    sf.getFunction((f) => f.isDefaultExport()) ??
    sf.getFunction((f) => f.hasExportKeyword())
  )
}

function getRootJsxElement(
  fn: FunctionDeclaration,
): JsxElement | JsxSelfClosingElement | undefined {
  const ret = fn.getFirstDescendantByKind(SyntaxKind.ReturnStatement)
  let expr = ret?.getExpression()
  if (!expr) return undefined
  if (Node.isParenthesizedExpression(expr)) expr = expr.getExpression()
  if (Node.isJsxElement(expr) || Node.isJsxSelfClosingElement(expr)) return expr
  return undefined
}

// ---------------------------------------------------------------------------
// Tree lifting
// ---------------------------------------------------------------------------

type JsxLike = JsxElement | JsxSelfClosingElement

class TreeBuilder {
  private readonly byName: Map<string, ControlSelection>
  private readonly input: OverlayInput
  private readonly resolved = new Set<string>()

  constructor(input: OverlayInput) {
    this.input = input
    this.byName = new Map(input.controls.map((c) => [c.name, c]))
  }

  assertAllControlsResolved(): void {
    for (const c of this.input.controls) {
      if (!this.resolved.has(c.name)) {
        throw new OverlayError(
          `Control "${c.name}" did not resolve to a hole${named(this.input)}. ` +
            `Root attr? {param} child? {cond && <El/>}? Add a marker for derived/nested-target.`,
        )
      }
    }
  }

  buildElement(
    node: JsxLike,
    { holesAllowed }: { holesAllowed: boolean },
  ): TemplateElement {
    const opening = Node.isJsxElement(node) ? node.getOpeningElement() : node
    const tag = opening.getTagNameNode().getText()

    const attrs: AttrPart[] = []
    for (const attr of opening.getAttributes()) {
      if (!Node.isJsxAttribute(attr)) {
        throw new OverlayError(
          `Spread attribute on dynamic <${tag}> is unsupported${named(this.input)}`,
        )
      }
      const attrName = attr.getNameNode().getText()
      if (attrName === 'data-control-target') continue
      const control = this.byName.get(attrName)
      const derived = readDerivedMarker(attr)
      if (control && (holesAllowed || derived)) {
        this.resolved.add(attrName)
        attrs.push({
          part: 'attr',
          control: attrName,
          attrName,
          kind: control.kind,
          default: control.default,
          ...((derived?.dropWhen ?? control.dropWhen)
            ? { dropWhen: derived?.dropWhen ?? control.dropWhen }
            : {}),
        })
        continue
      }
      const text = attr.getText()
      if (text.includes('\n')) {
        throw new OverlayError(
          `Multiline attribute "${attrName}" on dynamic <${tag}> is unsupported${named(this.input)}`,
        )
      }
      attrs.push({ part: 'static', text })
    }

    const children: ChildPart[] = []
    if (Node.isJsxElement(node)) {
      for (const child of node.getJsxChildren()) {
        const part = this.buildChild(child)
        if (part) children.push(part)
      }
    }
    return { tag, attrs, children }
  }

  private buildChild(child: Node): ChildPart | null {
    if (Node.isJsxText(child)) {
      const text = child.getText().replace(/\s+/g, ' ').trim()
      return text === '' ? null : { part: 'static-text', text }
    }

    if (Node.isJsxExpression(child)) {
      const expr = child.getExpression()
      if (!expr) return null // {/* comment */}

      if (Node.isIdentifier(expr) && this.byName.has(expr.getText())) {
        const control = this.byName.get(expr.getText())
        if (!control) return null
        this.resolved.add(control.name)
        return { part: 'text', control: control.name, kind: control.kind }
      }

      if (
        Node.isBinaryExpression(expr) &&
        expr.getOperatorToken().getText() === '&&' &&
        this.byName.has(expr.getLeft().getText())
      ) {
        const control = expr.getLeft().getText()
        let right: Node = expr.getRight()
        if (Node.isParenthesizedExpression(right)) right = right.getExpression()
        if (!Node.isJsxElement(right) && !Node.isJsxSelfClosingElement(right)) {
          throw new OverlayError(
            `Conditional "{${control} && …}" must wrap a JSX element${named(this.input)}`,
          )
        }
        this.resolved.add(control)
        return {
          part: 'element',
          el: this.buildElement(right, { holesAllowed: false }),
          showWhen: control,
        }
      }

      return { part: 'static', lines: nodeLines(child) }
    }

    if (Node.isJsxElement(child) || Node.isJsxSelfClosingElement(child)) {
      if (this.containsDynamic(child)) {
        const opening = Node.isJsxElement(child)
          ? child.getOpeningElement()
          : child
        return {
          part: 'element',
          el: this.buildElement(child, { holesAllowed: hasMarker(opening) }),
        }
      }
      return { part: 'static', lines: nodeLines(child) }
    }

    throw new OverlayError(
      `Unsupported JSX child of kind ${child.getKindName()}${named(this.input)}`,
    )
  }

  /** Does this subtree contain anything a control can change? */
  private containsDynamic(node: JsxLike): boolean {
    const openings: Node[] = [node, ...node.getDescendants()]
    for (const n of openings) {
      if (Node.isJsxAttribute(n)) {
        if (n.getNameNode().getText() === 'data-control-target') return true
        if (readDerivedMarker(n)) return true
      }
      if (Node.isJsxExpression(n)) {
        const expr = n.getExpression()
        if (!expr) continue
        if (Node.isIdentifier(expr) && this.byName.has(expr.getText()))
          return true
        if (
          Node.isBinaryExpression(expr) &&
          expr.getOperatorToken().getText() === '&&' &&
          this.byName.has(expr.getLeft().getText())
        )
          return true
      }
    }
    return false
  }
}

function hasMarker(opening: { getAttributes(): Node[] }): boolean {
  return opening
    .getAttributes()
    .some(
      (a) =>
        Node.isJsxAttribute(a) &&
        a.getNameNode().getText() === 'data-control-target',
    )
}

/** Read `@control:` + `@drop-when:` leading comments on a derived attr. */
function readDerivedMarker(attr: JsxAttribute): { dropWhen?: string } | null {
  const full = attr.getFullText()
  if (!/@control:/.test(full)) return null
  const dropMatch = full.match(/@drop-when:\s*([A-Za-z_$][\w$]*)/)
  return { dropWhen: dropMatch?.[1] }
}

/** A static node's formatted lines, dedented so its first column is 0. */
function nodeLines(node: Node): string[] {
  const column = node.getStart() - node.getStartLinePos()
  const [first = '', ...rest] = node.getText().split('\n')
  return [first, ...rest.map((l) => (l.trim() === '' ? '' : l.slice(column)))]
}

// ---------------------------------------------------------------------------
// Collect (from the FORMATTED file)
// ---------------------------------------------------------------------------

function collectImports(sf: SourceFile): ImportDecl[] {
  return sf.getImportDeclarations().map((d) => {
    const def = d.getDefaultImport()
    if (def) {
      return {
        source: d.getModuleSpecifierValue(),
        text: d.getText(),
        symbols: [{ name: def.getText() }],
        kind: 'default' as const,
      }
    }
    return {
      source: d.getModuleSpecifierValue(),
      text: d.getText(),
      symbols: d.getNamedImports().map((n) => ({
        name: n.getName(),
        local: n.getAliasNode()?.getText(),
      })),
      kind: 'named' as const,
    }
  })
}

function collectConsts(sf: SourceFile): ConstDecl[] {
  const out: ConstDecl[] = []
  for (const st of sf.getStatements()) {
    if (!Node.isVariableStatement(st) || st.hasExportKeyword()) continue
    for (const d of st.getDeclarations()) {
      out.push({
        name: d.getName(),
        real: st.getText(),
        placeholder: `const ${d.getName()} = /* ... */;`,
      })
    }
  }
  return out
}

async function formatOrThrow(
  code: string,
  input: OverlayInput,
): Promise<string> {
  const r = await format('demo.tsx', code, OXFMT_OPTIONS)
  if (r.errors.length > 0) {
    throw new OverlayError(
      `oxfmt failed${named(input)}: ${r.errors[0]?.message}\n${r.errors[0]?.codeframe ?? ''}`,
    )
  }
  return r.code
}

function named(i: OverlayInput): string {
  return i.componentName ? ` (${i.componentName})` : ''
}
