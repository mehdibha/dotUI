/**
 * SourceFirst playground — BUILD-TIME source overlay.
 *
 * Turns one real demo `.tsx` into a `CodeTemplate` (template-with-holes).
 *
 * Strategy (LOCKED): format the demo ONCE at the WIDEST CONCRETE instance (every
 * controllable attr present with a real value, every conditional region included),
 * then slice the single formatted string around each controllable position. Each
 * hole OWNS its surrounding whitespace (`sep` / `padBefore`) so a runtime drop only
 * removes spans — oxfmt's wrap decision stays valid for every fill. No sentinels,
 * no per-value formatting, no runtime AST.
 *
 * Build-time only (imports oxfmt + ts-morph, both `www` deps).
 */
import { format } from "oxfmt";
import { Node, Project, ScriptKind, SyntaxKind } from "ts-morph";

import type {
	FunctionDeclaration,
	JsxAttribute,
	JsxElement,
	JsxExpression,
	JsxSelfClosingElement,
	SourceFile,
} from "ts-morph";

// NOTE: relative (not `@/`) — this module is loaded by the rehype plugin at vite
// config-load time, before the `@/` alias is registered.
import { rewriteImportPath } from "../../../publisher/build-time/transform-base";
import { INNER } from "./code-template";

import type {
	AttrHole,
	ChildHole,
	CodeTemplate,
	ConstDecl,
	Hole,
	ImportDecl,
	SerializedDefault,
	ValueKind,
} from "./code-template";

// oxfmt for the GENERATED demo code uses SPACES (Shiki/DynamicPre consume spaces,
// matching the existing transformer.ts tabs→spaces behaviour). printWidth/tabWidth
// mirror .oxfmtrc.jsonc. sortImports stays OFF for stable line identity.
const OXFMT_OPTIONS = { printWidth: 120, tabWidth: 2, useTabs: false } as const;
const BODY_INDENT = 4;

export interface ControlSelection {
	name: string;
	kind: ValueKind;
	/** From the demo PARAM signature (Problem #4 fix). */
	default: SerializedDefault;
	/** Marker-derived: drop this attr when boolean `dropWhen` control is truthy. */
	dropWhen?: string;
}

export interface OverlayInput {
	source: string;
	controls: ControlSelection[];
	componentName?: string;
}

export class OverlayError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "OverlayError";
	}
}

// Singleton project (matches transformer.ts). Each call removes its files in finally.
const project = new Project({ useInMemoryFileSystem: true, compilerOptions: {} });
let fileCounter = 0;
function createSourceFile(source: string): SourceFile {
	return project.createSourceFile(`overlay-${fileCounter++}.tsx`, source, {
		scriptKind: ScriptKind.TSX,
		overwrite: true,
	});
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

export async function buildSourceOverlay(input: OverlayInput): Promise<CodeTemplate> {
	const byName = new Map(input.controls.map((c) => [c.name, c]));
	const sf = createSourceFile(input.source);
	try {
		stripNonEmitStatements(sf);
		rewriteImports(sf);

		const fn = findExportFunction(sf);
		if (!fn) throw new OverlayError(`No exported function in demo${named(input)}`);
		const root = getRootJsxElement(fn);
		if (!root) throw new OverlayError(`Exported function has no root JSX element${named(input)}`);
		const rootTag = root.getOpeningElement().getTagNameNode().getText();

		// selfClose decision MUST be taken BEFORE mutating (mutation forgets descendants).
		const selfCloseWhenEmpty = onlyHoleChildren(root, byName);

		// Plan all positions, THEN apply widest-concrete rewrites (two-phase so spans
		// aren't invalidated mid-scan).
		const plan = planHoles(root, byName, input);
		applyWidestConcrete(plan, byName);

		// Format the whole templated file ONCE. Strip the `@control` / `@drop-when`
		// marker comments first so they never leak into shown code (their meaning was
		// already captured into the plan during planHoles).
		const templated = sf
			.getFullText()
			.replace(/export default function/, "export function")
			.replace(/[ \t]*\/\*\s*@(?:control|drop-when):[^*]*\*\/[ \t]*\n?/g, "");
		const formatted = await formatOrThrow(templated, input);

		// Re-parse the FORMATTED string for canonical text, then slice.
		const f2 = createSourceFile(formatted);
		try {
			const imports = collectImports(f2);
			const consts = collectConsts(f2);
			const { bodyText } = formattedRootBody(f2);
			const { segments, holes } = sliceBody(bodyText, plan);
			if (segments.length !== holes.length + 1) {
				throw new OverlayError(`segment/hole invariant violated (${segments.length} vs ${holes.length})`);
			}
			return { segments, holes, consts, imports, rootTag, selfCloseWhenEmpty, bodyIndent: BODY_INDENT };
		} finally {
			project.removeSourceFile(f2);
		}
	} finally {
		project.removeSourceFile(sf);
	}
}

// ---------------------------------------------------------------------------
// Pre-processing
// ---------------------------------------------------------------------------

function stripNonEmitStatements(sf: SourceFile): void {
	for (const st of [...sf.getStatements()]) {
		if (Node.isExpressionStatement(st) && /["']use client["']/.test(st.getText())) {
			st.remove();
			continue;
		}
		if (Node.isInterfaceDeclaration(st) || Node.isTypeAliasDeclaration(st)) st.remove();
	}
}

function rewriteImports(sf: SourceFile): void {
	for (const imp of sf.getImportDeclarations()) {
		if (imp.isTypeOnly()) {
			imp.remove();
			continue;
		}
		for (const spec of imp.getNamedImports()) if (spec.isTypeOnly()) spec.remove();
		if (imp.getNamedImports().length === 0 && !imp.getDefaultImport() && !imp.getNamespaceImport()) {
			imp.remove();
			continue;
		}
		imp.setModuleSpecifier(rewriteImportPath(imp.getModuleSpecifierValue()) ?? imp.getModuleSpecifierValue());
	}
}

function findExportFunction(sf: SourceFile): FunctionDeclaration | undefined {
	return sf.getFunction((f) => f.isDefaultExport()) ?? sf.getFunction((f) => f.hasExportKeyword());
}

function getRootJsxElement(fn: FunctionDeclaration): JsxElement | undefined {
	const ret = fn.getFirstDescendantByKind(SyntaxKind.ReturnStatement);
	let expr = ret?.getExpression();
	if (!expr) return undefined;
	if (Node.isParenthesizedExpression(expr)) expr = expr.getExpression();
	return Node.isJsxElement(expr) ? expr : undefined;
}

// ---------------------------------------------------------------------------
// Planning (gather positions before mutating)
// ---------------------------------------------------------------------------

type AttrPlan = {
	hole: "attr";
	key: string;
	attrName: string;
	kind: ValueKind;
	default: SerializedDefault;
	dropWhen?: string;
	node: JsxAttribute;
	marker: "attr" | "target" | "derived";
};
type ChildPlan = {
	hole: "child";
	key: string;
	kind: ValueKind;
	default: SerializedDefault;
	node: JsxExpression;
	fragment?: string;
};
type Plan = AttrPlan | ChildPlan;

function planHoles(root: JsxElement, byName: Map<string, ControlSelection>, input: OverlayInput): Plan[] {
	const plans: Plan[] = [];
	const attrKeys = new Set<string>();

	// 1. Root attributes + data-control-target elements + derived markers.
	collectAttrPlans(root.getOpeningElement(), byName, plans, attrKeys, "attr");
	for (const targetEl of findControlTargets(root)) {
		const opening = Node.isJsxElement(targetEl) ? targetEl.getOpeningElement() : targetEl;
		collectAttrPlans(opening, byName, plans, attrKeys, "target");
	}

	// 2. Child idents + conditional slots (snapshot then mutate; slot before ident of same key).
	type Cand =
		| { kind: "ident"; start: number; key: string; node: JsxExpression }
		| { kind: "slot"; start: number; key: string; node: JsxExpression };
	const cands: Cand[] = [];
	for (const ex of root.getDescendantsOfKind(SyntaxKind.JsxExpression)) {
		const e = ex.getExpression();
		if (!e) continue;
		if (Node.isIdentifier(e) && byName.has(e.getText()) && !attrKeys.has(e.getText())) {
			cands.push({ kind: "ident", start: ex.getStart(), key: e.getText(), node: ex });
		} else if (Node.isBinaryExpression(e) && e.getOperatorToken().getText() === "&&") {
			const ctrlName = e.getLeft().getText();
			if (byName.has(ctrlName) && !attrKeys.has(ctrlName)) {
				cands.push({ kind: "slot", start: ex.getStart(), key: ctrlName, node: ex });
			}
		}
	}
	cands.sort((a, b) => (a.kind === "slot" ? 0 : 1) - (b.kind === "slot" ? 0 : 1) || a.start - b.start);
	const seen = new Set<string>();
	for (const c of cands) {
		if (seen.has(c.key) || c.node.wasForgotten()) continue;
		seen.add(c.key);
		const ctrl = byName.get(c.key);
		if (!ctrl) continue;
		plans.push({
			hole: "child",
			key: c.key,
			kind: ctrl.kind,
			default: ctrl.default,
			node: c.node,
			fragment: c.kind === "slot" ? "slot" : undefined,
		});
	}

	// Fail-loud: every declared control must resolve to >=1 plan.
	const resolved = new Set(plans.map((p) => p.key));
	for (const c of input.controls) {
		if (!resolved.has(c.name)) {
			throw new OverlayError(
				`Control "${c.name}" did not resolve to a hole${named(input)}. ` +
					`Root attr? {param} child? {cond && <El/>}? Add a marker for derived/nested-target.`,
			);
		}
	}
	return plans;
}

function collectAttrPlans(
	opening: { getAttributes(): Node[] },
	byName: Map<string, ControlSelection>,
	plans: Plan[],
	attrKeys: Set<string>,
	marker: "attr" | "target",
): void {
	for (const attr of opening.getAttributes()) {
		if (!Node.isJsxAttribute(attr)) continue; // skip {...spread}
		const attrName = attr.getNameNode().getText();
		if (attrName === "data-control-target") continue; // stripped later
		const ctrl = byName.get(attrName);
		if (!ctrl) continue;
		const derived = readDerivedMarker(attr);
		plans.push({
			hole: "attr",
			key: attrName,
			attrName,
			kind: ctrl.kind,
			default: ctrl.default,
			dropWhen: derived?.dropWhen ?? ctrl.dropWhen,
			node: attr,
			marker: derived ? "derived" : marker,
		});
		attrKeys.add(attrName);
	}
}

/** Find elements carrying a bare `data-control-target` marker attribute. */
function findControlTargets(root: JsxElement): Array<JsxElement | JsxSelfClosingElement> {
	const out: Array<JsxElement | JsxSelfClosingElement> = [];
	const hasMarker = (openLike: { getAttributes(): Node[] }) =>
		openLike.getAttributes().some((a) => Node.isJsxAttribute(a) && a.getNameNode().getText() === "data-control-target");
	for (const el of root.getDescendantsOfKind(SyntaxKind.JsxElement)) {
		if (el === root) continue;
		if (hasMarker(el.getOpeningElement())) out.push(el);
	}
	for (const el of root.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)) {
		if (hasMarker(el)) out.push(el);
	}
	return out;
}

/** Read `@control:` + `@drop-when:` leading comments on a derived attr. */
function readDerivedMarker(attr: JsxAttribute): { dropWhen?: string } | null {
	const full = attr.getFullText();
	if (!/@control:/.test(full)) return null;
	const dropMatch = full.match(/@drop-when:\s*([A-Za-z_$][\w$]*)/);
	return { dropWhen: dropMatch?.[1] };
}

// ---------------------------------------------------------------------------
// Widest-concrete rewrite (the wrap-stability key)
// ---------------------------------------------------------------------------

function applyWidestConcrete(plans: Plan[], byName: Map<string, ControlSelection>): void {
	for (const p of plans) {
		if (p.hole !== "attr" || p.node.wasForgotten()) continue;
		const ctrl = byName.get(p.key);
		if (!ctrl) continue;
		if (p.marker === "derived") continue; // keep the real derived expression
		widenAttr(p.node, p.attrName, ctrl);
	}
	stripMarkerAttrs(plans);
	// Child holes: widen {ident} to a concrete child; slots stay verbatim.
	for (const p of plans) {
		if (p.hole !== "child" || p.fragment || p.node.wasForgotten()) continue;
		const ctrl = byName.get(p.key);
		if (!ctrl) continue;
		const wide =
			ctrl.kind === "icon"
				? "<MailIcon />"
				: ctrl.kind === "number"
					? `{${ctrl.default ?? 0}}`
					: `{${JSON.stringify(String(ctrl.default ?? "x"))}}`;
		p.node.replaceWithText(wide);
	}
}

function widenAttr(attr: JsxAttribute, name: string, ctrl: ControlSelection): void {
	switch (ctrl.kind) {
		case "boolean":
			attr.replaceWithText(name); // shorthand
			break;
		case "number":
			attr.setInitializer(`{${ctrl.default ?? 0}}`);
			break;
		case "icon":
			attr.setInitializer(`{<MailIcon />}`);
			break;
		default:
			attr.setInitializer(JSON.stringify(String(ctrl.default ?? "x")));
	}
}

function stripMarkerAttrs(plans: Plan[]): void {
	const owners = new Set<JsxElement | JsxSelfClosingElement>();
	for (const p of plans) {
		if (p.hole === "attr" && p.marker === "target" && !p.node.wasForgotten()) {
			const parent = p.node.getFirstAncestorByKind(SyntaxKind.JsxElement);
			if (parent) owners.add(parent);
			const self = p.node.getFirstAncestorByKind(SyntaxKind.JsxSelfClosingElement);
			if (self) owners.add(self);
		}
	}
	for (const owner of owners) {
		const opening = Node.isJsxElement(owner) ? owner.getOpeningElement() : owner;
		for (const a of opening.getAttributes()) {
			if (Node.isJsxAttribute(a) && a.getNameNode().getText() === "data-control-target") a.remove();
		}
	}
}

// ---------------------------------------------------------------------------
// Collect (from FORMATTED file)
// ---------------------------------------------------------------------------

function collectImports(sf: SourceFile): ImportDecl[] {
	return sf.getImportDeclarations().map((d) => {
		const def = d.getDefaultImport();
		if (def) {
			return {
				source: d.getModuleSpecifierValue(),
				text: d.getText(),
				symbols: [{ name: def.getText() }],
				kind: "default" as const,
			};
		}
		return {
			source: d.getModuleSpecifierValue(),
			text: d.getText(),
			symbols: d.getNamedImports().map((n) => ({ name: n.getName(), local: n.getAliasNode()?.getText() })),
			kind: "named" as const,
		};
	});
}

function collectConsts(sf: SourceFile): ConstDecl[] {
	const out: ConstDecl[] = [];
	for (const st of sf.getStatements()) {
		if (!Node.isVariableStatement(st) || st.hasExportKeyword()) continue;
		for (const d of st.getDeclarations()) {
			out.push({ name: d.getName(), real: st.getText(), placeholder: `const ${d.getName()} = /* ... */;` });
		}
	}
	return out;
}

function formattedRootBody(sf: SourceFile): { bodyText: string } {
	const fn = findExportFunction(sf);
	const root = fn && getRootJsxElement(fn);
	if (!root) throw new OverlayError("formatted file lost its root JSX element");
	return { bodyText: dedent(root.getText()) };
}

// ---------------------------------------------------------------------------
// Slice the formatted body → segments ⋈ holes (sep-owned)
// ---------------------------------------------------------------------------

function sliceBody(body: string, plans: Plan[]): { segments: string[]; holes: Hole[] } {
	type Located = { plan: Plan; dropStart: number; dropEnd: number; sep?: string; padBefore?: string; raw: string };
	const located: Located[] = [];

	for (const p of plans) {
		if (p.hole === "attr") {
			const loc = locateAttr(body, p.attrName);
			if (!loc) throw new OverlayError(`attr "${p.attrName}" not found in formatted body`);
			located.push({
				plan: p,
				dropStart: loc.start,
				dropEnd: loc.end,
				sep: loc.sep,
				raw: body.slice(loc.start, loc.end),
			});
		} else {
			const loc = locateChild(body, p);
			if (!loc) throw new OverlayError(`child "${p.key}" not found in formatted body`);
			located.push({
				plan: p,
				dropStart: loc.start,
				dropEnd: loc.end,
				padBefore: loc.padBefore,
				raw: body.slice(loc.start, loc.end),
			});
		}
	}
	located.sort((a, b) => a.dropStart - b.dropStart);

	const segments: string[] = [];
	const holes: Hole[] = [];
	let cursor = 0;
	for (const L of located) {
		segments.push(body.slice(cursor, L.dropStart));
		holes.push(toHole(L.plan, L.sep, L.padBefore, L.raw));
		cursor = L.dropEnd;
	}
	segments.push(body.slice(cursor));
	return { segments, holes };
}

/** Find an attribute's full span + the separator before it. Handles inline and wrapped. */
function locateAttr(body: string, attrName: string): { start: number; end: number; sep: string } | null {
	const re = new RegExp(`(\\s+)${escapeRe(attrName)}(?=[\\s/>=])`, "g");
	const m = re.exec(body);
	if (!m) return null;
	const sep = m[1] ?? "";
	const nameEnd = m.index + sep.length + attrName.length;
	// Peek (without committing) past inline whitespace for a value `=`. If there is
	// no value (boolean shorthand), the drop span ends at the name — trailing space
	// belongs to the NEXT attr's sep / the following literal, never to this hole.
	let j = nameEnd;
	while (j < body.length && /[^\S\n]/.test(body.charAt(j))) j++;
	let i = nameEnd;
	if (body[j] === "=") {
		i = j + 1;
		while (i < body.length && /[^\S\n]/.test(body.charAt(i))) i++;
		if (body[i] === "{") {
			let depth = 0;
			for (; i < body.length; i++) {
				if (body[i] === "{") depth++;
				else if (body[i] === "}") {
					depth--;
					if (depth === 0) {
						i++;
						break;
					}
				}
			}
		} else if (body[i] === '"' || body[i] === "'") {
			const q = body[i];
			i++;
			while (i < body.length && body[i] !== q) i++;
			i++;
		}
	}
	return { start: m.index, end: i, sep };
}

/** Find a child region's span + the padding (newline+indent) it owns. */
function locateChild(body: string, p: ChildPlan): { start: number; end: number; padBefore: string } | null {
	const at = p.fragment ? findSlotLine(body, p.key) : body.indexOf(childToken(p));
	if (at < 0) return null;
	const before = body.slice(0, at);
	const pm = before.match(/(\n[ \t]*)$/);
	const padBefore = pm?.[1] ?? "";
	const start = at - padBefore.length;
	const end = at + regionLength(body, at);
	return { start, end, padBefore };
}

function childToken(p: ChildPlan): string {
	if (p.kind === "icon") return "<MailIcon />";
	if (p.kind === "number") return `{${p.default ?? 0}}`;
	return `{${JSON.stringify(String(p.default ?? "x"))}}`;
}

function regionLength(body: string, at: number): number {
	if (body[at] !== "{") {
		const close = body.indexOf("/>", at);
		return close >= 0 ? close + 2 - at : body.length - at;
	}
	let depth = 0;
	for (let i = at; i < body.length; i++) {
		if (body[i] === "{") depth++;
		else if (body[i] === "}") {
			depth--;
			if (depth === 0) return i + 1 - at;
		}
	}
	return body.length - at;
}

function findSlotLine(body: string, key: string): number {
	const re = new RegExp(`\\{\\s*${escapeRe(key)}\\s*&&`);
	const m = re.exec(body);
	return m ? m.index : -1;
}

function toHole(plan: Plan, sep: string | undefined, padBefore: string | undefined, raw: string): Hole {
	if (plan.hole === "attr") {
		const h: AttrHole = {
			slot: "attr",
			control: plan.key,
			attrName: plan.attrName,
			kind: plan.kind,
			default: plan.default,
			sep: sep ?? " ",
		};
		if (plan.dropWhen) h.dropWhen = plan.dropWhen;
		return h;
	}
	const h: ChildHole = {
		slot: "child",
		control: plan.key,
		kind: plan.kind,
		default: plan.default,
		padBefore: padBefore ?? "",
		padAfter: "",
		droppable: true,
	};
	if (plan.fragment) h.fragment = innerizeFragment(raw, plan.key);
	return h;
}

/** From `{label && <Label>{label}</Label>}` produce `<Label>INNER</Label>`. */
function innerizeFragment(raw: string, key: string): string {
	const m = raw.match(/&&\s*([\s\S]*?)\s*\}$/);
	const el = m?.[1] ?? raw;
	return el.replace(new RegExp(`\\{${escapeRe(key)}\\}`, "g"), INNER);
}

// ---------------------------------------------------------------------------
// selfClose + utils
// ---------------------------------------------------------------------------

function onlyHoleChildren(root: JsxElement, byName: Map<string, ControlSelection>): boolean {
	for (const child of root.getJsxChildren()) {
		if (Node.isJsxText(child)) {
			if (child.getText().trim() !== "") return false;
			continue;
		}
		if (Node.isJsxExpression(child)) {
			const e = child.getExpression();
			if (!e) continue; // {/* comment */}
			if (Node.isIdentifier(e) && byName.has(e.getText())) continue;
			if (Node.isBinaryExpression(e) && byName.has(e.getLeft().getText())) continue;
			return false; // e.g. {items.map(...)}
		}
		if (Node.isJsxClosingElement(child) || Node.isJsxOpeningElement(child)) continue;
		return false; // a real element child
	}
	return true;
}

function dedent(code: string): string {
	const lines = code.split("\n");
	if (lines.length <= 1) return code;
	const min = lines.slice(1).reduce((m, l) => {
		if (l.trim() === "") return m;
		return Math.min(m, l.match(/^(\s*)/)?.[1]?.length ?? 0);
	}, Number.POSITIVE_INFINITY);
	if (min === 0 || min === Number.POSITIVE_INFINITY) return code;
	return lines.map((l, i) => (i === 0 ? l : l.trim() === "" ? "" : l.slice(min))).join("\n");
}

async function formatOrThrow(code: string, input: OverlayInput): Promise<string> {
	const r = await format("demo.tsx", code, OXFMT_OPTIONS);
	if (r.errors.length > 0) {
		throw new OverlayError(`oxfmt failed${named(input)}: ${r.errors[0]?.message}\n${r.errors[0]?.codeframe ?? ""}`);
	}
	return r.code;
}

function escapeRe(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function named(i: OverlayInput): string {
	return i.componentName ? ` (${i.componentName})` : "";
}
