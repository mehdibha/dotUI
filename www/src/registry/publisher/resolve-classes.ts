import { BLUR_OPTIONS, CURSOR_OPTIONS, RADIUS_OPTIONS, SHADOW_OPTIONS } from "./token-map";

import type { RegistryItem, TokenType } from "@/registry/types";

const VALUE_TO_TOKEN_BY_TYPE: Record<TokenType, Map<string, string>> = {
	radius: new Map(RADIUS_OPTIONS.map((opt) => [opt.value, opt.label])),
	blur: new Map(BLUR_OPTIONS.map((opt) => [opt.value, opt.label.toLowerCase().replace(/\s+/g, "-")])),
	shadow: new Map(SHADOW_OPTIONS.map((opt) => [opt.value, opt.label.toLowerCase().replace(/\s+/g, "-")])),
	cursor: new Map(CURSOR_OPTIONS.map((opt) => [opt.value, opt.label.toLowerCase().replace(/\s+/g, "-")])),
	opacity: new Map(),
	color: new Map(),
	"font-size": new Map(),
	spacing: new Map(),
};

const CSS_VAR_UTILITY_PATTERN = /([a-z0-9-]+)-\(--([a-z0-9-]+)\)/gi;

function resolveClassString(value: string, scalarVars: Map<string, { type: TokenType; selected: string }>): string {
	return value.replace(CSS_VAR_UTILITY_PATTERN, (full, utility: string, cssVarName: string) => {
		const binding = scalarVars.get(`--${cssVarName}`);
		if (!binding) return full;

		const tokenValue = VALUE_TO_TOKEN_BY_TYPE[binding.type].get(binding.selected);
		if (!tokenValue) return full;

		return `${utility}-${tokenValue}`;
	});
}

function walkAndResolve(input: unknown, scalarVars: Map<string, { type: TokenType; selected: string }>): unknown {
	if (typeof input === "string") return resolveClassString(input, scalarVars);
	if (Array.isArray(input)) return input.map((entry) => walkAndResolve(entry, scalarVars));
	if (!input || typeof input !== "object") return input;

	const output: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(input)) {
		output[key] = walkAndResolve(value, scalarVars);
	}
	return output;
}

export function resolveScalarClasses(
	config: Record<string, unknown>,
	meta: Pick<RegistryItem, "params">,
	componentParams: Record<string, string>,
): Record<string, unknown> {
	const scalarVars = new Map<string, { type: TokenType; selected: string }>();
	for (const [paramName, def] of Object.entries(meta.params ?? {})) {
		if (def.kind !== "scalar") continue;
		scalarVars.set(def.cssVar, {
			type: def.type,
			selected: componentParams[paramName] ?? def.default,
		});
	}

	return walkAndResolve(config, scalarVars) as Record<string, unknown>;
}
