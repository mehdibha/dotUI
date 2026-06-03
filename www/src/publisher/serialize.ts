/**
 * Render a plain JS value as a TS object literal source string.
 *
 * Used to turn the resolved tv config into the `%%TV_CONFIG%%` substitution
 * for the published component template. Output is intentionally simple:
 *   - object keys are bare identifiers when valid, JSON-quoted otherwise
 *   - strings use double quotes (JSON.stringify)
 *   - arrays and objects break onto multiple lines for readability
 *   - undefined / null entries inside objects are skipped
 *
 * The final source goes through `oxfmt` after substitution, so we don't try
 * to be precise about whitespace here.
 */

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function quoteKey(key: string): string {
	return IDENT_RE.test(key) ? key : JSON.stringify(key);
}

function serializeValue(value: unknown, indent: number): string {
	if (value === null) return "null";
	if (value === undefined) return "undefined";
	if (typeof value === "string") return JSON.stringify(value);
	if (typeof value === "number" || typeof value === "boolean") return String(value);

	if (Array.isArray(value)) return serializeArray(value, indent);
	if (isPlainObject(value)) return serializeObject(value, indent);

	return JSON.stringify(value);
}

function serializeArray(value: unknown[], indent: number): string {
	if (value.length === 0) return "[]";
	const pad = "\t".repeat(indent + 1);
	const close = "\t".repeat(indent);
	const items = value.map((item) => `${pad}${serializeValue(item, indent + 1)},`);
	return `[\n${items.join("\n")}\n${close}]`;
}

function serializeObject(value: Record<string, unknown>, indent: number): string {
	const entries = Object.entries(value).filter(([, v]) => v !== undefined);
	if (entries.length === 0) return "{}";
	const pad = "\t".repeat(indent + 1);
	const close = "\t".repeat(indent);
	const items = entries.map(([k, v]) => `${pad}${quoteKey(k)}: ${serializeValue(v, indent + 1)},`);
	return `{\n${items.join("\n")}\n${close}}`;
}

export function serializeTvConfig(value: unknown): string {
	return serializeValue(value, 0);
}
