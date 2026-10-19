/**
 * SourceFirst playground — BUILD-TIME source overlay.
 *
 * Turns one real demo `.tsx` into a `CodeTemplate`: the demo is formatted ONCE
 * with oxfmt, then the formatted root JSX is lifted into a tree that keeps
 * verbatim formatted text for everything static and structured nodes for every
 * position a control can change (attr holes, `{param}` text slots,
 * `{cond && <El>…</El>}` conditionals, `attr={cond ? value : undefined}`
 * attrs, `{!cond && "…"}` text and `{Array.from({ length }, () => <El />)}`
 * repeats). The runtime renderer in
 * `code-template.ts` owns the layout of the dynamic parts, so no per-value
 * formatting ever happens — and the output stays byte-identical to oxfmt.
 *
 * Hole scoping: attr holes attach to the ROOT element, to elements marked with
 * a bare `data-control-target` attribute, and to attrs carrying an
 * `@control:` marker comment (with optional `@drop-when:`). An attr passing a
 * control through under another name (`disabled={isDisabled}`) keeps its own
 * name. An attr whose
 * value is an object literal embedding its control (`visibleDuration={{
 * months: visibleDuration }}`) keeps that literal around the value.
 * `{ident}`, `{ident && …}`, `{ident > 1 && …}`, `{!ident && "…"}` and
 * `{Array.from({ length: ident }, …)}` children, and `ident ? "…" : undefined`
 * attrs, match controls anywhere in the tree, as do members of an expanded
 * object literal inside an attribute (`{ ident }` shorthand,
 * `...(ident && { … })` spread) — for imperative APIs like `toast.add({ … })`.
 *
 * Build-time only (imports oxfmt + ts-morph, both `www` deps).
 */
import { format } from "oxfmt"
import { Node, SyntaxKind } from "ts-morph"
import type {
  FunctionDeclaration,
  JsxAttribute,
  JsxElement,
  JsxSelfClosingElement,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  SourceFile,
} from "ts-morph"

// NOTE: relative (not `@/`) — this module is loaded by the rehype plugin at vite
// config-load time, before the `@/` alias is registered.
import { rewriteImportPath } from "../../../publisher/build-time/transform-base"
import { parseTsx, releaseTsx } from "../build-time"
import type {
  AttrPart,
  ChildPart,
  CodeTemplate,
  CompareOp,
  Comparison,
  ConstDecl,
  ImportDecl,
  MemberPart,
  ObjectAttr,
  SerializedDefault,
  TemplateElement,
  ValueKind,
} from "./code-template"

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

interface OverlayInput {
  source: string
  controls: ControlSelection[]
  componentName?: string
}

export class OverlayError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OverlayError"
  }
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

export async function buildSourceOverlay(
  input: OverlayInput,
): Promise<CodeTemplate> {
  const sf = parseTsx(input.source)
  try {
    stripNonEmitStatements(sf)
    rewriteImports(sf)

    const templated = sf
      .getFullText()
      .replace(/export default function/, "export function")
    const formatted = await formatOrThrow(templated, input)

    // Lift the FORMATTED file into the template tree.
    const f2 = parseTsx(formatted)
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
      releaseTsx(f2)
    }
  } finally {
    releaseTsx(sf)
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
    // `rewriteImportPath` yields the shipped paths, where `ui/*` maps to
    // `@/components/ui/*` — the default shadcn `aliases.ui`, and where a real
    // install lands files. Registry icon names are lucide's, the default library.
    const specifier = imp.getModuleSpecifierValue()
    imp.setModuleSpecifier(
      specifier === "@/registry/icons"
        ? "lucide-react"
        : (rewriteImportPath(specifier) ?? specifier),
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
      if (attrName === "data-control-target") continue
      const controlName = this.byName.has(attrName)
        ? attrName
        : readIdentifierValue(attr)
      const control = controlName ? this.byName.get(controlName) : undefined
      const derived = readDerivedMarker(attr)
      if (controlName && control && (holesAllowed || derived)) {
        this.resolved.add(controlName)
        const wrap = derived ? undefined : readObjectWrap(attr)
        attrs.push({
          part: "attr",
          control: controlName,
          attrName,
          kind: control.kind,
          default: control.default,
          ...((derived?.dropWhen ?? control.dropWhen)
            ? { dropWhen: derived?.dropWhen ?? control.dropWhen }
            : {}),
          ...(wrap ? { wrap } : {}),
        })
        continue
      }
      const guarded = this.readGuardedAttr(attr)
      if (guarded) {
        this.resolved.add(guarded.showWhen)
        attrs.push({ part: "static", ...guarded })
        continue
      }
      const object = this.buildObjectAttr(attr)
      if (object) {
        attrs.push(object)
        continue
      }
      const text = attr.getText()
      if (text.includes("\n")) {
        throw new OverlayError(
          `Multiline attribute "${attrName}" on dynamic <${tag}> is unsupported${named(this.input)}`,
        )
      }
      attrs.push({ part: "static", text })
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

  private buildObjectAttr(attr: JsxAttribute): ObjectAttr | null {
    const objects = attr
      .getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)
      .filter((o) => this.hasBoundMember(o))
    const obj = objects[0]
    if (!obj) return null
    if (objects.length > 1) {
      throw new OverlayError(
        `Attribute "${attr.getNameNode().getText()}" has more than one object with controls${named(this.input)}`,
      )
    }

    const lines = nodeLines(attr)
    const first = attr.getStartLineNumber()
    const open = obj.getStartLineNumber() - first
    const close = obj.getEndLineNumber() - first
    const props = obj.getProperties()
    if (
      open === close ||
      !lines[open]?.endsWith("{") ||
      !lines[close]?.trimStart().startsWith("}")
    ) {
      throw new OverlayError(
        `Object with controls in "${attr.getNameNode().getText()}" must be expanded (newline after "{")${named(this.input)}`,
      )
    }

    const members = props.map((p) => this.buildMember(p))
    if (
      !members.some(
        (m) =>
          m.part === "static" || (m.part === "member" && m.kind === "enum"),
      )
    ) {
      throw new OverlayError(
        `Object with controls in "${attr.getNameNode().getText()}" needs a member that always renders${named(this.input)}`,
      )
    }

    const column = (n: Node) => n.getStart() - n.getStartLinePos()
    return {
      part: "object",
      head: lines.slice(0, open + 1),
      memberIndent: column(props[0] ?? obj) - column(attr),
      members,
      tail: lines.slice(close),
    }
  }

  private buildMember(p: ObjectLiteralElementLike): MemberPart {
    const name = this.boundMemberControl(p)
    if (!name) return { part: "static", lines: withComma(nodeLines(p)) }
    this.resolved.add(name)
    if (Node.isShorthandPropertyAssignment(p)) {
      const control = this.byName.get(name)
      if (control?.kind === "icon" || control?.kind === "node") {
        throw new OverlayError(
          `Object member "${name}" can't take a ${control.kind} control${named(this.input)}`,
        )
      }
      return { part: "member", control: name, kind: control?.kind ?? "string" }
    }
    return {
      part: "spread",
      showWhen: name,
      lines: (spreadGuard(p)?.object.getProperties() ?? []).flatMap((q) =>
        withComma(nodeLines(q)),
      ),
    }
  }

  /** The control a `{ ident }` or `...(ident && { … })` member binds to. */
  private boundMemberControl(p: ObjectLiteralElementLike): string | undefined {
    const name = Node.isShorthandPropertyAssignment(p)
      ? p.getName()
      : spreadGuard(p)?.guard
    return name && this.byName.has(name) ? name : undefined
  }

  private hasBoundMember(obj: ObjectLiteralExpression): boolean {
    return obj.getProperties().some((p) => this.boundMemberControl(p))
  }

  private buildChild(child: Node): ChildPart | null {
    if (Node.isJsxText(child)) {
      const text = child.getText().replace(/\s+/g, " ").trim()
      return text === "" ? null : { part: "static-text", text }
    }

    if (Node.isJsxExpression(child)) {
      const expr = child.getExpression()
      if (!expr) return null // {/* comment */}

      if (Node.isIdentifier(expr) && this.byName.has(expr.getText())) {
        const control = this.byName.get(expr.getText())
        if (!control) return null
        this.resolved.add(control.name)
        return { part: "text", control: control.name, kind: control.kind }
      }

      const hidden = this.readHiddenText(expr)
      if (hidden) {
        this.resolved.add(hidden.hideWhen)
        return { part: "static-text", ...hidden }
      }

      const condition = this.readCondition(expr)
      if (condition && Node.isBinaryExpression(expr)) {
        const { control, compare } = condition
        let right: Node = expr.getRight()
        if (Node.isParenthesizedExpression(right)) right = right.getExpression()
        if (!Node.isJsxElement(right) && !Node.isJsxSelfClosingElement(right)) {
          throw new OverlayError(
            `Conditional "{${control} && …}" must wrap a JSX element${named(this.input)}`,
          )
        }
        this.resolved.add(control)
        return {
          part: "element",
          el: this.buildElement(right, { holesAllowed: false }),
          showWhen: control,
          ...(compare ? { compare } : {}),
        }
      }

      const repeat = this.readRepeat(expr)
      if (repeat) {
        this.resolved.add(repeat.count)
        const el = this.buildElement(repeat.el, { holesAllowed: false })
        // The displayed copies are siblings in JSX, not an array: no key.
        el.attrs = el.attrs.filter(
          (a) => a.part !== "static" || !a.text.startsWith("key="),
        )
        return { part: "repeat", el, count: repeat.count }
      }

      return { part: "static", lines: nodeLines(child) }
    }

    if (Node.isJsxElement(child) || Node.isJsxSelfClosingElement(child)) {
      if (this.containsDynamic(child)) {
        const opening = Node.isJsxElement(child)
          ? child.getOpeningElement()
          : child
        return {
          part: "element",
          el: this.buildElement(child, { holesAllowed: hasMarker(opening) }),
        }
      }
      return { part: "static", lines: nodeLines(child) }
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
        if (n.getNameNode().getText() === "data-control-target") return true
        if (readDerivedMarker(n)) return true
        if (this.readGuardedAttr(n)) return true
        if (
          n
            .getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)
            .some((o) => this.hasBoundMember(o))
        )
          return true
      }
      if (Node.isJsxExpression(n)) {
        const expr = n.getExpression()
        if (!expr) continue
        if (Node.isIdentifier(expr) && this.byName.has(expr.getText()))
          return true
        if (this.readCondition(expr)) return true
        if (this.readHiddenText(expr)) return true
        if (this.readRepeat(expr)) return true
      }
    }
    return false
  }

  /** `Array.from({ length: count }, (_, i) => <El key={i} />)` with `count` a control. */
  private readRepeat(expr: Node): { count: string; el: JsxLike } | null {
    if (
      !Node.isCallExpression(expr) ||
      expr.getExpression().getText() !== "Array.from"
    )
      return null
    const [size, map] = expr.getArguments()
    if (!Node.isObjectLiteralExpression(size) || !Node.isArrowFunction(map))
      return null
    const length = size.getProperty("length")
    const count = Node.isShorthandPropertyAssignment(length)
      ? length.getName()
      : Node.isPropertyAssignment(length)
        ? length.getInitializer()?.getText()
        : undefined
    if (!count || !this.byName.has(count)) return null
    let body: Node = map.getBody()
    if (Node.isParenthesizedExpression(body)) body = body.getExpression()
    if (!Node.isJsxElement(body) && !Node.isJsxSelfClosingElement(body))
      return null
    return { count, el: body }
  }

  /** `attr={ident ? "…" : undefined}` → the attr as written when shown. */
  private readGuardedAttr(
    attr: JsxAttribute,
  ): { text: string; showWhen: string } | null {
    const init = attr.getInitializer()
    if (!init || !Node.isJsxExpression(init)) return null
    const expr = init.getExpression()
    if (
      !expr ||
      !Node.isConditionalExpression(expr) ||
      !this.byName.has(expr.getCondition().getText()) ||
      expr.getWhenFalse().getText() !== "undefined"
    )
      return null
    const name = attr.getNameNode().getText()
    const value = expr.getWhenTrue()
    const text =
      Node.isStringLiteral(value) && !/["\\]/.test(value.getLiteralText())
        ? `${name}="${value.getLiteralText()}"`
        : `${name}={${value.getText()}}`
    if (text.includes("\n")) {
      throw new OverlayError(
        `Guarded attribute "${name}" must fit on one line${named(this.input)}`,
      )
    }
    return { text, showWhen: expr.getCondition().getText() }
  }

  /** `{!ident && "…"}` → the text and the control that hides it. */
  private readHiddenText(
    expr: Node,
  ): { text: string; hideWhen: string } | null {
    if (
      !Node.isBinaryExpression(expr) ||
      expr.getOperatorToken().getText() !== "&&"
    )
      return null
    const left = expr.getLeft()
    const right = expr.getRight()
    if (
      !Node.isPrefixUnaryExpression(left) ||
      left.getOperatorToken() !== SyntaxKind.ExclamationToken ||
      !this.byName.has(left.getOperand().getText()) ||
      !Node.isStringLiteral(right)
    )
      return null
    return {
      text: right.getLiteralText().replace(/\s+/g, " ").trim(),
      hideWhen: left.getOperand().getText(),
    }
  }

  /** `ident && …` or `ident <op> literal && …` over a control, else null. */
  private readCondition(
    expr: Node,
  ): { control: string; compare?: Comparison } | null {
    if (
      !Node.isBinaryExpression(expr) ||
      expr.getOperatorToken().getText() !== "&&"
    )
      return null
    const left = expr.getLeft()
    if (Node.isIdentifier(left))
      return this.byName.has(left.getText())
        ? { control: left.getText() }
        : null
    if (!Node.isBinaryExpression(left)) return null
    const op = left.getOperatorToken().getText()
    const ident = left.getLeft()
    const literal = left.getRight()
    if (
      !COMPARE_OPS.has(op) ||
      !Node.isIdentifier(ident) ||
      !this.byName.has(ident.getText())
    )
      return null
    if (!Node.isNumericLiteral(literal) && !Node.isStringLiteral(literal))
      return null
    return {
      control: ident.getText(),
      compare: { op: op as CompareOp, value: literal.getLiteralValue() },
    }
  }
}

const COMPARE_OPS = new Set(["<", "<=", ">", ">=", "===", "!=="])

/** `attr={{ key: attr }}` → the attr text around the control's one occurrence. */
function readObjectWrap(
  attr: JsxAttribute,
): { before: string; after: string } | undefined {
  const init = attr.getInitializer()
  const expr = Node.isJsxExpression(init) ? init.getExpression() : undefined
  if (!expr || !Node.isObjectLiteralExpression(expr)) return undefined
  const name = attr.getNameNode().getText()
  const refs = expr.getDescendantsOfKind(SyntaxKind.Identifier).filter((id) => {
    const parent = id.getParent()
    return (
      id.getText() === name &&
      !(Node.isPropertyAssignment(parent) && parent.getNameNode() === id)
    )
  })
  const [ref] = refs
  if (refs.length !== 1 || !ref) return undefined
  const text = attr.getText()
  const at = ref.getStart() - attr.getStart()
  return {
    before: text.slice(0, at),
    after: text.slice(at + name.length),
  }
}

function hasMarker(opening: { getAttributes(): Node[] }): boolean {
  return opening
    .getAttributes()
    .some(
      (a) =>
        Node.isJsxAttribute(a) &&
        a.getNameNode().getText() === "data-control-target",
    )
}

/** `disabled={isDisabled}`: the identifier an attr passes through as-is. */
function readIdentifierValue(attr: JsxAttribute): string | undefined {
  const init = attr.getInitializer()
  if (!init || !Node.isJsxExpression(init)) return undefined
  const expr = init.getExpression()
  return expr && Node.isIdentifier(expr) ? expr.getText() : undefined
}

/** Read `@control:` + `@drop-when:` leading comments on a derived attr. */
function readDerivedMarker(attr: JsxAttribute): { dropWhen?: string } | null {
  const full = attr.getFullText()
  if (!/@control:/.test(full)) return null
  const dropMatch = full.match(/@drop-when:\s*([A-Za-z_$][\w$]*)/)
  return { dropWhen: dropMatch?.[1] }
}

/** The guard and object of a `...(guard && { … })` spread member. */
function spreadGuard(
  p: ObjectLiteralElementLike,
): { guard: string; object: ObjectLiteralExpression } | undefined {
  if (!Node.isSpreadAssignment(p)) return undefined
  let expr = p.getExpression()
  if (Node.isParenthesizedExpression(expr)) expr = expr.getExpression()
  if (
    !Node.isBinaryExpression(expr) ||
    expr.getOperatorToken().getText() !== "&&"
  )
    return undefined
  const object = expr.getRight()
  if (!Node.isObjectLiteralExpression(object)) return undefined
  return { guard: expr.getLeft().getText(), object }
}

function withComma(lines: string[]): string[] {
  return lines.map((l, i) => (i === lines.length - 1 ? `${l},` : l))
}

/** A static node's formatted lines, dedented so its first column is 0. */
function nodeLines(node: Node): string[] {
  const column = node.getStart() - node.getStartLinePos()
  const [first = "", ...rest] = node.getText().split("\n")
  return [first, ...rest.map((l) => (l.trim() === "" ? "" : l.slice(column)))]
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
        kind: "default" as const,
      }
    }
    return {
      source: d.getModuleSpecifierValue(),
      text: d.getText(),
      symbols: d.getNamedImports().map((n) => ({
        name: n.getName(),
        local: n.getAliasNode()?.getText(),
      })),
      kind: "named" as const,
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
  const r = await format("demo.tsx", code, OXFMT_OPTIONS)
  if (r.errors.length > 0) {
    throw new OverlayError(
      `oxfmt failed${named(input)}: ${r.errors[0]?.message}\n${r.errors[0]?.codeframe ?? ""}`,
    )
  }
  return r.code
}

function named(i: OverlayInput): string {
  return i.componentName ? ` (${i.componentName})` : ""
}
