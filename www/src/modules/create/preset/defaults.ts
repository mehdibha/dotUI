import { registryUi } from "@/registry/ui/registry";

import type { DesignSystem } from "./types";

function deriveDefaults(): DesignSystem {
	const componentStyles: Record<string, string> = {};
	const componentTokens: Record<string, string> = {};
	const componentParams: Record<string, Record<string, string>> = {};

	for (const item of registryUi) {
		if (item.styles && item.defaultStyle) {
			componentStyles[item.name] = item.defaultStyle;
		}
		if (item.tokens) {
			for (const [tokenName, tokenDef] of Object.entries(item.tokens)) {
				componentTokens[tokenName] = tokenDef.default;
			}
		}
		if (item.params) {
			const params: Record<string, string> = {};
			for (const [paramName, paramDef] of Object.entries(item.params)) {
				params[paramName] = paramDef.default;
			}
			if (Object.keys(params).length > 0) componentParams[item.name] = params;
		}
	}

	return { componentStyles, componentTokens, componentParams, density: "compact" };
}

export const DEFAULTS: DesignSystem = deriveDefaults();
